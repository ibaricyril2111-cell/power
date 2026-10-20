"use client"
import Header from "@/components/layout/header"
import PowerPageVisual from "@/components/layout/power-page-visual"
import Footer from "@/components/layout/footer"
import CartPage from "@/components/cart/cart-page"

export default function PanierPage() {
  return (
    <div className="power-page min-h-screen bg-background">
      <Header />
      <main className="container mx-auto max-w-6xl px-4 pt-28 pb-8">
        <PowerPageVisual mood="market" />
        <CartPage />
      </main>
      <Footer />
    </div>
  )
}
