import { describe, expect, it } from "vitest"
import { existsSync, readFileSync } from "node:fs"
import { resolve } from "node:path"
import { POWER_AVATARS, avatarForProductName, powerAvatar } from "../lib/power-avatars"

const expectedPairs = [
  ["Orange", "orange"],
  ["Figue", "figue"],
  ["Melon", "melon"],
  ["Pêche", "peche"],
  ["Asperge", "asperge"],
  ["Betterave", "betterave"],
  ["Chou-fleur", "chou-fleur"],
  ["Endive", "endive"],
  ["Épinard", "epinard"],
  ["Haricot vert", "haricot-vert"],
  ["Poireau", "poireau"],
  ["Radis", "radis"],
  ["Brocoli", "brocoli"],
  ["Navet", "navet"],
  ["Patate douce", "patate-douce"],
  ["Échalote", "echalote"],
  ["Fraises Gariguette", "fraise"],
  ["Tomates cerises", "tomate"],
  ["Mangue avion", "mangue"],
  ["Ananas Sweet", "ananas"],
  ["Pommes de terre Charlotte", "pomme-de-terre"],
  ["POMME-DE-TERRE", "pomme-de-terre"],
  ["Pommes Golden", "pomme"],
  ["Citrons verts", "citron-vert"],
  ["Citron jaune", "citron"],
  ["Poire conférence", "poire"],
] as const

const missingArtwork = [
   "Piment", "Gombo",
  "Jus de mangue", "Salade de fruits", "Produit inconnu",
]

describe("POWER product/character identity", () => {
  it.each(expectedPairs)("maps %s to %s", (name, key) => {
    expect(avatarForProductName(name)?.key).toBe(key)
  })

  it.each(missingArtwork)("does not substitute another species for %s", (name) => {
    expect(avatarForProductName(name)).toBeNull()
  })

  it.each(POWER_AVATARS)("uses the same $key image for product and avatar", (avatar) => {
    expect(avatarForProductName(avatar.label)).toEqual(avatar)
    expect(powerAvatar(avatar.key).image).toBe(avatar.image)
    expect(avatar.image).toBe(`/brand/mascots/v3/${avatar.key}.webp`)
    expect(existsSync(resolve(process.cwd(), "public", avatar.image.slice(1)))).toBe(true)
  })

  it("retains all 100 individually addressable characters from the newly approved atlas", () => {
    expect(POWER_AVATARS).toHaveLength(100)
    expect(new Set(POWER_AVATARS.map((avatar) => avatar.image)).size).toBe(100)
    const manifest = JSON.parse(readFileSync(resolve(process.cwd(), "public/brand/mascots/v3/sources.json"), "utf8"))
    for (const avatar of POWER_AVATARS) {
      expect(manifest[avatar.key].approved).toBe("2026-10-04")
      expect(manifest[avatar.key].source).toBe("approved-family-100.png")
      expect(manifest[avatar.key].width).toBe(95)
      expect(manifest[avatar.key].height).toBe(95)
    }
  })

  it("does not retain 500 percent sprite zoom or hash-based arbitrary fallback", () => {
    const product = readFileSync(resolve(process.cwd(), "components/product/product-mascot-image.tsx"), "utf8")
    const avatar = readFileSync(resolve(process.cwd(), "components/account/power-avatar.tsx"), "utf8")
    expect(product).not.toContain("500%")
    expect(avatar).not.toContain("500%")
    expect(product).not.toContain("fallbackMascot")
    expect(product).not.toContain("charCodeAt")
  })
})
