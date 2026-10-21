// @vitest-environment jsdom
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"
import { cleanup, fireEvent, render, screen, within } from "@testing-library/react"
import ProductGrid from "@/components/product/product-grid"
import { productFamilyKey } from "@/lib/product-families"

vi.mock("next/image", () => ({ default: ({src,alt}: any) => <img src={src} alt={alt} /> }))
vi.mock("next/navigation", () => ({ useRouter: () => ({push: vi.fn()}) }))
vi.mock("@/app/actions/cart", () => ({ addToCart: vi.fn(), decrementFromCart: vi.fn() }))
vi.mock("@/components/product/product-modal-context", () => ({ ProductModalProvider: ({children}: any) => children, useProductModal: () => ({openProductModal:vi.fn()}) }))
beforeEach(() => vi.stubGlobal("matchMedia", () => ({matches:false,addEventListener:vi.fn(),removeEventListener:vi.fn()})))
afterEach(() => {cleanup();vi.unstubAllGlobals()})
const product = (id: string, name: string, category: string, price: number) => ({id,name,category,price,image:"",unit:"kg",description:"",inStock:true,organic:false})

describe("catalogue compact par famille", () => {
  it("regroupe les pommes et conserve les vrais prix dans la fenêtre", () => {
    render(<ProductGrid categories={["Fruits","Légumes"]} products={[
      product("gold","Pomme Golden","Fruits",3),product("pink","Pomme Pink Lady","Fruits",4.5),product("potato","Pomme de terre vrac","Légumes",1.5),
    ]} />)
    expect(screen.queryByRole("heading",{name:"Pomme Pink Lady"})).toBeNull()
    fireEvent.click(screen.getByRole("button",{name:"Découvrir nos pommes"}))
    const dialog=screen.getByRole("dialog",{name:"Nos pommes"})
    expect(within(dialog).getByText("4.50 €")).toBeTruthy()
    expect(within(dialog).getByText("3.00 €")).toBeTruthy()
    expect(within(dialog).getByRole("button",{name:"Ajouter Pomme Pink Lady au panier"})).toBeTruthy()
    expect(within(dialog).queryByText("Pomme de terre vrac")).toBeNull()
    fireEvent.click(within(dialog).getByRole("button",{name:"Close"}))
    fireEvent.change(screen.getByRole("textbox",{name:"Rechercher dans les produits"}),{target:{value:"Pink Lady"}})
    expect(screen.queryByRole("button",{name:"Découvrir nos pommes"})).toBeNull()
    expect(screen.getAllByRole("heading",{name:"Pomme Pink Lady"}).length).toBeGreaterThan(0)
  })
  it("classe les herbes, agrumes et fruits rouges sans confondre racines et pommes", () => {
    expect(productFamilyKey({name:"Pomme de terre Gala",category:"Légumes"})).toBe("legumes")
    expect(productFamilyKey({name:"Basilic Frais",category:"Aromates"})).toBe("herbes")
    expect(productFamilyKey({name:"Gingembre",category:"Exotiques"})).toBe("exotiques")
    expect(productFamilyKey({name:"Citrons Jaune",category:"Fruits"})).toBe("agrumes")
    expect(productFamilyKey({name:"Fraises 500g",category:"Fruits rouges"})).toBe("fruits-rouges")
  })
})
