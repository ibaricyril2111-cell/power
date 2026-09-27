import type { Metadata } from 'next'
import Link from 'next/link'
import Header from '@/components/layout/header'
import Footer from '@/components/layout/footer'

export const metadata: Metadata = {
  title: 'Livraison de fruits et légumes en Île-de-France',
  description: 'Power Primeur prépare et livre fruits, légumes, paniers et produits frais à Alfortville et en Île-de-France : 75, 77, 91, 92, 93 et 94.',
  alternates: { canonical: '/livraison' },
}

const zones = [
  ['Val-de-Marne (94)', 'Alfortville, Vitry-sur-Seine, Maisons-Alfort et communes desservies selon le créneau.'],
  ['Paris (75)', 'Livraison de paniers, fruits, légumes et produits frais selon disponibilité.'],
  ['Seine-et-Marne (77)', 'Livraison organisée selon la commune, le volume et le jour demandé.'],
  ['Essonne (91)', 'Commandes particulières et professionnelles selon le secteur desservi.'],
  ['Hauts-de-Seine (92)', 'Livraison planifiée selon le volume et les disponibilités.'],
  ['Seine-Saint-Denis (93)', 'Livraison planifiée selon la commune et le créneau.'],
]

export default function LivraisonPage() {
  return (
    <div className="min-h-screen bg-[#f7f4ed] text-[#173f32]">
      <Header />
      <main className="mx-auto max-w-7xl px-5 pb-20 pt-36 sm:px-8">
        <section className="rounded-[40px] bg-[#173f32] px-6 py-14 text-white sm:px-12 lg:px-16">
          <p className="text-sm font-bold uppercase tracking-[0.22em] text-orange-400">Livraison POWER</p>
          <h1 className="mt-5 max-w-5xl text-4xl font-black tracking-tight sm:text-6xl">Livraison de fruits et légumes frais en Île-de-France</h1>
          <p className="mt-6 max-w-3xl text-lg leading-relaxed text-white/80">Commandez vos fruits, légumes, paniers de saison, jus, smoothies et soupes chez votre primeur d’Alfortville. Retrait au 114 rue Paul-Vaillant-Couturier ou livraison selon votre commune et le créneau disponible.</p>
          <div className="mt-8 flex flex-wrap gap-3"><Link href="/#marketplace" className="rounded-full bg-orange-500 px-7 py-4 font-bold text-white hover:bg-orange-600">Voir les produits</Link><Link href="/contact" className="rounded-full border border-white/30 px-7 py-4 font-bold text-white hover:bg-white/10">Vérifier ma zone</Link></div>
        </section>

        <section className="py-16">
          <h2 className="text-3xl font-black sm:text-4xl">Départements desservis</h2>
          <p className="mt-4 max-w-3xl leading-relaxed text-[#173f32]/70">La zone annoncée couvre les départements 75, 77, 91, 92, 93 et 94. Les Yvelines (78) et le Val-d’Oise (95) sont exclus. La confirmation dépend de la commune, du volume, du jour et du créneau.</p>
          <div className="mt-8 grid gap-5 md:grid-cols-2 lg:grid-cols-3">{zones.map(([title, copy]) => <article key={title} className="rounded-3xl border border-[#173f32]/10 bg-white p-7 shadow-sm"><h3 className="text-xl font-black">{title}</h3><p className="mt-3 leading-relaxed text-[#173f32]/70">{copy}</p></article>)}</div>
        </section>

        <section className="grid gap-8 rounded-[36px] bg-white p-8 shadow-sm lg:grid-cols-3 lg:p-12">
          <article><h2 className="text-2xl font-black">Alfortville</h2><p className="mt-3 leading-relaxed text-[#173f32]/70">POWER vous accueille rue Paul-Vaillant-Couturier, à proximité de la mairie d’Alfortville. Le click & collect permet de récupérer une commande préparée.</p></article>
          <article><h2 className="text-2xl font-black">Produits frais</h2><p className="mt-3 leading-relaxed text-[#173f32]/70">Fruits, légumes, produits bio selon arrivage, références vegan, paniers, jus, smoothies et soupes.</p></article>
          <article><h2 className="text-2xl font-black">Professionnels</h2><p className="mt-3 leading-relaxed text-[#173f32]/70">Entreprises, restaurants, EHPAD et maisons de retraite peuvent demander une livraison régulière et un devis adapté.</p><Link href="/professionnels" className="mt-4 inline-flex font-bold text-orange-600 underline underline-offset-4">Livraison professionnelle</Link></article>
        </section>
      </main>
      <Footer />
    </div>
  )
}
