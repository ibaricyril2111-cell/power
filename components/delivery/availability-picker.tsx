"use client"
import { useState } from "react"
import Link from "next/link"
import DeliveryCalendar from "./delivery-calendar"

export default function AvailabilityPicker() {
  const [mode, setMode] = useState<"livraison" | "retrait">("livraison")
  const [selected, setSelected] = useState<{date:string;time:string;dateISO:string;slotId?:string}|null>(null)
  return <section aria-label="Créneaux disponibles" className="my-10 min-w-0 space-y-4">
    <h2 className="text-2xl font-black sm:text-3xl">Les créneaux disponibles</h2>
    <div className="flex flex-wrap gap-3">
      {([['livraison','Livraison'],['retrait','Retrait en magasin']] as const).map(([value,label]) =>
        <button key={value} type="button" aria-pressed={mode === value} onClick={() => {setMode(value);setSelected(null)}}
          className={`min-h-11 rounded-xl border px-4 py-3 font-bold ${mode === value ? 'border-[#ffcd47] bg-[#ffcd47] text-[#073b2d]' : 'border-white/30 text-white'}`}>{label}</button>)}
    </div>
    <DeliveryCalendar key={mode} mode={mode} selectedDelivery={selected} onSelectDelivery={setSelected} />
    {selected && <Link className="inline-flex min-h-11 items-center justify-center rounded-xl bg-[#ffcd47] px-5 py-3 text-center font-bold text-[#073b2d]"
      href={`/commande?mode=${mode}&date=${selected.dateISO}&slot=${encodeURIComponent(selected.slotId || '')}`}>
      Continuer avec ce créneau
    </Link>}
  </section>
}
