import type { MetadataRoute } from 'next'

const SITE_URL = 'https://powerprimeur.com'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/admin/', '/api/', '/connexion', '/mon-compte', '/commande', '/commandes/', '/checkout/', '/panier'],
    },
    sitemap: SITE_URL + '/sitemap.xml',
    host: SITE_URL,
  }
}
