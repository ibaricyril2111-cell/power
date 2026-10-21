"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { PowerAvatar, PowerAvatarPicker } from "./power-avatar"
import { powerAvatar, type PowerAvatarKey } from "@/lib/power-avatars"

export default function AvatarDialog({ value, onChange, disabled = false }: {
  value: PowerAvatarKey; onChange: (value: PowerAvatarKey) => void; disabled?: boolean
}) {
  const [open, setOpen] = useState(false)
  return <>
    <Button type="button" variant="outline" disabled={disabled} onClick={() => setOpen(true)}
      className="flex h-auto min-w-0 w-full gap-3 whitespace-normal py-3 text-left">
      <PowerAvatar avatarKey={value} size={44} />
      <span>Avatar : {powerAvatar(value).label}<span className="block text-xs">Choisir mon avatar</span></span>
    </Button>
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="max-h-[85dvh] overflow-y-auto border-white/20 bg-[#102e25] text-white sm:max-w-xl">
        <DialogHeader><DialogTitle>Mon avatar POWER</DialogTitle>
          <DialogDescription>Choisissez votre personnage. Ce choix ne modifie pas votre panier.</DialogDescription></DialogHeader>
        <PowerAvatarPicker value={value} onChange={(key) => { onChange(key); setOpen(false) }} compact />
      </DialogContent>
    </Dialog>
  </>
}
