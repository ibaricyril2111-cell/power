"use client"

import { useEffect, useState, type ReactNode } from "react"
import { usePathname } from "next/navigation"
import Image from "next/image"
import { Pause, Play } from "lucide-react"
import "./power-universe.css"

/** Presentation only. Admin, transactions and server data are left untouched. */
export default function PowerUniverse({ children }: { children: ReactNode }) {
  const pathname = usePathname() || "/"
  const [paused, setPaused] = useState(false)
  useEffect(() => {
    try { setPaused(localStorage.getItem("power-motion") === "paused") } catch {}
  }, [])
  const excluded = pathname === "/gestion" || pathname.startsWith("/admin")
  if (excluded) return <>{children}</>
  const quiet = /^\/(commande|commandes|checkout|connexion|mon-compte|mot-de-passe)/.test(pathname)
  const mood = pathname.includes("jus") ? "sunshine" : pathname.includes("recette") || pathname.includes("decoupe") ? "harvest" : pathname.includes("panier") ? "berry" : "orchard"
  function toggleMotion() {
    const next = !paused
    setPaused(next)
    try { localStorage.setItem("power-motion", next ? "paused" : "running") } catch {}
  }
  return (
    <div className="power-universe" data-mood={mood} data-motion={paused || quiet ? "paused" : "running"}>
      <div className="power-atmosphere" aria-hidden="true">
        <div className="power-aura power-aura-one" /><div className="power-aura power-aura-two" />
        <div className="power-orbital" />
        <div className="power-scan-grid" />
        {["orange", "fraise", "carotte", "citron", "ananas", "courgette"].map((key, i) => (
          <div className={`power-floating-fruit power-floating-fruit-${i}`} key={key}>
            <Image src={`/brand/mascots/v4/${key}.webp`} alt="" width={144} height={144} sizes="(max-width: 767px) 76px, 144px" />
          </div>
        ))}
      </div>
      <div className="power-world-content">{children}</div>
      {!quiet && <button type="button" className="power-motion-toggle" onClick={toggleMotion} aria-pressed={paused} aria-label={paused ? "Activer les animations du décor" : "Mettre les animations du décor en pause"}>
        {paused ? <Play size={14} aria-hidden="true" /> : <Pause size={14} aria-hidden="true" />}<span>Décor {paused ? "figé" : "animé"}</span>
      </button>}
    </div>
  )
}
