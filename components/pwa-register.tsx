"use client"

import { useEffect, useState } from "react"
import { Download, Share2, X } from "lucide-react"

type InstallPromptEvent = Event & {
  prompt: () => Promise<void>
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>
}

export default function PwaRegister() {
  const [installPrompt, setInstallPrompt] = useState<InstallPromptEvent | null>(null)
  const [showInstall, setShowInstall] = useState(false)
  const [showIosHelp, setShowIosHelp] = useState(false)
  const [isIos, setIsIos] = useState(false)

  useEffect(() => {
    if ("serviceWorker" in navigator && process.env.NODE_ENV === "production") {
      navigator.serviceWorker.register("/sw.js").catch((error) => {
        console.error("Service worker registration failed:", error)
      })
    }

    const standalone = window.matchMedia("(display-mode: standalone)").matches ||
      ("standalone" in navigator && Boolean((navigator as Navigator & { standalone?: boolean }).standalone))
    if (standalone) return

    const ios = /iphone|ipad|ipod/i.test(navigator.userAgent)
    const mobile = ios || /android/i.test(navigator.userAgent)
    setIsIos(ios)
    if (mobile) window.setTimeout(() => setShowInstall(true), 900)

    const onBeforeInstall = (event: Event) => {
      event.preventDefault()
      setInstallPrompt(event as InstallPromptEvent)
      setShowInstall(true)
    }
    const onInstalled = () => setShowInstall(false)
    window.addEventListener("beforeinstallprompt", onBeforeInstall)
    window.addEventListener("appinstalled", onInstalled)
    return () => {
      window.removeEventListener("beforeinstallprompt", onBeforeInstall)
      window.removeEventListener("appinstalled", onInstalled)
    }
  }, [])

  const install = async () => {
    if (installPrompt) {
      await installPrompt.prompt()
      const choice = await installPrompt.userChoice
      if (choice.outcome === "accepted") setShowInstall(false)
      return
    }
    setShowIosHelp(true)
  }

  if (!showInstall) return null

  return (
    <aside className="fixed inset-x-3 bottom-3 z-[100] mx-auto max-w-md rounded-3xl border border-orange-500/40 bg-zinc-950/95 p-4 text-white shadow-2xl backdrop-blur-xl" aria-label="Installer l'application Power">
      <button onClick={() => setShowInstall(false)} className="absolute right-3 top-3 rounded-full p-2 text-zinc-400 hover:bg-white/10 hover:text-white" aria-label="Fermer">
        <X className="h-4 w-4" />
      </button>
      <div className="pr-9">
        <p className="font-black uppercase italic tracking-tight">Installez Power sur votre téléphone</p>
        <p className="mt-1 text-sm text-zinc-400">Commandez plus vite, comme avec une vraie application.</p>
      </div>
      {showIosHelp && isIos ? (
        <div className="mt-4 rounded-2xl bg-white/5 p-3 text-sm text-zinc-200">
          <p className="flex items-center gap-2"><Share2 className="h-4 w-4 text-orange-500" /> Appuyez sur <strong>Partager</strong></p>
          <p className="mt-2">Puis choisissez <strong>Sur l’écran d’accueil</strong> et <strong>Ajouter</strong>.</p>
        </div>
      ) : (
        <button onClick={install} className="mt-4 flex h-12 w-full items-center justify-center gap-2 rounded-2xl bg-orange-500 font-bold text-white hover:bg-orange-600">
          <Download className="h-5 w-5" /> Installer l’application Power
        </button>
      )}
    </aside>
  )
}
