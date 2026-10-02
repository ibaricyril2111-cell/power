"use client"

import { POWER_AVATARS, powerAvatar, type PowerAvatarKey } from "@/lib/power-avatars"

export function PowerAvatar({ avatarKey, size = 72, className = "" }: { avatarKey?: string | null; size?: number; className?: string }) {
  const avatar = powerAvatar(avatarKey)
  return (
    <div
      role="img"
      aria-label={`Mascotte ${avatar.label}`}
      className={`overflow-hidden rounded-full border-2 border-[#ffcd47] bg-[#244f40] shadow-lg ${className}`}
      style={{
        width: size,
        height: size,
        backgroundImage: `url("${avatar.image}")`,
        backgroundSize: "285%",
        backgroundPosition: avatar.position,
        backgroundRepeat: "no-repeat",
      }}
    />
  )
}

export function PowerAvatarPicker({
  value,
  onChange,
  compact = false,
}: {
  value: PowerAvatarKey
  onChange: (value: PowerAvatarKey) => void
  compact?: boolean
}) {
  return (
    <fieldset>
      <legend className="mb-3 text-sm font-bold text-white">
        Choisis ton fruit POWER <span className="text-[#ffcd47]">★</span>
      </legend>
      <p className="mb-4 text-xs leading-relaxed text-white/65">
        Il devient ton avatar. Tu pourras le changer quand tu veux.
      </p>
      <div className={`grid gap-3 ${compact ? "grid-cols-4 sm:grid-cols-7" : "grid-cols-4"}`}>
        {POWER_AVATARS.map((avatar) => {
          const active = value === avatar.key
          return (
            <button
              key={avatar.key}
              type="button"
              onClick={() => onChange(avatar.key)}
              aria-pressed={active}
              className={`group flex flex-col items-center gap-1.5 rounded-2xl p-2 transition ${active ? "bg-[#ffcd47] text-[#102e25] ring-2 ring-[#ffcd47] ring-offset-2 ring-offset-[#102e25]" : "bg-white/5 text-white hover:bg-white/10"}`}
            >
              <PowerAvatar avatarKey={avatar.key} size={compact ? 52 : 58} className={active ? "border-[#102e25]" : ""} />
              <span className="max-w-full truncate text-[10px] font-bold">{avatar.label}</span>
            </button>
          )
        })}
      </div>
    </fieldset>
  )
}
