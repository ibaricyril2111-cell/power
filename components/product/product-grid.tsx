"use client"

import { useState, useMemo, useEffect } from "react"
import { Search } from "lucide-react"
import ProductCard from "./product-card"
import ProductCardMobile from "./product-card-mobile"
import CompositionMobileItem from "./composition-mobile-item"
import CompositionSheet from "./composition-sheet"
import { ProductModalProvider, useProductModal } from "./product-modal-context"
import ImageWithFallback from "./image-with-fallback"

interface Product {
  id: string
  name: string
  price: number
  promoPrice?: number | null
  unit: string
  image: string
  description: string
  category: string
  categorySlug?: string
  inStock: boolean
  organic: boolean
  /** Stock réel, transmis jusqu'à la modale pour borner la quantité commandable. */
  currentStock?: number
}

interface Composition {
  id: string
  name: string
  type: string
  basePrice: number
  description: string | null
  image: string
  imageUrl?: string | null
  /** Formats de vente définis en admin, avec leur prix propre. */
  sizes?: { id: string; name: string; price: number; description?: string | null; isDefault?: boolean }[]
  /** Ingrédients : formule standard incluse, ou supplément payant. */
  options?: { id: string; name: string; extraPrice: number; includedByDefault?: boolean; isRemovable?: boolean }[]
}

interface ProductGridProps {
  products: Product[]
  compositions?: Composition[]
  categories?: string[]
}

function ProductGridInner({ products, compositions = [], categories = [] }: ProductGridProps) {
  const { openProductModal } = useProductModal()
  const [activeTab, setActiveTab] = useState("tout")
  const [search, setSearch] = useState("")
  const [selectedComposition, setSelectedComposition] = useState<Composition | null>(null)
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 767px)")
    setIsMobile(mq.matches)
    const handler = (e: MediaQueryListEvent) => setIsMobile(e.matches)
    mq.addEventListener("change", handler)
    return () => mq.removeEventListener("change", handler)
  }, [])

  useEffect(() => {
    const handler = (e: Event) => {
      const tab = (e as CustomEvent).detail as string
      if (tab) setActiveTab(tab)
    }
    window.addEventListener("marketplace-tab", handler)
    return () => window.removeEventListener("marketplace-tab", handler)
  }, [])

  // Tabs dynamiques depuis les vraies catégories DB + types de compositions DB
  const visibleTabs = useMemo(() => {
    const tabs: { id: string; label: string }[] = [{ id: "tout", label: "Tout" }]

    // Ajouter chaque catégorie réelle de produits depuis la DB
    const categoryOrder = ["Fruits", "Fruits rouges", "Légumes", "Aromates", "Exotiques"]
    ;[...categories].sort((a, b) => {
      const ai = categoryOrder.indexOf(a)
      const bi = categoryOrder.indexOf(b)
      return (ai === -1 ? 99 : ai) - (bi === -1 ? 99 : bi)
    }).forEach(cat => {
      const id = cat.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/\s+/g, "-")
      tabs.push({ id, label: cat })
    })

    // Ajouter chaque type de composition unique depuis la DB
    const compositionTypes = [...new Set(compositions.map(c => c.type))]
    compositionTypes.forEach(type => {
      const id = "comp-" + type.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/\s+/g, "-")
      // Capitaliser le label
      const label = type.charAt(0).toUpperCase() + type.slice(1).replace(/-/g, " ")
      tabs.push({ id, label })
    })

    return tabs
  }, [categories, compositions])

  const filtered = useMemo(() => {
    const q = search.toLowerCase().trim()
    let filteredProducts = products
    let filteredCompositions = compositions

    if (activeTab.startsWith("comp-")) {
      // Onglet composition dynamique — extraire le type
      const compType = activeTab.replace("comp-", "")
      filteredProducts = []
      filteredCompositions = compositions.filter(c => {
        const typeSlug = c.type.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/\s+/g, "-")
        return typeSlug === compType
      })
    } else if (activeTab !== "tout") {
      // Onglet catégorie produit
      filteredProducts = products.filter(p => {
        const catSlug = p.category.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/\s+/g, "-")
        return catSlug === activeTab
      })
      filteredCompositions = []
    }

    if (q) {
      filteredProducts = filteredProducts.filter(p => p.name.toLowerCase().includes(q))
      filteredCompositions = filteredCompositions.filter(c => c.name.toLowerCase().includes(q))
    }

    return { products: filteredProducts, compositions: filteredCompositions }
  }, [products, compositions, activeTab, search])

  const totalItems = filtered.products.length + filtered.compositions.length

  return (
    <>
      {/* Search + Tabs centré */}
      <div className="mb-10 flex flex-col gap-5">
        <div className="relative w-full max-w-xl">
          <Search className="absolute left-5 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
          <input
            type="text"
            placeholder="Rechercher un produit..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-12 pr-4 py-4 bg-white border border-black/10 rounded-2xl text-zinc-900 placeholder:text-zinc-400 shadow-sm focus:outline-none focus:border-orange-500 focus:ring-4 focus:ring-orange-500/10 transition text-sm"
          />
        </div>

        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide md:flex-wrap">
          {visibleTabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-shrink-0 px-4 py-2 rounded-full text-xs font-bold uppercase tracking-widest transition-all ${
                activeTab === tab.id
                  ? "bg-[#173f32] text-white shadow-md"
                  : "bg-white text-zinc-700 border border-black/10 hover:border-[#173f32]/40"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {totalItems === 0 ? (
        <div className="text-center py-20">
          <p className="text-zinc-500 italic font-medium">Aucun produit trouvé.</p>
        </div>
      ) : (
        <>
          {/* Mobile */}
          <div className="sm:hidden grid grid-cols-2 gap-3">
            {filtered.products.map((product) => (
              <ProductCardMobile
                key={product.id}
                product={product}
                onViewDetails={() => openProductModal(product)}
              />
            ))}
            {filtered.compositions.map((comp) => (
              <CompositionMobileItem
                key={comp.id}
                composition={{
                  id: comp.id,
                  name: comp.name,
                  basePrice: comp.basePrice,
                  imageUrl: comp.image,
                  description: comp.description,
                }}
                onCompose={() => setSelectedComposition(comp)}
              />
            ))}
          </div>

          {/* Desktop */}
          <div className="hidden sm:grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {filtered.products.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onViewDetails={() => openProductModal(product)}
              />
            ))}
            {filtered.compositions.map((comp) => (
              <div
                key={comp.id}
                className="group bg-white border border-black/5 rounded-[28px] overflow-hidden hover:-translate-y-1 hover:shadow-xl transition-all duration-300 h-full flex flex-col cursor-pointer"
                onClick={() => setSelectedComposition(comp)}
              >
                <div className="relative aspect-square overflow-hidden bg-zinc-800">
                  <ImageWithFallback
                    src={comp.image || "/placeholder.svg"}
                    alt={comp.name}
                    fill
                    sizes="(max-width: 768px) 100vw, 300px"
                    className="object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                  <div className="absolute top-6 left-6">
                    <span className="bg-white/90 backdrop-blur-xl border border-black/5 text-[#173f32] px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest shadow-sm">
                      {comp.type.charAt(0).toUpperCase() + comp.type.slice(1).replace(/-/g, " ")}
                    </span>
                  </div>
                  <div className="absolute bottom-6 left-6 right-6">
                    <div className="inline-flex bg-white/95 backdrop-blur-xl rounded-full px-4 py-2 shadow-lg">
                      <span className="text-xl font-black text-[#173f32] leading-none">
                        {comp.basePrice.toFixed(2)}€
                      </span>
                    </div>
                  </div>
                </div>
                <div className="p-6 pb-4 flex-1">
                  <h3 className="text-xl font-black text-[#173f32] mb-2 line-clamp-1 group-hover:text-orange-600 transition-colors">
                    {comp.name}
                  </h3>
                  <p className="text-zinc-500 line-clamp-2 min-h-[42px] text-sm leading-relaxed">
                    {comp.description}
                  </p>
                </div>
                <div className="p-6 pt-0 mt-auto">
                  <button className="w-full h-12 rounded-full bg-[#173f32] hover:bg-[#225943] text-white font-bold text-sm transition-colors">
                    Composer
                  </button>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {selectedComposition && (
        <CompositionSheet
          composition={{
            ...selectedComposition,
            // La grille reçoit l'image sous `image` ; le configurateur attend `imageUrl`.
            imageUrl: selectedComposition.imageUrl ?? selectedComposition.image ?? null,
            sizes: selectedComposition.sizes ?? [],
            options: selectedComposition.options ?? [],
          }}
          isOpen={!!selectedComposition}
          onClose={() => setSelectedComposition(null)}
          isMobile={isMobile}
        />
      )}
    </>
  )
}

export default function ProductGrid({ products, compositions = [], categories = [] }: ProductGridProps) {
  return (
    <ProductModalProvider>
      <ProductGridInner products={products} compositions={compositions} categories={categories} />
    </ProductModalProvider>
  )
}
