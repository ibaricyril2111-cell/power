import type { MetadataRoute } from 'next'
import { prisma } from '@/lib/db'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date()
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: 'https://power-ecru-pi.vercel.app',
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 1,
    },
    { url: 'https://power-ecru-pi.vercel.app/produits', lastModified: now, changeFrequency: 'daily', priority: 0.9 },
    { url: 'https://power-ecru-pi.vercel.app/livraison', lastModified: now, changeFrequency: 'monthly', priority: 0.9 },
    { url: 'https://power-ecru-pi.vercel.app/decoupes', lastModified: now, changeFrequency: 'weekly', priority: 0.8 },
    { url: 'https://power-ecru-pi.vercel.app/jus-soupes', lastModified: now, changeFrequency: 'weekly', priority: 0.8 },
    { url: 'https://power-ecru-pi.vercel.app/recettes', lastModified: now, changeFrequency: 'weekly', priority: 0.7 },
    { url: 'https://power-ecru-pi.vercel.app/blog', lastModified: now, changeFrequency: 'weekly', priority: 0.7 },
    {
      url: 'https://power-ecru-pi.vercel.app/contact',
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: 'https://power-ecru-pi.vercel.app/faq',
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.5,
    },
    {
      url: 'https://power-ecru-pi.vercel.app/mentions-legales',
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 0.3,
    },
    {
      url: 'https://power-ecru-pi.vercel.app/cgv',
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
        url: `https://power-ecru-pi.vercel.app/categories/${category.slug}`,
        lastModified: category.updatedAt,
        changeFrequency: 'daily' as const,
        priority: 0.8,
      })),
      ...products.map((product) => ({
        url: `https://power-ecru-pi.vercel.app/produits/${product.id}`,
        lastModified: product.updatedAt,
        changeFrequency: 'weekly' as const,
        priority: 0.7,
      })),
    ]
  } catch {
    return staticPages
  }
}
