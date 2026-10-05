import { describe, it, expect, vi, beforeEach } from "vitest"
const { db } = vi.hoisted(() => ({ db: {
  product: { findMany: vi.fn() },
  compositionSize: { count: vi.fn(), createMany: vi.fn() },
  compositionOption: { count: vi.fn(), createMany: vi.fn(), findMany: vi.fn() },
} }))
vi.mock("@/lib/db", () => ({ prisma: db }))
import { configureEmptyPowerSmoothies } from "@/lib/configure-power-smoothies"
const empty = { id: "smoothie-2", name: "Smoothie à composer / 2 fruits", basePrice: 5, sizes: [], options: [] }
beforeEach(() => {
  vi.clearAllMocks()
  db.product.findMany.mockResolvedValue([
    { name: "Mangue", unit: "piece", currentStock: 4 },
    { name: "Fraise", unit: "barquette", currentStock: 3 },
    { name: "Kiwi", unit: "piece", currentStock: 0 },
    { name: "Mangue avion", unit: "piece", currentStock: 5 },
    { name: "Tomate", unit: "kg", currentStock: 3 },
  ])
  db.compositionSize.count.mockResolvedValue(0)
  db.compositionOption.count.mockResolvedValue(0)
  db.compositionOption.findMany.mockResolvedValue([{ id: "merchant-choice", isActive: false }])
})
describe("completing the existing POWER smoothie configuration", () => {
  it("keeps the real base price and includes only available, distinct fruit characters", async () => {
    expect(await configureEmptyPowerSmoothies([empty])).toBe(true)
    expect(db.compositionSize.createMany).toHaveBeenCalledWith({
      skipDuplicates: true, data: [{
        id: "power-format-smoothie-2", compositionId: "smoothie-2",
        name: "2 fruits au choix", price: 5, includedChoices: 2, isDefault: true, order: 0,
      }],
    })
    const options = db.compositionOption.createMany.mock.calls[0][0]
    expect(options.skipDuplicates).toBe(true)
    expect(options.data.map((item: { name: string }) => item.name)).toEqual(["Mangue", "Fraise"])
    expect(options.data.every((item: { extraPrice: number }) => item.extraPrice === 1)).toBe(true)
  })
  it("does not overwrite an existing or inactive merchant configuration", async () => {
    expect(await configureEmptyPowerSmoothies([{ ...empty, sizes: [{}] }])).toBe(false)
    db.compositionOption.count.mockResolvedValue(1)
    expect(await configureEmptyPowerSmoothies([empty])).toBe(false)
    expect(db.compositionOption.createMany).not.toHaveBeenCalled()
    expect(db.compositionSize.createMany).not.toHaveBeenCalled()
  })
  it("does not manufacture choices when not enough fruit is in stock", async () => {
    db.product.findMany.mockResolvedValue([{ name: "Mangue", unit: "piece", currentStock: 1 }])
    expect(await configureEmptyPowerSmoothies([empty])).toBe(false)
    expect(db.compositionSize.createMany).not.toHaveBeenCalled()
  })
  it("repairs a partially initialized recipe without replacing its own ingredient rows", async () => {
    db.compositionOption.count.mockResolvedValue(2)
    db.compositionOption.findMany.mockResolvedValue([
      { id: "power-fruit-smoothie-2-mangue", isActive: true },
      { id: "power-fruit-smoothie-2-fraise", isActive: true },
    ])
    expect(await configureEmptyPowerSmoothies([{ ...empty, options: [
      { id: "power-fruit-smoothie-2-mangue" }, { id: "power-fruit-smoothie-2-fraise" },
    ] }])).toBe(true)
    expect(db.compositionSize.createMany).toHaveBeenCalledOnce()
    expect(db.compositionOption.createMany.mock.calls[0][0].skipDuplicates).toBe(true)
  })
  it("does not alter unrelated juices, soups or products", async () => {
    expect(await configureEmptyPowerSmoothies([{ ...empty, name: "Soupe du jour" }])).toBe(false)
    expect(db.product.findMany).not.toHaveBeenCalled()
  })
})
