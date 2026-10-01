import { describe, it, expect } from "vitest"
import { safeCallbackPath } from "@/lib/auth-redirect"
import { parseDeliveryDate } from "@/lib/utils"
describe("retour après connexion", () => {
  it("conserve la commande et son créneau", () => {
    expect(safeCallbackPath("/commande?date=2099-08-10&slot=s1")).toBe("/commande?date=2099-08-10&slot=s1")
  })
  it.each(["https://evil.example", "//evil.example", "/\\evil.example", "/connexion", "/\n/evil.example"])("refuse %s", value => {
    expect(safeCallbackPath(value)).toBe("/")
  })
  it("rejette une date inexistante", () => {
    expect(parseDeliveryDate("2099-02-31")).toBeNull()
    expect(parseDeliveryDate("31/02/2099")).toBeNull()
  })
})
