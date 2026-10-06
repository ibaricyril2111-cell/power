import { produceNoteForName } from "@/lib/power-produce-notes"

export default function ProduceComment({ name, description, className = "" }: {
  name: string; description?: string | null; className?: string
}) {
  const note = produceNoteForName(name)
  const comment = description?.trim() || note?.comment
  if (!comment && !note) return null
  return <div className={"space-y-1 text-sm leading-relaxed " + className}>
    {comment && <p className="text-white/75">{comment}</p>}
    {note && <p className="text-xs text-[#ffcd47]">Saison : {note.season}</p>}
  </div>
}
