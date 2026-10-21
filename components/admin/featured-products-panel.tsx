"use client"
import { useEffect, useState } from "react"
import { getFeaturedProductOptions, saveFeaturedProducts } from "@/app/actions/featured-products"

export default function FeaturedProductsPanel() {
  const [products, setProducts] = useState<{ id: string; name: string; inStock: boolean }[]>([])
  const [selected, setSelected] = useState<string[]>([])
  const [ready, setReady] = useState(false)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState("")
  useEffect(() => {
    let active = true
    getFeaturedProductOptions().then(r => {
      if (!active) return
      if (!r.success) { setMessage("Accès administrateur nécessaire."); return }
      setProducts(r.products); setSelected(r.selected); setReady(true)
    }).catch(() => { if (active) setMessage("Impossible de charger la sélection.") })
    return () => { active = false }
  }, [])
  async function save() {
    setSaving(true)
    try { const r = await saveFeaturedProducts(selected); setMessage(r.success ? "Sélection enregistrée." : r.error || "Échec.") }
    catch { setMessage("Enregistrement impossible. Réessayez.") }
    finally { setSaving(false) }
  }
  return <section className="space-y-4 rounded-xl border p-5" aria-label="Produits mis en avant">
    <h2 className="text-xl font-bold">Produits mis en avant sur l’accueil</h2>
    <p>Choisissez jusqu’à 12 produits. Les produits indisponibles ne seront pas proposés à l’achat.</p>
    <div className="grid max-h-80 gap-2 overflow-y-auto sm:grid-cols-2">
      {products.map(p => <label key={p.id} className="flex min-h-11 items-center gap-3">
        <input type="checkbox" checked={selected.includes(p.id)} disabled={!ready || saving || (!selected.includes(p.id) && selected.length >= 12)}
          onChange={e => setSelected(s => e.target.checked ? [...s, p.id] : s.filter(id => id !== p.id))} />
        {p.name}{!p.inStock ? " (indisponible)" : ""}
      </label>)}
    </div>
    <button type="button" disabled={!ready || saving} onClick={save} className="rounded-lg bg-green-700 px-4 py-3 font-bold text-white disabled:opacity-50">Enregistrer la sélection</button>
    <p role="status">{message}</p>
  </section>
}
