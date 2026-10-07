import { produceNoteForName } from "@/lib/power-produce-notes"
import { normalizeMascotName } from "@/lib/power-avatars"

export default function ProduceComment({ name, description, className = "" }: {
  name: string; description?: string | null; className?: string
}) {
  const note = produceNoteForName(name)
  const provided = description?.trim()
  // Ne pas répéter le titre ou le texte automatique d'import en guise de descriptif.
  // Les vrais descriptifs du magasin restent prioritaires, sans modifier la base.
  const normalized = normalizeMascotName(provided || "")
  const placeholder = normalized === normalizeMascotName(name)
    || normalized === normalizeMascotName(`${name} sélectionné par Power Primeur à Alfortville`)
  const comment = note && (!provided || placeholder) ? note.comment : provided
  if (!comment && !note) return null
  return <div className={"space-y-1 text-sm leading-relaxed " + className}>
    {comment && <p className="text-white/75">{comment}</p>}
    {note && <p className="text-xs text-[#ffcd47]">Saison : {note.season}</p>}
  </div>
}
