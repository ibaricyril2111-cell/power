import { prisma } from "@/lib/db"
import { notFound } from "next/navigation"
import Header from "@/components/layout/header"
import Footer from "@/components/layout/footer"
import ProductMascotImage from "@/components/product/product-mascot-image"
import { Leaf, ArrowLeft, ShieldCheck, Truck, Star } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import ProductPurchase from "@/components/product/product-purchase"
import ProduceComment from "@/components/product/produce-comment"
import { avatarForProductName } from "@/lib/power-avatars"
import type { Metadata } from "next"
import { productImage } from "@/lib/product-image"

export const dynamic = 'force-dynamic'

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
    const { id } = await params
    const product = await prisma.product.findUnique({ where: { id }, include: { category: true } })
    if (!product) return { title: 'Produit introuvable' }
    const description = product.description || `${product.name} frais disponible chez Power Primeur à Alfortville, en livraison ou click & collect.`
    return {
        title: `${product.name} frais`,
        description,
        alternates: { canonical: `/produits/${id}` },
        openGraph: { title: `${product.name} — Power Primeur`, description, url: `/produits/${id}`, images: [avatarForProductName(product.name)?.image ?? productImage(product.name, product.image)] },
    }
}

export default async function ProductDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params
    const product = await prisma.product.findUnique({
        where: { id },
        include: { category: true }
    })

    if (!product) {
        notFound()
    }

    const productJsonLd = {
        '@context': 'https://schema.org',
        '@type': 'Product',
        name: product.name,
        description: product.description || `${product.name} frais chez Power Primeur Alfortville`,
        image: [new URL(avatarForProductName(product.name)?.image ?? productImage(product.name, product.image), 'https://powerprimeur.com').toString()],
        category: product.category.name,
        offers: {
            '@type': 'Offer',
            url: `https://powerprimeur.com/produits/${product.id}`,
            priceCurrency: 'EUR',
            price: (product.promoPrice ?? product.price).toFixed(2),
            availability: product.inStock && product.currentStock > 0 ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock',
            seller: { '@type': 'Organization', name: 'Power Primeur' },
        },
    }

    return (
        <div className="min-h-screen bg-[#073b2d] text-white">
            <Header />
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(productJsonLd) }} />
            <main className="max-w-7xl mx-auto px-4 pt-44 pb-32">
                <Link href="/produits" className="inline-flex items-center gap-2 text-white/70 hover:text-[#ffcd47] font-black uppercase italic tracking-widest text-xs mb-12 group transition-all">
                    <ArrowLeft className="w-4 h-4 group-hover:-translate-x-2 transition-transform" />
                    <span>Retour au catalogue</span>
                </Link>

                <div className="grid grid-cols-1 lg:grid-cols-2 items-start gap-8 lg:gap-14">
                    {/* Image Section */}
                    <div className="relative mx-auto aspect-square w-full max-w-[280px] rounded-[24px] overflow-hidden bg-[#0b4938] border border-white/15 shadow-2xl group">
                        <ProductMascotImage
                            name={product.name}
                            alt={product.name}
                            sizes="280px"
                        />
                        {product.organic && (
                            <div className="absolute top-10 left-10 bg-[#ffcd47]/90 backdrop-blur-2xl text-white px-6 py-3 rounded-full flex items-center gap-3 font-black uppercase italic tracking-widest text-sm shadow-2xl">
                                <Leaf className="w-5 h-5" /> <span>Produit bio</span>
                            </div>
                        )}
                        <div className="absolute bottom-10 right-10 bg-black/60 backdrop-blur-2xl px-6 py-4 rounded-3xl border border-white/10 flex items-center gap-2">
                            <Star className="w-5 h-5 text-[#ffcd47] fill-[#ffcd47]" />
                            <span className="font-black italic text-xl">Sélection POWER</span>
                        </div>
                    </div>

                    {/* Info Section */}
                    <div className="flex flex-col justify-center">
                        <div className="mb-12">
                            <span className="text-[#ffcd47] font-black uppercase tracking-[0.4em] text-xs mb-6 block">{product.category.name}</span>
                            <h1 className="text-4xl sm:text-5xl font-black tracking-tight leading-tight mb-6">
                                {product.name}
                            </h1>
                            <div className="flex items-baseline gap-6 mb-10">
                                {product.promoPrice != null && <span className="text-3xl font-black text-white/70 italic line-through">{product.price.toFixed(2)}€</span>}
                                <span className="text-5xl font-black text-white italic">{(product.promoPrice ?? product.price).toFixed(2)}€</span>
                                <span className="text-2xl text-white/60 font-black uppercase italic opacity-50 tracking-tighter">/ {product.unit}</span>
                            </div>
                            <ProduceComment name={product.name} description={product.description} className="mb-12 max-w-xl" />
                        </div>

                        <div className="flex flex-col gap-10">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="glassmorphism bg-white/5 p-8 rounded-[32px] border border-white/5 flex flex-col gap-3 group hover:border-[#ffcd47]/30 transition-all">
                                    <div className="w-12 h-12 rounded-2xl bg-[#ffcd47]/10 flex items-center justify-center">
                                        <Truck className="w-6 h-6 text-[#ffcd47]" />
                                    </div>
                                    <span className="font-black uppercase italic text-sm tracking-widest text-white">Livraison locale</span>
                                    <span className="text-xs text-white/70 font-medium leading-relaxed">Livraison selon votre commune et le créneau disponible.</span>
                                </div>
                                <div className="glassmorphism bg-white/5 p-8 rounded-[32px] border border-white/5 flex flex-col gap-3 group hover:border-[#ffcd47]/30 transition-all">
                                    <div className="w-12 h-12 rounded-2xl bg-[#ffcd47]/10 flex items-center justify-center">
                                        <ShieldCheck className="w-6 h-6 text-[#ffcd47]" />
                                    </div>
                                    <span className="font-black uppercase italic text-sm tracking-widest text-white">Préparation soignée</span>
                                    <span className="text-xs text-white/70 font-medium leading-relaxed">Votre commande est préparée avec attention avant le retrait ou la livraison.</span>
                                </div>
                            </div>

                            <ProductPurchase product={product} />
                        </div>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    )
}
