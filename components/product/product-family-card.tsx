"use client"

import Image from "next/image"
import { ArrowUpRight } from "lucide-react"
import type { PRODUCT_FAMILIES } from "@/lib/product-families"

export default function ProductFamilyCard({ family, count, onOpen }: {
  family: (typeof PRODUCT_FAMILIES)[number]; count: number; onOpen: () => void
}) {
  return <button type="button" onClick={onOpen} aria-haspopup="dialog" aria-label={`Découvrir ${family.title.toLowerCase()}`}
    className="power-family-card power-tile group flex min-w-0 w-full flex-col overflow-hidden rounded-[22px] border border-white/15 bg-[#0b4938] text-left transition hover:border-[#ffcd47] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ffcd47]">
    <span className="relative block aspect-[4/3] w-full overflow-hidden">
      <Image src={family.image} alt={`La famille POWER : ${family.title.toLowerCase()}`} fill sizes="(max-width:639px) 45vw, (max-width:1023px) 40vw, 300px" className="object-cover transition-transform duration-300 group-hover:scale-105" />
    </span>
    <span className="flex w-full min-w-0 flex-1 flex-col gap-2 p-3 sm:p-5">
      <span className="block text-lg font-black leading-tight text-white sm:text-xl">{family.title}</span>
      <span className="block text-xs leading-relaxed text-emerald-50/80 sm:text-sm">{family.description}</span>
      <span className="mt-auto flex flex-wrap items-center justify-between gap-2 pt-1 text-xs font-bold text-[#ffcd47] sm:text-sm">
        <span>{count} produits · Voir</span><ArrowUpRight className="h-4 w-4 shrink-0" aria-hidden="true" />
      </span>
    </span>
  </button>
}
