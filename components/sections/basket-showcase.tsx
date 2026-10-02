"use client"

import { ArrowRight, Check } from "lucide-react"

const baskets = [
  { name: "Solo", price: 20, detail: "L’essentiel pour la semaine", tone: "bg-[#244f40]" },
  { name: "Duo", price: 30, detail: "Le bon format pour deux", tone: "bg-[#2f654f]" },
  { name: "Familial", price: 40, detail: "Généreux et varié", tone: "bg-[#244f40]" },
]

export default function BasketShowcase() {
  const openBaskets = () => {
    window.dispatchEvent(new CustomEvent("marketplace-tab", { detail: "comp-panier" }))
    document.getElementById("marketplace")?.scrollIntoView({ behavior: "smooth" })
  }

  return (
    <section id="paniers" className="w-full bg-[#102e25] px-5 py-20 sm:px-8 md:py-28">
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-10 lg:grid-cols-[0.8fr_1.7fr] lg:items-end">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-[#ffcd47]">Le choix facile</p>
            <h2 className="mt-3 text-4xl font-black tracking-[-0.04em] text-white sm:text-5xl">Les paniers de saison</h2>
            <p className="mt-4 max-w-md text-base leading-relaxed text-white/70">Un mélange équilibré de fruits et légumes choisi selon les arrivages. Vous pouvez retirer un produit, préciser vos préférences et ajouter un supplément.</p>
          </div>
          <div className="grid gap-4 sm:grid-cols-3">
            {baskets.map((basket) => (
              <button key={basket.name} onClick={openBaskets} className={`${basket.tone} group rounded-[28px] p-6 text-left transition duration-300 hover:-translate-y-1 hover:shadow-xl`}>
                <div className="flex items-start justify-between">
                  <span className="rounded-full bg-[#ffcd47] px-3 py-1 text-xs font-bold uppercase tracking-widest text-white">Panier</span>
                  <span className="text-3xl font-black text-white">{basket.price}€</span>
                </div>
                <h3 className="mt-12 text-3xl font-black tracking-tight text-white">{basket.name}</h3>
                <p className="mt-1 text-sm text-white/70">{basket.detail}</p>
                <span className="mt-6 inline-flex items-center gap-2 text-sm font-bold text-white">Composer <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" /></span>
              </button>
            ))}
          </div>
        </div>
        <div className="mt-6 flex flex-wrap gap-3 text-sm text-white/80">
          <span className="inline-flex items-center gap-2 rounded-full bg-white/10 border border-white/10 px-4 py-2"><Check className="h-4 w-4 text-[#ffcd47]" /> Supplément fraises +5€</span>
          <span className="inline-flex items-center gap-2 rounded-full bg-white/10 border border-white/10 px-4 py-2"><Check className="h-4 w-4 text-[#ffcd47]" /> Mélange fruits rouges +5€</span>
          <span className="inline-flex items-center gap-2 rounded-full bg-white/10 border border-white/10 px-4 py-2"><Check className="h-4 w-4 text-[#ffcd47]" /> Demande spéciale en commentaire</span>
        </div>
      </div>
    </section>
  )
}
