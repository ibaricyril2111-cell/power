import type { Metadata } from 'next'
import Header from "@/components/layout/header"
import Footer from "@/components/layout/footer"
import HeroSection from "@/components/sections/hero-section"
import ProductSection from "@/components/sections/product-section"
import ServiceStrip from "@/components/sections/service-strip"
import BasketShowcase from "@/components/sections/basket-showcase"
import FruitShowcase from "@/components/sections/fruit-showcase"\nimport SeasonalStars from "@/components/sections/seasonal-stars"

export const metadata: Metadata = { alternates: { canonical: '/' } }
export const dynamic = 'force-dynamic'

export default async function LandingPage() {
  return (
    <div className="min-h-screen bg-[#102e25] font-sans selection:bg-[#ffcd47]/20">
      <Header />
      <main className="flex flex-col items-center overflow-hidden">
        <HeroSection />
        <ServiceStrip />
        <FruitShowcase />
        <BasketShowcase />

        <div id="marketplace" className="w-full bg-[#102e25]">
          <ProductSection />
        </div>
      </main>
      <Footer />
    </div>
  )
}
