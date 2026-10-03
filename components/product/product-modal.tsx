"use client"

import { useState, useEffect } from "react"
import ProductMascotImage from "@/components/product/product-mascot-image"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { ShoppingCart, Leaf, Truck, Shield, Loader2 } from "lucide-react"
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
      <DialogContent className="max-w-4xl max-h-[90dvh] overflow-y-auto rounded-[24px] bg-[#073b2d] text-white border-[#ffcd47]/25 shadow-2xl">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-white">
            {product.name}
          </DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Exact same official character as the catalogue; no normal-photo fallback. */}
          <div className="relative aspect-square w-full overflow-hidden rounded-[20px] border border-white/10 bg-[#0b4938]">
            <ProductMascotImage
              name={product.name}
              alt={`Personnage POWER ${product.name}`}
              sizes="(max-width: 767px) 85vw, 400px"
            />

            <div className="absolute top-4 left-4 flex flex-col gap-2">
              {product.organic && (
                <Badge className="bg-[#073b2d]/95 text-[#ffcd47] border-[#ffcd47]/30">
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

          {/* Commercial data and quantity logic are unchanged. */}
          <div className="space-y-6">
            <div>
              <p className="text-white/75 mb-4">{product.description}</p>

              <div className="flex items-center gap-4 mb-4">
                {product.promoPrice != null && <span className="text-xl font-semibold text-white/60 line-through">{product.price.toFixed(2)}€</span>}
                <span className="text-3xl font-bold text-[#ffcd47]">{(product.promoPrice ?? product.price).toFixed(2)}€</span>
                <span className="text-white/70">/{product.unit}</span>
              </div>
            </div>

            <Separator className="bg-white/15" />

            <div>
              <label className="block text-sm font-medium text-white/80 mb-2">Quantité</label>
              <QuantitySelector
                value={quantity}
                onChange={setQuantity}
                unit={product.unit}
                max={product.currentStock}
                disabled={!product.inStock}
              />
            </div>

            <Separator className="bg-white/15" />

            <div className="space-y-3">
              <div className="flex items-center gap-3 text-sm text-white/75">
                <Truck className="h-4 w-4 text-[#ffcd47]" />
                <span>Livraison sous 24h</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-white/75">
                <Shield className="h-4 w-4 text-[#ffcd47]" />
                <span>Fraîcheur garantie</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-white/75">
                <Leaf className="h-4 w-4 text-[#ffcd47]" />
                <span>Produit local</span>
              </div>
            </div>

            <Separator className="bg-white/15" />

            <div className="space-y-3">
              <div className="flex items-center justify-between text-lg font-semibold text-white">
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
                {isAdding ? (
                  <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                ) : (
                  <ShoppingCart className="h-5 w-5 mr-2" />
                )}
                {isAdding ? "Ajout en cours..." : "Ajouter au panier"}
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
