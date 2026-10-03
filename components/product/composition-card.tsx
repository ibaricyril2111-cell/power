"use client"

import { useState } from "react"
import CompositionArtwork from "@/components/product/composition-artwork"
import { Button } from "@/components/ui/button"
import { Settings2 } from "lucide-react"
import CompositionSheet from "@/components/product/composition-sheet"
import { startingPrice } from "@/lib/composition-pricing"
import type { ConfigurableComposition } from "@/components/product/composition-configurator"

interface Props {
    composition: ConfigurableComposition
    /** Pastille de contexte affichée sur l'image (« Fraîcheur garantie », « Pressé à froid »…). */
    badge?: React.ReactNode
    fallbackLabel?: string
}

/**
 * Carte vitrine d'une composition.
 *
 * Ouvre le configurateur au lieu d'ajouter directement au panier : une composition se
 * choisit par format et par ingrédients, l'ajouter en un clic reviendrait à imposer une
 * formule et un prix que le client n'a pas vus.
 */
export default function CompositionCard({ composition, badge, fallbackLabel = "À COMPOSER" }: Props) {
    const [open, setOpen] = useState(false)
    const [isMobile, setIsMobile] = useState(false)

    const from = startingPrice(composition.sizes, composition.basePrice)
    // « à partir de » ne se justifie qu'avec plusieurs formats ou des suppléments
    // susceptibles de faire monter le prix.
    const priceVaries = composition.sizes.length > 1 || composition.options.length > 0

    const openSheet = () => {
        setIsMobile(window.matchMedia("(max-width: 767px)").matches)
        setOpen(true)
    }

    return (
        <>
            <div className="group bg-[#0b4938] rounded-[24px] overflow-hidden border border-white/15 hover:border-[#ffcd47]/60 transition-all flex flex-col">
                <button
                    type="button"
                    onClick={openSheet}
                    className="relative aspect-[4/5] w-full overflow-hidden text-left sm:aspect-square"
                    aria-label={`Composer ${composition.name}`}
                >
                    <CompositionArtwork composition={composition} sizes="(max-width: 767px) 90vw, 360px" />
                    {badge}
                </button>

                <div className="p-5 flex flex-col flex-1">
                    <h3 className="text-xl font-bold mb-2 text-white group-hover:text-[#ffcd47] transition-colors">
                        {composition.name}
                    </h3>
                    <p className="text-white/70 mb-6 line-clamp-2">
                        {composition.description || "Un produit ultra-frais, prêt pour vos recettes."}
                    </p>

                    <div className="mt-auto flex items-center justify-between gap-3">
                        <div>
                            {priceVaries && (
                                <span className="block text-[10px] uppercase tracking-widest text-white/70 font-bold">
                                    à partir de
                                </span>
                            )}
                            <span className="text-3xl font-black text-white">{from.toFixed(2)}€</span>
                        </div>
                        <Button
                            onClick={openSheet}
                            className="h-12 px-6 text-sm rounded-2xl bg-[#ffcd47] hover:bg-[#ffe18a] text-[#073b2d] font-bold"
                        >
                            <Settings2 className="h-4 w-4 mr-2" />
                            Composer
                        </Button>
                    </div>
                </div>
            </div>

            {open && (
                <CompositionSheet
                    composition={composition}
                    isOpen={open}
                    onClose={() => setOpen(false)}
                    isMobile={isMobile}
                />
            )}
        </>
    )
}
