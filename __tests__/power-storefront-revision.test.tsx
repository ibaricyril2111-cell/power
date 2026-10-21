// @vitest-environment jsdom
import { afterEach, describe, expect, it, vi } from "vitest"
import { cleanup, fireEvent, render, screen, within } from "@testing-library/react"
import { useState } from "react"
import AvatarDialog from "@/components/account/avatar-dialog"
import RegistrationDetails from "@/components/auth/registration-details"
import ProductPrice from "@/components/product/product-price"
import ProductCard from "@/components/product/product-card"
import { DEFAULT_POWER_AVATAR, type PowerAvatarKey } from "@/lib/power-avatars"
vi.mock('next/image', () => ({ default: ({src, alt}: any) => <img src={src} alt={alt} /> }))
vi.mock('next/navigation', () => ({ useRouter: () => ({ push: vi.fn() }) }))
vi.mock('@/app/actions/cart', () => ({ addToCart: vi.fn(), decrementFromCart: vi.fn() }))
afterEach(cleanup)

describe('finitions demandées par Cyril', () => {
  it('garde les 100 choix hors du formulaire et ferme la modale après sélection', () => {
    function Fixture() {
      const [value, setValue] = useState<PowerAvatarKey>(DEFAULT_POWER_AVATAR)
      return <AvatarDialog value={value} onChange={setValue} />
    }
    render(<Fixture />)
    expect(screen.queryByRole('dialog')).toBeNull()
    expect(screen.queryByRole('button', { name: 'Choisir Fraise' })).toBeNull()
    fireEvent.click(screen.getByRole('button', { name: /Choisir mon avatar/ }))
    const dialog = screen.getByRole('dialog')
    expect(within(dialog).getAllByRole('button', { name: /^Choisir / })).toHaveLength(100)
    fireEvent.click(within(dialog).getByRole('button', { name: 'Choisir Fraise' }))
    expect(screen.queryByRole('dialog')).toBeNull()
    expect(screen.getByRole('button', { name: /Avatar : Fraise/ })).toBeTruthy()
  })
  it('collecte téléphone et type de compte sans choix indépendant de facturation', () => {
    const onChange = vi.fn()
    render(<RegistrationDetails phone="" clientType="particulier" avatarKey={DEFAULT_POWER_AVATAR} onChange={onChange} onAvatarChange={vi.fn()} disabled={false} />)
    expect(screen.getByLabelText('Téléphone').getAttribute('type')).toBe('tel')
    expect(screen.getByLabelText('Téléphone').hasAttribute('required')).toBe(true)
    fireEvent.change(screen.getByLabelText('Type de compte'), { target: { value: 'professionnel' } })
    expect(onChange).toHaveBeenCalledWith('clientType', 'professionnel')
    expect(screen.queryByLabelText('Facturation')).toBeNull()
  })
  it('préserve le prix promotionnel et son unité sans superposition sur la photo', () => {
    const { container } = render(<ProductPrice price={4} promoPrice={3.5} unit="kg" />)
    expect(screen.getByText('4.00 €').tagName).toBe('DEL')
    expect(screen.getByText('3.50 €')).toBeTruthy()
    expect(screen.getByText('/ kg')).toBeTruthy()
    expect(container.firstElementChild?.className).not.toMatch(/absolute|backdrop/)
  })
  it('permet le retour à la ligne du bouton et laisse la photo dégagée', () => {
    const { container } = render(<ProductCard product={{ id:'p', name:'Mangue Kent', price:2, unit:'pièce', image:'', description:'', category:'Fruits', inStock:true, organic:false }} />)
    const button = screen.getByRole('button', { name:'Ajouter Mangue Kent au panier' })
    expect(button.className).toContain('h-auto')
    expect(button.className).toContain('whitespace-normal')
    expect(container.querySelector('[data-cart-button-content]')?.className).toContain('flex-wrap')
    expect(container.querySelector('[data-product-price]')?.parentElement?.className).not.toContain('absolute')
  })
})
