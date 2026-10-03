"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"

export default function CookieConsent() {
  const [showBanner, setShowBanner] = useState(false)

  useEffect(() => {
    const consent = localStorage.getItem("cookie-consent")
    if (!consent) {
      setShowBanner(true)
    }
  }, [])

  const acceptAll = () => {
    localStorage.setItem("cookie-consent", "all")
    setShowBanner(false)
    window.dispatchEvent(new Event("cookie-consent-update"))
  }

  const acceptEssential = () => {
    localStorage.setItem("cookie-consent", "essential")
    setShowBanner(false)
    window.dispatchEvent(new Event("cookie-consent-update"))
  }

  if (!showBanner) return null

  return (
    <div className="fixed bottom-16 left-0 right-0 z-[100] p-3 md:bottom-0 md:p-4">
      <div className="max-w-4xl mx-auto bg-[#052e23]/95 border border-[#ffcd47]/25 rounded-2xl p-5 backdrop-blur-xl shadow-2xl">
        <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
          <div className="flex-1">
            <h3 className="font-bold text-white mb-1">Cookies & Confidentialité</h3>
            <p className="text-sm text-white/70">
              Nous utilisons des cookies pour améliorer votre expérience. Les cookies essentiels sont nécessaires au fonctionnement du site.
              Les cookies analytiques nous aident à comprendre comment vous utilisez notre site.
            </p>
          </div>
          <div className="flex gap-2 shrink-0">
            <Button
              variant="outline"
              onClick={acceptEssential}
              className="border-white/20 text-white/75 hover:text-white bg-transparent rounded-xl"
            >
              Essentiels uniquement
            </Button>
            <Button
              onClick={acceptAll}
              className="bg-[#ffcd47] hover:bg-[#ffe18a] text-[#073b2d] font-black rounded-xl"
            >
              Tout accepter
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
