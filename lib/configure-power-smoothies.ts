import { prisma } from "@/lib/db"
import { avatarForProductName } from "@/lib/power-avatars"
import { minQuantity } from "@/lib/units"

type EmptyRecipe = {
  id: string; name: string; basePrice: number
  sizes: readonly unknown[]; options: readonly { id?: string }[]
}

/** Complete the two existing unconfigured made-to-order smoothies.
 * No product, price, stock or existing choice is overwritten. Stable IDs make
 * concurrent startup calls idempotent. Existing/inactive merchant choices win.
 */
export async function configureEmptyPowerSmoothies(recipes: readonly EmptyRecipe[]) {
  const candidates = recipes.filter((recipe) => /smoothie/i.test(recipe.name)
    && /\b([23])\s*fruits?\b/i.test(recipe.name) && recipe.sizes.length === 0
    && recipe.options.every((option) => option.id?.startsWith("power-fruit-" + recipe.id + "-")))
  if (candidates.length === 0) return false
  const products = await prisma.product.findMany({
    where: { inStock: true, currentStock: { gt: 0 } },
    select: { name: true, unit: true, currentStock: true },
    orderBy: { name: "asc" },
  })
  const seen = new Set<string>()
  const fruits = products.flatMap((product) => {
    const avatar = avatarForProductName(product.name)
    if (!avatar || !["fruits", "exotiques"].includes(avatar.family)
      || product.currentStock < minQuantity(product.unit) || seen.has(avatar.key)) return []
    seen.add(avatar.key)
    return [avatar]
  })
  let changed = false
  for (const recipe of candidates) {
    const quota = Number(recipe.name.match(/\b([23])\s*fruits?\b/i)?.[1])
    if (fruits.length < quota) continue
    // Count ALL rows: an inactive configuration must not be replaced.
    const [sizeCount, optionCount] = await Promise.all([
      prisma.compositionSize.count({ where: { compositionId: recipe.id } }),
      prisma.compositionOption.count({ where: { compositionId: recipe.id } }),
    ])
    if (sizeCount > 0) continue
    if (optionCount > 0) {
      // Recover a failed format insertion only for this initializer's own active
      // rows. Any merchant-created or inactive choice keeps its configuration.
      const existing = await prisma.compositionOption.findMany({
        where: { compositionId: recipe.id }, select: { id: true, isActive: true },
      })
      if (existing.length !== optionCount || existing.some((option) =>
        !option.isActive || !option.id.startsWith("power-fruit-" + recipe.id + "-"))) continue
    }
    // Supplement follows POWER's established €1 ingredient supplement.
    // The existing commercial base price remains authoritative (5€ / 6€ today).
    await prisma.compositionOption.createMany({
      skipDuplicates: true,
      data: fruits.map((avatar, order) => ({
        id: "power-fruit-" + recipe.id + "-" + avatar.key,
        compositionId: recipe.id, name: avatar.label, order,
        extraPrice: 1, includedByDefault: false, isRemovable: true, isActive: true,
      })),
    })
    await prisma.compositionSize.createMany({
      skipDuplicates: true,
      data: [{
        id: "power-format-" + recipe.id, compositionId: recipe.id,
        name: quota + " fruits au choix", price: recipe.basePrice,
        includedChoices: quota, isDefault: true, order: 0,
      }],
    })
    changed = true
  }
  return changed
}
