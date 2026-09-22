import { Bike, CalendarCheck, ShoppingBag, WalletCards } from "lucide-react"

const services = [
  { icon: ShoppingBag, title: "Click & collect", copy: "Commandez aujourd’hui, retirez demain" },
  { icon: Bike, title: "Livraison locale", copy: "À domicile dans Alfortville" },
  { icon: CalendarCheck, title: "Ultra-frais", copy: "Achats et arrivages chaque matin" },
  { icon: WalletCards, title: "Paiement simple", copy: "Sur place ou au livreur par TPE" },
]

export default function ServiceStrip() {
  return (
    <section aria-label="Les services Power" className="relative z-20 w-full bg-[#173f32] text-white">
      <div className="mx-auto grid max-w-7xl grid-cols-2 divide-x divide-y divide-white/10 md:grid-cols-4 md:divide-y-0">
        {services.map(({ icon: Icon, title, copy }) => (
          <div key={title} className="flex gap-3 px-4 py-5 sm:px-6">
            <Icon className="mt-0.5 h-5 w-5 shrink-0 text-orange-400" />
            <div>
              <p className="text-sm font-bold">{title}</p>
              <p className="mt-1 text-xs leading-snug text-white/65">{copy}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
