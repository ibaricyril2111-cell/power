import { POWER_AVATARS, avatarForProductName } from "@/lib/power-avatars"

function fallbackMascot(name: string) {
  const score = [...name].reduce((sum, char) => sum + char.charCodeAt(0), 0)
  return POWER_AVATARS[score % POWER_AVATARS.length]
}

export default function ProductMascotImage({
  name,
  alt,
  className = "",
}: {
  name: string
  fallbackImage?: string | null
  alt?: string
  sizes?: string
  className?: string
}) {
  const mascot = avatarForProductName(name) ?? fallbackMascot(name)

  return (
    <div
      role="img"
      aria-label={alt || `Personnage POWER ${name}`}
      className={`absolute inset-0 bg-[#0b4938] ${className}`}
      style={{
        backgroundImage: `url("${mascot.image}")`,
        backgroundSize: "500%",
        backgroundPosition: mascot.position,
        backgroundRepeat: "no-repeat",
      }}
    />
  )
}
