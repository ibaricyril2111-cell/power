"use client"

import { useState, useEffect } from "react"
import ProductMascotImage from "@/components/product/product-mascot-image"
import CartButtonContent from "@/components/product/cart-button-content"
import ProduceComment from "./produce-comment"
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerFooter } from "@/components/ui/drawer"
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

interface ProductBottomSheetProps {
  product: Product
  isOpen: boolean
  onClose: () => void
}

export default function ProductBottomSheet({ product, isOpen, onClose }: ProductBottomSheetProps) {
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
    <Drawer open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DrawerContent className="bg-[#073b2d] text-white border-[#ffcd47]/25 max-h-[85dvh]">
        <div className="min-h-0 overflow-y-auto flex-1">
          <DrawerHeader className="pb-0">
            <DrawerTitle className="text-xl font-bold text-white text-left">
              {product.name}
            </DrawerTitle>
          </DrawerHeader>

          {/* Image */}
          <div className="relative mx-4 mt-3 aspect-[4/3] overflow-hidden rounded-xl">
            <ProductMascotImage
              name={product.name}
              alt={product.name}
              sizes="(max-width: 767px) 100vw, 500px"
            />
            <div className="absolute top-3 left-3 flex flex-col gap-2">
              {product.organic && (
                <Badge className="badge-brand">
                  <Leaf className="h-3 w-3 mr-1" />
                  Bio
                </Badge>
              )}
              {!product.inStock && (
                <Badge className="badge-error">
                  Rupture de stock
                </Badge>
              )}
            </div>
          </div>

          {/* Infos */}
          <div className="px-4 pt-4 space-y-4">
            <ProduceComment name={product.name} description={product.description} />

            <div className="flex items-center gap-3">
              {product.promoPrice != null && <span className="text-lg font-semibold text-zinc-400 line-through">{product.price.toFixed(2)}€</span>}
              <span className="text-2xl font-bold text-[#ffcd47]">{(product.promoPrice ?? product.price).toFixed(2)}€</span>
              <span className="text-zinc-400 text-sm">/{product.unit}</span>
            </div>

            <Separator className="bg-white/15" />

            {/* Quantité */}
            <div>
              <label className="block text-sm font-medium text-white mb-2">Quantité</label>
              <QuantitySelector
                appearance="power"
                value={quantity}
                onChange={setQuantity}
                unit={product.unit}
                max={product.currentStock}
                disabled={!product.inStock}
              />
            </div>

            <Separator className="bg-white/15" />

            {/* Features */}
            <div className="space-y-2.5">
              <div className="flex items-center gap-3 text-sm text-white/75">
                <Truck className="h-4 w-4 shrink-0 text-[#ffcd47]" />
                <span>Retrait en boutique ou livraison selon les créneaux proposés.</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-white/75">
                <Shield className="h-4 w-4 text-[#ffcd47]" />
                <span>Fraîcheur garantie</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-white/75">
                <Leaf className="h-4 w-4 text-[#ffcd47]" />
                <span>Sélectionné par POWER</span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer sticky */}
        <DrawerFooter className="shrink-0 border-t border-white/15 bg-[#073b2d] pb-[max(1rem,env(safe-area-inset-bottom))]">
          <div className="flex items-center justify-between text-lg font-semibold text-white mb-2">
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
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  )
}
