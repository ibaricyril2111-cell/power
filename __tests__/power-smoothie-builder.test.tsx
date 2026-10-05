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
describe("smoothie composition with the approved clickable characters", () => {
  it("adds the clicked fruit to the mixer immediately and removes it when deselected", async () => {
    const { container } = render(<CompositionConfigurator composition={recipe} />)
    expect(container.querySelectorAll("[data-selected-ingredient]")).toHaveLength(0)
    expect((screen.getByRole("button", { name: "Choisis au moins un ingrédient" }) as HTMLButtonElement).disabled).toBe(true)
    fireEvent.click(screen.getByRole("button", { name: "Mangue" }))
    expect(container.querySelector('[data-selected-ingredient="mango"]')).toBeTruthy()
    expect(screen.getByAltText("Personnage POWER Mangue").getAttribute("src")).toBe("/brand/mascots/v3/mangue.webp")
    fireEvent.click(screen.getByRole("button", { name: "Fraise" }))
    expect(container.querySelectorAll("[data-selected-ingredient]")).toHaveLength(2)
    fireEvent.click(screen.getByRole("button", { name: "Mangue" }))
    await waitFor(() => expect(container.querySelector('[data-selected-ingredient="mango"]')).toBeNull())
    expect(container.querySelector('[data-selected-ingredient="strawberry"]')).toBeTruthy()
    expect(screen.getByRole("status").textContent).toBe("Fraise")
  })
  it("keeps the quota and extra price correct and sends the same chosen IDs to the cart", async () => {
    render(<CompositionConfigurator composition={recipe} />)
    for (const name of ["Mangue", "Fraise", "Kiwi"]) fireEvent.click(screen.getByRole("button", { name }))
    expect(screen.getAllByText("5.75€")).toHaveLength(2)
    fireEvent.click(screen.getByRole("button", { name: "Ajouter au panier" }))
    await waitFor(() => expect(add).toHaveBeenCalledWith({
      compositionId: "real-smoothie", quantity: 1, customData: { sizeId: "two", optionIds: ["mango", "strawberry", "kiwi"] },
    }))
  })
  it("retains required base ingredients and never swaps in a different fruit", () => {
    const fixed = { ...recipe, sizes: [{ id: "fixed", name: "Classique", price: 5, includedChoices: 0, isDefault: true }],
      options: [{ ...recipe.options[0], includedByDefault: true, isRemovable: false }, recipe.options[1]] }
    const { container } = render(<CompositionConfigurator composition={fixed} />)
    expect((screen.getByRole("button", { name: "Mangue" }) as HTMLButtonElement).disabled).toBe(true)
    expect(container.querySelector('[data-selected-ingredient="mango"]')).toBeTruthy()
    fireEvent.click(screen.getByRole("button", { name: "Fraise" }))
    expect(screen.getByRole("status").textContent).toBe("Mangue · Fraise")
  })
})
