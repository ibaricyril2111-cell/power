import Link from "next/link"
import { PowerAvatar } from "@/components/account/power-avatar"
import { powerAvatar, type PowerAvatarKey } from "@/lib/power-avatars"

const picks: PowerAvatarKey[] = ["mangue", "fraise", "avocat", "carotte", "tomate"]

export default function AvatarChoicePromo() {
  return (
    <section className="w-full bg-[#073b2d] px-3 pb-10 sm:px-6">
      <div className="mx-auto max-w-7xl overflow-hidden rounded-[24px] border border-[#ffcd47]/30 bg-gradient-to-r from-[#0b4938] to-[#123e2f] p-5 text-white shadow-xl sm:p-7">
        <div className="grid items-center gap-5 sm:grid-cols-[1fr_auto]">
          <div>
            <p className="text-xl font-black">Choisis ton fruit <span className="text-[#ffcd47]">POWER !</span></p>
            <p className="mt-1 max-w-xl text-sm text-white/75">Fruits, légumes, aromates et exotiques : clique sur une mascotte pour retrouver ses produits.</p>
            <div className="mt-4 flex items-center gap-2">
              {picks.map(key => <Link key={key} href={"/personnages?personnage=" + key} aria-label={"Commander " + powerAvatar(key).label} className="rounded-full focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#ffcd47]">
                <PowerAvatar avatarKey={key} size={44} className="border-2 border-[#ffcd47]/60" />
              </Link>)}
              <Link href="/personnages" aria-label="Voir les 100 mascottes" className="flex h-11 w-11 items-center justify-center rounded-full border border-white/20 bg-white/5 font-black">•••</Link>
            </div>
            <Link href="/personnages" className="mt-3 inline-flex min-h-11 items-center text-sm font-bold text-[#ffcd47] underline underline-offset-4">
              Découvrir les 100 mascottes
            </Link>
          </div>
          <Link href="/personnages" className="inline-flex min-h-12 items-center justify-center rounded-full bg-[#ffcd47] px-6 text-sm font-black text-[#073b2d] hover:bg-[#ffe18a]">
            Choisir et commander
          </Link>
        </div>
      </div>
    </section>
  )
}
