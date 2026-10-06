"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Eye, Plus, Minus, Leaf, Loader2 } from "lucide-react"
import { addToCart, decrementFromCart } from "@/app/actions/cart"
import { toast } from "sonner"
import ProductMascotImage from "@/components/product/product-mascot-image"
import CartButtonContent from "@/components/product/cart-button-content"

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
}

interface ProductCardProps {
  product: Product
  onViewDetails?: () => void
}

export default function ProductCard({ product, onViewDetails }: ProductCardProps) {
  const router = useRouter()
  const [quantity, setQuantity] = useState(0)
  const [loading, setLoading] = useState(false)

  const handleViewDetails = () => {
    // The catalogue supplies a modal callback; the homepage stars do not.
    // Without this fallback those apparently clickable cards did nothing.
    if (onViewDetails) onViewDetails()
    else router.push(`/produits/${encodeURIComponent(product.id)}`)
  }

  const handleAdd = async () => {
    setLoading(true)
    try {
      const result = await addToCart({ productId: product.id, quantity: 1 })
      if (result.success) {
        setQuantity(prev => prev + 1)
        toast.success(`${product.name} ajouté au panier !`)
        window.dispatchEvent(new Event("cart-updated"))
      } else {
        toast.error("Erreur")
      }
    } catch {
      toast.error("Une erreur est survenue")
    } finally {
      setLoading(false)
    }
  }

  const handleIncrement = async () => {
    setLoading(true)
    try {
      const result = await addToCart({ productId: product.id, quantity: 1 })
      if (result.success) {
        setQuantity(prev => prev + 1)
        window.dispatchEvent(new Event("cart-updated"))
      }
    } catch {} finally {
      setLoading(false)
    }
  }

  const handleDecrement = async () => {
    setLoading(true)
    try {
      const result = await decrementFromCart(product.id)
      if (result.success) {
        setQuantity(result.newQuantity)
        window.dispatchEvent(new Event("cart-updated"))
      }
    } catch {
      toast.error("Erreur")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card className="group bg-[#0b4938] border-white/15 rounded-[20px] overflow-hidden hover:-translate-y-1 hover:border-[#ffcd47]/70 hover:shadow-xl transition-all duration-300 h-full flex flex-col">
      {/* Le détail reste séparé des boutons du panier. */}
      <CardContent
        className="p-0 relative cursor-pointer"
        role="button"
        tabIndex={0}
        aria-label={`Voir le détail de ${product.name}`}
        onClick={handleViewDetails}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault()
            handleViewDetails()
          }
        }}
      >
        <div className="relative aspect-[4/3] overflow-hidden bg-[#0b4938]">
          <ProductMascotImage
            name={product.name}
            fallbackImage={product.image}
            alt={product.name}
            sizes="(max-width: 768px) 100vw, 300px"
            className="group-hover:scale-105 transition-transform duration-500"
          />
          <div className="absolute top-6 left-6 flex flex-col gap-2">
            {product.organic && (
              <Badge className="bg-[#307659] text-white border-0 font-bold uppercase text-[10px] tracking-widest px-3 py-1 shadow-md">
                <Leaf className="h-3 w-3 mr-1" />Bio
              </Badge>
            )}
            {!product.inStock && (
              <Badge className="bg-zinc-800 text-white/65 border border-white/10 font-black uppercase italic text-[10px] tracking-widest px-3 py-1">Rupture</Badge>
            )}
          </div>
          <div aria-hidden="true" className="absolute top-5 right-5 h-10 w-10 rounded-full bg-[#102e25]/90 backdrop-blur-xl text-[#ffcd47] opacity-0 group-hover:opacity-100 transition-all flex items-center justify-center shadow-md">
            <Eye className="h-5 w-5" />
          </div>
          <div className="absolute bottom-4 left-4">
            <div className="bg-[#102e25]/95 backdrop-blur-xl rounded-full px-4 py-2 shadow-lg">
              <span className="text-lg font-black text-[#ffcd47] leading-none">{product.promoPrice != null && <span className="text-sm font-bold text-zinc-400 line-through mr-2">{product.price.toFixed(2)}€</span>}{(product.promoPrice ?? product.price).toFixed(2)}€ <span className="text-[10px] uppercase tracking-widest text-white/65">/ {product.unit}</span></span>
            </div>
          </div>
        </div>
        <div className="p-6 pb-4">
          <p className="mb-2 text-[10px] font-bold uppercase tracking-[0.16em] text-[#ffcd47]">{product.category}</p>
          <h3 className="text-lg font-black text-white mb-1 line-clamp-1">{product.name}</h3>
          <p className="text-white/70 line-clamp-1 min-h-[22px] text-sm leading-relaxed">{product.description}</p>
        </div>
      </CardContent>
      <CardFooter className="p-6 pt-0 mt-auto">
        {quantity === 0 ? (
          <Button onClick={handleAdd} disabled={loading || !product.inStock} className="w-full h-12 rounded-xl bg-[#ffcd47] hover:bg-[#ffe18a] text-[#073b2d] font-black text-sm transition-all">
            <CartButtonContent loading={loading}>{loading ? "Ajout…" : "Ajouter au panier"}</CartButtonContent>
          </Button>
        ) : (
          <div className="flex items-center justify-center gap-4 w-full">
            <button aria-label={`Retirer ${product.name}`} onClick={handleDecrement} className="h-12 w-12 rounded-full bg-[#e7e2d8] hover:bg-[#dcd5c8] text-[#ffcd47] flex items-center justify-center transition-colors">
              <Minus className="h-5 w-5" />
            </button>
            <span className="text-2xl font-black text-[#ffcd47] w-8 text-center">{quantity}</span>
            <button aria-label={`Ajouter ${product.name}`} onClick={handleIncrement} disabled={loading} className="h-12 w-12 rounded-full bg-[#ffcd47] hover:bg-[#ffe18a] text-[#073b2d] flex items-center justify-center transition-colors disabled:opacity-50">
              {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : <Plus className="h-5 w-5" />}
            </button>
          </div>
        )}
      </CardFooter>
    </Card>
  )
}
