import Image from "next/image"
import { avatarForProductName } from "@/lib/power-avatars"

export default function ProductMascotImage({
  name,
  alt,
  sizes = "(max-width: 639px) 100vw, (max-width: 1023px) 50vw, 400px",
  className = "",
}: {
  name: string
  fallbackImage?: string | null
  alt?: string
  sizes?: string
  className?: string
}) {
  const mascot = avatarForProductName(name)

  // An unillustrated product is explicit in Preview. Never silently substitute
  // another species, an emoji, or an old product photograph.
  if (!mascot) {
    return (
      <div
        role="img"
        aria-label={`Illustration POWER de ${name} en préparation`}
        data-mascot-missing={name}
        className={`absolute inset-0 flex flex-col items-center justify-center gap-2 bg-[#0b4938] p-4 text-center ${className}`}
      >
        <span className="text-sm font-bold text-white">{name}</span>
        <span className="text-xs leading-relaxed text-white/65">Son personnage POWER est en préparation.</span>
      </div>
    )
  }

  return (
    <div
      data-mascot-key={mascot.key}
      className={`absolute inset-0 overflow-hidden bg-[#0b4938] ${className}`}
    >
      <Image
        src={mascot.image}
        alt={alt || `Personnage POWER ${mascot.label}`}
        fill
        quality={90}
        sizes={sizes}
        className="object-contain"
      />
    </div>
  )
}
