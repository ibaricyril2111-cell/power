import { describe, expect, it } from "vitest"
import { existsSync } from "node:fs"
import { resolve } from "node:path"
import { POWER_RECIPE_ARTWORK, resolveCompositionArtwork } from "../lib/power-composition-artwork"

const options = [
  { id: "m", name: "Mangue", includedByDefault: true },
  { id: "a", name: "Ananas", includedByDefault: true },
  { id: "p", name: "Fruit de la passion", includedByDefault: true },
  { id: "b", name: "Banane", includedByDefault: false },
]
const smoothie = { name: "Smoothie à composer", type: "jus", options }

describe("POWER prepared recipe artwork", () => {
  it.each(POWER_RECIPE_ARTWORK)("uses existing original art for $key", (recipe) => {
    expect(existsSync(resolve(process.cwd(), "public", recipe.image.slice(1)))).toBe(true)
    expect(resolveCompositionArtwork({name: recipe.aliases[0], type: "jus"}).recipe?.key).toBe(recipe.key)
  })

  it("resolves the configured base recipe without selecting an optional extra", () => {
    expect(resolveCompositionArtwork(smoothie).recipe?.key).toBe("mangue-ananas-passion")
  })

  it("uses selected identifiers instead of the marketing name", () => {
    const visual = resolveCompositionArtwork({...smoothie, name: "Tropic Rose"}, ["m", "a"])
    expect(visual.recipe).toBeNull()
    expect(visual.ingredients.map((o) => o.id)).toEqual(["m", "a"])
  })

  it("stops showing a fixed recipe when an extra is selected", () => {
    expect(resolveCompositionArtwork(smoothie, ["m", "a", "p", "b"]).recipe).toBeNull()
  })

  it("does not present available choices as ingredients already selected", () => {
    const visual = resolveCompositionArtwork(smoothie, [])
    expect(visual.recipe).toBeNull()
    expect(visual.mode).toBe("choices")
  })

  it.each(["salade", "soupe", "fruits-decoupes"])("never assigns smoothie artwork to %s", (type) => {
    expect(resolveCompositionArtwork({...smoothie, type}).recipe).toBeNull()
  })

  it("does not replace a prepared salad with a single lettuce mascot", () => {
    const visual = resolveCompositionArtwork({name: "Salade César", type: "salade", options: [
      {id: "t", name: "Tomates cerises", includedByDefault: true},
      {id: "ch", name: "Poulet", includedByDefault: true},
    ]})
    expect(visual.kind).toBe("salad")
    expect(visual.recipe).toBeNull()
    expect(visual.ingredients.map((o) => o.name)).toEqual(["Tomates cerises", "Poulet"])
  })

  it("does not ignore unknown ingredients to force a match", () => {
    expect(resolveCompositionArtwork({...smoothie, options: [...options,
      {id: "x", name: "Chocolat", includedByDefault: true},
    ]}).recipe).toBeNull()
  })

  it("does not trust a mismatched legacy photo URL", () => {
    expect(resolveCompositionArtwork({name: "Salade Burrata", type: "salade", imageUrl: "/brand/tropic-rose.webp"}).recipe).toBeNull()
  })

  it("does not mutate choices or commercial data", () => {
    const data = {...smoothie, basePrice: 6.27, stock: 13}
    const before = JSON.stringify(data)
    resolveCompositionArtwork(data, ["m", "a", "p"])
    expect(JSON.stringify(data)).toBe(before)
  })
})
