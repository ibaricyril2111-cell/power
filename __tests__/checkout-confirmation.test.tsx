// @vitest-environment jsdom
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"
import { cleanup, render, screen } from "@testing-library/react"
import SuccessPage from "@/app/checkout/success/page"

let query = ""
vi.mock("next/navigation", () => ({ useSearchParams: () => new URLSearchParams(query) }))
vi.mock("@/components/layout/header", () => ({ default: () => null }))
vi.mock("@/components/layout/footer", () => ({ default: () => null }))
vi.mock("@/components/account/power-avatar", () => ({ PowerAvatar: () => null }))
vi.mock("@/app/actions/account", () => ({ getUserProfile: vi.fn().mockResolvedValue({ success: false }) }))
beforeEach(() => { query = ""; vi.stubGlobal("fetch", vi.fn()) })
afterEach(() => { cleanup(); vi.unstubAllGlobals() })

describe("confirmation de commande", () => {
  it("ne confirme ni commande ni paiement sans identifiant", async () => {
    render(<SuccessPage />)
    expect(await screen.findByRole("heading", { name: "Confirmation indisponible" })).toBeTruthy()
    expect(screen.getByRole("alert").textContent).toContain("éviter un doublon")
    expect(screen.queryByText(/paiement a été traité avec succès/i)).toBeNull()
    expect(fetch).not.toHaveBeenCalled()
  })

  it.each(["not-found", "network", "invalid-response"])("invite à vérifier l’historique si la confirmation échoue : %s", async failure => {
    query = "order_id=order-1"
    const mock = vi.mocked(fetch)
    if (failure === "network") mock.mockRejectedValue(new Error("network"))
    else mock.mockResolvedValue({ ok: failure !== "not-found", json: async () => ({}) } as Response)
    render(<SuccessPage />)
    expect(await screen.findByRole("heading", { name: "Confirmation indisponible" })).toBeTruthy()
    expect(screen.queryByRole("heading", { name: "Commande confirmée !" })).toBeNull()
    expect(screen.getByRole("link", { name: "Voir mes commandes" }).getAttribute("href")).toBe("/mon-compte")
  })

  it("confirme une commande retrouvée sans prétendre à un paiement ou un email", async () => {
    query = "order_id=order-1"
    vi.mocked(fetch).mockResolvedValue({ ok: true, json: async () => ({
      id: "order-1", orderNumber: "CMD-ORDER1", total: 2.3, deliveryMethod: "retrait",
      deliveryFee: 0, discount: 0, status: "validated", items: [],
    }) } as Response)
    render(<SuccessPage />)
    expect(await screen.findByRole("heading", { name: "Commande confirmée !" })).toBeTruthy()
    expect(screen.getByText("CMD-ORDER1")).toBeTruthy()
    expect(screen.getByText("Total de la commande")).toBeTruthy()
    expect(screen.queryByText(/email.*envoyé|total payé/i)).toBeNull()
  })
})
