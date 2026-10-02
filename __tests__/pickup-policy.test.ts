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
})
