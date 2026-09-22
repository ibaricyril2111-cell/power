import Link from "next/link"

export default function Footer() {
  return (
    <footer className="bg-[#102e25] text-white">
      <div className="mx-auto grid max-w-7xl gap-10 px-5 py-12 sm:px-8 md:grid-cols-[1.3fr_1fr_1fr]">
        <div>
          <span className="text-2xl font-black tracking-tight">POWER<span className="text-orange-400">.</span></span>
          <p className="mt-3 max-w-sm text-sm leading-relaxed text-white/65">Primeur, frais & local. Livraison à domicile et click & collect à Alfortville.</p>
          <p className="mt-4 text-sm text-white/80">114 rue Paul Vaillant-Couturier, 94140 Alfortville</p>
        </div>
        <nav className="flex flex-col gap-3 text-sm text-white/70">
          <p className="font-bold uppercase tracking-widest text-white">Commander</p>
          <Link href="/#marketplace" className="hover:text-orange-400">Boutique</Link>
          <Link href="/#paniers" className="hover:text-orange-400">Paniers de saison</Link>
          <Link href="/livraison" className="hover:text-orange-400">Livraison & retrait</Link>
        </nav>
        <nav className="flex flex-col gap-3 text-sm text-white/70">
          <p className="font-bold uppercase tracking-widest text-white">Power</p>
          <Link href="/contact" className="hover:text-orange-400">Contact</Link>
          <Link href="/faq" className="hover:text-orange-400">FAQ</Link>
          <Link href="/mentions-legales" className="hover:text-orange-400">Mentions légales</Link>
          <Link href="/cgv" className="hover:text-orange-400">CGV</Link>
        </nav>
      </div>
      <div className="border-t border-white/10 px-5 py-5 text-center text-xs text-white/45">© {new Date().getFullYear()} Power Primeur — Tous droits réservés.</div>
    </footer>
  )
}
