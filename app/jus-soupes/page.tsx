import Header from "@/components/layout/header"
import Footer from "@/components/layout/footer"
import { Soup } from "lucide-react"
import CompositionCard from "@/components/product/composition-card"
import { getCompositionsByTypes } from "@/app/actions/compositions"
import FruitShowcase from "@/components/sections/fruit-showcase"

export const dynamic = 'force-dynamic'

export const metadata = {
    title: 'Jus, smoothies et soupes à composer — Power Primeur',
    description:
        "Composez votre jus, smoothie ou soupe : choisissez le format, la recette de base " +
        "et vos suppléments. Pressé du jour, retrait à Alfortville ou livraison.",
    alternates: { canonical: '/jus-soupes' },
}

export default async function JusSoupesPage() {
    const { data: compositions } = await getCompositionsByTypes(['jus', 'smoothie', 'soupe'])

    return (
        <div className="min-h-screen bg-[#073b2d] text-white">
            <Header />
            <div className="pt-24"><FruitShowcase linkToCatalog /></div>
            <main id="jus-disponibles" className="max-w-7xl mx-auto scroll-mt-28 px-4 pt-12 pb-20">
                <div className="flex flex-col gap-8">
                    <div>
                        <h1 className="text-4xl font-black tracking-tight sm:text-5xl border-b border-white/15 pb-6">
                            Jus, smoothies & <span className="text-[#ffcd47]">soupes POWER</span>
                        </h1>
                        <p className="mt-4 text-white/75 max-w-2xl text-lg">
                            Choisis ta formule, clique sur tes fruits préférés et regarde les personnages apparaître dans ton mixeur.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {compositions.map((comp) => (
                            <CompositionCard
                                key={comp.id}
                                composition={comp}
                                fallbackLabel="ÉNERGIE"
                                badge={
                                    <div className="absolute top-6 left-6 bg-black/60 backdrop-blur-xl border border-white/10 text-white px-4 py-2 rounded-full flex items-center gap-2 font-bold text-xs uppercase tracking-widest">
                                        <Soup className="w-4 h-4 text-[#ffcd47]" /> À composer
                                    </div>
                                }
                            />
                        ))}
                    </div>

                    {compositions.length === 0 && (
                        <div className="text-center py-40 border border-dashed border-white/10 rounded-[48px]">
                            <p className="text-zinc-500 text-xl italic">Nos pressoirs font une pause. Revenez plus tard !</p>
                        </div>
                    )}
                </div>
            </main>
            <Footer />
        </div>
    )
}
