"use client"
import { Check, CupSoda, LockKeyhole } from "lucide-react"
import { avatarForProductName } from "@/lib/power-avatars"
import MascotPortrait from "@/components/product/mascot-portrait"
export default function IngredientChoice({ name, active, locked = false, priceLabel, onClick }: {
  name: string
  active: boolean
  locked?: boolean
  priceLabel?: string
  onClick: () => void
}) {
  const mascot = avatarForProductName(name)
  return (
    <button type="button" onClick={onClick} disabled={locked} aria-pressed={active} aria-label={name}
      className={"relative flex min-w-0 flex-col items-center gap-1.5 rounded-2xl border p-2 text-center transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#ffcd47] "
        + (active ? "border-[#ffcd47] bg-[#ffcd47]/15 text-[#ffe18a]" : "border-white/20 bg-white/5 text-white hover:border-[#ffcd47]/70")
        + (locked ? " cursor-not-allowed opacity-75" : "")}>
      {mascot ? <MascotPortrait mascotKey={mascot.key} decorative className="w-full max-w-[76px]" /> : (
        <span className="flex aspect-square w-full max-w-[76px] items-center justify-center rounded-2xl bg-[#0b4938]">
          <CupSoda className="h-7 w-7 text-[#ffcd47]" aria-hidden="true" />
        </span>
      )}
      <span className="min-h-7 text-xs font-bold leading-tight">{name}</span>
      {priceLabel && <span className="text-[10px] font-semibold text-[#ffcd47]">{priceLabel}</span>}
      {active && <span className="absolute right-1 top-1 rounded-full bg-[#ffcd47] p-1 text-[#073b2d]">
        {locked ? <LockKeyhole className="h-3 w-3" aria-hidden="true" /> : <Check className="h-3 w-3" aria-hidden="true" />}
      </span>}
    </button>
  )
}
