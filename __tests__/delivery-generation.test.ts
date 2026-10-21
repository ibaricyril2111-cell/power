import { beforeEach, describe, expect, it, vi } from 'vitest'
import { NextRequest } from 'next/server'
const { auth, createMany } = vi.hoisted(() => ({ auth: vi.fn(), createMany: vi.fn() }))
vi.mock('@/auth', () => ({ auth }))
vi.mock('@/lib/db', () => ({ prisma: { deliverySlot: { createMany } } }))
import { POST } from '@/app/api/admin/delivery-slots/auto-generate/route'
const request = (body: unknown) => new NextRequest('http://localhost/api/admin/delivery-slots/auto-generate', { method:'POST', body:JSON.stringify(body) })
beforeEach(() => { vi.clearAllMocks(); auth.mockResolvedValue({user:{role:'admin'}}); createMany.mockResolvedValue({count:112}) })
describe('planning livraison et retrait', () => {
  it('ouvre les sept jours pour les deux modes sans écraser les créneaux existants', async () => {
    const response = await POST(request({weeksAhead:1,type:'both'}))
    expect(response.status).toBe(200)
    const {data, skipDuplicates} = createMany.mock.calls[0][0]
    expect(skipDuplicates).toBe(true)
    expect(data).toHaveLength(112)
    expect(new Set(data.map((slot: any) => slot.date.getUTCDay())).size).toBe(7)
    expect(new Set(data.map((slot: any) => slot.type))).toEqual(new Set(['livraison','retrait']))
    expect(data.every((slot: any) => slot.startTime >= '09:00' && slot.endTime <= '17:00')).toBe(true)
  })
  it.each([0, -1, 99, '4'])('refuse une plage invalide %s', async weeksAhead => {
    expect((await POST(request({weeksAhead}))).status).toBe(400)
    expect(createMany).not.toHaveBeenCalled()
  })
  it('refuse un utilisateur non administrateur', async () => {
    auth.mockResolvedValue({user:{role:'user'}})
    expect((await POST(request({}))).status).toBe(401)
    expect(createMany).not.toHaveBeenCalled()
  })
})
