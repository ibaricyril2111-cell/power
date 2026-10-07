/** The 100 characters approved by Cyril on 4 October 2026, in atlas order.
 * Shared identity for products, avatars and recipes. Commercial data comes from DB.
 */
const CHARACTERS = [
  ["mangue", "Mangue", "fruits"], ["fraise", "Fraise", "fruits"], ["ananas", "Ananas", "exotiques"], ["tomate", "Tomate", "legumes"], ["banane", "Banane", "fruits"],
  ["pomme", "Pomme", "fruits"], ["poire", "Poire", "fruits"], ["orange", "Orange", "fruits"], ["citron", "Citron", "fruits"], ["citron-vert", "Citron vert", "fruits"],
  ["clementine", "Clémentine", "fruits"], ["pamplemousse", "Pamplemousse", "fruits"], ["mandarine", "Mandarine", "fruits"], ["kiwi", "Kiwi", "fruits"], ["pasteque", "Pastèque", "fruits"],
  ["melon", "Melon", "fruits"], ["raisin", "Raisin", "fruits"], ["cerise", "Cerise", "fruits"], ["abricot", "Abricot", "fruits"], ["peche", "Pêche", "fruits"],
  ["nectarine", "Nectarine", "fruits"], ["prune", "Prune", "fruits"], ["framboise", "Framboise", "fruits"], ["mure", "Mûre", "fruits"], ["myrtille", "Myrtille", "fruits"],
  ["groseille", "Groseille", "fruits"], ["cassis", "Cassis", "fruits"], ["figue", "Figue", "fruits"], ["grenade", "Grenade", "fruits"], ["kaki", "Kaki", "fruits"],
  ["passion", "Fruit de la passion", "exotiques"], ["noix-de-coco", "Noix de coco", "exotiques"], ["papaye", "Papaye", "exotiques"], ["pitaya", "Pitaya", "exotiques"], ["litchi", "Litchi", "exotiques"],
  ["goyave", "Goyave", "exotiques"], ["carambole", "Carambole", "exotiques"], ["ramboutan", "Ramboutan", "exotiques"], ["mangoustan", "Mangoustan", "exotiques"], ["durian", "Durian", "exotiques"],
  ["corossol", "Corossol", "exotiques"], ["cherimole", "Chérimole", "exotiques"], ["tamarin", "Tamarin", "exotiques"], ["kumquat", "Kumquat", "exotiques"], ["physalis", "Physalis", "exotiques"],
  ["datte", "Datte", "exotiques"], ["avocat", "Avocat", "exotiques"], ["jacquier", "Fruit du jacquier", "exotiques"], ["longane", "Longane", "exotiques"], ["nefle", "Nèfle", "fruits"],
  ["carotte", "Carotte", "legumes"], ["courgette", "Courgette", "legumes"], ["aubergine", "Aubergine", "legumes"], ["concombre", "Concombre", "legumes"], ["poivron", "Poivron rouge", "legumes"],
  ["brocoli", "Brocoli", "legumes"], ["chou-fleur", "Chou-fleur", "legumes"], ["chou-rouge", "Chou rouge", "legumes"], ["salade", "Laitue", "legumes"], ["epinard", "Épinard", "legumes"],
  ["poireau", "Poireau", "legumes"], ["celeri-branche", "Céleri branche", "legumes"], ["fenouil", "Fenouil", "legumes"], ["artichaut", "Artichaut", "legumes"], ["asperge", "Asperge", "legumes"],
  ["haricot-vert", "Haricot vert", "legumes"], ["petit-pois", "Petit pois", "legumes"], ["radis", "Radis", "legumes"], ["betterave", "Betterave", "legumes"], ["navet", "Navet", "legumes"],
  ["panais", "Panais", "legumes"], ["pomme-de-terre", "Pomme de terre", "legumes"], ["patate-douce", "Patate douce", "legumes"], ["potiron", "Potimarron", "legumes"], ["butternut", "Butternut", "legumes"],
  ["champignon", "Champignon", "legumes"], ["oignon", "Oignon", "legumes"], ["ail", "Ail", "legumes"], ["echalote", "Échalote", "legumes"], ["endive", "Endive", "legumes"],
  ["basilic", "Basilic", "aromates"], ["menthe", "Menthe", "aromates"], ["persil", "Persil", "aromates"], ["coriandre", "Coriandre", "aromates"], ["ciboulette", "Ciboulette", "aromates"],
  ["thym", "Thym", "aromates"], ["romarin", "Romarin", "aromates"], ["sauge", "Sauge", "aromates"], ["estragon", "Estragon", "aromates"], ["aneth", "Aneth", "aromates"],
  ["laurier", "Laurier", "aromates"], ["origan", "Origan", "aromates"], ["sarriette", "Sarriette", "aromates"], ["cerfeuil", "Cerfeuil", "aromates"], ["melisse", "Mélisse", "aromates"],
  ["verveine", "Verveine", "aromates"], ["oseille", "Oseille", "aromates"], ["gingembre", "Gingembre", "aromates"], ["curcuma", "Curcuma", "aromates"], ["citronnelle", "Citronnelle", "aromates"],
] as const

export type PowerAvatarKey = (typeof CHARACTERS)[number][0]
export type PowerFamily = (typeof CHARACTERS)[number][2]
export const POWER_AVATARS = CHARACTERS.map(([key, label, family]) => ({
  key, label, family, image: "/brand/mascots/v4/" + key + ".webp", position: "50% 50%",
}))
export const DEFAULT_POWER_AVATAR: PowerAvatarKey = "mangue"
export function isPowerAvatarKey(value: unknown): value is PowerAvatarKey {
  return typeof value === "string" && POWER_AVATARS.some((avatar) => avatar.key === value)
}
/** The default is only for personal avatars, never unidentified products. */
export function powerAvatar(key?: string | null) {
  return POWER_AVATARS.find((avatar) => avatar.key === key) ?? POWER_AVATARS[0]
}
export function avatarSettingKey(userId: string) { return "user-avatar:" + userId }
export const normalizeMascotName = (value: string) => value.normalize("NFD")
  .replace(/[\u0300-\u036f]/g, "").toLowerCase().replace(/[^a-z0-9]+/g, " ").trim()
const ALIASES: Partial<Record<PowerAvatarKey, string[]>> = {
  fraise: ["gariguette"], passion: ["passion", "fruit de passion"],
  pamplemousse: ["pomelo", "pomelos"], pitaya: ["pitahaya", "fruit du dragon"],
  "noix-de-coco": ["coco"], cherimole: ["cherimoya"], jacquier: ["jacquier", "jackfruit"],
  salade: ["salade", "batavia", "romaine", "sucrine"], potiron: ["potiron", "potimarron"],
  poivron: ["poivron"], echalote: ["echalotte"], "celeri-branche": ["celeri"],
}
function phrasePattern(value: string) {
  return "\\b" + normalizeMascotName(value).split(" ").map((word) => {
    if (word === "chou") return "choux?"
    if (word.endsWith("eau")) return word + "x?"
    if (["de", "du", "la", "le"].includes(word) || word.endsWith("s") || word.endsWith("x")) return word
    return word + "s?"
  }).join(" ") + "\\b"
}
// Longest names win: potato before apple, green lemon before lemon, etc.
const RULES = POWER_AVATARS.flatMap((avatar) =>
  [avatar.label, ...(ALIASES[avatar.key] ?? [])].map((name) => ({
    avatar, specificity: normalizeMascotName(name).length, pattern: new RegExp(phrasePattern(name)),
  })),
).sort((a, b) => b.specificity - a.specificity)
export function avatarForProductName(name: string) {
  const normalized = normalizeMascotName(name)
  if (/\b(jus|smoothies?|soupes?|compotes?|confitures?|coulis|purees?|paniers?|box|bowls?)\b/.test(normalized)
      || /\bsalades? (de fruits|composees?|cesar|poulet|veggie|burrata)\b/.test(normalized)) return null
  return RULES.find(({ pattern }) => pattern.test(normalized))?.avatar ?? null
}
