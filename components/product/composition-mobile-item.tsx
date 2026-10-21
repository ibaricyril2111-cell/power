"use client"

import CompositionArtwork from "./composition-artwork"
import type { ArtworkIngredient } from "@/lib/power-composition-artwork"
import { ChefHat } from "lucide-react"
import { Button } from "@/components/ui/button"
import { isDrinkRecipe } from "@/lib/drink-ordering"
import ProductPrice from "./product-price"

interface Composition {
  id: string
  type?: string | null
  options?: readonly ArtworkIngredient[]
  name: string
  basePrice: number
  imageUrl: string | null
  description: string | null
}

export default function CompositionMobileItem({ composition, onCompose }: { composition: Composition; onCompose?: () => void }) {
  return (
    <div
      className="power-tile flex min-w-0 flex-col overflow-hidden bg-[#0b4938] border border-white/15 rounded-[22px] shadow-sm active:scale-[0.99] transition"
      onClick={onCompose}
    >
      <div className="relative w-full aspect-square overflow-hidden bg-[#0b4938]">
        <CompositionArtwork composition={composition} sizes="50vw" />
      </div>
      <div className="min-w-0 p-3 pb-2">
        <p className="mb-1 text-[9px] font-bold uppercase tracking-wider text-[#ffcd47]">{isDrinkRecipe(composition) ? "Recette POWER" : "À composer"}</p>
        <h3 className="text-sm font-bold text-white truncate">{composition.name}</h3>
        <ProductPrice price={composition.basePrice} from />
      </div>
      <Button
        onClick={(e) => {
          e.stopPropagation()
          onCompose?.()
        }}
        className="mx-3 mb-3 min-h-11 h-auto min-w-0 w-auto flex-wrap whitespace-normal px-2 py-3 rounded-xl bg-[#ffcd47] hover:bg-[#ffe18a] text-[#073b2d] transition-all active:scale-95"
      >
        <ChefHat className="mr-2 w-4 h-4" /> {isDrinkRecipe(composition) ? "Commander" : "Composer"}
      </Button>
    </div>
  )
}
