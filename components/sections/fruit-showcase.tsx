import Image from "next/image"
import Link from "next/link"

const creations = [
  { image: "tropic-rose", name: "Mangue, ananas & passion", alt: "Les mascottes mangue, ananas et passion dans l’univers POWER" },
  { image: "tropical-rose", name: "Mangue, fraise & clémentine", alt: "Les mascottes mangue, fraise et clémentine autour du mixeur POWER" },
  { image: "harmonie-rose", name: "Fraise, banane & poire", alt: "Les mascottes fraise, banane et poire autour du mixeur POWER" },
]

export default function FruitShowcase({ linkToCatalog = false }: { linkToCatalog?: boolean }) {
  const href = linkToCatalog ? "#jus-disponibles" : "/jus-soupes"
  return (
    <section aria-labelledby="power-fruits-title" className="w-full bg-[#102e25] px-5 py-14 text-white sm:px-8 sm:py-20">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
          <div>
            <p className="text-sm font-bold uppercase tracking-widest text-[#ffcd47]">Le bar à jus POWER</p>
            <h2 id="power-fruits-title" className="mt-3 text-3xl font-black leading-tight tracking-tight sm:text-5xl">Nos fruits ont du caractère.</h2>
            <p className="mt-4 max-w-xl text-base leading-relaxed text-white/75">Retrouvez l’univers de nos recettes et découvrez les jus disponibles en boutique en ligne.</p>
          </div>
          <Link href={href} className="inline-flex min-h-12 shrink-0 items-center justify-center rounded-full bg-[#ffcd47] px-6 font-bold text-[#102e25] transition-colors hover:bg-[#ffe18a]">Voir les jus & smoothies</Link>
        </div>
        <div className="flex snap-x snap-mandatory gap-5 overflow-x-auto pb-3 md:grid md:grid-cols-3 md:overflow-visible">
          {creations.map((creation) => (
            <Link key={creation.image} href={href} className="power-fruit-card group w-[82%] shrink-0 snap-start overflow-hidden rounded-3xl border border-white/15 bg-white/5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#ffcd47] sm:w-[60%] md:w-auto">
              <div className="relative aspect-[4/5] overflow-hidden">
                <Image src={`/brand/${creation.image}.webp`} alt={creation.alt} fill sizes="(min-width: 768px) 33vw, 100vw" className="power-fruit-card-image object-cover" />
              </div>
              <p className="px-5 py-5 text-lg font-bold">{creation.name}</p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
