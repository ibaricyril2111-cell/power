import { beforeEach, describe, expect, it, vi } from "vitest"
const mocks = vi.hoisted(() => ({ recipe: vi.fn(), recipes: vi.fn(), create: vi.fn(), update: vi.fn() }))
vi.mock("@/auth", () => ({ auth: vi.fn().mockResolvedValue({ user: { id: "customer" } }) }))
vi.mock("next/headers", () => ({ cookies: vi.fn().mockResolvedValue({ get: () => undefined }) }))
vi.mock("@/lib/db", () => ({ prisma: {
  cart: { findFirst: vi.fn().mockResolvedValue({ id: "cart" }) },
  cartItem: { findFirst: vi.fn().mockResolvedValue(null), create: mocks.create, update: mocks.update },
  composition: { findUnique: mocks.recipe, findMany: mocks.recipes },
} }))
import { addToCart } from "@/app/actions/cart"
import { getComposition, getCompositionsByTypes } from "@/app/actions/compositions"
const fixed = { id: "fixed", name: "Jus Mangue", type: "jus", basePrice: 5, sizes: [],
  options: [{ id: "mango", name: "Mangue", includedByDefault: true, extraPrice: 0 }] }
const retired = { ...fixed, id: "old", name: "Smoothie à composer / 2 fruits" }
beforeEach(() => { vi.clearAllMocks(); mocks.recipe.mockResolvedValue(fixed); mocks.create.mockResolvedValue({ id: "item" }) })
describe("catalogue and cart obey fixed recipes", () => {
  it("hides old custom smoothies from the public catalogue without deleting any data", async () => {
    mocks.recipes.mockResolvedValue([retired, fixed])
    expect((await getCompositionsByTypes(["jus"])).data).toEqual([fixed])
  })
  it("does not reopen a retired formula by ID", async () => {
    mocks.recipe.mockResolvedValue(retired)
    expect((await getComposition("old")).data).toBeNull()
  })
  it("blocks a retired formula at add-to-cart", async () => {
    mocks.recipe.mockResolvedValue(retired)
    expect((await addToCart({ compositionId: "old" })).success).toBe(false)
    expect(mocks.create).not.toHaveBeenCalled()
  })
  it("blocks an ingredient removal sent by an old client", async () => {
    expect((await addToCart({ compositionId: "fixed", customData: { optionIds: [] } })).success).toBe(false)
    expect(mocks.create).not.toHaveBeenCalled()
  })
  it("uses the merchant's base recipe when added without customisation", async () => {
    expect((await addToCart({ compositionId: "fixed" })).success).toBe(true)
    expect(mocks.create).toHaveBeenCalledWith({ data: { cartId: "cart", productId: null,
      compositionId: "fixed", quantity: 1, customData: { sizeId: null, optionIds: ["mango"] } } })
  })
})
