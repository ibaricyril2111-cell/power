"use client"

import { useState } from "react"
import { toast } from "sonner"
import { addToCart } from "@/app/actions/cart"
import { compositionPrice, resolveSize } from "@/lib/composition-pricing"
import { isFreeChoiceDrink } from "@/lib/drink-ordering"
import type { ConfigurableComposition } from "./composition-configurator"
import CompositionArtwork from "./composition-artwork"
import QuantitySelector from "./quantity-selector"
import CartButtonContent from "./cart-button-content"
import { Button } from "@/components/ui/button"

export default function FixedDrinkPurchase({ composition, onDone }: {
  composition: ConfigurableComposition; onDone?: () => void
}) {
  const [sizeId, setSizeId] = useState(resolveSize(composition.sizes, null)?.id ?? null)
  const [quantity, setQuantity] = useState(1)
  const [loading, setLoading] = useState(false)
  const included = composition.options.filter(option => option.includedByDefault)
  const selection = { sizeId, optionIds: included.map(option => option.id) }
  const price = compositionPrice(selection, composition.sizes, composition.options, composition.basePrice)
  if (isFreeChoiceDrink(composition)) return <p role="status">Cette formule à composer n’est plus proposée. Choisissez une recette POWER.</p>

  const add = async () => {
    if (loading) return
    setLoading(true)
    try {
      const result = await addToCart({ compositionId: composition.id, quantity, customData: selection })
      if (!result.success) { toast.error(result.error || "Impossible d’ajouter cette recette."); return }
      toast.success(`${quantity} × ${composition.name} ajouté au panier`)
      window.dispatchEvent(new Event("cart-updated"))
      onDone?.()
    } catch { toast.error("Impossible d’ajouter cette recette. Réessayez.") }
    finally { setLoading(false) }
  }

  return <div className="grid gap-5 md:grid-cols-2">
    <div className="relative aspect-square overflow-hidden rounded-2xl border border-white/15 bg-[#0b4938]">
      <CompositionArtwork composition={{ ...composition, options: included }} sizes="(max-width: 767px) 90vw, 360px" />
    </div>
    <div className="space-y-5">
      <p className="text-sm text-white/80">{composition.description}</p>
      {included.length > 0 && <p className="text-sm text-[#ffcd47]">{included.map(option => option.name).join(" · ")}</p>}
      <p className="text-sm text-white/70">Recette POWER, sans personnalisation des ingrédients.</p>
      {composition.sizes.length > 1 && <label className="block text-sm font-bold">Format
        <select aria-label="Format" value={sizeId ?? ""} onChange={event => setSizeId(event.target.value)} className="mt-2 block min-h-12 w-full rounded-xl border border-white/20 bg-[#0b4938] p-3">
          {composition.sizes.map(size => <option key={size.id} value={size.id}>{size.name} — {size.price.toFixed(2)} €</option>)}
        </select>
      </label>}
      <div><p className="mb-2 text-sm font-bold">Quantité</p><QuantitySelector appearance="power" value={quantity} onChange={setQuantity} unit="verre" /></div>
      <p className="flex justify-between text-xl font-bold"><span>Total</span><span className="text-[#ffcd47]">{(price * quantity).toFixed(2)} €</span></p>
      <Button onClick={add} disabled={loading} className="min-h-12 w-full rounded-xl bg-[#ffcd47] font-bold text-[#073b2d] hover:bg-[#ffe18a]">
        <CartButtonContent loading={loading}>{loading ? "Ajout en cours…" : "Ajouter au panier"}</CartButtonContent>
      </Button>
    </div>
  </div>
}
