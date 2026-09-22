import type { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/admin/', '/api/', '/connexion', '/mon-compte', '/commande', '/commandes/', '/checkout/', '/panier'],
    },
    sitemap: 'https://powerprimeur.com/sitemap.xml',
  }
}
