import { afterEach, describe, expect, it, vi } from 'vitest'
import { NextRequest } from 'next/server'
const { plan } = vi.hoisted(() => ({ plan: vi.fn() }))
vi.mock('@/lib/delivery-planning', () => ({generateDeliveryPlanning:plan}))
vi.mock('@/lib/db', () => ({prisma:{rateLimit:{deleteMany:vi.fn().mockResolvedValue({count:0})},siteSetting:{findMany:vi.fn().mockResolvedValue([])}}}))
import { GET } from '@/app/api/cron/cleanup/route'
afterEach(()=>{vi.unstubAllEnvs();vi.clearAllMocks()})
describe('renouvellement protégé des créneaux',()=>{
  it('refuse les appels sans authentification et ne crée aucun créneau',async()=>{
    vi.stubEnv('CRON_SECRET','test-only-cron-key')
    expect((await GET(new NextRequest('http://localhost/api/cron/cleanup'))).status).toBe(401)
    expect(plan).not.toHaveBeenCalled()
  })
  it('renouvelle les créneaux sur un appel autorisé',async()=>{
    vi.stubEnv('CRON_SECRET','test-only-cron-key');plan.mockResolvedValue({created:16,skipped:432})
    const response=await GET(new NextRequest('http://localhost/api/cron/cleanup',{headers:{authorization:'Bearer test-only-cron-key'}}))
    expect(response.status).toBe(200);expect(plan).toHaveBeenCalledOnce()
    expect((await response.json()).planning).toEqual({created:16,skipped:432})
  })
})
