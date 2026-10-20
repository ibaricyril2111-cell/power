import Image from "next/image"

const scenes = {
  market: { label: "Le marché POWER", line: "De la couleur dans votre quotidien.", characters: ["carotte", "fraise", "ananas"] },
  kitchen: { label: "Les envies POWER", line: "À boire. À croquer. À cuisiner.", characters: ["orange", "courgette", "citron"] },
  store: { label: "La famille POWER", line: "Votre primeur, tout simplement.", characters: ["mangue", "banane", "tomate"] },
} as const

export default function PowerPageVisual({ mood = "market" }: { mood?: keyof typeof scenes }) {
  const scene = scenes[mood]
  return <aside className="power-page-visual" aria-label={scene.label}>
    <div><p className="power-scene-label">{scene.label}</p><p className="power-scene-line">{scene.line}</p></div>
    <div className="power-scene-characters" aria-hidden="true">{scene.characters.map((key) => <div className="power-scene-character" key={key}><Image src={`/brand/mascots/v4/${key}.webp`} alt="" width={112} height={112} sizes="(max-width: 639px) 64px, 112px" /></div>)}</div>
  </aside>
}
