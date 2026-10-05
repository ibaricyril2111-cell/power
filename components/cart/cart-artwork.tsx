import { ChefHat, CupSoda, Salad, Soup } from "lucide-react"
import ProductMascotImage from "@/components/product/product-mascot-image"
import MascotPortrait from "@/components/product/mascot-portrait"
import { avatarForProductName } from "@/lib/power-avatars"
import { compositionArtworkKind, type CompositionArtworkSource } from "@/lib/power-composition-artwork"

export default function CartArtwork({ name, composition, optionIds, sizes = "80px" }: {
  name: string
  composition?: CompositionArtworkSource | null
  optionIds?: readonly string[] | null
  sizes?: string
}) {
  if (!composition) return <ProductMascotImage name={name} alt={`Personnage POWER ${name}`} sizes={sizes} />
  const characters = (composition.options ?? [])
    .filter((option) => optionIds ? optionIds.includes(option.id) : option.includedByDefault)
    .flatMap((option) => {
      const avatar = avatarForProductName(option.name)
      return avatar ? [avatar] : []
    }).filter((avatar, index, all) => all.findIndex((other) => other.key === avatar.key) === index)
  const kind = compositionArtworkKind(composition)
  const Icon = kind === "drink" ? CupSoda : kind === "soup" ? Soup : kind === "salad" ? Salad : ChefHat
  return characters.length > 0 ? (
    <div className={`absolute inset-0 grid items-center gap-0.5 overflow-hidden rounded-lg bg-[#0b4938] ${characters.length === 1 ? "grid-cols-1" : "grid-cols-2"}`}>
      {characters.slice(0, 4).map((avatar) => <MascotPortrait key={avatar.key} mascotKey={avatar.key} />)}
    </div>
  ) : <div className="absolute inset-0 flex items-center justify-center rounded-lg bg-[#0b4938] text-[#ffcd47]"><Icon aria-label={name} className="h-8 w-8" /></div>
}
