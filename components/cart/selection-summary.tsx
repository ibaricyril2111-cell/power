import type { describeSelection } from "@/lib/composition-pricing"

export default function SelectionSummary({ selection }: { selection?: ReturnType<typeof describeSelection> | null }) {
  if (!selection) return null
  return (
    <div className="mt-1 space-y-1 text-[10px]" data-selection-summary>
      {selection.sizeName && <p className="text-white/70">{selection.sizeName}</p>}
      <div className="flex flex-wrap gap-1">
        {selection.included.map((name, index) => <span key={`included-${index}`} className="rounded-full bg-[#ffcd47]/10 px-2 py-0.5 text-[#ffcd47]">{name}</span>)}
        {selection.extras.map((extra, index) => <span key={`extra-${index}`} className="rounded-full border border-[#ffcd47]/30 px-2 py-0.5 text-[#ffcd47]">{extra.name} +{extra.price.toFixed(2)} €</span>)}
      </div>
    </div>
  )
}
