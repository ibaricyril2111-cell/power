import { avatarForProductName } from "@/lib/power-avatars"

export type ArtworkIngredient = {
  id: string
  name: string
  includedByDefault?: boolean
}

export type CompositionArtworkSource = {
  name: string
  type?: string | null
  imageUrl?: string | null
  description?: string | null
  options?: readonly ArtworkIngredient[]
}

const normalize = (value: string) => value.normalize("NFD")
  .replace(/[\u0300-\u036f]/g, "").toLowerCase()
  .replace(/[^a-z0-9]+/g, " ").trim()

// Existing artwork checked visually against the original POWER recipe images.
// No price, stock, option selection or commercial data is stored here.
export const POWER_RECIPE_ARTWORK = [
  { key: "mangue-ananas-passion", image: "/brand/tropic-rose.webp", ingredients: ["mangue", "ananas", "passion"], aliases: ["tropic rose", "mangue ananas passion", "mangue passion ananas"], alt: "Les personnages mangue, ananas et fruit de la passion autour du mixeur POWER" },
  { key: "mangue-fraise-clementine", image: "/brand/tropical-rose.webp", ingredients: ["mangue", "fraise", "clementine"], aliases: ["tropical rose", "mangue fraise clementine"], alt: "Les personnages mangue, fraise et clémentine autour du mixeur POWER" },
  { key: "fraise-banane-poire", image: "/brand/harmonie-rose.webp", ingredients: ["fraise", "banane", "poire"], aliases: ["harmonie rose", "fraise banane poire"], alt: "Les personnages fraise, banane et poire autour du mixeur POWER" },
] as const

export function compositionArtworkKind(source: CompositionArtworkSource) {
  const type = normalize(source.type ?? "")
  const name = normalize(source.name)
  // A salad or soup must never receive a smoothie image, even with the same fruits.
  if (/\bsalades?\b/.test(type || name)) return "salad" as const
  if (/\bsoupes?\b/.test(type || name)) return "soup" as const
  if (/\b(jus|smoothies?|boissons?)\b/.test(type || name)) return "drink" as const
  return "other" as const
}

// Some fixed preparations have no configurable options. Their published opening
// ingredient list can still illustrate the card, without creating any choices.
function describedIngredients(description?: string | null): ArtworkIngredient[] {
  const opening = description?.split(/[.!?]/, 1)[0] ?? ""
  if (/\b(sans|sauf|option|facultatif|supplement|choix)\b/.test(normalize(opening))) return []
  const names = opening.split(/\s*[,;]\s*|\s+et\s+/i).map(name => name.trim()).filter(Boolean)
  if (names.length < 2 || !names.some(name => avatarForProductName(name))) return []
  return names.map((name, index) => ({ id: `artwork-description-${index}`, name }))
}

export function resolveCompositionArtwork(source: CompositionArtworkSource, selectedOptionIds?: readonly string[]) {
  const options = source.options ?? []
  const described = options.length === 0 && selectedOptionIds === undefined ? describedIngredients(source.description) : []
  const kind = compositionArtworkKind(source)
  const selected = selectedOptionIds === undefined
    ? options.filter((option) => option.includedByDefault)
    : options.filter((option) => selectedOptionIds.includes(option.id))
  const mode = selected.length > 0
    ? (selectedOptionIds === undefined ? "included" : "selected")
    : options.length > 0 ? "choices" : described.length > 0 ? "described" : "missing"
  const ingredients = selected.length > 0 ? selected : options.length > 0 ? options : described
  const cleanName = normalize(source.name).replace(/^(?:jus|smoothie) (?:de |aux? )?/, "")
  let recipe: (typeof POWER_RECIPE_ARTWORK)[number] | undefined

  if (kind !== "salad" && kind !== "soup" && (kind === "drink" || !source.type)) {
    if (options.length > 0) {
      // The selection is authoritative. Unknown ingredients, extras and removals
      // invalidate a fixed recipe illustration instead of silently lying about it.
      const keys = selected.map((option) => avatarForProductName(option.name)?.key)
      if (keys.length > 0 && keys.every((key) => key !== undefined)) {
        const uniqueKeys = [...new Set(keys)]
        recipe = POWER_RECIPE_ARTWORK.find((entry) =>
          entry.ingredients.length === uniqueKeys.length &&
          entry.ingredients.every((key) => uniqueKeys.includes(key)),
        )
      }
    } else if (selectedOptionIds === undefined) {
      recipe = POWER_RECIPE_ARTWORK.find((entry) => entry.aliases.some((alias) => alias === cleanName))
    }
  }

  return { recipe: recipe ?? null, ingredients, mode, kind }
}
