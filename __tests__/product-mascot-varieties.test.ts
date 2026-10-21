import { describe, expect, it } from "vitest"
import { existsSync } from "node:fs"
import { productMascotForName } from "@/lib/product-mascots"

describe("portraits fidèles aux variétés vendues", () => {
  it.each([
    ["Pomme Pink Lady ", "pomme-pink-lady"], ["Pommes Granny Smith", "pomme-granny-smith"],
    ["Pommes Gala", "pomme-gala"], ["Mirabelle", "mirabelle"], ["Choux blanc", "chou-blanc"], ["Piment vert ", "piment-vert"],
  ])("donne à %s son propre portrait", (name, key) => {
    const mascot = productMascotForName(name)
    expect(mascot?.key).toBe(key)
    expect(existsSync("public" + mascot?.image)).toBe(true)
  })
  it("garde la Golden jaune, le fenouil existant et distingue les pommes de terre", () => {
    expect(productMascotForName("Pomme Golden")?.image).toBe("/brand/mascots/v4/pomme.webp")
    expect(productMascotForName("Fenouil")?.key).toBe("fenouil")
    expect(productMascotForName("Pommes de terre Gala")?.key).toBe("pomme-de-terre")
    expect(productMascotForName("Jus de pomme Pink Lady")).toBeNull()
    expect(productMascotForName("Produit inconnu")).toBeNull()
  })
})
