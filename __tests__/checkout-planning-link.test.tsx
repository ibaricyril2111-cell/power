// @vitest-environment jsdom
import { expect, it, vi } from "vitest"
import { render, screen } from "@testing-library/react"
import CommandePage from "@/app/commande/page"

vi.mock("next/navigation", () => ({ useRouter: () => ({ push: vi.fn() }), useSearchParams: () => new URLSearchParams("mode=retrait&date=2026-10-23&slot=pickup-slot") }))
vi.mock("@/components/layout/header", () => ({ default: () => null }))
vi.mock("@/components/layout/footer", () => ({ default: () => null }))
vi.mock("@/components/cart/cart-artwork", () => ({ default: () => null }))
vi.mock("@/components/delivery/delivery-calendar", () => ({ default: (props: any) => <div data-testid="planning">{props.mode}|{props.initialDate}|{props.initialSlotId}</div> }))
vi.mock("@/app/actions/cart", () => ({ getCartItems: vi.fn().mockResolvedValue({ success: true, data: [{ id: "cart", quantity: 1, product: { id: "p", name: "Basilic", price: 1, unit: "botte" } }] }) }))
vi.mock("@/app/actions/account", () => ({ getUserProfile: vi.fn().mockResolvedValue({ success: true, data: {} }) }))
vi.mock("@/app/actions/content", () => ({ getDeliveryConfig: vi.fn().mockResolvedValue({ fee: 4.9, threshold: 30 }) }))

it("reprend le mode retrait et le vrai créneau transmis par le planning", async () => {
  render(<CommandePage />)
  expect((await screen.findByTestId("planning")).textContent).toBe("retrait|2026-10-23|pickup-slot")
  expect(screen.queryByLabelText("Adresse *")).toBeNull()
  expect(screen.getByRole("button", { name: "Confirmer — Espèces à la réception" })).toBeTruthy()
})
