export const POWER_AVATARS = [
  { key: "mangue", label: "Mangue", image: "/brand/tropical-rose.webp", position: "8% 52%" },
  { key: "fraise", label: "Fraise", image: "/brand/tropical-rose.webp", position: "50% 30%" },
  { key: "clementine", label: "Clémentine", image: "/brand/tropical-rose.webp", position: "92% 52%" },
  { key: "ananas", label: "Ananas", image: "/brand/tropic-rose.webp", position: "50% 28%" },
  { key: "passion", label: "Passion", image: "/brand/tropic-rose.webp", position: "90% 55%" },
  { key: "banane", label: "Banane", image: "/brand/harmonie-rose.webp", position: "52% 28%" },
  { key: "poire", label: "Poire", image: "/brand/harmonie-rose.webp", position: "90% 55%" },
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
