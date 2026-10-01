import manifest from "@/public/products/manifest.json"

type ManifestEntry = { name: string; path: string }

const normalize = (value: string) =>
  value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, " ")
    .trim()

const curated = new Map<string, string>(
  Object.values(manifest as Record<string, ManifestEntry>).map((entry) => [normalize(entry.name), entry.path]),
)

// Photos déjà préparées dans le dépôt mais ajoutées après le premier manifest.
const extraCurated: Record<string, string> = {
  "basilic frais": "/products/basilic-frais.webp",
  "coriandre fraiche": "/products/coriandre-fraiche.webp",
  "persil frise": "/products/persil-frise.webp",
  "persil plat": "/products/persil-plat.webp",
}

for (const [name, path] of Object.entries(extraCurated)) curated.set(normalize(name), path)

const isPlaceholder = (value?: string | null) =>
  !value || value.includes("placeholder") || value === "/images/placeholder.jpg"

/**
 * Une présentation homogène du catalogue :
 * 1. photo produit locale validée quand elle existe ;
 * 2. photo enregistrée en admin pour les nouveaux produits ;
 * 3. visuel de secours POWER, jamais une image cassée.
 */
export function productImage(name: string, adminImage?: string | null): string {
  const local = curated.get(normalize(name))
  if (local) return local
  if (!isPlaceholder(adminImage)) return adminImage as string
  return "/product-fallback.svg"
}
