import type { MetadataRoute } from 'next'
import { prisma } from '@/lib/db'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date()
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: 'https://powerprimeur.com',
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 1,
    },
    { url: 'https://powerprimeur.com/produits', lastModified: now, changeFrequency: 'daily', priority: 0.9 },
    { url: 'https://powerprimeur.com/livraison', lastModified: now, changeFrequency: 'monthly', priority: 0.9 },
    { url: 'https://powerprimeur.com/decoupes', lastModified: now, changeFrequency: 'weekly', priority: 0.8 },
    { url: 'https://powerprimeur.com/jus-soupes', lastModified: now, changeFrequency: 'weekly', priority: 0.8 },
    { url: 'https://powerprimeur.com/recettes', lastModified: now, changeFrequency: 'weekly', priority: 0.7 },
    { url: 'https://powerprimeur.com/blog', lastModified: now, changeFrequency: 'weekly', priority: 0.7 },
    {
      url: 'https://powerprimeur.com/contact',
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: 'https://powerprimeur.com/faq',
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.5,
    },
    {
      url: 'https://powerprimeur.com/mentions-legales',
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 0.3,
    },
    {
      url: 'https://powerprimeur.com/cgv',
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 0.3,
    },
  ]

  try {
    const [products, categories] = await Promise.all([
      prisma.product.findMany({ where: { inStock: true }, select: { id: true, updatedAt: true } }),
      prisma.category.findMany({ select: { slug: true, updatedAt: true } }),
    ])
    return [
      ...staticPages,
      ...categories.map((category) => ({
        url: `https://powerprimeur.com/categories/${category.slug}`,
        lastModified: category.updatedAt,
        changeFrequency: 'daily' as const,
        priority: 0.8,
      })),
      ...products.map((product) => ({
        url: `https://powerprimeur.com/produits/${product.id}`,
        lastModified: product.updatedAt,
        changeFrequency: 'weekly' as const,
        priority: 0.7,
      })),
    ]
  } catch {
    return staticPages
  }
}
