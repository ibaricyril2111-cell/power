/** Existing POWER artwork extracted from the original files, never from the 120px preview atlas. */
export const POWER_AVATARS = [
  { key: "mangue", label: "Mangue", image: "/brand/mascots/v2/mangue.webp", position: "50% 50%" },
  { key: "ananas", label: "Ananas", image: "/brand/mascots/v2/ananas.webp", position: "50% 50%" },
  { key: "passion", label: "Fruit de la passion", image: "/brand/mascots/v2/passion.webp", position: "50% 50%" },
  { key: "fraise", label: "Fraise", image: "/brand/mascots/v2/fraise.webp", position: "50% 50%" },
  { key: "banane", label: "Banane", image: "/brand/mascots/v2/banane.webp", position: "50% 50%" },
  { key: "poire", label: "Poire", image: "/brand/mascots/v2/poire.webp", position: "50% 50%" },
  { key: "clementine", label: "Clémentine", image: "/brand/mascots/v2/clementine.webp", position: "50% 50%" },
  { key: "citron-vert", label: "Citron vert", image: "/brand/mascots/v2/citron-vert.webp", position: "50% 50%" },
  { key: "kiwi", label: "Kiwi", image: "/brand/mascots/v2/kiwi.webp", position: "50% 50%" },
  { key: "avocat", label: "Avocat", image: "/brand/mascots/v2/avocat.webp", position: "50% 50%" },
  { key: "pomme", label: "Pomme", image: "/brand/mascots/v2/pomme.webp", position: "50% 50%" },
  { key: "citron", label: "Citron", image: "/brand/mascots/v2/citron.webp", position: "50% 50%" },
  { key: "tomate", label: "Tomate", image: "/brand/mascots/v2/tomate.webp", position: "50% 50%" },
  { key: "carotte", label: "Carotte", image: "/brand/mascots/v2/carotte.webp", position: "50% 50%" },
  { key: "aubergine", label: "Aubergine", image: "/brand/mascots/v2/aubergine.webp", position: "50% 50%" },
  { key: "concombre", label: "Concombre", image: "/brand/mascots/v2/concombre.webp", position: "50% 50%" },
  { key: "courgette", label: "Courgette", image: "/brand/mascots/v2/courgette.webp", position: "50% 50%" },
  { key: "pomme-de-terre", label: "Pomme de terre", image: "/brand/mascots/v2/pomme-de-terre.webp", position: "50% 50%" },
  { key: "oignon", label: "Oignon", image: "/brand/mascots/v2/oignon.webp", position: "50% 50%" },
  { key: "potiron", label: "Potiron", image: "/brand/mascots/v2/potiron.webp", position: "50% 50%" },
  { key: "raisin", label: "Raisin", image: "/brand/mascots/v2/raisin.webp", position: "50% 50%" },
  { key: "poivron", label: "Poivron", image: "/brand/mascots/v2/poivron.webp", position: "50% 50%" },
  { key: "salade", label: "Salade", image: "/brand/mascots/v2/salade.webp", position: "50% 50%" },
  { key: "persil", label: "Persil", image: "/brand/mascots/v2/persil.webp", position: "50% 50%" },
  { key: "framboise", label: "Framboise", image: "/brand/mascots/v2/framboise.webp", position: "50% 50%" },
] as const

export type PowerAvatarKey = (typeof POWER_AVATARS)[number]["key"]
export const DEFAULT_POWER_AVATAR: PowerAvatarKey = "mangue"

export function isPowerAvatarKey(value: unknown): value is PowerAvatarKey {
  return typeof value === "string" && POWER_AVATARS.some((avatar) => avatar.key === value)
}

/** Default is ONLY for a user avatar. It must never be used to identify a product. */
export function powerAvatar(key?: string | null) {
  return POWER_AVATARS.find((avatar) => avatar.key === key) ?? POWER_AVATARS[0]
}

export function avatarSettingKey(userId: string) {
  return `user-avatar:${userId}`
}

const normalize = (value: string) => value
  .normalize("NFD")
  .replace(/[\u0300-\u036f]/g, "")
  .toLowerCase()
  .replace(/[^a-z0-9]+/g, " ")
  .trim()

// Whole words avoid "poireau" -> "poire" and "ail" inside another word.
// Specific products must precede their generic names (potato/apple, lime/lemon).
const PRODUCT_MASCOT_RULES: ReadonlyArray<readonly [RegExp, PowerAvatarKey]> = [
  [/\bpommes? de terre\b/, "pomme-de-terre"],
  [/\bcitrons? verts?\b/, "citron-vert"],
  [/\bfruits? de (?:la )?passion\b|\bpassion\b/, "passion"],
  [/\bananas\b/, "ananas"],
  [/\baubergines?\b/, "aubergine"],
  [/\bavocats?\b/, "avocat"],
  [/\bbananes?\b/, "banane"],
  [/\bcarottes?\b/, "carotte"],
  [/\bcitrons?\b/, "citron"],
  [/\bclementines?\b/, "clementine"],
  [/\bconcombres?\b/, "concombre"],
  [/\bcourgettes?\b/, "courgette"],
  [/\bfraises?\b|\bgariguettes?\b/, "fraise"],
  [/\bframboises?\b/, "framboise"],
  [/\bkiwis?\b/, "kiwi"],
  [/\bmangues?\b/, "mangue"],
  [/\boignons?\b/, "oignon"],
  [/\bpoires?\b/, "poire"],
  [/\bpoivrons?\b/, "poivron"],
  [/\bpommes?\b/, "pomme"],
  [/\bpotirons?\b/, "potiron"],
  [/\braisins?\b/, "raisin"],
  [/\bsalades?\b|\bbatavias?\b|\blaitues?\b/, "salade"],
  [/\btomates?\b/, "tomate"],
  [/\bpersils?\b/, "persil"],
]

export function avatarForProductName(name: string) {
  const normalized = normalize(name)
  // Prepared/mixed products need their own illustration, not one arbitrary ingredient.
  if (/\b(jus|smoothies?|soupes?|compotes?|confitures?|coulis|purees?|paniers?|box|bowls?)\b/.test(normalized)
      || /\bsalade (de fruits|composee|cesar)\b/.test(normalized)) return null
  const rule = PRODUCT_MASCOT_RULES.find(([pattern]) => pattern.test(normalized))
  if (!rule) return null
  return POWER_AVATARS.find((avatar) => avatar.key === rule[1]) ?? null
}
