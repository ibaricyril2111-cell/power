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
    <div role="img" aria-label={alt || `Personnage POWER ${name}`} className={`absolute inset-0 overflow-hidden bg-[radial-gradient(circle_at_50%_45%,#17664d_0%,#0b4938_55%,#073b2d_100%)] ${className}`}>
      <div
        className="absolute left-1/2 top-1/2 aspect-square w-[62%] max-w-[128px] -translate-x-1/2 -translate-y-1/2 drop-shadow-[0_14px_18px_rgba(0,0,0,.28)]"
        style={{
          backgroundImage: `url("${mascot.image}")`,
          backgroundSize: "500%",
          backgroundPosition: mascot.position,
          backgroundRepeat: "no-repeat",
        }}
      />
      <div className="absolute inset-x-0 bottom-0 h-10 bg-gradient-to-t from-[#073b2d]/45 to-transparent" />
    </div>
  )
}
