// @vitest-environment jsdom
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"
import { cleanup, fireEvent, render, screen } from "@testing-library/react"
import PowerUniverse from "@/components/layout/power-universe"
const route = vi.hoisted(() => ({ value: "/produits" }))
vi.mock("next/navigation", () => ({ usePathname: () => route.value }))
vi.mock("next/image", () => ({ default: ({ src, alt }: { src: string; alt: string }) => <img src={src} alt={alt} /> }))
beforeEach(() => { localStorage.clear(); route.value = "/produits" })
afterEach(cleanup)
describe("POWER shared visual universe", () => {
  it("decorates public pages without replacing their children", () => {
    const { container } = render(<PowerUniverse><button>Commander</button></PowerUniverse>)
    expect(screen.getByRole("button", { name: "Commander" })).toBeTruthy()
    expect(container.querySelectorAll('.power-atmosphere img')).toHaveLength(6)
    expect(container.querySelector('.power-atmosphere')?.getAttribute('aria-hidden')).toBe('true')
  })
  it("persists the user pause setting", () => {
    const { container } = render(<PowerUniverse>Contenu</PowerUniverse>)
    fireEvent.click(screen.getByRole('button', { name: 'Mettre les animations du décor en pause' }))
    expect(container.querySelector('[data-motion]')?.getAttribute('data-motion')).toBe('paused')
    expect(localStorage.getItem('power-motion')).toBe('paused')
  })
  it.each(['/admin', '/admin/products', '/gestion'])("leaves %s undecorated", (path) => {
    route.value = path
    const { container } = render(<PowerUniverse>Administration</PowerUniverse>)
    expect(container.querySelector('.power-universe')).toBeNull()
    expect(screen.getByText('Administration')).toBeTruthy()
  })
  it.each(['/commande', '/checkout/success', '/connexion', '/mon-compte'])("keeps %s motionless", (path) => {
    route.value = path
    const { container } = render(<PowerUniverse>Formulaire</PowerUniverse>)
    expect(container.querySelector('[data-motion]')?.getAttribute('data-motion')).toBe('paused')
    expect(screen.queryByRole('button')).toBeNull()
  })
})
