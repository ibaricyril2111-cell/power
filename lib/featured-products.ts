export const FEATURED_PRODUCTS_KEY = "homepage_featured_product_ids"
export function parseFeaturedIds(value?: string | null): string[] {
  try {
    const ids: unknown = JSON.parse(value || "[]")
    return Array.isArray(ids) && ids.length <= 12 && ids.every(id => typeof id === "string" && /^[a-zA-Z0-9_-]{1,100}$/.test(id))
      ? [...new Set(ids)] : []
  } catch { return [] }
}
