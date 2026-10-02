export const POWER_AVATARS = [
  { key: "mangue", label: "Mangue", image: "/brand/mascot-atlas.jpg", position: "0% 0%" },
  { key: "ananas", label: "Ananas", image: "/brand/mascot-atlas.jpg", position: "25% 0%" },
  { key: "passion", label: "Fruit de la passion", image: "/brand/mascot-atlas.jpg", position: "50% 0%" },
  { key: "fraise", label: "Fraise", image: "/brand/mascot-atlas.jpg", position: "75% 0%" },
  { key: "banane", label: "Banane", image: "/brand/mascot-atlas.jpg", position: "100% 0%" },
  { key: "poire", label: "Poire", image: "/brand/mascot-atlas.jpg", position: "0% 25%" },
  { key: "clementine", label: "Clémentine", image: "/brand/mascot-atlas.jpg", position: "25% 25%" },
  { key: "citron-vert", label: "Citron vert", image: "/brand/mascot-atlas.jpg", position: "50% 25%" },
  { key: "kiwi", label: "Kiwi", image: "/brand/mascot-atlas.jpg", position: "75% 25%" },
  { key: "avocat", label: "Avocat", image: "/brand/mascot-atlas.jpg", position: "100% 25%" },
  { key: "pomme", label: "Pomme", image: "/brand/mascot-atlas.jpg", position: "0% 50%" },
  { key: "citron", label: "Citron", image: "/brand/mascot-atlas.jpg", position: "25% 50%" },
  { key: "tomate", label: "Tomate", image: "/brand/mascot-atlas.jpg", position: "50% 50%" },
  { key: "carotte", label: "Carotte", image: "/brand/mascot-atlas.jpg", position: "75% 50%" },
  { key: "aubergine", label: "Aubergine", image: "/brand/mascot-atlas.jpg", position: "100% 50%" },
  { key: "concombre", label: "Concombre", image: "/brand/mascot-atlas.jpg", position: "0% 75%" },
  { key: "courgette", label: "Courgette", image: "/brand/mascot-atlas.jpg", position: "25% 75%" },
  { key: "pomme-de-terre", label: "Pomme de terre", image: "/brand/mascot-atlas.jpg", position: "50% 75%" },
  { key: "oignon", label: "Oignon", image: "/brand/mascot-atlas.jpg", position: "75% 75%" },
  { key: "potiron", label: "Potiron", image: "/brand/mascot-atlas.jpg", position: "100% 75%" },
  { key: "raisin", label: "Raisin", image: "/brand/mascot-atlas.jpg", position: "0% 100%" },
  { key: "poivron", label: "Poivron", image: "/brand/mascot-atlas.jpg", position: "25% 100%" },
  { key: "salade", label: "Salade", image: "/brand/mascot-atlas.jpg", position: "50% 100%" },
  { key: "persil", label: "Persil", image: "/brand/mascot-atlas.jpg", position: "75% 100%" },
  { key: "framboise", label: "Framboise", image: "/brand/mascot-atlas.jpg", position: "100% 100%" },
] as const

export type PowerAvatarKey = (typeof POWER_AVATARS)[number]["key"]

export const DEFAULT_POWER_AVATAR: PowerAvatarKey = "mangue"

export function isPowerAvatarKey(value: unknown): value is PowerAvatarKey {
  return typeof value === "string" && POWER_AVATARS.some((avatar) => avatar.key === value)
}

export function powerAvatar(key?: string | null) {
  return POWER_AVATARS.find((avatar) => avatar.key === key) ?? POWER_AVATARS[0]
}

export function avatarSettingKey(userId: string) {
  return `user-avatar:${userId}`
}

const NORMALIZE = (value: string) =>
  value.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase()

const PRODUCT_MASCOT_ALIASES: Array<[string[], PowerAvatarKey]> = [
  [["ananas"], "ananas"],
  [["aubergine"], "aubergine"],
  [["avocat"], "avocat"],
  [["banane"], "banane"],
  [["carotte"], "carotte"],
  [["citron vert"], "citron-vert"],
  [["citron jaune", "citrons jaune", "citron"], "citron"],
  [["courgette"], "courgette"],
  [["fraise", "gariguette"], "fraise"],
  [["kiwi"], "kiwi"],
  [["mangue"], "mangue"],
  [["mini concombre", "concombre"], "concombre"],
  [["oignon"], "oignon"],
  [["poire"], "poire"],
  [["poivron"], "poivron"],
  [["pomme de terre"], "pomme-de-terre"],
  [["pomme gala", "pomme golden", "pommes gala", "pomme"], "pomme"],
  [["potimarron", "potiron", "butternut"], "potiron"],
  [["raisin"], "raisin"],
  [["salade", "batavia"], "salade"],
  [["tomate"], "tomate"],
  [["persil"], "persil"],
  [["orange", "clementine", "pomolo", "pomelos"], "clementine"],
]

export function avatarForProductName(name: string) {
  const normalized = NORMALIZE(name)
  const alias = PRODUCT_MASCOT_ALIASES.find(([terms]) =>
    terms.some((term) => normalized.includes(NORMALIZE(term)))
  )
  if (alias) return powerAvatar(alias[1])

  return POWER_AVATARS.find((avatar) => {
    const key = NORMALIZE(avatar.key.replaceAll("-", " "))
    const label = NORMALIZE(avatar.label)
    return normalized.includes(key) || normalized.includes(label)
  }) ?? null
}
