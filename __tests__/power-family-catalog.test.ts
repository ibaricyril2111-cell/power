import { describe, it, expect } from "vitest"
import { avatarForProductName, POWER_AVATARS } from "@/lib/power-avatars"
import { productsForCharacter, type FamilyProduct } from "@/lib/power-family-catalog"
const product = (id: string, name: string, stock: number, inStock = true): FamilyProduct => ({
  id, name, currentStock: stock, inStock, price: 4.25, promoPrice: 2.99, unit: "kg",
})
describe("approved POWER family connected to the live catalogue", () => {
  it("matches newly approved herbs and exotics without confusing near names", () => {
    for (const [name, key] of [["Ail", "ail"], ["Pomelos", "pamplemousse"], ["Fruit du dragon", "pitaya"],
      ["Gingembre", "gingembre"], ["Butternut", "butternut"], ["Choux rouges", "chou-rouge"],
      ["Petits pois", "petit-pois"], ["Menthe", "menthe"], ["Pastèques", "pasteque"]] as const) {
      expect(avatarForProductName(name)?.key).toBe(key)
    }
    expect(avatarForProductName("Poireaux")?.key).toBe("poireau")
    expect(avatarForProductName("Salade César")).toBeNull()
    expect(avatarForProductName("Jus de mangue")).toBeNull()
  })
  it("offers real IDs, prices and stock, with available variants first, and no synthetic products", () => {
    const products = [product("empty", "Mangue avion", 0), product("real", "Mangue mûre", .5),
      product("pear", "Poire conférence", 3)]
    const before = JSON.stringify(products)
    const matches = productsForCharacter(products, "mangue")
    expect(matches.map((item) => item.id)).toEqual(["real", "empty"])
    expect(matches[0].promoPrice).toBe(2.99)
    expect(matches[0].currentStock).toBe(.5)
    expect(productsForCharacter(products, "pitaya")).toEqual([])
    expect(JSON.stringify(products)).toBe(before)
  })
  it("preserves every approved identity for matching and account avatars", () => {
    expect(new Set(POWER_AVATARS.map((item) => item.key)).size).toBe(100)
    for (const avatar of POWER_AVATARS) expect(avatarForProductName(avatar.label)?.key).toBe(avatar.key)
  })
})
