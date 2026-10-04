import Image from "next/image"
import Link from "next/link"

export default function Footer() {
  return (
    <footer className="bg-[#102e25] text-white">
      <div className="mx-auto grid max-w-7xl gap-10 px-5 py-12 sm:px-8 md:grid-cols-[1.3fr_1fr_1fr]">
        <div>
          <Image src="/logo-power.webp" alt="POWER — Primeur Alfortville" width={800} height={160} className="h-12 w-auto" />
          <p className="mt-3 max-w-sm text-sm leading-relaxed text-white/65">Primeur, frais & local. Livraison à domicile et click & collect à Alfortville.</p>
          <p className="mt-4 text-sm text-white/80">114 rue Paul Vaillant-Couturier, 94140 Alfortville</p>
        </div>
        <nav className="flex flex-col gap-3 text-sm text-white/70">
          <p className="font-bold uppercase tracking-widest text-white">Commander</p>
          <Link href="/#marketplace" className="hover:text-[#ffcd47]">Boutique</Link>
          <Link href="/#paniers" className="hover:text-[#ffcd47]">Paniers de saison</Link>
          <Link href="/livraison" className="hover:text-[#ffcd47]">Livraison & retrait</Link>
          <Link href="/professionnels" className="hover:text-[#ffcd47]">Professionnels, EHPAD & entreprises</Link>
        </nav>
        <nav className="flex flex-col gap-3 text-sm text-white/70">
          <p className="font-bold uppercase tracking-widest text-white">Power</p>
          <Link href="/contact" className="hover:text-[#ffcd47]">Contact</Link>
          <Link href="/faq" className="hover:text-[#ffcd47]">FAQ</Link>
          <Link href="/mentions-legales" className="hover:text-[#ffcd47]">Mentions légales</Link>
          <Link href="/cgv" className="hover:text-[#ffcd47]">CGV</Link>
        </nav>
      </div>
      <div className="border-t border-white/10 px-5 py-5 text-center text-xs text-white/45">© {new Date().getFullYear()} Power Primeur — Tous droits réservés.</div>
    </footer>
  )
}
