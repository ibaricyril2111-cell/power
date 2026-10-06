import type { Metadata } from "next"
import Header from "@/components/layout/header"
import Footer from "@/components/layout/footer"
import MobileBottomNav from "@/components/layout/mobile-bottom-nav"
import PowerFamily from "@/components/sections/power-family"
import { getProducts } from "@/app/actions/products"
import { isPowerAvatarKey } from "@/lib/power-avatars"

export const dynamic = "force-dynamic"
export const metadata: Metadata = {
  title: "Les 100 personnages POWER — fruits, légumes et smoothies",
  description: "Retrouvez les 100 mascottes POWER : fruits, légumes, aromates et exotiques. Choisissez votre produit ou composez votre smoothie.",
  alternates: { canonical: "/personnages" },
}
export default async function CharactersPage({ searchParams }: { searchParams?: Promise<{ personnage?: string }> }) {
  const params = searchParams ? await searchParams : {}
  const initialCharacter = isPowerAvatarKey(params.personnage) ? params.personnage : null
  const result = await getProducts()
  return (
    <div className="min-h-screen bg-[#073b2d] text-white">
      <Header />
      <main className="pb-20 pt-40 sm:pt-44">
        {!result.success && <p role="alert" className="mx-auto max-w-7xl px-4 text-sm text-[#ffcd47]">
          Le catalogue ne se charge pas pour le moment. Réessaie dans un instant.
        </p>}
        <PowerFamily key={initialCharacter ?? "all"} products={result.data} initialCharacter={initialCharacter} />
      </main>
      <Footer /><MobileBottomNav />
    </div>
  )
}
