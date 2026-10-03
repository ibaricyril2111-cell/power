import { describe, expect, it } from "vitest"
import { existsSync, readFileSync } from "node:fs"
import { resolve } from "node:path"
const source = readFileSync(resolve("components/sections/hero-section.tsx"), "utf8")
describe("POWER approved storefront integrity", () => {
  it("uses the user's exact reference and preserves the entire frame", () => {
    expect(source).toContain('/brand/facade-power-validee.webp')
    expect(source).not.toContain('power-champ-hero.webp')
    expect(source).not.toContain('object-cover')
    expect(source).not.toContain('min-h-[330px]')
    expect(source).not.toContain('bg-gradient-to-t')
    expect(source).toContain('width={710}')
    expect(source).toContain('height={319}')
    expect(existsSync(resolve("public/brand/facade-power-validee.webp"))).toBe(true)
  })
  it("records an exact unresized crop of the approved image", () => {
    const m = JSON.parse(readFileSync(resolve("public/brand/facade-power-validee.json"), "utf8"))
    expect(m.sourceSha256).toBe('3ddf6e945f973f8e1a8f808c65f454a06b503b892243c531ee1915841bcd0e3b')
    expect(m.crop).toEqual([0,350,710,669])
    expect([m.width,m.height]).toEqual([710,319])
  })
  it("retains the shopping destination and four benefits", () => {
    expect(source).toContain('href="#marketplace"')
    expect(source).toContain('grid-cols-4')
    expect(source).toContain('Faire mes courses')
  })
})
