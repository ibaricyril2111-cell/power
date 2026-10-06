import { describe, expect, it } from "vitest"
import { drinkOrderError, isFreeChoiceDrink } from "@/lib/drink-ordering"

const fixed = { name: "Mangue Passion Ananas", type: "jus", sizes: [{ id: "s", includedChoices: 0 }],
  options: [{ id: "m", includedByDefault: true }, { id: "p", includedByDefault: true }, { id: "a", includedByDefault: true }, { id: "extra" }] }

describe("fixed recipe ordering policy", () => {
  it.each(["Smoothie à composer / 2 fruits", "Jus au choix", "Smoothie personnalisé"])("rejects retired formula %s", name => {
    expect(isFreeChoiceDrink({ name, type: "jus" })).toBe(true)
    expect(drinkOrderError({ name, type: "jus" }, {})).toMatch(/ne sont plus proposés/)
  })
  it("rejects renamed quota drinks too", () => expect(isFreeChoiceDrink({ ...fixed, sizes: [{ includedChoices: 3 }] })).toBe(true))
  it("leaves non-drink customisation unchanged", () => expect(drinkOrderError({ ...fixed, type: "panier" }, { ingredients: ["x"] })).toBeNull())
  it("accepts only the exact fixed ingredients", () => expect(drinkOrderError(fixed, { sizeId: "s", optionIds: ["a", "p", "m"] })).toBeNull())
  it.each([["m", "p"], ["m", "p", "a", "extra"], ["m", "p", "a", "a"]])("rejects removals, extras and duplicates: %j", (...ids) => {
    expect(drinkOrderError(fixed, { optionIds: ids })).not.toBeNull()
  })
  it("rejects forged formats and legacy ingredients", () => {
    expect(drinkOrderError(fixed, { sizeId: "unknown", optionIds: ["m", "p", "a"] })).not.toBeNull()
    expect(drinkOrderError(fixed, { ingredients: [], optionIds: ["m", "p", "a"] })).not.toBeNull()
  })
})
