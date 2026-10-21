"use client"

import { Fragment, useState, useMemo, useEffect } from "react"
import { Search } from "lucide-react"
import ProductCard from "./product-card"
import ProductCardMobile from "./product-card-mobile"
import CompositionMobileItem from "./composition-mobile-item"
import CompositionSheet from "./composition-sheet"
import { ProductModalProvider, useProductModal } from "./product-modal-context"
import CompositionArtwork from "./composition-artwork"
import { isDrinkRecipe } from "@/lib/drink-ordering"
import ProductPrice from "./product-price"
import { readMarketplaceTab } from "@/lib/marketplace-navigation"
import ProductFamilyCard from "./product-family-card"
import { PRODUCT_FAMILIES, productFamilyKey, type ProductFamilyKey } from "@/lib/product-families"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"

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
  featuredIds?: string[]
}

const COMPOSITION_LABELS: Record<string, string> = {
  soupe: "Soupes", "legumes decoupes": "Légumes découpés", jus: "Jus", panier: "Paniers",
  "power bowl": "Power bowls", "fruits decoupes": "Fruits découpés", smoothie: "Smoothies", salade: "Salades",
}
const compositionLabel = (type: string) => COMPOSITION_LABELS[type.toLowerCase().replace(/-/g, " ")] ?? type.replace(/-/g, " ")

function ProductGridInner({ products, compositions = [], categories = [], featuredIds = [] }: ProductGridProps) {
  const { openProductModal } = useProductModal()
  const [activeTab, setActiveTab] = useState("tout")
  const [search, setSearch] = useState("")
  const [selectedComposition, setSelectedComposition] = useState<Composition | null>(null)
  const [selectedFamily, setSelectedFamily] = useState<ProductFamilyKey | null>(null)
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 767px)")
    setIsMobile(mq.matches)
    const handler = (e: MediaQueryListEvent) => setIsMobile(e.matches)
    mq.addEventListener("change", handler)
    return () => mq.removeEventListener("change", handler)
  }, [])

  useEffect(() => {
    setActiveTab(readMarketplaceTab(window.location.search))
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
      const label = compositionLabel(type)
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
  const compactFamilies = activeTab === "tout" && !search.trim()
  const families = useMemo(() => {
    const buckets = new Map<ProductFamilyKey, Product[]>()
    for (const product of filtered.products) {
      const key = productFamilyKey(product)
      if (key) { const entries = buckets.get(key) ?? []; entries.push(product); buckets.set(key, entries) }
    }
    return PRODUCT_FAMILIES.map(family => ({ ...family, products: buckets.get(family.key) ?? [] })).filter(family => family.products.length > 1)
  }, [filtered.products])
  const groupedIds = new Set(compactFamilies ? families.flatMap(family => family.products.map(product => product.id)) : [])
  const family = families.find(family => family.key === selectedFamily)
  const standalone = filtered.products.filter(product => !groupedIds.has(product.id))
  const groups: { key: string; label: string; products: Product[]; compositions: Composition[] }[] = []
  const featured = activeTab === "tout" && !search.trim()
    ? featuredIds.flatMap(id => filtered.products.filter(p => p.id === id && p.inStock)) : []
  if (featured.length) groups.push({ key: "featured", label: "À la une", products: featured, compositions: [] })
  for (const category of new Set(standalone.filter(p => !featured.includes(p)).map(p => p.category))) {
    groups.push({ key: "product-" + category, label: category, products: standalone.filter(p => p.category === category && !featured.includes(p)), compositions: [] })
  }
  for (const type of new Set(filtered.compositions.map(c => c.type))) {
    groups.push({ key: "composition-" + type, label: compositionLabel(type), products: [], compositions: filtered.compositions.filter(c => c.type === type) })
  }

  const familyGrid = compactFamilies && families.length > 0 ? <section aria-label="Les familles POWER">
    <h3 className="mb-4 text-2xl font-black text-white">À découvrir par famille</h3>
    <div className="grid grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-4">
      {families.map(family => <ProductFamilyCard key={family.key} family={family} count={family.products.length} onOpen={() => setSelectedFamily(family.key)} />)}
    </div>
  </section> : null

  return (
    <>
      {/* Search + Tabs centré */}
      <div className="mb-10 flex flex-col gap-5">
        <div className="relative w-full max-w-xl">
          <Search className="absolute left-5 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
          <input
            type="text"
            aria-label="Rechercher dans les produits"
            placeholder="Rechercher un produit..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-12 pr-4 py-4 bg-[#173f32] border border-white/15 rounded-2xl text-white placeholder:text-zinc-400 shadow-sm focus:outline-none focus:border-[#ffcd47] focus:ring-4 focus:ring-[#ffcd47]/10 transition text-sm"
          />
        </div>

        <div className="flex flex-wrap gap-2 pb-2" aria-label="Filtrer les produits par catégorie">
          {visibleTabs.map((tab) => (
            <button
              key={tab.id}
              type="button"
              aria-pressed={activeTab === tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-shrink-0 px-4 py-2 rounded-full text-xs font-bold uppercase tracking-widest transition-all ${
                activeTab === tab.id
                  ? "bg-[#ffcd47] text-[#073b2d] shadow-md"
                  : "bg-[#173f32] text-white border border-white/15 hover:border-[#173f32]/40"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {totalItems === 0 ? (
        <div className="text-center py-20">
          <p className="text-white/65 italic font-medium">Aucun produit trouvé.</p>
        </div>
      ) : (
        <div className="space-y-10">
          {!featured.length && familyGrid}
          {groups.map(group => <Fragment key={group.key}><section aria-label={group.label}>
          <h3 className="mb-4 text-2xl font-black capitalize text-white">{group.label}</h3>
          {/* Mobile */}
          <div className="sm:hidden grid grid-cols-2 gap-3">
            {group.products.map((product) => (
              <ProductCardMobile
                key={product.id}
                product={product}
                onViewDetails={() => openProductModal(product)}
              />
            ))}
            {group.compositions.map((comp) => (
              <CompositionMobileItem
                key={comp.id}
                composition={{
                  id: comp.id,
                  type: comp.type,
                  name: comp.name,
                  basePrice: comp.basePrice,
                  imageUrl: comp.image,
                  description: comp.description,
                  options: comp.options,
                }}
                onCompose={() => setSelectedComposition(comp)}
              />
            ))}
          </div>

          {/* Desktop */}
          <div className="hidden sm:grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {group.products.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onViewDetails={() => openProductModal(product)}
              />
            ))}
            {group.compositions.map((comp) => (
              <div
                key={comp.id}
                className="group bg-[#0b4938] border border-white/15 rounded-[28px] overflow-hidden hover:-translate-y-1 hover:shadow-xl transition-all duration-300 h-full flex flex-col cursor-pointer"
                onClick={() => setSelectedComposition(comp)}
              >
                <div className="relative aspect-square overflow-hidden bg-zinc-800">
                  <CompositionArtwork composition={{...comp, imageUrl:comp.imageUrl ?? comp.image}} sizes="(max-width: 768px) 100vw, 300px" />
                </div>
                <div className="p-6 pb-4 flex-1">
                  <h3 className="text-xl font-black text-[#ffcd47] mb-2 line-clamp-1 group-hover:text-[#ffcd47] transition-colors">
                    {comp.name}
                  </h3>
                  <p className="text-white/65 line-clamp-2 min-h-[42px] text-sm leading-relaxed">
                    {comp.description}
                  </p>
                  <ProductPrice price={comp.basePrice} from />
                </div>
                <div className="p-6 pt-0 mt-auto">
                  <button className="flex min-w-0 w-full min-h-12 h-auto flex-wrap items-center justify-center whitespace-normal px-2 py-3 rounded-xl bg-[#ffcd47] hover:bg-[#ffe18a] text-[#073b2d] font-bold text-sm transition-colors">
                    {isDrinkRecipe(comp) ? "Commander" : "Composer"}
                  </button>
                </div>
              </div>
            ))}
          </div>
          </section>{group.key === "featured" && familyGrid}</Fragment>)}
        </div>
      )}

      <Dialog open={!!family} onOpenChange={open => { if (!open) setSelectedFamily(null) }}>
        <DialogContent className="max-w-5xl rounded-3xl border-white/20 bg-[#073b2d] p-4 text-white sm:p-6">
          <DialogHeader className="pr-7">
            <DialogTitle className="text-2xl font-black">{family?.title}</DialogTitle>
            <DialogDescription className="text-emerald-50/80">Choisissez vos produits et ajoutez-les directement au panier. Prix et disponibilités selon les arrivages.</DialogDescription>
          </DialogHeader>
          <div className="grid min-w-0 grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {family?.products.map(product => <ProductCard key={product.id} product={product} onViewDetails={() => { setSelectedFamily(null); openProductModal(product) }} />)}
          </div>
        </DialogContent>
      </Dialog>

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

export default function ProductGrid({ products, compositions = [], categories = [], featuredIds = [] }: ProductGridProps) {
  return (
    <ProductModalProvider>
      <ProductGridInner products={products} compositions={compositions} categories={categories} featuredIds={featuredIds} />
    </ProductModalProvider>
  )
}
