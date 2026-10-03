import type { Metadata } from "next"
import Header from "@/components/layout/header"
import Footer from "@/components/layout/footer"
import MobileBottomNav from "@/components/layout/mobile-bottom-nav"
import HeroSection from "@/components/sections/hero-section"
import ProductStars from "@/components/sections/product-stars"
import AvatarChoicePromo from "@/components/sections/avatar-choice-promo"
import SeasonalStars from "@/components/sections/seasonal-stars"
import BasketShowcase from "@/components/sections/basket-showcase"
import ProductSection from "@/components/sections/product-section"

export const metadata: Metadata = { alternates: { canonical: "/" } }
export const dynamic = "force-dynamic"

export default async function LandingPage() {
  return (
    <div className="min-h-screen bg-[#073b2d] font-sans selection:bg-[#ffcd47]/25">
      <Header />
      <main className="flex flex-col items-center overflow-hidden pb-16 md:pb-0">
        <HeroSection />
        <ProductStars />
        <AvatarChoicePromo />
        <SeasonalStars />
        <BasketShowcase />
        <div id="marketplace" className="w-full bg-[#073b2d]">
          <ProductSection />
        </div>
      </main>
      <Footer />
      <MobileBottomNav />
    </div>
  )
}
