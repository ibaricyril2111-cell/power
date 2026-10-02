import { prisma } from "@/lib/db"
import ProductGrid from "@/components/product/product-grid"
import { productImage } from "@/lib/product-image"

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
    <section id="fruits" className="py-20 px-5 sm:px-8 w-full bg-[#102e25] md:py-28">
      <div className="mx-auto w-full max-w-7xl">
        <div className="mb-12 max-w-2xl">
          <p className="text-sm font-bold uppercase tracking-[0.2em] text-[#ffcd47]">La boutique POWER · nos mascottes vous accompagnent</p>
          <h2 className="mt-3 text-4xl md:text-6xl font-black text-white tracking-[-0.05em]">
            Le marché POWER, vivant jusque dans votre panier.
          </h2>
          <p className="mt-4 text-white/70 max-w-xl text-lg leading-relaxed">
            Fruits, légumes, aromates et produits frais sélectionnés pour POWER. Ajoutez au panier, choisissez votre créneau et retirez en boutique ou faites-vous livrer selon votre zone.
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
