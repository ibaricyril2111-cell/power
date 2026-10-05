import { prisma } from "@/lib/db"
import ProductGrid from "@/components/product/product-grid"
import { productImage } from "@/lib/product-image"
import { getCompositionsByTypes } from "@/app/actions/compositions"

export default async function ProductSection() {
  const [products, compositionResult] = await Promise.all([
    prisma.product.findMany({
      where: { inStock: true },
      orderBy: [{ category: { name: 'asc' } }, { name: 'asc' }],
      include: { category: true }
    }),
    getCompositionsByTypes()
  ])
  const compositions = compositionResult.data

  const formattedProducts = products.map((product) => ({
    id: product.id,
    name: product.name,
    price: product.price,
    promoPrice: product.promoPrice,
    unit: product.unit,
    image: productImage(product.name, product.image),
    description: product.description || `${product.name} sélectionné par Power Primeur à Alfortville.`,
    category: product.category.name,
    categorySlug: product.category.slug,
    inStock: product.inStock,
    organic: product.organic,
    currentStock: product.currentStock,
  }))

  const formattedCompositions = compositions.map((comp) => ({
    id: comp.id,
    name: comp.name,
    type: comp.type,
    basePrice: comp.basePrice,
    description: comp.description || "",
    image: comp.imageUrl || "/product-fallback.svg",
    imageUrl: comp.imageUrl,
    sizes: comp.sizes,
    options: comp.options,
  }))

  const categories = [...new Set(products.map(p => p.category.name))]

  return (
    <section id="fruits" className="w-full bg-[#073b2d] px-3 py-12 sm:px-6 md:py-16">
      <div className="mx-auto w-full max-w-7xl">
        <div className="mb-8 max-w-2xl">
          <p className="text-sm font-bold uppercase tracking-[0.2em] text-[#ffcd47]">Tous les produits · personnages POWER</p>
          <h2 className="mt-3 text-4xl md:text-6xl font-black text-white tracking-[-0.05em]">
            Tout le marché POWER
          </h2>
          <p className="mt-4 text-white/70 max-w-xl text-lg leading-relaxed">
            Fruits, légumes, aromates, jus et préparations : retrouve toute la bande POWER et ajoute directement tes produits au panier.
          </p>
        </div>
        <ProductGrid
          products={formattedProducts}
          compositions={formattedCompositions}
          categories={categories}
        />
      </div>
    </section>
  )
}
