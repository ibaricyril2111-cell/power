import Image from "next/image"
import { powerAvatar, type PowerAvatarKey } from "@/lib/power-avatars"
export default function MascotPortrait({ mascotKey, className = "", decorative = false, sizes = "100px" }: {
  mascotKey: PowerAvatarKey
  className?: string
  decorative?: boolean
  sizes?: string
}) {
  const avatar = powerAvatar(mascotKey)
  return (
    <span className={"relative block aspect-square overflow-hidden rounded-2xl bg-[#0b4938] " + className}
      data-mascot-key={avatar.key}>
      <Image src={avatar.image} alt={decorative ? "" : "Personnage POWER " + avatar.label}
        fill quality={90} sizes={sizes} className="object-contain" />
    </span>
  )
}
