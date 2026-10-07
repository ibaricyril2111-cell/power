// @vitest-environment jsdom
import { describe, it, expect, vi, afterEach } from 'vitest'
import { act, render, screen, fireEvent, waitFor, cleanup } from '@testing-library/react'
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
  it.each(['server', 'network'])('distingue une panne %s d’une journée vide et permet de réessayer', async (failure) => {
    if (failure === 'server') slots.mockResolvedValueOnce({ success: false, data: [] })
    else slots.mockRejectedValueOnce(new Error('network'))
    slots.mockResolvedValueOnce(result('recovered'))
    render(<DeliveryCalendar initialDate="2099-08-10" onSelectDelivery={vi.fn()} selectedDelivery={null} />)
    expect((await screen.findByRole('alert')).textContent).toContain('Impossible de charger')
    expect(screen.queryByText(/Aucun créneau/)).toBeNull()
    const retry = screen.getByRole('button', { name: 'Réessayer' })
    expect(retry.getAttribute('type')).toBe('button')
    fireEvent.click(retry)
    await screen.findByRole('button', { name: /10:00/ })
    expect(screen.queryByRole('alert')).toBeNull()
    expect(slots).toHaveBeenLastCalledWith('2099-08-10', '2099-08-10', 'livraison')
  })

  it('invalide une sélection de livraison lors du passage au retrait', async () => {
    slots.mockResolvedValue(result('s1'))
    const select = vi.fn()
    const { rerender } = render(<DeliveryCalendar initialDate="2099-08-10" onSelectDelivery={select} selectedDelivery={null} />)
    fireEvent.click(await screen.findByRole('button', { name: /10:00/ }))
    slots.mockResolvedValueOnce({ success: true, data: [] })
    rerender(<DeliveryCalendar mode="retrait" initialDate="2099-08-10" onSelectDelivery={select} selectedDelivery={{ date: '10/08/2099', time: '10:00 - 12:00' }} />)
    await screen.findByText(/Aucun créneau de retrait/)
    expect(select).toHaveBeenLastCalledWith(null)
  })

  it('invalide le créneau lorsque la date change', async () => {
    slots.mockResolvedValue(result('s1'))
    const select = vi.fn()
    render(<DeliveryCalendar initialDate="2099-08-10" onSelectDelivery={select} selectedDelivery={null} />)
    fireEvent.click(await screen.findByRole('button', { name: /10:00/ }))
    expect(select).toHaveBeenLastCalledWith(expect.objectContaining({ slotId: 's1', dateISO: '2099-08-10' }))
    await act(async () => { fireEvent.click(screen.getByText('Changer date')) })
    expect(select).toHaveBeenLastCalledWith(null)
  })
  it('ignore une réponse arrivée après le changement de date', async () => {
    let resolveOld: (value: any) => void = () => {}
    slots.mockImplementationOnce(() => new Promise(resolve => { resolveOld = resolve })).mockResolvedValue(result('new'))
    const select = vi.fn()
    render(<DeliveryCalendar initialDate="2099-08-10" onSelectDelivery={select} selectedDelivery={null} />)
    fireEvent.click(screen.getByText('Changer date'))
    await screen.findByRole('button', { name: /10:00/ })
    await act(async () => { resolveOld(result('old')) })
    await waitFor(() => expect(slots).toHaveBeenCalledTimes(2))
    fireEvent.click(screen.getByRole('button', { name: /10:00/ }))
    expect(select).toHaveBeenLastCalledWith(expect.objectContaining({ slotId: 'new', dateISO: '2099-08-11' }))
  })

  it('signale le créneau sélectionné sans soumettre le formulaire parent', async () => {
    slots.mockResolvedValue(result('s1'))
    render(<DeliveryCalendar initialDate="2099-08-10" onSelectDelivery={vi.fn()} selectedDelivery={null} />)
    const button = await screen.findByRole('button', { name: /10:00/ })
    expect(button.getAttribute('type')).toBe('button')
    expect(button.getAttribute('aria-pressed')).toBe('false')
    fireEvent.click(button)
    expect(button.getAttribute('aria-pressed')).toBe('true')
    expect(button.className).toContain('bg-[#ffcd47]')
    expect(button.className).toContain('text-[#073b2d]')
  })

  it('affiche un chargement explicite puis un message lorsque la date est complète', async () => {
    let finish: (value: { success: boolean; data: [] }) => void = () => {}
    slots.mockImplementationOnce(() => new Promise(resolve => { finish = resolve }))
    render(<DeliveryCalendar initialDate="2099-08-10" onSelectDelivery={vi.fn()} selectedDelivery={null} />)
    expect(screen.getByRole('status').textContent).toContain('Chargement des créneaux')
    await act(async () => { finish({ success: true, data: [] }) })
    expect(screen.getByRole('status').textContent).toContain('Aucun créneau de livraison disponible')
  })

  it('ne permet pas de choisir un créneau de livraison sans place', async () => {
    slots.mockResolvedValue({ success: true, data: [{ id: 'full', date: '2099-08-10', startTime: '10:00', endTime: '12:00', remainingSlots: 0 }] })
    const select = vi.fn()
    render(<DeliveryCalendar initialDate="2099-08-10" onSelectDelivery={select} selectedDelivery={null} />)
    const button = await screen.findByRole('button', { name: /10:00/ })
    expect((button as HTMLButtonElement).disabled).toBe(true)
    fireEvent.click(button)
    expect(select).not.toHaveBeenCalled()
  })

  it('conserve le mode retrait et n’affiche pas un quota de livraison pour le magasin', async () => {
    slots.mockResolvedValue(result('pickup'))
    const select = vi.fn()
    render(<DeliveryCalendar mode="retrait" initialDate="2099-08-10" onSelectDelivery={select} selectedDelivery={null} />)
    const button = await screen.findByRole('button', { name: /10:00/ })
    expect(slots).toHaveBeenCalledWith('2099-08-10', '2099-08-10', 'retrait')
    expect(screen.queryByText(/places/)).toBeNull()
    fireEvent.click(button)
    expect(select).toHaveBeenLastCalledWith(expect.objectContaining({ slotId: 'pickup', dateISO: '2099-08-10' }))
  })
})
