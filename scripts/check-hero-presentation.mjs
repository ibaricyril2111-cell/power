import assert from 'node:assert/strict'
import { readFileSync, existsSync } from 'node:fs'

const hero = readFileSync('components/sections/hero-section.tsx', 'utf8')
const css = readFileSync('components/sections/hero-section.module.css', 'utf8')
assert.equal((hero.match(/href="#marketplace"/g) || []).length, 1)
assert.ok(hero.includes('Faire mes courses'))
assert.ok(hero.includes('/brand/facade-power-validee.webp'))
assert.ok(hero.includes('width={710}') && hero.includes('height={319}'))
assert.ok(!hero.includes('object-cover'))
for (const mascot of ['carotte', 'orange', 'fraise']) {
  assert.ok(existsSync(`public/brand/mascots/v4/${mascot}.webp`))
}
for (const route of ['produits', 'jus-soupes', 'personnages']) {
  assert.ok(existsSync(`app/${route}/page.tsx`))
}
assert.ok(css.includes('prefers-reduced-motion: reduce'))
assert.ok(css.includes('.card:focus-visible'))
assert.ok(!hero.includes('"use client"'))
console.log('PASS: shopping CTA, intact facade, real mascots, destinations, focus and reduced motion')
