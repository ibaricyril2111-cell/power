"use client"

import { useState, useEffect, useMemo } from "react"
import CompositionArtwork from "@/components/product/composition-artwork"
import SmoothieStage from "@/components/product/smoothie-stage"
import IngredientChoice from "@/components/product/ingredient-choice"
import CartButtonContent from "@/components/product/cart-button-content"
import { compositionArtworkKind } from "@/lib/power-composition-artwork"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Check, Info } from "lucide-react"
import { addToCart } from "@/app/actions/cart"
import { toast } from "sonner"
import QuantitySelector from "@/components/product/quantity-selector"
import {
    compositionPrice,
    defaultOptionIds,
    resolveSize,
    remainingIncludedChoices,
    compositionUnit,
    type SizeLike,
    type OptionLike,
} from "@/lib/composition-pricing"

export type ConfigurableComposition = {
    id: string
    name: string
    /** Type métier (« jus », « soupe », « fruits-decoupes »…), qui nomme l'unité vendue. */
    type?: string | null
    description: string | null
    basePrice: number
    imageUrl: string | null
    sizes: (SizeLike & { description?: string | null })[]
    options: (OptionLike & { isRemovable?: boolean })[]
}

interface Props {
    composition: ConfigurableComposition
    onDone?: () => void
}

/**
 * Configurateur d'une composition : format, formule standard et suppléments.
 *
 * Le prix affiché suit exactement la règle facturée côté serveur — prix du format retenu
 * plus les suppléments cochés. Rien n'est calculé à partir des prix au kilo du catalogue :
 * trois morceaux de mangue dans un plateau ne coûtent pas un kilo de mangues.
 */
export default function CompositionConfigurator({ composition, onDone }: Props) {
    const { sizes, options } = composition

    const [sizeId, setSizeId] = useState<string | null>(null)
    const [selectedOptions, setSelectedOptions] = useState<string[]>([])
    const [quantity, setQuantity] = useState(1)
    const [isAdding, setIsAdding] = useState(false)
    const isDrink = compositionArtworkKind(composition) === "drink"
    const selectedIngredients = selectedOptions.flatMap((id) => {
        const ingredient = options.find((option) => option.id === id)
        return ingredient ? [ingredient] : []
    })
    const needsIngredient = isDrink && options.length > 0 && selectedIngredients.length === 0

    // Sur un format à quota, rien n'est pré-coché : le client choisit ses ingrédients.
    // Sur une formule fixe, on présente la recette standard du commerçant.
    useEffect(() => {
        const size = resolveSize(sizes, null)
        setSizeId(size?.id ?? null)
        setSelectedOptions(defaultOptionIds(options, size))
        setQuantity(1)
    }, [composition.id, sizes, options])

    const currentSize = resolveSize(sizes, sizeId)
    const quota = currentSize?.includedChoices ?? 0
    const remaining = remainingIncludedChoices({ sizeId, optionIds: selectedOptions }, sizes)

    const includedOptions = useMemo(() => options.filter((o) => o.includedByDefault), [options])
    const extraOptions = useMemo(() => options.filter((o) => !o.includedByDefault), [options])

    const unitPrice = compositionPrice(
        { sizeId, optionIds: selectedOptions },
        sizes,
        options,
        composition.basePrice,
    )
    const total = unitPrice * quantity

    const toggleOption = (id: string) => {
        setSelectedOptions((prev) =>
            prev.includes(id) ? prev.filter((o) => o !== id) : [...prev, id],
        )
    }

    // Changer de format peut changer le quota : on repart d'une sélection cohérente
    // plutôt que de laisser un choix hérité facturer un supplément inattendu.
    const changeSize = (nextId: string) => {
        const next = sizes.find((s) => s.id === nextId)
        setSizeId(nextId)
        const nextQuota = next?.includedChoices ?? 0
        if (nextQuota <= 0 && quota > 0) setSelectedOptions(defaultOptionIds(options, next))
        if (nextQuota > 0 && quota <= 0) setSelectedOptions([])
    }

    /** Rang d'un ingrédient dans la sélection : au-delà du quota, il devient payant. */
    const rankOf = (id: string) => selectedOptions.indexOf(id)

    const handleAddToCart = async () => {
        if (isAdding || needsIngredient) return
        setIsAdding(true)
        try {
            const result = await addToCart({
                compositionId: composition.id,
                quantity,
                // Seuls les identifiants sont transmis : le serveur retrouve les prix en base
                // et recalcule, pour qu'un montant forgé côté client ne serve à rien.
                customData: { sizeId, optionIds: selectedOptions },
            })

            if (result.success) {
                toast.success(`${quantity} × ${composition.name} ajouté au panier`)
                window.dispatchEvent(new Event("cart-updated"))
                onDone?.()
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

    const noChoicesConfigured = sizes.length === 0 && options.length === 0

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Visuel et description */}
            <div className={"space-y-3 self-start " + (isDrink ? "sticky top-0 z-20 bg-[#073b2d] pb-3 md:top-2" : "")}>
                <div className={"relative rounded-2xl overflow-hidden bg-[#0b4938] border border-white/15 " + (isDrink ? "h-[220px] sm:h-[260px] md:h-[340px]" : "h-[240px] sm:h-[280px] md:h-[340px]")}>
                    {isDrink ? <SmoothieStage ingredients={selectedIngredients} /> : <CompositionArtwork
                        composition={composition}
                        selectedOptionIds={options.length > 0 ? selectedOptions : undefined}
                        sizes="(max-width: 767px) 90vw, 360px"
                    />}
                </div>
                {composition.description && (
                    <p className="text-white/80 text-sm">{composition.description}</p>
                )}
            </div>

            {/* Configuration */}
            <div className="space-y-5">
                {noChoicesConfigured && (
                    <div className="flex gap-2 rounded-xl bg-[#ffcd47]/10 border border-[#ffcd47]/30 p-3 text-sm text-[#ffe18a]">
                        <Info className="h-4 w-4 shrink-0 mt-0.5" />
                        <span>
                            Aucun format ni ingrédient n&apos;est encore configuré pour cette
                            composition. Le tarif affiché est le prix de base.
                        </span>
                    </div>
                )}

                {/* Un format unique n'est pas un choix : on l'affiche comme une information
                    de prix plutôt qu'en sélecteur à un seul bouton. */}
                {sizes.length === 1 && (
                    <div className="flex items-baseline justify-between rounded-xl bg-white/5 border border-white/20 px-4 py-3">
                        <span className="text-sm font-semibold text-white">
                            {sizes[0].name}
                            {sizes[0].description && (
                                <span className="block text-xs font-normal text-white/65">{sizes[0].description}</span>
                            )}
                        </span>
                        <span className="text-lg font-bold text-[#ffcd47]">{sizes[0].price.toFixed(2)}€</span>
                    </div>
                )}

                {sizes.length > 1 && (
                    <div>
                        <label className="block text-sm font-semibold text-white mb-2">Format</label>
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                            {sizes.map((size) => (
                                <button
                                    key={size.id}
                                    type="button"
                                    onClick={() => changeSize(size.id)}
                                    aria-pressed={sizeId === size.id}
                                    className={`p-3 rounded-xl text-sm font-bold transition-all text-left ${
                                        sizeId === size.id
                                            ? "bg-[#ffcd47] text-[#073b2d] shadow-lg"
                                            : "bg-white/5 hover:bg-white/10 text-white border border-white/20"
                                    }`}
                                >
                                    <div>{size.name}</div>
                                    <div className={sizeId === size.id ? "text-[#073b2d]" : "text-[#ffcd47]"}>
                                        {size.price.toFixed(2)}€
                                    </div>
                                    {size.description && (
                                        <div className={`text-[11px] font-normal mt-0.5 ${sizeId === size.id ? "text-[#073b2d]/80" : "text-white/65"}`}>
                                            {size.description}
                                        </div>
                                    )}
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                {/* Format « N ingrédients au choix » : une seule liste, où les N premiers
                    sélectionnés sont compris et les suivants facturés. */}
                {quota > 0 && options.length > 0 && (
                    <div>
                        <div className="flex items-baseline justify-between mb-1">
                            <label className="block text-sm font-semibold text-white">
                                Choisissez {quota} ingrédient{quota > 1 ? "s" : ""}
                            </label>
                            <span className={`text-xs font-semibold ${remaining === 0 ? "text-white/65" : "text-[#ffcd47]"}`}>
                                {selectedOptions.length}/{quota} choisi{selectedOptions.length > 1 ? "s" : ""}
                            </span>
                        </div>
                        <p className="text-xs text-white/65 mb-2">
                            {remaining && remaining > 0
                                ? `Encore ${remaining} au choix, compris dans le prix.`
                                : "Quota atteint — chaque ingrédient de plus est facturé en supplément."}
                        </p>
                        <div className={isDrink ? "grid grid-cols-3 gap-2 sm:grid-cols-4 md:grid-cols-3" : "flex flex-wrap gap-2"}>
                            {options.map((option) => {
                                const rank = rankOf(option.id)
                                const active = rank >= 0
                                const isPaid = active && rank >= quota
                                if (isDrink) return <IngredientChoice key={option.id} name={option.name} active={active}
                                    onClick={() => toggleOption(option.id)}
                                    priceLabel={isPaid || (!active && remaining === 0) ? "+" + option.extraPrice.toFixed(2) + " €" : "Compris dans la formule"} />
                                return (
                                    <button
                                        key={option.id}
                                        type="button"
                                        onClick={() => toggleOption(option.id)}
                                        aria-pressed={active}
                                        className={`px-3 py-1.5 rounded-full text-sm font-medium border transition-all ${
                                            isPaid
                                                ? "bg-[#ffcd47] border-[#ffcd47] text-[#073b2d]"
                                                : active
                                                  ? "bg-[#ffcd47]/15 border-[#ffcd47]/50 text-[#ffe18a]"
                                                  : "bg-white/5 border-white/20 text-white/80 hover:bg-white/10"
                                        }`}
                                    >
                                        {active && <Check className="inline h-3 w-3 mr-1" />}
                                        {option.name}
                                        {isPaid && (
                                            <span className="text-current ml-1">+{option.extraPrice.toFixed(2)}€</span>
                                        )}
                                        {!active && remaining === 0 && (
                                            <span className="text-[#ffcd47] ml-1">+{option.extraPrice.toFixed(2)}€</span>
                                        )}
                                    </button>
                                )
                            })}
                        </div>
                    </div>
                )}

                {quota === 0 && includedOptions.length > 0 && (
                    <div>
                        <label className="block text-sm font-semibold text-white mb-1">
                            Composition de base
                        </label>
                        <p className="text-xs text-white/65 mb-2">
                            Comprise dans le prix. Décochez ce que vous ne voulez pas.
                        </p>
                        <div className={isDrink ? "grid grid-cols-3 gap-2 sm:grid-cols-4 md:grid-cols-3" : "flex flex-wrap gap-2"}>
                            {includedOptions.map((option) => {
                                const active = selectedOptions.includes(option.id)
                                const locked = option.isRemovable === false
                                if (isDrink) return <IngredientChoice key={option.id} name={option.name} active={active} locked={locked}
                                    onClick={() => toggleOption(option.id)} priceLabel="Compris dans la formule" />
                                return (
                                    <button
                                        key={option.id}
                                        type="button"
                                        disabled={locked}
                                        onClick={() => toggleOption(option.id)}
                                        aria-pressed={active}
                                        className={`px-3 py-1.5 rounded-full text-sm font-medium border transition-all ${
                                            active
                                                ? "bg-[#ffcd47]/15 border-[#ffcd47]/50 text-[#ffe18a]"
                                                : "bg-white/5 border-white/15 text-white/60 line-through"
                                        } ${locked ? "opacity-70 cursor-not-allowed" : ""}`}
                                    >
                                        {active && <Check className="inline h-3 w-3 mr-1" />}
                                        {option.name}
                                    </button>
                                )
                            })}
                        </div>
                    </div>
                )}

                {quota === 0 && extraOptions.length > 0 && (
                    <div>
                        <label className="block text-sm font-semibold text-white mb-1">
                            Suppléments
                        </label>
                        <p className="text-xs text-white/65 mb-2">Ajoutés au prix du format.</p>
                        <div className={isDrink ? "grid grid-cols-3 gap-2 sm:grid-cols-4 md:grid-cols-3" : "flex flex-wrap gap-2"}>
                            {extraOptions.map((option) => {
                                const active = selectedOptions.includes(option.id)
                                if (isDrink) return <IngredientChoice key={option.id} name={option.name} active={active}
                                    onClick={() => toggleOption(option.id)} priceLabel={"+" + option.extraPrice.toFixed(2) + " €"} />
                                return (
                                    <button
                                        key={option.id}
                                        type="button"
                                        onClick={() => toggleOption(option.id)}
                                        aria-pressed={active}
                                        className={`px-3 py-1.5 rounded-full text-sm font-medium border transition-all ${
                                            active
                                                ? "bg-[#ffcd47] border-[#ffcd47] text-[#073b2d]"
                                                : "bg-white/5 border-white/20 text-white/80 hover:bg-white/10"
                                        }`}
                                    >
                                        {active && <Check className="inline h-3 w-3 mr-1" />}
                                        {option.name}
                                        <span className={active ? "text-current ml-1" : "text-[#ffcd47] ml-1"}>
                                            +{option.extraPrice.toFixed(2)}€
                                        </span>
                                    </button>
                                )
                            })}
                        </div>
                    </div>
                )}

                <div>
                    <label className="block text-sm font-semibold text-white mb-2">Quantité</label>
                    <QuantitySelector appearance="power" value={quantity} onChange={setQuantity} unit={compositionUnit(composition.type)} />
                </div>

                <Separator className="bg-white/15" />

                <div className="sticky bottom-0 z-10 space-y-3 rounded-2xl border border-white/15 bg-[#073b2d] p-4">
                    <div className="flex items-center justify-between text-sm text-white/80">
                        <span>Prix unitaire</span>
                        <span>{unitPrice.toFixed(2)}€</span>
                    </div>
                    <div className="flex items-center justify-between text-lg font-bold text-white">
                        <span>Total</span>
                        <span className="text-[#ffcd47]">{total.toFixed(2)}€</span>
                    </div>

                    <Button
                        className="w-full bg-[#ffcd47] hover:bg-[#ffe18a] text-[#073b2d] font-bold min-h-12 rounded-xl py-3"
                        onClick={handleAddToCart}
                        disabled={isAdding || needsIngredient}
                    >
                        <CartButtonContent loading={isAdding}>
                            {isAdding ? "Ajout en cours…" : needsIngredient ? "Choisis au moins un ingrédient" : "Ajouter au panier"}
                        </CartButtonContent>
                    </Button>
                </div>
            </div>
        </div>
    )
}
