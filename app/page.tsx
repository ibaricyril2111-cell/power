import Header from "@/components/layout/header"
import Footer from "@/components/layout/footer"
import HeroSection from "@/components/sections/hero-section"
import ProductSection from "@/components/sections/product-section"
import ServiceStrip from "@/components/sections/service-strip"
import BasketShowcase from "@/components/sections/basket-showcase"

export const dynamic = 'force-dynamic'

export default async function LandingPage() {
  return (
    <div className="min-h-screen bg-[#f7f4ed] font-sans selection:bg-orange-500/20">
      <Header />
      <main className="flex flex-col items-center overflow-hidden">
        <HeroSection />
        <ServiceStrip />
        <BasketShowcase />

        <div id="marketplace" className="w-full bg-[#f7f4ed]">
          <ProductSection />
        </div>
      </main>
      <Footer />
    </div>
  )
}
