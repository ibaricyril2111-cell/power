import Image from "next/image"
import { ChefHat, CupSoda, Salad, Soup } from "lucide-react"
import { avatarForProductName } from "@/lib/power-avatars"
import { resolveCompositionArtwork, type CompositionArtworkSource } from "@/lib/power-composition-artwork"

/** Display only: never changes the composition, selection, price or stock. */
export default function CompositionArtwork({
  composition,
  selectedOptionIds,
  sizes = "(max-width: 767px) 90vw, 360px",
  className = "",
}: {
  composition: CompositionArtworkSource
  selectedOptionIds?: readonly string[]
  sizes?: string
  className?: string
}) {
  const { recipe, ingredients, mode, kind } = resolveCompositionArtwork(composition, selectedOptionIds)

  if (recipe) {
    return (
      <div data-composition-artwork={recipe.key} className={`absolute inset-0 overflow-hidden bg-[#0b4938] ${className}`}>
        <Image src={recipe.image} alt={recipe.alt} fill sizes={sizes} className="object-contain" />
      </div>
    )
  }

  const Icon = kind === "salad" ? Salad : kind === "drink" ? CupSoda : kind === "soup" ? Soup : ChefHat
  const heading = mode === "choices" ? "Les ingrédients au choix"
    : mode === "selected" ? "Votre sélection"
    : mode === "included" ? "Les ingrédients de base"
    : "Votre création POWER"
  const characters = ingredients.map((ingredient) => ({ ingredient, avatar: avatarForProductName(ingredient.name) }))
    .filter((item) => item.avatar !== null)
    .filter((item, index, all) => all.findIndex((other) => other.avatar?.key === item.avatar?.key) === index)
    .slice(0, 4)
  const cols = characters.length > 3 ? "grid-cols-4" : characters.length === 3 ? "grid-cols-3" : "grid-cols-2"

  return (
    <div
      data-composition-artwork="ingredient-board"
      data-composition-kind={kind}
      data-ingredient-mode={mode}
      className={`absolute inset-0 flex flex-col justify-between gap-3 overflow-hidden bg-gradient-to-b from-[#145b46] to-[#073b2d] p-4 text-white ${className}`}
    >
      <div className="flex items-center justify-between gap-2">
        <span className="text-xs font-bold text-[#ffcd47]">{heading}</span>
        <Icon aria-hidden="true" className="h-5 w-5 shrink-0 text-[#ffcd47]" />
      </div>
      {characters.length > 0 ? (
        <div className={`grid min-h-0 flex-1 items-center gap-2 ${cols}`}>
          {characters.map(({ ingredient, avatar }) => (
            <div key={avatar!.key} className="min-w-0 text-center">
              <div className="relative mx-auto aspect-square w-full max-w-[140px] overflow-hidden rounded-2xl bg-[#0b4938]">
                <Image src={avatar!.image} alt={`Personnage POWER ${avatar!.label}`} fill sizes="140px" className="object-contain" />
              </div>
              <span className="mt-1 block truncate text-[11px] font-semibold">{ingredient.name}</span>
            </div>
          ))}
        </div>
      ) : (
        <div className="flex min-h-0 flex-1 flex-col items-center justify-center gap-3 text-center">
          <Icon aria-hidden="true" className="h-12 w-12 text-[#ffcd47]" />
          <span className="text-sm font-bold">{composition.name}</span>
        </div>
      )}
      <p className="line-clamp-2 text-center text-[11px] leading-relaxed text-white/75">
        {ingredients.length > 0 ? ingredients.map((ingredient) => ingredient.name).join(" · ")
          : "L’illustration de cette recette est en préparation."}
      </p>
    </div>
  )
}
