import Image from "next/image"
import Link from "next/link"
import { Leaf, Truck, MapPin, Heart } from "lucide-react"

const benefits = [
  { icon: Leaf, title: "Produits sélectionnés" },
  { icon: Truck, title: "Click & Collect et livraison" },
  { icon: MapPin, title: "Magasin à Alfortville" },
  { icon: Heart, title: "Des familles plus heureuses" },
]

interface HeroSectionProps { title?: string; subtitle?: string }

export default function HeroSection({ title, subtitle }: HeroSectionProps) {
  return (
    <section className="w-full bg-[#073b2d] text-white">
      <div className="mx-auto max-w-7xl px-3 pb-6 sm:px-6">
        <div className="relative overflow-hidden rounded-b-[28px] border-x border-b border-[#ffcd47]/20 bg-[#0b4938] shadow-2xl">
          <div className="relative aspect-[16/10] min-h-[330px] sm:aspect-[16/8] lg:aspect-[16/7]">
            <Image
              src="/power-champ-hero.webp"
              alt="Bienvenue chez POWER à Alfortville avec les personnages fruits et légumes POWER"
              fill
              priority
              fetchPriority="high"
              sizes="100vw"
              className="object-cover object-center"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#052e23]/95 via-transparent to-transparent" />
            <div className="absolute inset-x-4 bottom-5 text-center sm:bottom-7">
              <h1 className="sr-only">{title || "POWER Primeur et Bar à jus à Alfortville"}</h1>
              <p className="mx-auto max-w-xl text-sm font-semibold text-white/90 sm:text-base">
                {subtitle || "Des fruits plus de sourires"}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 border-t border-white/10 bg-[#073b2d] sm:grid-cols-4">
            {benefits.map(({ icon: Icon, title }) => (
              <div key={title} className="flex min-h-[74px] items-center gap-3 border-white/10 px-4 py-3 even:border-l sm:border-l first:sm:border-l-0">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-[#ffcd47]/60 text-[#ffcd47]"><Icon className="h-4 w-4" /></span>
                <span className="text-[11px] font-bold leading-tight sm:text-xs">{title}</span>
              </div>
            ))}
          </div>

          <div className="bg-[#073b2d] px-4 pb-5 pt-2 text-center">
            <Link href="#marketplace" className="inline-flex min-h-14 w-full max-w-sm items-center justify-center rounded-full bg-[#ffcd47] px-8 text-base font-black text-[#073b2d] shadow-lg transition hover:bg-[#ffe18a]">
              Faire mes courses <span className="ml-3 text-xl">→</span>
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
