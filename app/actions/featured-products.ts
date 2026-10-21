"use server"
import { auth } from "@/auth"
import { prisma } from "@/lib/db"
import { revalidatePath } from "next/cache"
import { FEATURED_PRODUCTS_KEY, parseFeaturedIds } from "@/lib/featured-products"

export async function getFeaturedProductOptions() {
  const session = await auth()
  if (session?.user?.role !== "admin" || session.user.disabled) return { success: false as const, products: [], selected: [] }
  const [products, setting] = await Promise.all([
    prisma.product.findMany({ select: { id: true, name: true, inStock: true }, orderBy: { name: "asc" } }),
    prisma.siteSetting.findUnique({ where: { key: FEATURED_PRODUCTS_KEY }, select: { value: true } }),
  ])
  return { success: true as const, products, selected: parseFeaturedIds(setting?.value) }
}

export async function saveFeaturedProducts(ids: string[]) {
  const session = await auth()
  if (session?.user?.role !== "admin" || session.user.disabled) return { success: false, error: "Non autorisé" }
  const valid = parseFeaturedIds(JSON.stringify(ids))
  if (!Array.isArray(ids) || valid.length !== ids.length) return { success: false, error: "Sélection invalide (12 produits maximum)." }
  const count = await prisma.product.count({ where: { id: { in: valid } } })
  if (count !== valid.length) return { success: false, error: "Un produit n'existe plus. Rechargez la sélection." }
  await prisma.siteSetting.upsert({ where: { key: FEATURED_PRODUCTS_KEY }, update: { value: JSON.stringify(valid) }, create: { key: FEATURED_PRODUCTS_KEY, value: JSON.stringify(valid) } })
  revalidatePath("/")
  return { success: true }
}
