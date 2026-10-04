import { avatarForProductName, type PowerAvatarKey } from "@/lib/power-avatars"
/** Public fields only. The character sheet never supplies prices or stock. */
export type FamilyProduct = {
  id: string
  name: string
  price: number
  promoPrice?: number | null
  unit: string
  inStock: boolean
  currentStock: number
}
export function productsForCharacter(products: readonly FamilyProduct[], key: PowerAvatarKey) {
  return products.filter((product) => avatarForProductName(product.name)?.key === key)
    .sort((a, b) => Number(b.inStock && b.currentStock > 0) - Number(a.inStock && a.currentStock > 0)
      || a.name.localeCompare(b.name, "fr"))
}
