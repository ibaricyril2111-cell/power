"use client"

import { useState } from "react"
import { Plus, Minus, Leaf, Loader2 } from "lucide-react"
import { addToCart, decrementFromCart } from "@/app/actions/cart"
import { toast } from "sonner"
import ProductMascotImage from "@/components/product/product-mascot-image"
import ProduceComment from "./produce-comment"

interface Product {
  id: string
  name: string
  description?: string
  price: number
  promoPrice?: number | null
  unit: string
  image: string
  category: string
  inStock: boolean
  organic: boolean
}

export default function ProductCardMobile({ product, onViewDetails }: { product: Product; onViewDetails?: () => void }) {
  const [quantity, setQuantity] = useState(0)
  const [loading, setLoading] = useState(false)

  const handleAdd = async (e: React.MouseEvent) => {
    e.stopPropagation()
    setLoading(true)
    try {
      const result = await addToCart({ productId: product.id, quantity: 1 })
      if (result.success) {
        setQuantity(prev => prev + 1)
        toast.success(`${product.name} ajouté !`)
        window.dispatchEvent(new Event("cart-updated"))
      } else {
        toast.error(result.error || "Erreur")
      }
    } catch {
      toast.error("Une erreur est survenue")
    } finally {
      setLoading(false)
    }
  }

  const handleIncrement = async (e: React.MouseEvent) => {
    e.stopPropagation()
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

  const handleDecrement = async (e: React.MouseEvent) => {
    e.stopPropagation()
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
    <div
      className="flex min-w-0 flex-col overflow-hidden bg-[#0b4938] border border-white/15 rounded-[18px] shadow-sm active:scale-[0.99] transition cursor-pointer"
      role="button"
      tabIndex={0}
      aria-label={`Voir le détail de ${product.name}`}
      onClick={onViewDetails}
      onKeyDown={(e) => {
        if (e.target !== e.currentTarget) return
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault()
          onViewDetails?.()
        }
      }}
    >
      <div className="relative w-full aspect-[4/3] overflow-hidden bg-[#0b4938]">
        <ProductMascotImage
            name={product.name}
            fallbackImage={product.image}
            alt={product.name}
            sizes="50vw"
            className=""
          />
        {product.organic && (
          <div className="absolute top-0.5 left-0.5">
            <Leaf className="h-4 w-4 text-[#307659] drop-shadow-lg" />
          </div>
        )}
      </div>

      <div className="min-w-0 p-3 pb-2">
        <p className="mb-1 truncate text-[9px] font-bold uppercase tracking-wider text-[#ffcd47]">{product.category}</p>
        <h3 className="text-sm font-black text-white truncate">{product.name}</h3>
        <ProduceComment name={product.name} description={product.description} className="mt-1 [&>p]:text-xs" />
        <div className="flex items-center gap-1.5 mt-1">
          {product.promoPrice != null && <span className="text-white/65 line-through text-xs">{product.price.toFixed(2)}€</span>}
          <span className="text-[#ffcd47] font-black text-sm">{(product.promoPrice ?? product.price).toFixed(2)}€</span>
          <span className="text-white/70 text-[10px] uppercase">/ {product.unit}</span>
        </div>
      </div>

      <div className="mt-auto px-3 pb-3">
      {quantity === 0 ? (
        <button
          aria-label={`Ajouter ${product.name} au panier`}
          onClick={handleAdd}
          disabled={loading || !product.inStock}
          className="w-full h-10 rounded-xl bg-[#ffcd47] hover:bg-[#ffe18a] text-[#073b2d] font-black transition-all active:scale-95 flex items-center justify-center disabled:opacity-50"
        >
          {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <><Plus className="mr-1 h-4 w-4" /> Ajouter</>}
        </button>
      ) : (
        <div className="flex items-center justify-between gap-1.5">
          <button
            aria-label={`Retirer ${product.name}`}
            onClick={handleDecrement}
            className="h-8 w-8 rounded-full bg-[#e7e2d8] text-[#ffcd47] flex items-center justify-center transition-colors"
          >
            <Minus className="w-3.5 h-3.5" />
          </button>
          <span className="text-[#ffcd47] font-bold text-sm w-5 text-center">{quantity}</span>
          <button
            aria-label={`Ajouter ${product.name}`}
            onClick={handleIncrement}
            disabled={loading}
            className="h-8 w-8 rounded-full bg-[#ffcd47] hover:bg-[#ffe18a] text-[#073b2d] flex items-center justify-center transition-colors disabled:opacity-50"
          >
            {loading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Plus className="w-3.5 h-3.5" />}
          </button>
        </div>
      )}
      </div>
    </div>
  )
}
