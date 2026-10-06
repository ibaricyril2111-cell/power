"use client"

import { useMemo, useState } from "react"
import Link from "next/link"
import { Search, ArrowRight } from "lucide-react"
import { Dialog, DialogContent, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import MascotPortrait from "@/components/product/mascot-portrait"
import ProductPurchase from "@/components/product/product-purchase"
import { POWER_AVATARS, normalizeMascotName, avatarForProductName, type PowerAvatarKey } from "@/lib/power-avatars"
import { productsForCharacter, type FamilyProduct } from "@/lib/power-family-catalog"
import { minQuantity, unitLabel } from "@/lib/units"

const FILTERS = [
  ["tout", "Tous les personnages"], ["fruits", "Fruits"], ["legumes", "Légumes"],
  ["exotiques", "Exotiques"], ["aromates", "Aromates"],
] as const

function FamilyProductRow({ product }: { product: FamilyProduct }) {
  return (
    <article className="rounded-2xl border border-white/15 bg-white/5 p-4">
      <Link href={"/produits/" + encodeURIComponent(product.id)} className="font-bold text-white underline-offset-4 hover:underline">{product.name}</Link>
      <p className="mb-3 mt-1 text-sm text-[#ffcd47]">
        {product.promoPrice != null && <span className="mr-2 text-white/50 line-through">{product.price.toFixed(2)} €</span>}
        {(product.promoPrice ?? product.price).toFixed(2)} € / {unitLabel(product.unit)}
      </p>
      <ProductPurchase product={product} />
    </article>
  )
}

export default function PowerFamily({ products, initialCharacter = null }: { products: FamilyProduct[]; initialCharacter?: PowerAvatarKey | null }) {
  const [filter, setFilter] = useState("tout")
  const [search, setSearch] = useState("")
  const [selected, setSelected] = useState<PowerAvatarKey | null>(initialCharacter)
  const entries = useMemo(() => POWER_AVATARS.map((avatar) => ({
    avatar, products: productsForCharacter(products, avatar.key),
  })), [products])
  const displayed = entries.filter(({ avatar }) => (filter === "tout" || filter === avatar.family)
    && (normalizeMascotName(avatar.label).includes(normalizeMascotName(search)) || avatarForProductName(search)?.key === avatar.key))
  const selection = entries.find(({ avatar }) => avatar.key === selected)

  return (
    <section className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6" aria-label="Les 100 personnages POWER">
      <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-xs font-black uppercase tracking-widest text-[#ffcd47]">La famille POWER · 100 personnages</p>
          <h1 className="mt-2 text-3xl font-black tracking-tight sm:text-5xl">Choisis ton personnage préféré</h1>
          <p className="mt-3 max-w-2xl text-sm leading-relaxed text-white/75">Clique sur un fruit, un légume ou un aromate pour retrouver ses produits et faire tes courses.</p>
        </div>
        <Link href="/jus-soupes" className="inline-flex min-h-12 items-center gap-2 rounded-full bg-[#ffcd47] px-5 text-sm font-black text-[#073b2d] hover:bg-[#ffe18a]">
          Composer mon smoothie <ArrowRight className="h-4 w-4" aria-hidden="true" />
        </Link>
      </div>
      <label className="mb-4 flex min-h-12 items-center gap-2 rounded-2xl border border-white/20 bg-white/5 px-4">
        <Search className="h-5 w-5 text-[#ffcd47]" aria-hidden="true" />
        <span className="sr-only">Rechercher un personnage</span>
        <input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Mangue, menthe, fruit du dragon…"
          className="min-w-0 flex-1 bg-transparent py-3 text-sm text-white outline-none placeholder:text-white/50" />
      </label>
      <div className="mb-5 flex flex-wrap gap-2" aria-label="Familles de personnages">
        {FILTERS.map(([key, label]) => (
          <button key={key} type="button" onClick={() => setFilter(key)} aria-pressed={filter === key}
            className={"min-h-11 rounded-full border px-4 text-xs font-bold transition-colors "
              + (filter === key ? "border-[#ffcd47] bg-[#ffcd47] text-[#073b2d]" : "border-white/20 bg-white/5 text-white hover:bg-white/10")}>{label}</button>
        ))}
      </div>
      <p className="mb-4 text-xs text-white/65" role="status">{displayed.length} personnage{displayed.length > 1 ? "s" : ""}</p>
      <div className="grid grid-cols-3 gap-2 sm:grid-cols-5 sm:gap-3 lg:grid-cols-8 xl:grid-cols-10">
        {displayed.map(({ avatar, products: matches }) => {
          const available = matches.some((product) => product.inStock && product.currentStock >= minQuantity(product.unit))
          return (
            <button key={avatar.key} type="button" onClick={() => setSelected(avatar.key)}
              aria-label={"Voir les produits " + avatar.label} data-family-character={avatar.key}
              className="group flex min-w-0 flex-col items-center gap-2 rounded-2xl border border-white/15 bg-[#0b4938] p-2 text-center transition hover:-translate-y-0.5 hover:border-[#ffcd47] focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#ffcd47]">
              <MascotPortrait mascotKey={avatar.key} decorative className="w-full max-w-[100px]" />
              <span className="min-h-7 text-xs font-bold leading-tight">{avatar.label}</span>
              <span className={"text-[10px] " + (available ? "text-[#ffcd47]" : "text-white/60")}>{available ? "Je me commande !" : "Selon arrivage"}</span>
            </button>
          )
        })}
      </div>
      {displayed.length === 0 && <p className="py-12 text-center text-white/70">Aucun personnage ne correspond à cette recherche.</p>}
      <Dialog open={Boolean(selection)} onOpenChange={(open) => { if (!open) setSelected(null) }}>
        <DialogContent className="max-h-[90dvh] max-w-lg overflow-y-auto border-[#ffcd47]/30 bg-[#073b2d] text-white">
          {selection && <>
            <div className="flex items-center gap-4 pr-6">
              <MascotPortrait mascotKey={selection.avatar.key} className="w-24 shrink-0" />
              <div>
                <DialogTitle className="text-2xl font-black">{selection.avatar.label}</DialogTitle>
                <DialogDescription className="mt-2 text-white/70">Retrouve mon produit chez POWER.</DialogDescription>
              </div>
            </div>
            <div className="space-y-3">
              {selection.products.map((product) => <FamilyProductRow key={product.id} product={product} />)}
              {selection.products.length === 0 && <p className="rounded-2xl border border-white/15 bg-white/5 p-4 text-sm leading-relaxed text-white/80">
                Je ne suis pas en vente aujourd’hui. Les produits disponibles changent avec les arrivages.
              </p>}
            </div>
            <Link href="/jus-soupes" className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl border border-[#ffcd47]/50 px-4 text-sm font-bold text-[#ffcd47] hover:bg-[#ffcd47]/10">
              Découvrir les smoothies à composer <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          </>}
        </DialogContent>
      </Dialog>
    </section>
  )
}
