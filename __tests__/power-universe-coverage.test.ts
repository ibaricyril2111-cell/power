import { describe, expect, it } from "vitest"
import { existsSync, readFileSync, readdirSync } from "node:fs"
import { join } from "node:path"

function pages(dir: string): string[] {
  return readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const path = join(dir, entry.name)
    if (path === "app/admin" || path === "app/gestion") return []
    return entry.isDirectory() ? pages(path) : entry.name === "page.tsx" ? [path] : []
  })
}
describe("POWER visual coverage and asset integrity", () => {
  it.each(pages('app'))("shares the universe on %s", (path) => {
    expect(readFileSync(path, 'utf8')).toContain('power-page')
  })
  it("uses only existing approved mascots and basket imagery", () => {
    for (const name of ['orange', 'fraise', 'carotte', 'citron', 'ananas', 'courgette', 'mangue', 'banane', 'tomate']) {
      expect(existsSync(`public/brand/mascots/v4/${name}.webp`)).toBe(true)
    }
    expect(existsSync('public/products/panier-saison.webp')).toBe(true)
    const baskets = readFileSync('components/sections/basket-showcase.tsx', 'utf8')
    expect(baskets).toContain('marketplace-tab')
    expect(baskets).toContain('comp-panier')
    expect(baskets).toContain('contenu selon arrivages')
    for (const price of [20, 30, 40]) expect(baskets).toContain(`price: ${price}`)
  })
  it("keeps scenery noninteractive and provides reduced motion", () => {
    const css = readFileSync('components/layout/power-universe.css', 'utf8')
    expect(css).toContain('pointer-events: none')
    expect(css).toContain('prefers-reduced-motion: reduce')
    expect(css).toContain(':focus-visible')
  })
})
