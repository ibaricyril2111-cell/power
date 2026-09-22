"use client"

import { ArrowRight, MapPin } from "lucide-react"
import { motion } from "framer-motion"
import Image from "next/image"
import Link from "next/link"

interface HeroSectionProps {
  title?: string;
  subtitle?: string;
}

export default function HeroSection({ title, subtitle }: HeroSectionProps) {
  const scrollToMarketplace = () => {
    const marketplaceSection = document.getElementById("marketplace")
    if (marketplaceSection) {
      marketplaceSection.scrollIntoView({ behavior: "smooth" })
    }
  }

  return (
    <section className="relative w-full min-h-[690px] md:min-h-[760px] flex items-end text-white overflow-hidden bg-[#173f32]">
      <div className="absolute inset-0">
        <Image
          src="/power-storefront.webp"
          alt="La boutique Power Primeur à Alfortville"
          fill
          priority
          fetchPriority="high"
          quality={88}
          className="object-cover"
          sizes="100vw"
        />
      </div>

      <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/45 to-black/10" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-transparent to-black/25" />

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: "easeOut" }}
        className="relative z-10 w-full max-w-7xl mx-auto px-5 sm:px-8 pb-12 md:pb-20 pt-36"
      >
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] backdrop-blur-md">
            <MapPin className="h-4 w-4 text-orange-400" /> 114 rue Paul Vaillant-Couturier · Alfortville
          </div>
          <h1 className="mt-6 text-5xl sm:text-6xl md:text-8xl font-black tracking-[-0.055em] leading-[0.92] text-balance">
            {title || <>Le frais du marché,<br/><span className="text-orange-400">sans perdre de temps.</span></>}
          </h1>
          <p className="mt-6 max-w-2xl text-base sm:text-xl text-white/85 leading-relaxed">
            {subtitle || "Fruits, légumes et paniers de saison choisis chaque matin. Commandez aujourd’hui, récupérez ou faites-vous livrer dès demain à Alfortville."}
          </p>
          <div className="mt-8 flex flex-col sm:flex-row gap-3">
            <button onClick={scrollToMarketplace} className="inline-flex h-14 items-center justify-center gap-2 rounded-full bg-orange-500 px-7 font-bold text-white shadow-xl shadow-black/20 transition hover:bg-orange-600">
              Faire mes courses <ArrowRight className="h-5 w-5" />
            </button>
            <Link href="#paniers" className="inline-flex h-14 items-center justify-center rounded-full border border-white/40 bg-white/10 px-7 font-bold text-white backdrop-blur-md transition hover:bg-white/20">
              Voir les paniers de saison
            </Link>
          </div>
          <div className="mt-8 flex flex-wrap gap-x-6 gap-y-2 text-sm font-medium text-white/80">
            <span>✓ Produits sélectionnés chaque matin</span>
            <span>✓ Paiement en boutique ou à la livraison</span>
          </div>
        </div>
      </motion.div>
    </section>
  )
}
