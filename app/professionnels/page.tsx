import type { Metadata } from 'next'
import Link from 'next/link'
import Header from '@/components/layout/header'
import Footer from '@/components/layout/footer'

export const metadata: Metadata = {
  title: 'Livraison fruits et légumes pour professionnels en Île-de-France',
  description: 'Power Primeur livre fruits, légumes, paniers et produits frais aux entreprises, restaurants, EHPAD et maisons de retraite en Île-de-France hors 78 et 95.',
  alternates: { canonical: '/professionnels' },
}

const publics = [
  ['EHPAD et maisons de retraite', 'Fruits, légumes, soupes et préparations fraîches adaptés aux volumes et à la fréquence de votre établissement.'],
  ['Restaurants et traiteurs', 'Approvisionnement régulier selon vos besoins, la saison et les arrivages disponibles.'],
  ['Entreprises et bureaux', 'Paniers de fruits, formats partagés et livraisons planifiées pour vos équipes.'],
  ['Associations et collectivités', 'Devis selon le nombre de bénéficiaires, les contraintes de préparation et le lieu de livraison.'],
]

const zones = ['Paris (75)', 'Seine-et-Marne (77)', 'Essonne (91)', 'Hauts-de-Seine (92)', 'Seine-Saint-Denis (93)', 'Val-de-Marne (94)']

export default function ProfessionnelsPage() {
  const serviceJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: 'Livraison de fruits et légumes pour professionnels',
    provider: { '@type': 'GroceryStore', name: 'Power Primeur', url: 'https://powerprimeur.com', address: { '@type': 'PostalAddress', streetAddress: '114 rue Paul-Vaillant-Couturier', addressLocality: 'Alfortville', postalCode: '94140', addressCountry: 'FR' } },
    areaServed: zones,
    serviceType: 'Livraison de fruits, légumes et produits frais pour professionnels',
    url: 'https://powerprimeur.com/professionnels',
  }

  return (
    <div className="min-h-screen bg-[#f7f4ed] text-[#173f32]">
      <Header />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceJsonLd) }} />
      <main className="mx-auto max-w-7xl px-5 pb-20 pt-36 sm:px-8">
        <section className="rounded-[40px] bg-[#173f32] px-6 py-14 text-white sm:px-12 lg:px-16">
          <p className="text-sm font-bold uppercase tracking-[0.22em] text-orange-400">Power pour les professionnels</p>
          <h1 className="mt-5 max-w-5xl text-4xl font-black tracking-tight sm:text-6xl">Livraison de fruits et légumes pour professionnels en Île-de-France</h1>
          <p className="mt-6 max-w-3xl text-lg leading-relaxed text-white/80">Depuis notre boutique au 114 rue Paul-Vaillant-Couturier à Alfortville, nous préparons des solutions pour entreprises, restaurants, EHPAD et maisons de retraite. Les produits sont sélectionnés selon la saison, les arrivages et votre cahier des charges.</p>
          <Link href="/contact" className="mt-8 inline-flex rounded-full bg-orange-500 px-7 py-4 font-bold text-white hover:bg-orange-600">Demander un devis</Link>
        </section>

        <section className="py-16">
          <h2 className="text-3xl font-black sm:text-4xl">Une offre adaptée à votre activité</h2>
          <div className="mt-8 grid gap-5 md:grid-cols-2">
            {publics.map(([title, copy]) => <article key={title} className="rounded-3xl border border-[#173f32]/10 bg-white p-7 shadow-sm"><h3 className="text-xl font-black">{title}</h3><p className="mt-3 leading-relaxed text-[#173f32]/70">{copy}</p></article>)}
          </div>
        </section>

        <section className="grid gap-8 rounded-[36px] bg-white p-8 shadow-sm lg:grid-cols-2 lg:p-12">
          <div>
            <h2 className="text-3xl font-black">Zones de livraison</h2>
            <p className="mt-4 leading-relaxed text-[#173f32]/70">POWER organise les livraisons dans les départements suivants. Les Yvelines (78) et le Val-d’Oise (95) ne font pas partie de la zone annoncée.</p>
            <ul className="mt-6 grid gap-2 sm:grid-cols-2">{zones.map((zone) => <li key={zone} className="rounded-xl bg-[#f7f4ed] px-4 py-3 font-semibold">{zone}</li>)}</ul>
          </div>
          <div>
            <h2 className="text-3xl font-black">Votre devis</h2>
            <p className="mt-4 leading-relaxed text-[#173f32]/70">Indiquez les produits, les volumes, la fréquence, le lieu, le créneau et les besoins de préparation. Pour les recherches liées à Rungis, précisez vos contraintes d’approvisionnement et de livraison afin que nous vérifiions la solution disponible.</p>
            <Link href="/contact" className="mt-6 inline-flex font-bold text-orange-600 underline underline-offset-4">Contacter POWER</Link>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}
