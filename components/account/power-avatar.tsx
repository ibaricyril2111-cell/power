"use client"

import { POWER_AVATARS, powerAvatar, type PowerAvatarKey } from "@/lib/power-avatars"

export function PowerAvatar({ avatarKey, size = 72, className = "" }: { avatarKey?: string | null; size?: number; className?: string }) {
  const avatar = powerAvatar(avatarKey)
  return (
    <div
      role="img"
      aria-label={`Mascotte ${avatar.label}`}
      data-mascot-key={avatar.key}
      className={`shrink-0 overflow-hidden rounded-full border-2 border-[#ffcd47] bg-[#244f40] shadow-lg ${className}`}
      style={{
        width: size,
        height: size,
        backgroundImage: `url("${avatar.image}")`,
        backgroundSize: "cover",
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
    <fieldset className="min-w-0">
      <legend className="mb-3 text-sm font-bold text-white">
        Choisis ton fruit ou légume POWER <span className="text-[#ffcd47]">★</span>
      </legend>
      <p className="mb-4 text-xs leading-relaxed text-white/65">
        Il devient ton avatar. Tu pourras le changer quand tu veux.
      </p>
      <div className="grid grid-cols-[repeat(auto-fit,minmax(72px,1fr))] gap-2">
        {POWER_AVATARS.map((avatar) => {
          const active = value === avatar.key
          return (
            <button
              key={avatar.key}
              type="button"
              onClick={() => onChange(avatar.key)}
              aria-pressed={active}
              aria-label={`Choisir ${avatar.label}`}
              className={`group flex min-w-0 flex-col items-center gap-1.5 rounded-2xl p-2 transition ${active ? "bg-[#ffcd47] text-[#102e25] ring-2 ring-[#ffcd47] ring-offset-2 ring-offset-[#102e25]" : "bg-white/5 text-white hover:bg-white/10"}`}
            >
              <PowerAvatar avatarKey={avatar.key} size={compact ? 48 : 54} />
              <span className="max-w-full text-center text-[10px] font-bold leading-tight">{avatar.label}</span>
            </button>
          )
        })}
      </div>
    </fieldset>
  )
}
