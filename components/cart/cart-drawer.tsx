"use client"

import { useState, useEffect, useCallback } from "react"
import Link from "next/link"
import CartArtwork from "@/components/cart/cart-artwork"
import SelectionSummary from "@/components/cart/selection-summary"
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { ShoppingBag, Plus, Minus, Trash2, Loader2 } from "lucide-react"
import { getCartItems, updateCartItemQuantity, removeCartItem } from "@/app/actions/cart"
import { getDeliveryConfig } from "@/app/actions/content"
import { cartItemUnitPrice, deliveryFee as computeDeliveryFee } from "@/lib/pricing"
import { compositionUnit, describeSelection } from "@/lib/composition-pricing"
import { quantityStep, roundToStep, formatQuantity, unitLabel } from "@/lib/units"
import { drinkOrderError } from "@/lib/drink-ordering"

interface CartDrawerProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export default function CartDrawer({ open, onOpenChange }: CartDrawerProps) {
  const [items, setItems] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [updatingId, setUpdatingId] = useState<string | null>(null)
  const [deliveryConfig, setDeliveryConfig] = useState<{ fee: number; threshold: number }>({ fee: 4.9, threshold: 30 })

  useEffect(() => {
    getDeliveryConfig().then((cfg) => { if (cfg) setDeliveryConfig(cfg) }).catch(() => {})
  }, [])

  const loadCart = useCallback(async () => {
    try {
      setLoading(true)
      const res = await getCartItems()
      if (res.success && res.data) {
        setItems(res.data)
      }
    } catch (error) {
      console.error("Erreur chargement panier:", error)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    if (open) loadCart()
  }, [open, loadCart])

  // Écouter les ajouts au panier pour refresh
  useEffect(() => {
    const handler = () => { if (open) loadCart() }
    window.addEventListener("cart-updated", handler)
    return () => window.removeEventListener("cart-updated", handler)
  }, [open, loadCart])

  const handleUpdateQuantity = async (cartItemId: string, newQuantity: number) => {
    setUpdatingId(cartItemId)
    try {
      if (newQuantity <= 0) {
        const res = await removeCartItem(cartItemId)
        if (res.success) {
          setItems(items.filter(i => i.id !== cartItemId))
          window.dispatchEvent(new Event("cart-updated"))
        }
      } else {
        const res = await updateCartItemQuantity(cartItemId, newQuantity)
        if (res.success) {
          setItems(items.map(i => i.id === cartItemId ? { ...i, quantity: newQuantity } : i))
        }
      }
    } catch (error) {
      console.error("Erreur MAJ quantité:", error)
    } finally {
      setUpdatingId(null)
    }
  }

  const handleRemoveItem = async (cartItemId: string) => {
    setUpdatingId(cartItemId)
    try {
      const res = await removeCartItem(cartItemId)
      if (res.success) {
        setItems(items.filter(i => i.id !== cartItemId))
        window.dispatchEvent(new Event("cart-updated"))
      }
    } catch (error) {
      console.error("Erreur suppression:", error)
    } finally {
      setUpdatingId(null)
    }
  }

  // Prices, stock-related actions and totals remain unchanged by this visual correction.
  const getItemData = (item: any) => {
    if (item.product) {
      return {
        id: item.id,
        name: item.product.name,
        price: item.product.promoPrice ?? item.product.price,
        oldPrice: item.product.promoPrice != null ? item.product.price : null,
        quantity: item.quantity,
        unit: item.product.unit,
        image: item.product.image || "/placeholder.svg",
        total: (item.product.promoPrice ?? item.product.price) * item.quantity,
        customData: null,
        composition: null,
        selection: null,
      }
    } else if (item.composition) {
      const customPrice = cartItemUnitPrice(item)
      return {
        id: item.id,
        name: item.composition.name,
        price: customPrice,
        quantity: item.quantity,
        unit: compositionUnit(item.composition.type),
        image: item.composition.imageUrl || "/placeholder.svg",
        total: customPrice * item.quantity,
        customData: item.customData || null,
        composition: item.composition,
        selection: describeSelection(item.customData ?? {}, item.composition.sizes ?? [], item.composition.options ?? []),
      }
    }
    return null
  }

  const processedItems = items.map(getItemData).filter(Boolean) as NonNullable<ReturnType<typeof getItemData>>[]
  const recipeError = items.map(item => item.composition && drinkOrderError(item.composition, item.customData)).find(Boolean)
  const subtotal = processedItems.reduce((sum, item) => sum + item.total, 0)
  const deliveryFee = computeDeliveryFee(subtotal, "livraison", deliveryConfig)
  const total = subtotal + deliveryFee
  const totalQuantity = processedItems.reduce((sum, item) => sum + item.quantity, 0)

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-full sm:max-w-md bg-[#073b2d] text-white border-white/15 p-0 flex flex-col shadow-2xl">
        <SheetHeader className="p-4 pb-3 border-b border-white/15">
          <SheetTitle className="text-white flex items-center gap-2">
            <ShoppingBag className="h-5 w-5 text-[#ffcd47]" />
            Mon Panier
            {totalQuantity > 0 && (
              <span className="text-xs bg-[#ffcd47] text-[#073b2d] px-2 py-0.5 rounded-full font-bold">
                {totalQuantity}
              </span>
            )}
          </SheetTitle>
        </SheetHeader>

        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-6 w-6 animate-spin text-[#ffcd47]" />
            </div>
          ) : processedItems.length === 0 ? (
            <div className="text-center py-12">
              <ShoppingBag className="h-12 w-12 mx-auto text-[#ffcd47] mb-3" />
              <p className="text-white font-medium mb-1">Votre panier est vide</p>
              <p className="text-white/70 text-sm mb-4">Ajoutez des produits depuis notre marketplace</p>
              <Button
                onClick={() => onOpenChange(false)}
                className="bg-[#ffcd47] hover:bg-[#ffe18a] text-[#073b2d] font-bold rounded-full px-6"
                asChild
              >
                <Link href="/#marketplace">Voir les produits</Link>
              </Button>
            </div>
          ) : (
            processedItems.map((item) => (
              <div key={item.id} className="flex gap-3 p-3 rounded-2xl bg-[#0b4938] border border-white/15 shadow-sm">
                <div className="relative w-16 h-16 flex-shrink-0 rounded-xl overflow-hidden bg-[#0b4938] border border-white/10">
                  <CartArtwork
                    name={item.name}
                    composition={item.composition}
                    optionIds={item.customData?.optionIds}
                    sizes="64px"
                  />
                </div>

                <div className="flex-1 min-w-0">
                  <h4 className="text-sm font-semibold text-white truncate">{item.name}</h4>
                  <p className="text-xs text-white/70">{item.price.toFixed(2)}€ / {unitLabel(item.unit)}</p>
                  <SelectionSummary selection={item.selection} />

                  {item.customData?.size && (
                    <div className="mt-1">
                      <span className="text-[10px] text-white/70">
                        {item.customData.sizeLabel || item.customData.size}
                      </span>
                      {item.customData.ingredients?.length > 0 && (
                        <div className="flex flex-wrap gap-0.5 mt-0.5">
                          {item.customData.ingredients.map((ing: any, i: number) => (
                            <span key={i} className="text-[9px] bg-[#ffcd47]/15 text-[#ffcd47] px-1 py-0.5 rounded">
                              {ing.name}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  )}

                  <div className="flex items-center justify-between mt-2">
                    <div className="flex items-center gap-1.5">
                      <button
                        aria-label={`Réduire la quantité de ${item.name}`}
                        onClick={() => handleUpdateQuantity(item.id, roundToStep(item.quantity - quantityStep(item.unit), item.unit))}
                        disabled={updatingId === item.id}
                        className="h-8 w-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors disabled:opacity-50"
                      >
                        <Minus className="h-3 w-3" />
                      </button>
                      <span className="min-w-6 text-center text-xs font-bold text-white">{formatQuantity(item.quantity, item.unit)}</span>
                      <button
                        aria-label={`Augmenter la quantité de ${item.name}`}
                        onClick={() => handleUpdateQuantity(item.id, roundToStep(item.quantity + quantityStep(item.unit), item.unit))}
                        disabled={updatingId === item.id}
                        className="h-8 w-8 rounded-full bg-[#ffcd47] hover:bg-[#ffe18a] flex items-center justify-center text-[#073b2d] transition-colors disabled:opacity-50"
                      >
                        <Plus className="h-3 w-3" />
                      </button>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold text-[#ffcd47]">{item.total.toFixed(2)}€</span>
                      <button
                        aria-label={`Supprimer ${item.name} du panier`}
                        onClick={() => handleRemoveItem(item.id)}
                        disabled={updatingId === item.id}
                        className="h-8 w-8 rounded-full hover:bg-red-500/15 flex items-center justify-center text-white/70 hover:text-red-300 transition-colors"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {processedItems.length > 0 && (
          <div className="border-t border-white/15 p-4 pb-[max(1rem,env(safe-area-inset-bottom))] space-y-3 bg-[#052e23]">
            <div className="flex justify-between text-sm text-white/70">
              <span>Sous-total</span>
              <span className="text-white font-medium">{subtotal.toFixed(2)}€</span>
            </div>
            <div className="flex justify-between text-sm text-white/70">
              <span>Livraison</span>
              <span className={deliveryFee === 0 ? "text-green-300 font-medium" : "text-white font-medium"}>
                {deliveryFee === 0 ? "Gratuit" : `${deliveryFee.toFixed(2)}€`}
              </span>
            </div>
            {deliveryFee > 0 && (
              <p className="text-[10px] text-[#ffcd47] bg-[#ffcd47]/10 px-2 py-1 rounded-lg text-center">
                Plus que {(deliveryConfig.threshold - subtotal).toFixed(2)}€ pour la livraison gratuite
              </p>
            )}
            <Separator className="bg-white/15" />
            <div className="flex justify-between items-center">
              <span className="text-white font-bold">Total TTC</span>
              <span className="text-xl font-black text-[#ffcd47]">{total.toFixed(2)}€</span>
            </div>

            {recipeError && <p role="alert" className="rounded-xl border border-amber-400/40 bg-amber-400/10 p-3 text-sm text-amber-100">{recipeError}</p>}
            {recipeError ? <Button disabled className="w-full min-h-12">Retirez la formule indisponible</Button> : <Button
              className="w-full bg-[#ffcd47] hover:bg-[#ffe18a] text-[#073b2d] font-bold py-6 rounded-xl shadow-lg text-base"
              asChild
              onClick={() => onOpenChange(false)}
            >
              <Link href="/commande">Passer commande</Link>
            </Button>}

            <button
              onClick={() => onOpenChange(false)}
              className="w-full text-center text-sm text-white/70 hover:text-white transition-colors py-1"
            >
              Continuer mes achats
            </button>
          </div>
        )}
      </SheetContent>
    </Sheet>
  )
}
