"use client"
import { useState } from "react"
import AddToCartButton from "@/components/product/add-to-cart-button"
import QuantitySelector from "@/components/product/quantity-selector"
import { minQuantity, quantityStep, lineTotal } from "@/lib/units"
import type { FamilyProduct } from "@/lib/power-family-catalog"
export default function ProductPurchase({ product }: { product: FamilyProduct }) {
  const [quantity, setQuantity] = useState(minQuantity(product.unit))
  const available = product.inStock && product.currentStock >= minQuantity(product.unit)
  const max = Math.floor((product.currentStock + 1e-8) / quantityStep(product.unit)) * quantityStep(product.unit)
  const price = product.promoPrice ?? product.price
  return (
    <div className="space-y-3">
      {available && <>
        <QuantitySelector appearance="power" value={quantity} onChange={setQuantity} unit={product.unit} max={max} />
        <p className="flex items-center justify-between text-sm font-bold"><span>Total</span><span className="text-[#ffcd47]">{lineTotal(price, quantity).toFixed(2)} €</span></p>
      </>}
      <AddToCartButton productId={product.id} name={product.name} price={price} quantity={quantity}
        outOfStock={!available} compact className="w-full min-h-12 rounded-xl bg-[#ffcd47] text-[#073b2d] hover:bg-[#ffe18a]" />
    </div>
  )
}
