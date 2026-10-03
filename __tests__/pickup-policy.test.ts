import { describe, expect, it } from "vitest"
import { isPickupDateAllowed, minimumPickupDate } from "@/lib/pickup-policy"

describe("règle Click & Collect POWER", () => {
  it("vendredi autorise un retrait samedi ou dimanche", () => {
    const friday = new Date("2026-10-02T10:00:00+02:00")
    expect(minimumPickupDate(friday)).toBe("2026-10-03")
    expect(isPickupDateAllowed("2026-10-03", friday)).toBe(true)
    expect(isPickupDateAllowed("2026-10-04", friday)).toBe(true)
  })

  it("samedi interdit dimanche et commence lundi", () => {
    const saturday = new Date("2026-10-03T10:00:00+02:00")
    expect(minimumPickupDate(saturday)).toBe("2026-10-05")
    expect(isPickupDateAllowed("2026-10-04", saturday)).toBe(false)
    expect(isPickupDateAllowed("2026-10-05", saturday)).toBe(true)
  })

  it("un jour normal commence au lendemain", () => {
    const monday = new Date("2026-10-05T10:00:00+02:00")
    expect(minimumPickupDate(monday)).toBe("2026-10-06")
  })

  it("ne promet ni une date passée ni un retrait le jour même", () => {
    const friday = new Date("2026-10-02T10:00:00+02:00")
    expect(isPickupDateAllowed("2026-10-01", friday)).toBe(false)
    expect(isPickupDateAllowed("2026-10-02", friday)).toBe(false)
  })

  it("applique la règle du samedi dès minuit à Paris même si UTC est encore vendredi", () => {
    const now = new Date("2026-10-02T22:30:00Z")
    expect(minimumPickupDate(now)).toBe("2026-10-05")
    expect(isPickupDateAllowed("2026-10-04", now)).toBe(false)
  })

  it.each([
    ["2026-03-29T00:30:00Z", "2026-03-30"],
    ["2026-03-29T01:30:00Z", "2026-03-30"],
    ["2026-10-25T00:30:00Z", "2026-10-26"],
    ["2026-10-25T01:30:00Z", "2026-10-26"],
  ])("conserve la date locale pendant le changement d'heure : %s", (instant, expected) => {
    expect(minimumPickupDate(new Date(instant))).toBe(expected)
  })

  it("passe correctement au mois suivant après un samedi", () => {
    expect(minimumPickupDate(new Date("2026-01-31T12:00:00+01:00"))).toBe("2026-02-02")
  })

  it("passe correctement à l'année suivante", () => {
    expect(minimumPickupDate(new Date("2026-12-31T12:00:00+01:00"))).toBe("2027-01-01")
  })

  it.each(["", "demain", "2026-1-03", "2026-13-01", "2026-11-31", "2027-02-29", "2026-10-00", "2026-10-05T10:00:00Z"])(
    "refuse une date invalide plutôt que de la normaliser : %s", (value) => {
      expect(isPickupDateAllowed(value, new Date("2026-01-01T12:00:00+01:00"))).toBe(false)
    },
  )

  it("accepte le 29 février d'une année bissextile lorsque le délai est respecté", () => {
    expect(isPickupDateAllowed("2028-02-29", new Date("2028-02-28T12:00:00+01:00"))).toBe(true)
  })
})
