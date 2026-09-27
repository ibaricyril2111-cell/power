import type { MetadataRoute } from 'next'
import { prisma } from '@/lib/db'

const SITE_URL = 'https://powerprimeur.com'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date()
  const pages = [
    ['', 'weekly', 1],
    ['/produits', 'daily', 0.9],
    ['/livraison', 'weekly', 0.9],
    ['/jus-soupes', 'weekly', 0.9],
    ['/professionnels', 'monthly', 0.8],
    ['/decoupes', 'weekly', 0.8],
    ['/recettes', 'weekly', 0.7],
    ['/blog', 'weekly', 0.7],
    ['/contact', 'monthly', 0.7],
    ['/faq', 'monthly', 0.6],
    ['/mentions-legales', 'yearly', 0.3],
    ['/cgv', 'yearly', 0.3],
  ] as const

  const staticPages: MetadataRoute.Sitemap = pages.map(([path, changeFrequency, priority]) => ({
    url: SITE_URL + path,
    lastModified: now,
    changeFrequency,
    priority,
  }))

  try {
    const [products, categories] = await Promise.all([
      prisma.product.findMany({ where: { inStock: true }, select: { id: true, updatedAt: true } }),
      prisma.category.findMany({ select: { slug: true, updatedAt: true } }),
    ])
    return [
      ...staticPages,
      ...categories.map((category) => ({ url: SITE_URL + '/categories/' + category.slug, lastModified: category.updatedAt, changeFrequency: 'daily' as const, priority: 0.8 })),
      ...products.map((product) => ({ url: SITE_URL + '/produits/' + product.id, lastModified: product.updatedAt, changeFrequency: 'weekly' as const, priority: 0.7 })),
    ]
  } catch {
    return staticPages
  }
}
