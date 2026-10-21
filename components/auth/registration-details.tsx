"use client"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import AvatarDialog from "@/components/account/avatar-dialog"
import type { PowerAvatarKey } from "@/lib/power-avatars"

export default function RegistrationDetails({ phone, clientType, avatarKey, onChange, onAvatarChange, disabled }: {
  phone: string; clientType: string; avatarKey: PowerAvatarKey; disabled: boolean
  onChange: (field: string, value: string) => void; onAvatarChange: (key: PowerAvatarKey) => void
}) {
  return <div className="space-y-4">
    <AvatarDialog value={avatarKey} onChange={onAvatarChange} disabled={disabled} />
    <div><Label htmlFor="register-phone">Téléphone</Label>
      <Input id="register-phone" name="phone" type="tel" autoComplete="tel" inputMode="tel" required
        value={phone} onChange={e => onChange("phone", e.target.value)} disabled={disabled} maxLength={30} />
      <p className="mt-1 text-xs text-muted-foreground">Pour vous joindre au sujet de votre commande.</p>
    </div>
    <div><Label htmlFor="register-client-type">Type de compte</Label>
      <select id="register-client-type" value={clientType} onChange={e => onChange("clientType", e.target.value)} disabled={disabled}
        className="mt-1 min-h-11 w-full rounded-xl border border-input bg-background px-3 text-foreground">
        <option value="particulier">Particulier</option><option value="professionnel">Professionnel</option>
      </select>
      <p className="mt-1 text-xs text-muted-foreground">La facturation suit automatiquement le type de compte.</p>
    </div>
  </div>
}
