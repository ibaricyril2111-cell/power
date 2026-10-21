import { describe, expect, it } from 'vitest'
import { inspectPublicSource, inspectPublicBundle } from '../scripts/check-public-env.mjs'

describe('contrôle des variables publiques', () => {
  it('refuse une variable privée ou dynamique dans un composant client', () => {
    expect(inspectPublicSource('"use client"; const x = process.env.AUTH_SECRET')).not.toEqual([])
    expect(inspectPublicSource('"use client"; const x = process.env[key]')).not.toEqual([])
  })
  it('autorise seulement les configurations publiques connues', () => {
    expect(inspectPublicSource('"use client"; const x = process.env.NEXT_PUBLIC_APP_URL')).toEqual([])
    expect(inspectPublicSource('process.env.NEXT_PUBLIC_DATABASE_URL')).not.toEqual([])
    expect(inspectPublicSource('const cfg = { env: { secret: "x" } }', 'next.config.mjs')).not.toEqual([])
  })
  it('détecte les motifs sensibles dans le bundle sans les imprimer', () => {
    expect(inspectPublicBundle('const value = "POWER_PRIVATE_ENV_CANARY_auth"')).toBe(true)
    expect(inspectPublicBundle('const url = "postgresql://test:test@localhost/db"')).toBe(true)
    expect(inspectPublicBundle('const title = "POWER"')).toBe(false)
  })
})
