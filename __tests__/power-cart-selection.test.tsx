// @vitest-environment jsdom
import { describe, it, expect, vi, afterEach } from "vitest"
import { render, screen, cleanup } from "@testing-library/react"
import CartArtwork from "@/components/cart/cart-artwork"
import SelectionSummary from "@/components/cart/selection-summary"
import { describeSelection } from "@/lib/composition-pricing"
vi.mock("next/image", () => ({ default: ({ src, alt }: { src: string; alt: string }) => <img src={src} alt={alt} /> }))
afterEach(cleanup)
const options = [
  { id: "mango", name: "Mangue", extraPrice: 1 },
  { id: "strawberry", name: "Fraise", extraPrice: 1 },
  { id: "kiwi", name: "Kiwi", extraPrice: 1 },
]
describe("smoothie selection in the cart and checkout", () => {
  it("shows only the selected fruit characters with the included ingredients and charged extra", () => {
    const selection = { sizeId: "two", optionIds: ["mango", "strawberry", "kiwi"] }
    render(<><CartArtwork name="Smoothie" composition={{ name: "Smoothie", type: "smoothie", options }} optionIds={selection.optionIds} />
      <SelectionSummary selection={describeSelection(selection, [{ id: "two", name: "2 fruits", price: 5, includedChoices: 2 }], options)} /></>)
    expect(screen.getByAltText("Personnage POWER Mangue").getAttribute("src")).toContain("/v3/mangue.webp")
    expect(screen.getByAltText("Personnage POWER Fraise")).toBeTruthy()
    expect(screen.getByText("Kiwi +1.00 €")).toBeTruthy()
    expect(screen.getByText("2 fruits")).toBeTruthy()
  })
  it("keeps unselected fruit out of the cart illustration", () => {
    render(<CartArtwork name="Smoothie" composition={{ name: "Smoothie", type: "smoothie", options }} optionIds={["mango"]} />)
    expect(screen.queryByAltText("Personnage POWER Fraise")).toBeNull()
  })
})
