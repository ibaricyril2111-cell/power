import Image from "next/image"
import Link from "next/link"
import { Leaf, Truck, MapPin, Heart, ArrowRight } from "lucide-react"

const benefits = [
  { icon: Leaf, title: "Produits sélectionnés" },
  { icon: Truck, title: "Click & Collect et livraison" },
  { icon: MapPin, title: "Magasin à Alfortville" },
  { icon: Heart, title: "Des familles plus heureuses" },
]

interface HeroSectionProps { title?: string; subtitle?: string }

export default function HeroSection({ title, subtitle }: HeroSectionProps) {
  return (
    <section aria-labelledby="power-welcome-title" data-power-facade="approved-reference" className="w-full bg-[#073b2d] text-white">
      <h1 id="power-welcome-title" className="sr-only">{title || "POWER Primeur et Bar à jus à Alfortville"}</h1>
      {subtitle && <p className="sr-only">{subtitle}</p>}
      <div className="mx-auto max-w-7xl">
        {/* The complete storefront and all five approved characters remain visible.
            This is the exact reference crop, not a reconstructed or generated scene. */}
        <Image
          src="/brand/facade-power-validee.webp"
          alt="La devanture POWER validée, avec les personnages mangue, fraise, ananas, banane et tomate devant le panneau Bienvenue chez POWER"
          width={710}
          height={319}
          priority
          fetchPriority="high"
          sizes="(min-width: 1280px) 1280px, 100vw"
          className="block h-auto w-full"
        />
        <div className="grid grid-cols-4 gap-1 px-2 py-3 sm:gap-4 sm:px-6 sm:py-4">
          {benefits.map(({ icon: Icon, title: benefitTitle }) => (
            <div key={benefitTitle} className="flex min-w-0 flex-col items-center gap-1.5 text-center sm:flex-row sm:gap-3 sm:text-left">
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-[#ffcd47]/80 text-[#ffcd47] sm:h-10 sm:w-10"><Icon aria-hidden="true" className="h-4 w-4 sm:h-5 sm:w-5" /></span>
              <span className="max-w-[10rem] text-[10px] font-medium leading-snug sm:text-xs">{benefitTitle}</span>
            </div>
          ))}
        </div>
        <div className="px-4 pb-5 pt-1 text-center">
          <Link href="#marketplace" className="inline-flex min-h-12 w-full max-w-sm items-center justify-center gap-3 rounded-full bg-[#ffcd47] px-6 text-base font-black text-[#073b2d] transition-colors hover:bg-[#ffe18a] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#ffcd47]">
            Faire mes courses <ArrowRight aria-hidden="true" className="h-5 w-5" />
          </Link>
        </div>
      </div>
    </section>
  )
}
