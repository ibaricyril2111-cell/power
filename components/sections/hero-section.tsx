import Image from "next/image"
import Link from "next/link"
import styles from "./hero-section.module.css"
import { Leaf, Truck, MapPin, Heart, ArrowRight } from "lucide-react"

const benefits = [
  { icon: Leaf, title: "Produits sélectionnés" },
  { icon: Truck, title: "Click & Collect et livraison" },
  { icon: MapPin, title: "Magasin à Alfortville" },
  { icon: Heart, title: "Pour toute la famille" },
]

interface HeroSectionProps { title?: string; subtitle?: string }

export default function HeroSection({ title, subtitle }: HeroSectionProps) {
  return (
    <section aria-labelledby="power-welcome-title" data-power-facade="approved-reference" className={`${styles.hero} w-full text-white`}>
      <div aria-hidden="true" className={styles.orbit} />
      <div className="relative mx-auto max-w-7xl px-4 pb-6 pt-8 sm:px-6 sm:pb-8 sm:pt-12">
        <div className="grid items-center gap-8 lg:grid-cols-[.9fr_1.1fr] lg:gap-12">
          <div className="max-w-xl">
            <p className="mb-4 text-xs font-bold uppercase tracking-[.16em] text-[#ffcd47]">POWER · Primeur & bar à jus</p>
            <h1 id="power-welcome-title" className="text-balance text-4xl font-black leading-[1.08] tracking-tight sm:text-5xl">{title || "Votre primeur à Alfortville."}</h1>
            <p className="mt-5 max-w-md text-base leading-relaxed text-white/85 sm:text-lg">{subtitle || "Fruits, légumes et jus frais. Retrouvez vos envies du jour, au même endroit."}</p>
            <Link href="#marketplace" className="mt-6 inline-flex min-h-12 w-full items-center justify-center gap-3 rounded-full bg-[#ffcd47] px-6 text-base font-bold text-[#073b2d] transition-colors hover:bg-[#ffe18a] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#ffcd47] sm:w-auto">
              Faire mes courses <ArrowRight aria-hidden="true" className="h-5 w-5" />
            </Link>
          </div>
        {/* The complete storefront and all five approved characters remain visible.
            This is the exact reference crop, not a reconstructed or generated scene. */}
        <div className={styles.scene}>
        <div className={styles.frame}>
        <Image
          src="/brand/facade-power-validee.webp"
          alt="La devanture POWER validée, avec les personnages mangue, fraise, ananas, banane et tomate devant le panneau Bienvenue chez POWER"
          width={710}
          height={319}
          priority
          fetchPriority="high"
          sizes="(min-width: 1280px) 660px, (min-width: 1024px) 55vw, 100vw"
          className="block h-auto w-full rounded-2xl"
        />
        </div>
        <nav aria-label="Découvrir les univers POWER" className={styles.cards}>
          {[
            { href: "/produits", label: "Fruits & légumes", mascot: "carotte" },
            { href: "/jus-soupes", label: "Jus & soupes", mascot: "orange" },
            { href: "/personnages", label: "La famille POWER", mascot: "fraise" },
          ].map(({ href, label, mascot }) => (
            <Link key={href} href={href} className={styles.card}>
              <Image src={`/brand/mascots/v4/${mascot}.webp`} alt="" width={72} height={72} sizes="72px" className={styles.mascot} />
              <span>{label}</span>
              <ArrowRight aria-hidden="true" className="h-4 w-4 shrink-0" />
            </Link>
          ))}
        </nav>
        </div>
        </div>
        <div className="mt-8 grid grid-cols-2 gap-x-4 gap-y-5 border-t border-white/15 pt-6 sm:grid-cols-4 sm:gap-6">
          {benefits.map(({ icon: Icon, title: benefitTitle }) => (
            <div key={benefitTitle} className="flex min-w-0 items-center gap-2.5">
              <Icon aria-hidden="true" className="h-5 w-5 shrink-0 text-[#ffcd47]" />
              <span className="text-xs font-medium leading-relaxed text-white/85 sm:text-sm">{benefitTitle}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
