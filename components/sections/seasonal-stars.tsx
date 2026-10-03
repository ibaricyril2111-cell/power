import Link from "next/link"
import { prisma } from "@/lib/db"
import { avatarForProductName } from "@/lib/power-avatars"
import ProductMascotImage from "@/components/product/product-mascot-image"

type Season = {
  key: "hiver" | "printemps" | "ete" | "automne"
  label: string
  eyebrow: string
  terms: string[]
  emoji: string
}

function currentSeason(month: number): Season {
  if ([11, 0, 1].includes(month)) {
    return { key: "hiver", label: "Hiver POWER", eyebrow: "Les stars de l’hiver", emoji: "❄️", terms: ["pomme", "poire", "orange", "clementine", "citron", "kiwi", "carotte", "poireau", "navet", "chou", "courge", "potimarron"] }
  }
  if ([2, 3, 4].includes(month)) {
    return { key: "printemps", label: "Printemps POWER", eyebrow: "Les stars du printemps", emoji: "🌱", terms: ["fraise", "asperge", "radis", "carotte", "salade", "epinard", "petit pois", "rhubarbe"] }
  }
  if ([5, 6, 7].includes(month)) {
    return { key: "ete", label: "Été POWER", eyebrow: "Les stars de l’été", emoji: "☀️", terms: ["fraise", "tomate", "melon", "pasteque", "peche", "nectarine", "abricot", "courgette", "aubergine", "poivron", "concombre"] }
  }
  return { key: "automne", label: "Automne POWER", eyebrow: "Les stars du moment", emoji: "🍂", terms: ["pomme", "poire", "raisin", "potimarron", "potiron", "courge", "carotte", "patate douce", "betterave", "poireau", "champignon"] }
}

const normalize = (value: string) =>
  value.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase()

export default async function SeasonalStars() {
  const season = currentSeason(new Date().getMonth())
  const products = await prisma.product.findMany({
    where: { inStock: true, currentStock: { gt: 0 } },
    include: { category: true },
    orderBy: { name: "asc" },
  })

  const seenMascots = new Set<string>()
  const ranked = products
    .map((product) => {
      const name = normalize(product.name)
      const rank = season.terms.findIndex((term) => name.includes(normalize(term)))
      const mascot = avatarForProductName(product.name)
      return { product, rank, mascot }
    })
    .filter(({ rank, mascot }) => rank >= 0 && mascot)
    .sort((a, b) => a.rank - b.rank)
    .filter(({ mascot }) => {
      if (!mascot || seenMascots.has(mascot.key)) return false
      seenMascots.add(mascot.key)
      return true
    })
    .slice(0, 6)

  if (ranked.length === 0) return null

  return (
    <section id="saison" className="w-full bg-[#0b4938] px-5 py-16 text-white sm:px-8 md:py-24">
      <div className="mx-auto max-w-7xl">
        <div className="overflow-hidden rounded-[36px] border border-white/10 bg-[#073b2d] shadow-2xl">
          <div className="relative border-b border-white/10 px-6 py-8 sm:px-9">
            <div className="absolute right-5 top-4 text-5xl opacity-90" aria-hidden="true">{season.emoji}</div>
            <p className="text-xs font-black uppercase tracking-[0.22em] text-[#ffcd47]">La bande POWER de saison</p>
            <h2 className="mt-2 max-w-3xl text-3xl font-black tracking-tight sm:text-5xl">{season.label}</h2>
            <p className="mt-3 max-w-2xl text-sm leading-relaxed text-white/70 sm:text-base">
              Repère les personnages étoilés : ce sont nos produits de saison disponibles en boutique. Touche ton préféré pour le retrouver au vrai prix du jour.
            </p>
          </div>

          <div className="px-5 py-7 sm:px-8 sm:py-9">
            <div className="mb-5 flex items-center justify-between gap-4">
              <h3 className="text-xl font-black sm:text-2xl">⭐ {season.eyebrow}</h3>
              <Link href="/produits" className="text-xs font-bold text-[#ffcd47] underline underline-offset-4 sm:text-sm">Voir tout le marché</Link>
            </div>

            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
              {ranked.map(({ product, mascot }) => {
                if (!mascot) return null
                return (
                  <Link
                    key={product.id}
                    href={`/produits/${product.id}`}
                    className="group overflow-hidden rounded-[24px] border border-white/10 bg-[#0b4938] p-3 transition hover:-translate-y-1 hover:border-[#ffcd47]/70"
                  >
                    <div className="relative aspect-square overflow-hidden rounded-[19px] bg-[#244f40]">
<div
                        role="img"
                        aria-label={`Personnage POWER ${product.name}`}
                        className="absolute inset-0 transition-transform duration-300 group-hover:scale-105"
                        style={{
                          backgroundImage: `url("${mascot.image}")`,
                          backgroundSize: "500%",
                          backgroundPosition: mascot.position,
                          backgroundRepeat: "no-repeat",
                        }}
                      />
                      <span className="absolute right-2 top-2 flex h-7 w-7 items-center justify-center rounded-full bg-[#ffcd47] text-sm shadow-lg">⭐</span>
                    </div>
                    <p className="mt-3 truncate text-sm font-black">{product.name}</p>
                    <p className="mt-1 text-sm font-black text-[#ffcd47]">
                      {(product.promoPrice ?? product.price).toFixed(2)}€ <span className="text-[10px] font-semibold text-white/55">/ {product.unit}</span>
                    </p>
                  </Link>
                )
              })}
            </div>

            <div className="mt-7 flex flex-col items-start justify-between gap-4 rounded-[24px] border border-[#ffcd47]/20 bg-[#ffcd47]/10 px-5 py-4 sm:flex-row sm:items-center">
              <div>
                <p className="font-black text-[#ffcd47]">⭐ Qui est de saison ?</p>
                <p className="mt-1 text-sm text-white/70">L’étoile POWER aide petits et grands à repérer les produits du moment.</p>
              </div>
              <Link href="/produits" className="inline-flex min-h-11 items-center justify-center rounded-full bg-[#ffcd47] px-5 text-sm font-black text-[#102e25] transition hover:bg-[#ffe18a]">
                Faire mes courses
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
