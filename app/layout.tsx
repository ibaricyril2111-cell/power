import type { Metadata } from 'next'
import './globals.css'
import { SessionProvider } from '@/components/providers/session-provider'
import GoogleAnalytics from '@/components/providers/google-analytics'
import CookieConsent from '@/components/cookie-consent'
import PwaRegister from '@/components/pwa-register'
import { Toaster } from "sonner"

const SITE_URL = 'https://powerprimeur.com'

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: { default: 'Power Primeur Alfortville | Fruits, légumes & livraison', template: '%s | Power Primeur Alfortville' },
  description: 'Primeur à Alfortville : fruits et légumes frais, produits bio selon arrivage, jus, smoothies, soupes, paniers de saison, livraison et click & collect au 114 rue Paul-Vaillant-Couturier.',
  keywords: ['primeur Alfortville', 'fruits et légumes Alfortville', 'primeur Paul-Vaillant-Couturier', 'primeur mairie Alfortville', 'livraison fruits légumes 94', 'smoothie Alfortville', 'soupe maison Alfortville', 'produits frais bio vegan', 'Power Primeur'],
  verification: { google: '1KOJaBLd_oa4Z8ePRSGeHxczLAFYL3s781AYso9Twfc' },
  openGraph: {
    title: 'Power Primeur Alfortville | Le frais du marché',
    description: 'Fruits et légumes frais, paniers de saison, jus, smoothies, soupes, livraison et retrait en boutique à Alfortville.',
    url: SITE_URL,
    siteName: 'Power Primeur',
    locale: 'fr_FR',
    type: 'website',
    images: [{ url: '/opengraph-image.png', width: 1200, height: 630, alt: 'Power Primeur à Alfortville' }],
  },
  twitter: { card: 'summary_large_image', title: 'Power Primeur Alfortville', description: 'Le frais du marché en livraison et click & collect.', images: ['/twitter-image.png'] },
  appleWebApp: { capable: true, statusBarStyle: 'black-translucent', title: 'Power' },
  icons: { icon: '/logo-power-mark.png', apple: '/logo-power-mark.png' },
}

export const viewport = { themeColor: '#f97316', width: 'device-width', initialScale: 1, viewportFit: 'cover' }

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': ['GroceryStore', 'LocalBusiness'],
  '@id': SITE_URL + '/#commerce',
  name: 'Power Primeur',
  url: SITE_URL,
  description: 'Primeur, bar à jus et commerce de produits frais à Alfortville. Fruits, légumes, jus, smoothies, soupes, paniers de saison, livraison et click & collect.',
  address: { '@type': 'PostalAddress', streetAddress: '114 rue Paul-Vaillant-Couturier', addressLocality: 'Alfortville', postalCode: '94140', addressRegion: 'Île-de-France', addressCountry: 'FR' },
  telephone: '+33659845017',
  image: SITE_URL + '/opengraph-image.png',
  logo: SITE_URL + '/logo-power-mark.png',
  priceRange: '€€',
  currenciesAccepted: 'EUR',
  paymentAccepted: 'Cash, Credit Card',
  hasMap: 'https://www.google.com/maps/search/?api=1&query=Power+Primeur+114+Rue+Paul+Vaillant+Couturier+94140+Alfortville',
  sameAs: ['https://www.instagram.com/poweralfortville/', 'https://www.tiktok.com/@power.alfortville'],
  contactPoint: { '@type': 'ContactPoint', telephone: '+33659845017', contactType: 'customer service', areaServed: ['FR-75', 'FR-77', 'FR-91', 'FR-92', 'FR-93', 'FR-94'], availableLanguage: 'French' },
  areaServed: [
    { '@type': 'City', name: 'Alfortville' },
    { '@type': 'AdministrativeArea', name: 'Paris (75)' },
    { '@type': 'AdministrativeArea', name: 'Seine-et-Marne (77)' },
    { '@type': 'AdministrativeArea', name: 'Essonne (91)' },
    { '@type': 'AdministrativeArea', name: 'Hauts-de-Seine (92)' },
    { '@type': 'AdministrativeArea', name: 'Seine-Saint-Denis (93)' },
    { '@type': 'AdministrativeArea', name: 'Val-de-Marne (94)' },
  ],
  knowsAbout: ['fruits frais', 'légumes frais', 'produits bio', 'produits vegan', 'jus frais', 'smoothies', 'soupes', 'paniers de saison', 'livraison de produits frais'],
}

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="fr" className="dark">
      <body>
        <SessionProvider>
          <PwaRegister />
          <GoogleAnalytics />
          <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
          {children}
          <CookieConsent />
          <Toaster position="bottom-right" richColors closeButton expand duration={4000} toastOptions={{ classNames: { toast: "rounded-xl border shadow-xl", success: "!bg-orange-500 !text-white !border-orange-600", error: "!bg-red-600 !text-white !border-red-700", info: "!bg-zinc-900 !text-white !border-zinc-700", warning: "!bg-amber-500 !text-white !border-amber-600", closeButton: "!bg-black/20 !text-white !border-transparent" } }} />
        </SessionProvider>
      </body>
    </html>
  )
}
