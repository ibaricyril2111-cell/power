// @vitest-environment jsdom
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest"
import { render, screen, fireEvent, cleanup, waitFor } from "@testing-library/react"
import CompositionConfigurator, { type ConfigurableComposition } from "@/components/product/composition-configurator"
const { add } = vi.hoisted(() => ({ add: vi.fn() }))
vi.mock("@/app/actions/cart", () => ({ addToCart: add }))
vi.mock("sonner", () => ({ toast: { success: vi.fn(), error: vi.fn() } }))
vi.mock("next/image", () => ({ default: ({ src, alt }: { src: string; alt: string }) => <img src={src} alt={alt} /> }))
const recipe: ConfigurableComposition = {
  id: "real-smoothie", name: "Smoothie à composer", type: "smoothie", description: null, imageUrl: null, basePrice: 5,
  sizes: [{ id: "two", name: "Deux fruits", price: 5, includedChoices: 2, isDefault: true }],
  options: [
    { id: "mango", name: "Mangue", includedByDefault: false, extraPrice: .75 },
    { id: "strawberry", name: "Fraise", includedByDefault: false, extraPrice: .75 },
    { id: "kiwi", name: "Kiwi", includedByDefault: false, extraPrice: .75 },
  ],
}
beforeEach(() => {
  add.mockResolvedValue({ success: true })
  Object.defineProperty(window, "matchMedia", { configurable: true, value: () => ({
    matches: true, addEventListener() {}, removeEventListener() {}, addListener() {}, removeListener() {},
  }) })
})
afterEach(() => { cleanup(); vi.clearAllMocks() })
describe("fixed POWER drinks without ingredient customisation", () => {
  it("retires the free-choice mixer even when opened from an old page", () => {
    const { container } = render(<CompositionConfigurator composition={recipe} />)
    expect(container.querySelectorAll("[data-selected-ingredient]")).toHaveLength(0)
    expect(screen.getByRole("status").textContent).toMatch(/n’est plus proposée/)
    expect(screen.queryByRole("button", { name: "Mangue" })).toBeNull()
    expect(screen.queryByRole("button", { name: "Ajouter au panier" })).toBeNull()
  })
  it("orders the exact fixed recipe at its merchant price without extras", async () => {
    const fixed = { ...recipe, name: "Jus Mangue", type: "jus", sizes: [],
      options: [{ ...recipe.options[0], includedByDefault: true }, recipe.options[1]] }
    render(<CompositionConfigurator composition={fixed} />)
    expect(screen.queryByRole("button", { name: "Mangue" })).toBeNull()
    expect(screen.queryByRole("button", { name: "Fraise" })).toBeNull()
    expect(screen.getByText("5.00 €")).toBeTruthy()
    fireEvent.click(screen.getByRole("button", { name: "Ajouter au panier" }))
    await waitFor(() => expect(add).toHaveBeenCalledWith({
      compositionId: "real-smoothie", quantity: 1, customData: { sizeId: null, optionIds: ["mango"] },
    }))
  })
  it("keeps the recipe orderable without displaying internal configuration warnings", () => {
    render(<CompositionConfigurator composition={{ ...recipe, name: "Jus Fraise", sizes: [], options: [] }} />)
    expect(screen.queryByText(/Aucun format ni ingrédient/)).toBeNull()
    expect((screen.getByRole("button", { name: "Ajouter au panier" }) as HTMLButtonElement).disabled).toBe(false)
  })
})
