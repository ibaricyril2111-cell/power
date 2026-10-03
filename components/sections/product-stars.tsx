import Link from "next/link"
import { prisma } from "@/lib/db"
import ProductCard from "@/components/product/product-card"
import { productImage } from "@/lib/product-image"

const wanted = ["mangue", "fraise", "ananas", "tomate"]

export default async function ProductStars() {
  const products = await prisma.product.findMany({
    where: { inStock: true },
    include: { category: true },
    orderBy: { name: "asc" },
  })

  const stars = wanted
    .map(term => products.find(p => p.name.toLowerCase().includes(term)))
    .filter((p): p is NonNullable<typeof p> => Boolean(p))

  if (!stars.length) return null

  return (
    <section className="w-full bg-[#073b2d] px-3 py-8 text-white sm:px-6">
      <div className="mx-auto max-w-7xl">
        <div className="mb-5 flex items-end justify-between gap-4">
          <div>
            <p className="text-xs font-black uppercase tracking-[.18em] text-[#ffcd47]">Les préférés POWER</p>
            <h2 className="mt-1 text-2xl font-black sm:text-3xl">Nos produits stars</h2>
          </div>
          <Link href="#marketplace" className="shrink-0 text-sm font-black text-[#ffcd47]">Voir tout →</Link>
        </div>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4">
          {stars.map(product => (
            <ProductCard
              key={product.id}
              product={{
                id: product.id,
                name: product.name,
                price: product.price,
                promoPrice: product.promoPrice,
                unit: product.unit,
                image: productImage(product.name, product.image),
                description: product.description || product.name,
                category: product.category.name,
                inStock: product.inStock,
                organic: product.organic,
              }}
            />
          ))}
        </div>
      </div>
    </section>
  )
}
