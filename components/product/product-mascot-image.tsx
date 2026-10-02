import Image from "next/image"
import { avatarForProductName } from "@/lib/power-avatars"

export default function ProductMascotImage({
  name,
  fallbackImage,
  alt,
  sizes = "(max-width: 768px) 100vw, 300px",
  className = "",
}: {
  name: string
  fallbackImage?: string | null
  alt?: string
  sizes?: string
  className?: string
}) {
  const mascot = avatarForProductName(name)

  if (mascot) {
    return (
      <div
        role="img"
        aria-label={alt || name}
        className={`absolute inset-0 bg-[#173f32] ${className}`}
        style={{
          backgroundImage: `url("${mascot.image}")`,
          backgroundSize: "500%",
          backgroundPosition: mascot.position,
          backgroundRepeat: "no-repeat",
        }}
      />
    )
  }

  return (
    <Image
      src={fallbackImage || "/placeholder.svg"}
      alt={alt || name}
      fill
      sizes={sizes}
      className={`object-cover ${className}`}
    />
  )
}
