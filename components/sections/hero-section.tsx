import { MapPin } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

interface HeroSectionProps { title?: string; subtitle?: string }

export default function HeroSection({ title, subtitle }: HeroSectionProps) {
  return (
    <section className="relative isolate w-full overflow-hidden bg-[#102e25] text-white">
      <div className="mx-auto grid max-w-7xl items-center lg:grid-cols-[1.05fr_1fr]">
        <div className="relative z-10 px-5 pb-8 pt-32 sm:px-8 lg:py-40">
          <Image src="/logo-power.webp" alt="POWER" width={800} height={160} priority className="mb-7 h-auto w-56 rounded-lg sm:w-72" />
          <p className="flex items-center gap-2 text-sm font-medium text-white/75">
            <MapPin aria-hidden="true" className="h-4 w-4 shrink-0 text-[#ffcd47]" />Votre primeur à Alfortville
          </p>
          <h1 className="mt-6 text-5xl font-black leading-[1.02] tracking-[-0.045em] sm:text-6xl lg:text-7xl">
            {title || <>Du frais.<br />Du goût.<br /><span className="text-[#ffcd47]">Du POWER.</span></>}
          </h1>
          <p className="mt-6 max-w-lg text-base leading-relaxed text-white/80 sm:text-lg">
            {subtitle || "Fruits, légumes, jus et smoothies : retrouvez le goût de POWER et préparez votre commande en ligne."}
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link href="#marketplace" className="inline-flex min-h-14 items-center justify-center rounded-full bg-[#ffcd47] px-7 text-base font-bold text-[#102e25] transition-colors hover:bg-[#ffe18a] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white">Faire mes courses</Link>
            <Link href="/jus-soupes" className="inline-flex min-h-14 items-center justify-center rounded-full border border-white/35 px-7 text-base font-bold transition-colors hover:bg-white/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white">Découvrir nos jus</Link>
          </div>
          <p className="mt-6 text-sm leading-relaxed text-white/65">Click & Collect à Alfortville · Livraison selon votre zone</p>
          <Link href="#paniers" className="mt-4 inline-block text-sm font-semibold text-[#ffcd47] underline underline-offset-4">Voir les paniers de saison</Link>
        </div>
        <div className="relative mx-5 mb-7 aspect-[4/5] overflow-hidden rounded-[2rem] sm:mx-8 sm:aspect-[4/3] lg:mx-0 lg:mb-0 lg:aspect-[3/4] lg:rounded-none lg:rounded-l-[3rem]">
          <Image
            src="/power-storefront.webp"
            alt="La boutique POWER à Alfortville"
            fill
            priority
            fetchPriority="high"
            sizes="(min-width: 1024px) 50vw, 100vw"
            className="object-cover object-center"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#102e25]/85 via-transparent to-[#102e25]/10" />
          <div className="absolute bottom-5 left-5 w-[48%] max-w-[250px] overflow-hidden rounded-[26px] border-2 border-[#ffcd47] bg-[#102e25] shadow-2xl">
            <div className="relative aspect-[4/5]">
              <Image
                src="/brand/tropic-rose.webp"
                alt="Les mascottes POWER mangue, ananas et passion"
                fill
                sizes="250px"
                className="object-cover"
              />
            </div>
          </div>
          <div className="absolute bottom-5 right-5 max-w-[48%] rounded-2xl border border-white/15 bg-[#102e25]/90 p-4 shadow-xl backdrop-blur">
            <p className="text-xs font-black uppercase tracking-widest text-[#ffcd47]">Bienvenue chez POWER</p>
            <p className="mt-1 text-sm font-bold leading-snug sm:text-base">Le vrai magasin, nos vrais produits, notre univers.</p>
          </div>
        </div>
      </div>
    </section>
  )
}
