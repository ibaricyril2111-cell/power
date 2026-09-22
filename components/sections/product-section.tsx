import { prisma } from "@/lib/db"
import ProductGrid from "@/components/product/product-grid"

export default async function ProductSection() {
  const [products, compositions] = await Promise.all([
    prisma.product.findMany({
      where: { inStock: true },
      orderBy: [{ category: { name: 'asc' } }, { name: 'asc' }],
      include: { category: true }
    }),
    prisma.composition.findMany({
      orderBy: { name: 'asc' },
      // Formats et ingrédients inclus : sans eux, le configurateur ouvert depuis la page
      // d'accueil affiche « aucun format configuré » alors que tout est réglé en admin.
      include: {
        sizes: {
          orderBy: [{ order: 'asc' }, { price: 'asc' }],
          select: { id: true, name: true, price: true, description: true, isDefault: true, includedChoices: true },
        },
        options: {
          where: { isActive: true },
          orderBy: [{ order: 'asc' }, { name: 'asc' }],
          select: { id: true, name: true, extraPrice: true, includedByDefault: true, isRemovable: true },
        },
      },
    })
  ])

  const formattedProducts = products.map((product) => ({
    id: product.id,
    name: product.name,
    price: product.price,
    promoPrice: product.promoPrice,
    unit: product.unit,
    image: product.image || "/placeholder.svg?height=200&width=300",
    description: product.description || "Produit frais de qualité",
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
    image: comp.imageUrl || "/placeholder-product.jpg",
    imageUrl: comp.imageUrl,
    sizes: comp.sizes,
    options: comp.options,
  }))

  const categories = [...new Set(products.map(p => p.category.name))]

  return (
    <section id="fruits" className="py-20 px-5 sm:px-8 w-full bg-[#f7f4ed] md:py-28">
      <div className="mx-auto w-full max-w-7xl">
        <div className="mb-12 max-w-2xl">
          <p className="text-sm font-bold uppercase tracking-[0.2em] text-orange-600">La boutique Power</p>
          <h2 className="mt-3 text-4xl md:text-6xl font-black text-[#173f32] tracking-[-0.05em]">
            Le marché, rayon par rayon.
          </h2>
          <p className="mt-4 text-zinc-600 max-w-xl text-lg leading-relaxed">
            Choisissez vos produits à l’unité ou gagnez du temps avec une composition prête à personnaliser.
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
