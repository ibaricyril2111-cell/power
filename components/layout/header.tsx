"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { Menu, Search, ShoppingCart, Apple, Carrot, CupSoda, Salad, ShoppingBasket, Tag, UserRound } from "lucide-react"
import { useSession } from "next-auth/react"
import { getCartItems } from "@/app/actions/cart"
import CartDrawer from "@/components/cart/cart-drawer"
import { getUserProfile } from "@/app/actions/account"
import { PowerAvatar } from "@/components/account/power-avatar"
import { DEFAULT_POWER_AVATAR, isPowerAvatarKey, type PowerAvatarKey } from "@/lib/power-avatars"
import { openMarketplace } from "@/lib/marketplace-navigation"

const shortcuts = [
  { label: "Tous", tab: "tout", icon: ShoppingBasket },
  { label: "Fruits", tab: "fruits", icon: Apple },
  { label: "Légumes", tab: "legumes", icon: Carrot },
  { label: "Jus & Smoothies", tab: "comp-jus", icon: CupSoda },
  { label: "Salades & Plats", tab: "comp-salade", icon: Salad },
  { label: "Paniers", href: "/#paniers", icon: ShoppingBasket },
  { label: "Promos", tab: "promos", icon: Tag },
]

export default function Header() {
  const [cartCount, setCartCount] = useState(0)
  const [cartOpen, setCartOpen] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [avatarKey, setAvatarKey] = useState<PowerAvatarKey>(DEFAULT_POWER_AVATAR)
  const { data: session, status } = useSession()
  const isLoggedIn = status === "authenticated"

  const loadCartCount = async () => {
    try {
      const result = await getCartItems()
      if (result.success && result.data) setCartCount(result.data.reduce((sum: number, item: any) => sum + (item.quantity || 0), 0))
    } catch {}
  }

  useEffect(() => { loadCartCount() }, [])
  useEffect(() => {
    const handler = () => loadCartCount()
    window.addEventListener("cart-updated", handler)
    return () => window.removeEventListener("cart-updated", handler)
  }, [])
  useEffect(() => {
    if (!isLoggedIn) return
    getUserProfile().then((res) => {
      if (res.success && isPowerAvatarKey(res.data?.avatarKey)) setAvatarKey(res.data.avatarKey)
    }).catch(() => {})
  }, [isLoggedIn])

  return (
    <>
      <header className="sticky top-0 z-50 w-full border-b border-[#ffcd47]/15 bg-[#073b2d]/98 text-white shadow-[0_10px_30px_rgba(0,0,0,.18)] backdrop-blur">
        <div className="mx-auto max-w-7xl px-3 pb-3 pt-2 sm:px-6">
          <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-2">
            <div className="flex items-center">
              <button type="button" onClick={() => setMenuOpen(v => !v)} className="flex min-h-11 items-center gap-2 rounded-xl px-2 text-sm font-bold hover:bg-white/5" aria-label="Menu" aria-expanded={menuOpen}>
                <Menu className="h-6 w-6" /><span className="hidden sm:inline">Menu</span>
              </button>
            </div>
            <Link href="/" aria-label="POWER — Accueil" className="justify-self-center">
              <Image src="/logo-power.webp" alt="POWER Primeur & Bar à jus" width={800} height={160} priority className="h-11 w-auto sm:h-14" />
            </Link>
            <div className="flex items-center justify-end gap-1 sm:gap-3">
              <Link href={isLoggedIn ? "/mon-compte" : "/connexion"} className="flex min-w-12 flex-col items-center justify-center text-[10px] font-bold sm:min-w-16">
                {isLoggedIn ? <PowerAvatar avatarKey={avatarKey} size={32} className="border-2 border-[#ffcd47]" /> : <UserRound className="h-6 w-6" />}
                <span className="mt-0.5 hidden sm:block">{isLoggedIn ? "Mon compte" : "Connexion"}</span>
              </Link>
              <button type="button" onClick={() => setCartOpen(true)} className="relative flex min-w-12 flex-col items-center justify-center text-[10px] font-bold sm:min-w-16" aria-label="Panier">
                <ShoppingCart className="h-7 w-7" />
                {cartCount > 0 && <span className="absolute right-1 top-0 flex h-5 min-w-5 items-center justify-center rounded-full bg-[#ffcd47] px-1 text-[10px] font-black text-[#073b2d]">{cartCount}</span>}
                <span className="mt-0.5 hidden sm:block">Panier</span>
              </button>
            </div>
          </div>
          <form action="/produits" method="get" role="search" className="relative mt-2">
            <button type="submit" aria-label="Lancer la recherche" className="absolute left-1 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-xl text-white/80 hover:text-[#ffcd47] focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#ffcd47]">
              <Search aria-hidden="true" className="h-5 w-5" />
            </button>
            <input name="q" type="search" aria-label="Rechercher" placeholder="Rechercher un fruit, un légume, un jus, une salade..." className="h-12 w-full rounded-2xl border border-white/35 bg-[#0b4938] pl-12 pr-4 text-sm font-medium text-white outline-none placeholder:text-white/65 focus:border-[#ffcd47]" />
          </form>
          <nav className="mt-2 flex gap-2 overflow-x-auto pb-1 scrollbar-hide" aria-label="Catégories POWER">
            {shortcuts.map(({ label, tab, href, icon: Icon }) => href ? (
              <Link key={label} href={href} className="flex min-w-[78px] flex-col items-center justify-center rounded-xl border border-white/20 bg-[#0b4938] px-3 py-2 text-[10px] font-bold transition hover:border-[#ffcd47] hover:text-[#ffcd47]">
                <Icon className="mb-1 h-4 w-4" />{label}
              </Link>
            ) : (
              <button type="button" key={label} onClick={() => openMarketplace(tab)} className="flex min-w-[78px] flex-col items-center justify-center rounded-xl border border-white/20 bg-[#0b4938] px-3 py-2 text-[10px] font-bold transition hover:border-[#ffcd47] hover:text-[#ffcd47]">
                <Icon className="mb-1 h-4 w-4" />{label}
              </button>
            ))}
          </nav>
          {menuOpen && (
            <div className="mt-2 grid grid-cols-2 gap-2 rounded-2xl border border-white/10 bg-[#052e23] p-3 text-sm font-bold shadow-2xl sm:grid-cols-4">
              <Link href="/#marketplace" onClick={() => setMenuOpen(false)} className="rounded-xl p-3 hover:bg-white/5">Faire mes courses</Link>
              <Link href="/personnages" onClick={() => setMenuOpen(false)} className="rounded-xl p-3 hover:bg-white/5">Les 100 mascottes</Link>
              <Link href="/livraison" onClick={() => setMenuOpen(false)} className="rounded-xl p-3 hover:bg-white/5">Livraison & retrait</Link>
              <Link href="/professionnels" onClick={() => setMenuOpen(false)} className="rounded-xl p-3 hover:bg-white/5">Professionnels</Link>
              <Link href="/contact" onClick={() => setMenuOpen(false)} className="rounded-xl p-3 hover:bg-white/5">Le magasin</Link>
            </div>
          )}
        </div>
      </header>
      <CartDrawer open={cartOpen} onOpenChange={setCartOpen} />
    </>
  )
}
