"use client"

import ImageWithFallback from "./image-with-fallback"
import { ChefHat } from "lucide-react"
import { Button } from "@/components/ui/button"

interface Composition {
  id: string
  name: string
  basePrice: number
  imageUrl: string | null
  description: string | null
}

export default function CompositionMobileItem({ composition, onCompose }: { composition: Composition; onCompose?: () => void }) {
  return (
    <div
      className="flex min-w-0 flex-col overflow-hidden bg-white border border-black/5 rounded-[22px] shadow-sm active:scale-[0.99] transition"
      onClick={onCompose}
    >
      <div className="relative w-full aspect-square overflow-hidden bg-[#eee9df]">
        <ImageWithFallback
          src={composition.imageUrl || "/placeholder.svg"}
          alt={composition.name}
          fill
          sizes="50vw"
          className="object-cover"
        />
      </div>
      <div className="min-w-0 p-3 pb-2">
        <p className="mb-1 text-[9px] font-bold uppercase tracking-wider text-orange-600">À composer</p>
        <h3 className="text-sm font-bold text-[#173f32] truncate">{composition.name}</h3>
        <span className="text-[#173f32] font-black text-sm">Dès {composition.basePrice.toFixed(2)}€</span>
      </div>
      <Button
        onClick={(e) => {
          e.stopPropagation()
          onCompose?.()
        }}
        className="mx-3 mb-3 h-9 w-auto rounded-full bg-[#173f32] hover:bg-[#225943] text-white transition-all active:scale-95"
      >
        <ChefHat className="mr-2 w-4 h-4" /> Composer
      </Button>
    </div>
  )
}
