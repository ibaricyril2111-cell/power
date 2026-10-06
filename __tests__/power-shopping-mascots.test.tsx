// @vitest-environment jsdom
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"
import { cleanup, fireEvent, render, screen, waitFor, within } from "@testing-library/react"
import PowerFamily from "@/components/sections/power-family"
import AvatarChoicePromo from "@/components/sections/avatar-choice-promo"
import ProductCardMobile from "@/components/product/product-card-mobile"
import ProductBottomSheet from "@/components/product/product-bottom-sheet"
import { POWER_AVATARS } from "@/lib/power-avatars"

const { add } = vi.hoisted(() => ({ add: vi.fn() }))
vi.mock("@/app/actions/cart", () => ({ addToCart: add, decrementFromCart: vi.fn() }))
vi.mock("sonner", () => ({ toast: { success: vi.fn(), error: vi.fn() } }))
vi.mock("next/image", () => ({ default: ({ src, alt }: { src: string; alt: string }) => <img src={src} alt={alt} /> }))
vi.mock("@/components/ui/drawer", () => ({
  Drawer: ({ children, open }: any) => open ? <div role="dialog">{children}</div> : null,
  DrawerContent: ({ children }: any) => <div>{children}</div>,
  DrawerHeader: ({ children }: any) => <div>{children}</div>,
  DrawerTitle: ({ children }: any) => <h2>{children}</h2>,
  DrawerFooter: ({ children }: any) => <div>{children}</div>,
}))
const product = { id: "merchant-mango", name: "Mangue Kent", price: 2, unit: "piece", currentStock: 12,
  inStock: true, image: "/old-photo.jpg", description: "Mangue mûre", category: "Exotiques", organic: false }
beforeEach(() => add.mockResolvedValue({ success: true }))
afterEach(() => { cleanup(); vi.clearAllMocks() })

describe("the 100 POWER mascots lead to shopping", () => {
  it("opens the matching product from every one of the 100 character buttons", () => {
    const products = POWER_AVATARS.map(a => ({ ...product, id: "catalogue-" + a.key, name: a.label }))
    render(<PowerFamily products={products} />)
    expect(screen.getAllByRole("button", { name: /^Voir les produits / })).toHaveLength(100)
    for (const avatar of POWER_AVATARS) {
      fireEvent.click(screen.getByRole("button", { name: "Voir les produits " + avatar.label }))
      const dialog = screen.getByRole("dialog")
      expect(within(dialog).getByRole("heading", { name: avatar.label })).toBeTruthy()
      expect(within(dialog).getByRole("link", { name: avatar.label }).getAttribute("href")).toBe("/produits/catalogue-" + avatar.key)
      expect((within(dialog).getByRole("button", { name: "Ajouter " + avatar.label + " au panier" }) as HTMLButtonElement).disabled).toBe(false)
      fireEvent.click(within(dialog).getByRole("button", { name: "Close" }))
    }
  }, 20000)

  it("opens a home-page character directly and sends the real product ID to the cart", async () => {
    render(<PowerFamily products={[product]} initialCharacter="mangue" />)
    fireEvent.click(screen.getByRole("button", { name: "Ajouter Mangue Kent au panier" }))
    await waitFor(() => expect(add).toHaveBeenCalledWith({ productId: "merchant-mango", quantity: 1 }))
  })

  it("never offers a fictitious price or purchase when a character has no product", () => {
    render(<PowerFamily products={[]} initialCharacter="pitaya" />)
    const dialog = screen.getByRole("dialog")
    expect(within(dialog).getByText(/Je ne suis pas en vente aujourd’hui/)).toBeTruthy()
    expect(within(dialog).queryByRole("button", { name: /^Ajouter/ })).toBeNull()
  })

  it("links each home-page mascot directly to its shop without an account gate", () => {
    render(<AvatarChoicePromo />)
    for (const key of ["mangue", "fraise", "avocat", "carotte", "tomate"]) {
      const a = POWER_AVATARS.find(a => a.key === key)!
      expect(screen.getByRole("link", { name: "Commander " + a.label }).getAttribute("href")).toBe("/personnages?personnage=" + key)
    }
    expect(screen.getByRole("link", { name: "Choisir et commander" }).getAttribute("href")).toBe("/personnages")
  })

  it("does not open product details when the mobile cart button is activated by keyboard", () => {
    const details = vi.fn()
    render(<ProductCardMobile product={product} onViewDetails={details} />)
    fireEvent.keyDown(screen.getByRole("button", { name: "Ajouter Mangue Kent au panier" }), { key: "Enter" })
    expect(details).not.toHaveBeenCalled()
    fireEvent.keyDown(screen.getByRole("button", { name: "Voir le détail de Mangue Kent" }), { key: "Enter" })
    expect(details).toHaveBeenCalledOnce()
  })

  it("uses the HD mascot on mobile and refreshes the cart badge after adding", async () => {
    const updated = vi.fn()
    window.addEventListener("cart-updated", updated)
    const close = vi.fn()
    render(<ProductBottomSheet product={product} isOpen onClose={close} />)
    expect(screen.getByAltText("Mangue Kent").getAttribute("src")).toBe("/brand/mascots/v4/mangue.webp")
    fireEvent.click(screen.getByRole("button", { name: "Ajouter au panier" }))
    await waitFor(() => expect(updated).toHaveBeenCalledOnce())
    expect(close).toHaveBeenCalledOnce()
    window.removeEventListener("cart-updated", updated)
  })
})
