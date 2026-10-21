import { avatarForProductName, normalizeMascotName } from "@/lib/power-avatars"

// Product varieties have their own portraits; the 100 personal avatars stay stable.
const portraits = [
  { key: "pomme-pink-lady", label: "Pomme Pink Lady", pattern: /\b(?:pommes? )?pink lady\b/ },
  { key: "pomme-granny-smith", label: "Pomme Granny Smith", pattern: /\b(?:pommes? )?granny(?: smith)?\b/ },
  { key: "pomme-gala", label: "Pomme Gala", pattern: /\b(?:pommes? )?gala\b/ },
  { key: "mirabelle", label: "Mirabelle", pattern: /\bmirabelles?\b/ },
  { key: "chou-blanc", label: "Chou blanc", pattern: /\bchoux? blancs?\b/ },
  { key: "piment-vert", label: "Piment vert", pattern: /\bpiments?(?: longs?)? verts?\b/ },
]

/** Display-only artwork: never modifies catalogue price, stock or product identity. */
export function productMascotForName(name: string) {
  const normalized = normalizeMascotName(name)
  const original = avatarForProductName(name)
  if (original?.key === "pomme-de-terre") return original
  // A recipe must not become one of its ingredients just because its name matches.
  if (/\b(jus|smoothies?|soupes?|compotes?|confitures?|coulis|purees?|paniers?|box|bowls?|salades?)\b/.test(normalized)) {
    return original
  }
  const portrait = portraits.find(item => item.pattern.test(normalized))
  return portrait ? { key: portrait.key, label: portrait.label, image: `/brand/mascots/products/${portrait.key}.webp` } : original
}
