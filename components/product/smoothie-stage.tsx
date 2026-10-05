"use client"
import { AnimatePresence, motion, useReducedMotion } from "framer-motion"
import { CupSoda } from "lucide-react"
import MascotPortrait from "@/components/product/mascot-portrait"
import { avatarForProductName } from "@/lib/power-avatars"
export default function SmoothieStage({ ingredients }: { ingredients: readonly { id: string; name: string }[] }) {
  const reducedMotion = useReducedMotion()
  return (
    <div className="absolute inset-0 flex flex-col items-center justify-between overflow-hidden bg-gradient-to-b from-[#17604a] to-[#073b2d] px-4 pb-3 pt-3"
      data-smoothie-stage>
      <p className="text-xs font-black uppercase tracking-widest text-[#ffcd47]">Ta création POWER</p>
      <div className="relative flex min-h-0 w-[220px] flex-1 items-end justify-center" aria-label="Mixeur POWER">
        <svg viewBox="0 0 220 240" className="absolute inset-0 h-full w-full" aria-hidden="true">
          <defs><linearGradient id="power-jar" x1="0" y1="0" x2="1" y2="1">
            <stop stopColor="#ffffff" stopOpacity=".2" /><stop offset="1" stopColor="#ffcd47" stopOpacity=".08" />
          </linearGradient></defs>
          <path d="M48 28h126l-14 151H63Z" fill="url(#power-jar)" stroke="#cce4d8" strokeWidth="4" />
          <path d="M173 46h15q23 0 19 28l-8 51q-3 18-33 18" fill="none" stroke="#cce4d8" strokeWidth="7" />
          <rect x="43" y="17" width="138" height="15" rx="7" fill="#ffcd47" />
          <path d="M63 182h97l16 38q3 13-12 13H56q-15 0-12-13Z" fill="#ffcd47" />
          <circle cx="110" cy="210" r="13" fill="#073b2d" />
          <path d="M110 203v8" stroke="#ffcd47" strokeWidth="2" strokeLinecap="round" />
          <text x="110" y="173" textAnchor="middle" fontSize="10" fontWeight="900" fill="#ffcd47">POWER</text>
        </svg>
        <div className="absolute left-[23%] right-[23%] top-[19%] bottom-[29%] flex content-center items-center justify-center gap-1 overflow-y-auto py-1"
          style={{ flexWrap: "wrap" }} data-smoothie-ingredients>
          <AnimatePresence initial={false}>
            {ingredients.map((ingredient) => {
              const mascot = avatarForProductName(ingredient.name)
              return (
                <motion.div key={ingredient.id} data-selected-ingredient={ingredient.id}
                  initial={reducedMotion ? false : { opacity: 0, y: -24, scale: .65 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={reducedMotion ? { opacity: 0 } : { opacity: 0, y: 12, scale: .65 }}
                  transition={{ duration: reducedMotion ? 0 : .25 }}
                  className="w-12 shrink-0 overflow-hidden rounded-xl border border-[#ffcd47]/40 shadow-lg">
                  {mascot ? <MascotPortrait mascotKey={mascot.key} className="w-12" /> : (
                    <span className="flex h-12 w-12 items-center justify-center bg-[#0b4938]" role="img" aria-label={ingredient.name}>
                      <CupSoda className="h-6 w-6 text-[#ffcd47]" aria-hidden="true" />
                    </span>
                  )}
                </motion.div>
              )
            })}
          </AnimatePresence>
          {ingredients.length === 0 && <span className="text-center text-[11px] font-bold leading-relaxed text-white/75">Choisis tes fruits<br />pour remplir le mixeur</span>}
        </div>
      </div>
      <p role="status" aria-live="polite" aria-atomic="true" className="w-full truncate text-center text-xs text-white/85">
        {ingredients.length > 0 ? ingredients.map((item) => item.name).join(" · ") : "Clique sur un personnage : il apparaît ici."}
      </p>
    </div>
  )
}
