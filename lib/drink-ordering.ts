import { compositionArtworkKind } from "@/lib/power-composition-artwork"

type DrinkRecipe = {
  name: string
  type?: string | null
  sizes?: readonly { id?: string; includedChoices?: number }[]
  options?: readonly { id: string; includedByDefault?: boolean }[]
}

export const isDrinkRecipe = (recipe: DrinkRecipe) => compositionArtworkKind({ name: recipe.name, type: recipe.type }) === "drink"

/** Retired from sale, not deleted from the merchant's catalogue or order history. */
export function isFreeChoiceDrink(recipe: DrinkRecipe) {
  const name = recipe.name.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase()
  return isDrinkRecipe(recipe) && (/\b(composer|au choix|personnalis)/.test(name)
    || (recipe.sizes ?? []).some(size => (size.includedChoices ?? 0) > 0))
}

/** Applied on the server too: old tabs/carts cannot submit customised drinks. */
export function drinkOrderError(recipe: DrinkRecipe, selection: any): string | null {
  if (!isDrinkRecipe(recipe)) return null
  if (isFreeChoiceDrink(recipe)) return "Les smoothies à composer ne sont plus proposés. Retirez cette formule et choisissez une recette POWER."
  const required = (recipe.options ?? []).filter(option => option.includedByDefault).map(option => option.id)
  const chosen = selection?.optionIds ?? []
  if (!Array.isArray(chosen) || chosen.length !== required.length
    || new Set(chosen).size !== chosen.length || required.some(id => !chosen.includes(id))
    || selection?.size != null || selection?.ingredients != null
    || (selection?.sizeId && !(recipe.sizes ?? []).some(size => size.id === selection.sizeId))) {
    return "Cette boisson est une recette fixe, sans choix d’ingrédients. Retirez-la puis ajoutez la recette à nouveau."
  }
  return null
}
