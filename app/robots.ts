import type { MetadataRoute } from 'next'

const SITE_URL = 'https://powerprimeur.com'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      { userAgent: '*', allow: '/', disallow: ['/admin/', '/api/', '/connexion', '/mon-compte', '/commande', '/commandes/', '/checkout/', '/panier'] },
      { userAgent: 'OAI-SearchBot', allow: '/' },
      { userAgent: 'GPTBot', allow: '/' },
      { userAgent: 'Googlebot', allow: '/' },
      { userAgent: 'Bingbot', allow: '/' },
    ],
    sitemap: SITE_URL + '/sitemap.xml',
    host: SITE_URL,
  }
}
