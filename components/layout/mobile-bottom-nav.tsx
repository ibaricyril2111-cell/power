"use client"

import Link from "next/link"
import { Home, Tag, ShoppingBasket, BookOpen, MapPin } from "lucide-react"

export default function MobileBottomNav() {
  return (
    <nav className="fixed inset-x-0 bottom-0 z-40 border-t border-white/10 bg-[#073b2d] px-2 pb-[max(.45rem,env(safe-area-inset-bottom))] pt-2 text-white shadow-[0_-10px_30px_rgba(0,0,0,.25)] md:hidden" aria-label="Navigation principale">
      <div className="mx-auto grid max-w-lg grid-cols-5">
        <Link href="/" className="flex flex-col items-center gap-1 text-[10px] font-bold text-[#ffcd47]"><Home className="h-5 w-5" />Accueil</Link>
        <Link href="/#marketplace" className="flex flex-col items-center gap-1 text-[10px] font-bold"><Tag className="h-5 w-5" />Promos</Link>
        <Link href="/#paniers" className="flex flex-col items-center gap-1 text-[10px] font-bold"><ShoppingBasket className="h-5 w-5" />Paniers</Link>
        <Link href="/jus-soupes" className="flex flex-col items-center gap-1 text-[10px] font-bold"><BookOpen className="h-5 w-5" />Recettes</Link>
        <Link href="/contact" className="flex flex-col items-center gap-1 text-[10px] font-bold"><MapPin className="h-5 w-5" />Magasin</Link>
      </div>
    </nav>
  )
}
