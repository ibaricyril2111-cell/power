// @vitest-environment jsdom
import { describe, it, expect, vi, afterEach } from 'vitest'
import { render, screen, fireEvent, waitFor, cleanup } from '@testing-library/react'
import DeliveryCalendar from '@/components/delivery/delivery-calendar'
const { slots } = vi.hoisted(() => ({ slots: vi.fn() }))
vi.mock('@/app/actions/delivery', () => ({ getAvailableDeliverySlots: slots }))
vi.mock('@/components/ui/calendar', () => ({ Calendar: ({ onSelect, disabled }: any) => <>
  <button onClick={() => onSelect(new Date(2099, 7, 11))}>Changer date</button>
  <span>{String(disabled(new Date(2099, 7, 10)))}</span>
</> }))
afterEach(() => { cleanup(); vi.clearAllMocks() })
const result = (id: string) => ({ success: true, data: [{ id, date: '2099-08-10', startTime: '10:00', endTime: '12:00', remainingSlots: 1 }] })
describe('créneaux de commande', () => {
  it('invalide le créneau lorsque la date change', async () => {
    slots.mockResolvedValue(result('s1'))
    const select = vi.fn()
    render(<DeliveryCalendar initialDate="2099-08-10" onSelectDelivery={select} selectedDelivery={null} />)
    fireEvent.click(await screen.findByRole('button', { name: /10:00/ }))
    expect(select).toHaveBeenLastCalledWith(expect.objectContaining({ slotId: 's1', dateISO: '2099-08-10' }))
    fireEvent.click(screen.getByText('Changer date'))
    expect(select).toHaveBeenLastCalledWith(null)
  })
  it('ignore une réponse arrivée après le changement de date', async () => {
    let resolveOld: (value: any) => void = () => {}
    slots.mockImplementationOnce(() => new Promise(resolve => { resolveOld = resolve })).mockResolvedValue(result('new'))
    const select = vi.fn()
    render(<DeliveryCalendar initialDate="2099-08-10" onSelectDelivery={select} selectedDelivery={null} />)
    fireEvent.click(screen.getByText('Changer date'))
    await screen.findByRole('button', { name: /10:00/ })
    resolveOld(result('old'))
    await waitFor(() => expect(slots).toHaveBeenCalledTimes(2))
    fireEvent.click(screen.getByRole('button', { name: /10:00/ }))
    expect(select).toHaveBeenLastCalledWith(expect.objectContaining({ slotId: 'new', dateISO: '2099-08-11' }))
  })
})
