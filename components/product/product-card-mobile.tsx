"use client"

import { useState } from "react"
import Image from "next/image"
import { Plus, Minus, Leaf, Loader2 } from "lucide-react"
import { addToCart, decrementFromCart } from "@/app/actions/cart"
import { toast } from "sonner"

interface Product {
  id: string
  name: string
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
  const [imgError, setImgError] = useState(false)

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
      className="flex min-w-0 flex-col overflow-hidden bg-white border border-black/5 rounded-[22px] shadow-sm active:scale-[0.99] transition cursor-pointer"
      role="button"
      tabIndex={0}
      aria-label={`Voir le détail de ${product.name}`}
      onClick={onViewDetails}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault()
          onViewDetails?.()
        }
      }}
    >
      <div className="relative w-full aspect-square overflow-hidden bg-[#eee9df]">
        <Image
          src={imgError ? "/placeholder.svg" : (product.image || "/placeholder.svg")}
          alt={product.name}
          fill
          sizes="50vw"
          className="object-cover"
          onError={() => setImgError(true)}
        />
        {product.organic && (
          <div className="absolute top-0.5 left-0.5">
            <Leaf className="h-4 w-4 text-[#307659] drop-shadow-lg" />
          </div>
        )}
      </div>

      <div className="min-w-0 p-3 pb-2">
        <p className="mb-1 truncate text-[9px] font-bold uppercase tracking-wider text-orange-600">{product.category}</p>
        <h3 className="text-sm font-bold text-[#173f32] truncate">{product.name}</h3>
        <div className="flex items-center gap-1.5 mt-1">
          {product.promoPrice != null && <span className="text-zinc-500 line-through text-xs">{product.price.toFixed(2)}€</span>}
          <span className="text-[#173f32] font-black text-sm">{(product.promoPrice ?? product.price).toFixed(2)}€</span>
          <span className="text-zinc-600 text-[10px] uppercase">/ {product.unit}</span>
        </div>
      </div>

      <div className="px-3 pb-3">
      {quantity === 0 ? (
        <button
          aria-label={`Ajouter ${product.name} au panier`}
          onClick={handleAdd}
          disabled={loading || !product.inStock}
          className="w-full h-9 rounded-full bg-[#173f32] hover:bg-[#225943] text-white transition-all active:scale-95 flex items-center justify-center disabled:opacity-50"
        >
          {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
        </button>
      ) : (
        <div className="flex items-center justify-between gap-1.5">
          <button
            aria-label={`Retirer ${product.name}`}
            onClick={handleDecrement}
            className="h-8 w-8 rounded-full bg-[#e7e2d8] text-[#173f32] flex items-center justify-center transition-colors"
          >
            <Minus className="w-3.5 h-3.5" />
          </button>
          <span className="text-[#173f32] font-bold text-sm w-5 text-center">{quantity}</span>
          <button
            aria-label={`Ajouter ${product.name}`}
            onClick={handleIncrement}
            disabled={loading}
            className="h-8 w-8 rounded-full bg-orange-500 hover:bg-orange-600 text-white flex items-center justify-center transition-colors disabled:opacity-50"
          >
            {loading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Plus className="w-3.5 h-3.5" />}
          </button>
        </div>
      )}
      </div>
    </div>
  )
}
