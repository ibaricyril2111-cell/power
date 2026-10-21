import { avatarForProductName } from "@/lib/power-avatars"

export const PRODUCT_FAMILIES = [
  { key: "pommes", title: "Nos pommes", description: "Toutes les variétés du moment.", image: "/brand/families/pommes.webp" },
  { key: "fruits-rouges", title: "Fruits rouges", description: "Les petites baies gourmandes.", image: "/brand/families/fruits-rouges.webp" },
  { key: "herbes", title: "Nos herbes", description: "La famille des aromates.", image: "/brand/families/herbes.webp" },
  { key: "agrumes", title: "Nos agrumes", description: "Oranges, citrons, pomelos…", image: "/brand/families/agrumes-pomelo.webp" },
  { key: "fruits", title: "Les autres fruits", description: "Poires, kiwis, raisins et plus.", image: "/brand/families/fruits.webp" },
  { key: "exotiques", title: "Fruits exotiques", description: "Les saveurs venues d’ailleurs.", image: "/brand/families/exotiques.webp" },
  { key: "legumes", title: "Nos légumes", description: "Toutes vos envies de cuisine.", image: "/brand/families/legumes.webp" },
] as const
export type ProductFamilyKey = (typeof PRODUCT_FAMILIES)[number]["key"]

const berries = new Set(["fraise", "framboise", "myrtille", "groseille", "mure", "cassis"])
const citrus = new Set(["orange", "citron", "citron-vert", "clementine", "mandarine", "pamplemousse", "kumquat"])

/** Classification only; no catalogue entries, prices or availability are invented. */
export function productFamilyKey(product: { name: string; category: string }): ProductFamilyKey | null {
  const mascot = avatarForProductName(product.name)
  if (mascot?.key === "pomme") return "pommes"
  if ((mascot && berries.has(mascot.key)) || product.category.toLowerCase() === "fruits rouges") return "fruits-rouges"
  if (mascot && citrus.has(mascot.key)) return "agrumes"
  if ((mascot?.family === "aromates" && !["gingembre", "curcuma"].includes(mascot.key)) || product.category.toLowerCase() === "aromates") return "herbes"
  const category = product.category.toLowerCase()
  if (category.includes("exotique")) return "exotiques"
  if (category.includes("légume") || category.includes("legume")) return "legumes"
  if (category.includes("fruit")) return "fruits"
  return null
}
