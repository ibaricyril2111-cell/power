import Image from "next/image"
import { powerAvatar, type PowerAvatarKey } from "@/lib/power-avatars"
export default function MascotPortrait({ mascotKey, className = "", decorative = false }: {
  mascotKey: PowerAvatarKey
  className?: string
  decorative?: boolean
}) {
  const avatar = powerAvatar(mascotKey)
  return (
    <span className={"relative block aspect-square overflow-hidden rounded-2xl bg-[#0b4938] " + className}
      data-mascot-key={avatar.key}>
      <Image src={avatar.image} alt={decorative ? "" : "Personnage POWER " + avatar.label}
        fill quality={90} sizes="100px" className="object-contain" />
    </span>
  )
}
