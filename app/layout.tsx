import type { Metadata } from 'next'
import './globals.css'
import { SessionProvider } from '@/components/providers/session-provider'
import GoogleAnalytics from '@/components/providers/google-analytics'
import CookieConsent from '@/components/cookie-consent'
import PwaRegister from '@/components/pwa-register'
import { Toaster } from "sonner"

export const metadata: Metadata = {
  metadataBase: new URL('https://powerprimeur.com'),
  title: {
    default: 'Power Primeur Alfortville | Fruits, légumes & livraison',
    template: '%s | Power Primeur Alfortville',
  },
  description: 'Primeur à Alfortville : fruits et légumes frais, paniers de saison, Power Bowls, livraison à domicile et click & collect au 114 rue Paul Vaillant-Couturier.',
  keywords: ['primeur Alfortville', 'fruits et légumes Alfortville', 'livraison fruits légumes 94', 'panier fruits légumes', 'click and collect Alfortville', 'Power Primeur'],
  verification: {
    google: '1KOJaBLd_oa4Z8ePRSGeHxczLAFYL3s781AYso9Twfc',
  },
  openGraph: {
    title: 'Power Primeur Alfortville | Le frais du marché',
    description: 'Fruits et légumes frais, paniers de saison, livraison à domicile et retrait en boutique à Alfortville.',
    url: 'https://powerprimeur.com',
    siteName: 'Power Primeur',
    locale: 'fr_FR',
    type: 'website',
    images: [{ url: '/opengraph-image.png', width: 1200, height: 630, alt: 'Power Primeur à Alfortville' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Power Primeur Alfortville',
    description: 'Le frais du marché en livraison et click & collect.',
    images: ['/twitter-image.png'],
  },
  alternates: {
    canonical: '/',
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'Power',
  },
  icons: {
    icon: '/logo-power-mark.png',
    apple: '/logo-power-mark.png',
  },
}

export const viewport = {
  themeColor: '#f97316',
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
}

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'GroceryStore',
  name: 'Power Primeur',
  url: 'https://powerprimeur.com',
  description: 'Votre primeur de confiance en Île-de-France. Livraison de produits frais, fruits et légumes sur Alfortville, Vitry (94), Paris (75), Hauts-de-Seine (92) et Essonne (91).',
  address: {
    '@type': 'PostalAddress',
    streetAddress: '114 Rue Paul Vaillant Couturier',
    addressLocality: 'Alfortville',
    postalCode: '94140',
    addressRegion: 'Île-de-France',
    addressCountry: 'FR'
  },
  telephone: '+33659845017',
  image: 'https://powerprimeur.com/opengraph-image.png',
  priceRange: '€€',
  currenciesAccepted: 'EUR',
  paymentAccepted: 'Cash, Credit Card',
  hasMap: 'https://www.google.com/maps/search/?api=1&query=Power+Primeur+114+Rue+Paul+Vaillant+Couturier+94140+Alfortville',
  sameAs: ['https://www.instagram.com/power_alfortville/'],
  contactPoint: {
    '@type': 'ContactPoint',
    telephone: '+33659845017',
    contactType: 'customer service',
    areaServed: 'FR',
    availableLanguage: 'French',
  },
  areaServed: [
    'Alfortville',
    'Vitry-sur-Seine',
    'Paris',
    'Val-de-Marne (94)',
    'Hauts-de-Seine (92)',
    'Essonne (91)'
  ]
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="fr" className="dark">
      <body>
        <SessionProvider>
          <PwaRegister />
          <GoogleAnalytics />
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
          />
          {children}
          <CookieConsent />
          {/* Notifications centralisées : un seul Toaster pour toute l'application,
              placé en bas à droite. Les couleurs viennent d'ici — les appels toast.*()
              ne portent aucun style, sinon chaque écran finit avec sa propre variante. */}
          <Toaster
            position="bottom-right"
            richColors
            closeButton
            expand
            duration={4000}
            toastOptions={{
              classNames: {
                toast: "rounded-xl border shadow-xl",
                success: "!bg-orange-500 !text-white !border-orange-600",
                error: "!bg-red-600 !text-white !border-red-700",
                info: "!bg-zinc-900 !text-white !border-zinc-700",
                warning: "!bg-amber-500 !text-white !border-amber-600",
                closeButton: "!bg-black/20 !text-white !border-transparent",
              },
            }}
          />
        </SessionProvider>
      </body>
    </html>
  )
}
