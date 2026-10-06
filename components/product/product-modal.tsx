"use client"

import { useState, useEffect } from "react"
import ProductMascotImage from "@/components/product/product-mascot-image"
import CartButtonContent from "@/components/product/cart-button-content"
import ProduceComment from "./produce-comment"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Leaf, Truck, Shield } from "lucide-react"
import { addToCart } from "@/app/actions/cart"
import { toast } from "sonner"
import QuantitySelector from "@/components/product/quantity-selector"
import { minQuantity, formatQuantity, lineTotal } from "@/lib/units"

interface Product {
  id: string
  name: string
  price: number
  promoPrice?: number | null
  unit: string
  image: string
  description: string
  category: string
  inStock: boolean
  organic: boolean
  /** Stock réel : borne la quantité commandable. */
  currentStock?: number
}

interface ProductModalProps {
  product: Product
  isOpen: boolean
  onClose: () => void
}

export default function ProductModal({ product, isOpen, onClose }: ProductModalProps) {
  const [quantity, setQuantity] = useState(() => minQuantity(product.unit))
  const [isAdding, setIsAdding] = useState(false)

  // Le provider monte cette modale une seule fois et ne change que le produit en props :
  // sans cette remise à zéro, la quantité d'un article au poids (0,2 kg) restait affichée
  // sur l'article suivant vendu à la pièce, soit « 0,2 pièce ».
  useEffect(() => {
    setQuantity(minQuantity(product.unit))
  }, [product.id, product.unit])

  const handleAddToCart = async () => {
    setIsAdding(true)
    try {
      const result = await addToCart({ productId: product.id, quantity })
      if (result.success) {
        toast.success(`${formatQuantity(quantity, product.unit)} de ${product.name} ajouté au panier`)
        window.dispatchEvent(new Event("cart-updated"))
        onClose()
      } else {
        // Le message serveur porte l'information utile (stock restant, produit retiré) :
        // l'afficher évite un « Erreur » opaque devant lequel le client abandonne.
        toast.error(result.error || "Erreur lors de l'ajout au panier.")
      }
    } catch (error) {
      console.error(error)
      toast.error("Une erreur est survenue")
    } finally {
      setIsAdding(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent
        className="flex w-[calc(100%-1.5rem)] max-w-3xl max-h-[calc(100dvh-2rem)] flex-col gap-0 overflow-hidden rounded-[24px] border-[#ffcd47]/25 bg-[#073b2d] p-0 text-white shadow-2xl sm:rounded-[24px] [&>button]:right-2 [&>button]:top-2 [&>button]:flex [&>button]:h-11 [&>button]:w-11 [&>button]:items-center [&>button]:justify-center [&>button]:rounded-xl [&>button]:text-white"
      >
        <DialogHeader className="shrink-0 border-b border-white/10 px-4 py-4 pr-14 text-left sm:px-6 sm:pr-16">
          <DialogTitle className="break-words text-xl font-bold leading-tight text-white sm:text-2xl">
            {product.name}
          </DialogTitle>
          <DialogDescription className="sr-only">
            Choisissez votre quantité. Le total et le bouton d’ajout restent accessibles en bas de la fiche.
          </DialogDescription>
        </DialogHeader>

        {/* Only this body scrolls. The close control, total and purchase action stay visible. */}
        <div data-power-product-body className="min-h-0 flex-1 overflow-y-auto overscroll-contain p-4 sm:p-6">
          <div className="grid min-w-0 grid-cols-1 items-start gap-4 md:grid-cols-2 md:gap-6">
            {/* Reuse the approved asset without cropping or enlarging it to fill the phone. */}
            <div data-power-product-image className="relative mx-auto aspect-square w-full max-w-[min(54vw,210px)] overflow-hidden rounded-[20px] border border-white/10 bg-[#0b4938] md:max-w-[280px]">
              <ProductMascotImage
                name={product.name}
                alt={`Personnage POWER ${product.name}`}
                sizes="(max-width: 389px) 54vw, (max-width: 767px) 210px, 280px"
              />

              <div className="absolute top-2 left-2 flex flex-col gap-2">
                {product.organic && (
                  <Badge className="bg-[#073b2d]/95 text-[#ffcd47] border-[#ffcd47]/30">
                    <Leaf className="h-3 w-3 mr-1" />
                    Bio
                  </Badge>
                )}
                {!product.inStock && (
                  <Badge className="badge-error">Rupture de stock</Badge>
                )}
              </div>
            </div>

            {/* Prices, units, stock bounds and calculation functions are unchanged. */}
            <div className="min-w-0 space-y-4">
              <div>
                <ProduceComment name={product.name} description={product.description} className="mb-3 break-words" />
                <div className="flex flex-wrap items-baseline gap-x-2 gap-y-1">
                  {product.promoPrice != null && (
                    <span className="text-lg font-semibold text-white/60 line-through">{product.price.toFixed(2)}€</span>
                  )}
                  <span className="text-2xl font-bold text-[#ffcd47] sm:text-3xl">{(product.promoPrice ?? product.price).toFixed(2)}€</span>
                  <span className="break-words text-sm text-white/70">/ {product.unit}</span>
                </div>
              </div>

              <Separator className="bg-white/15" />

              <div>
                <p className="mb-2 text-sm font-semibold text-white">Quantité</p>
                <QuantitySelector
                  value={quantity}
                  onChange={setQuantity}
                  unit={product.unit}
                  max={product.currentStock}
                  disabled={!product.inStock}
                  appearance="power"
                />
              </div>

              <Separator className="bg-white/15" />

              <div className="space-y-2 text-xs leading-relaxed text-white/75">
                <div className="flex items-start gap-2">
                  <Truck className="mt-0.5 h-4 w-4 shrink-0 text-[#ffcd47]" />
                  <span>Retrait en boutique ou livraison selon les créneaux proposés.</span>
                </div>
                <div className="flex items-start gap-2">
                  <Shield className="mt-0.5 h-4 w-4 shrink-0 text-[#ffcd47]" />
                  <span>Fraîcheur garantie</span>
                </div>
                <div className="flex items-start gap-2">
                  <Leaf className="mt-0.5 h-4 w-4 shrink-0 text-[#ffcd47]" />
                  <span>Sélectionné par POWER</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div data-power-product-footer className="shrink-0 space-y-3 border-t border-[#ffcd47]/20 bg-[#073b2d] p-4 pb-[max(1rem,env(safe-area-inset-bottom))] sm:px-6">
          <div className="flex items-center justify-between gap-3 text-lg font-semibold text-white">
            <span>Total :</span>
            <span className="text-[#ffcd47]">
              {lineTotal(product.promoPrice ?? product.price, quantity).toFixed(2)}€
            </span>
          </div>
          <Button
            className="w-full min-h-12 rounded-xl bg-[#ffcd47] hover:bg-[#ffe18a] text-[#073b2d] font-black py-3"
            onClick={handleAddToCart}
            disabled={!product.inStock || isAdding}
          >
            <CartButtonContent loading={isAdding}>{isAdding ? "Ajout en cours..." : "Ajouter au panier"}</CartButtonContent>
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
