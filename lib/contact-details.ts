import { z } from "zod"

export const normalizePhone = (value: string) => value.trim().replace(/[\s.()\-]/g, "")
export const isValidPhone = (value: string) => /^\+?[0-9]{10,15}$/.test(normalizePhone(value))
export const phoneSchema = z.string().trim().max(30).transform(normalizePhone)
  .refine(isValidPhone, "Numéro de téléphone invalide (10 à 15 chiffres)")

export const checkoutContactSchema = z.object({
  phone: phoneSchema,
  address: z.string().trim().max(240).optional(),
  postalCode: z.string().trim().max(20).optional(),
  city: z.string().trim().max(100).optional(),
})
export type CheckoutContact = z.infer<typeof checkoutContactSchema>

export function checkoutContactIssues(data: CheckoutContact & { method: "livraison" | "retrait"; hasSlot: boolean }) {
  const issues: { id: string; message: string }[] = []
  // Follow the actual field order on the checkout page.
  if (data.method === "livraison") {
    if (!data.address?.trim()) issues.push({ id: "address", message: "Renseignez votre adresse de livraison." })
    else if (data.address.trim().length > 240) issues.push({ id: "address", message: "L’adresse ne doit pas dépasser 240 caractères." })
    if (!data.postalCode?.trim()) issues.push({ id: "postalCode", message: "Renseignez votre code postal." })
    else if (data.postalCode.trim().length > 20) issues.push({ id: "postalCode", message: "Le code postal est trop long." })
    if (!data.city?.trim()) issues.push({ id: "city", message: "Renseignez votre ville." })
    else if (data.city.trim().length > 100) issues.push({ id: "city", message: "Le nom de la ville est trop long." })
  }
  if (!data.phone.trim()) issues.push({ id: "phone", message: "Renseignez votre numéro de téléphone." })
  else if (data.phone.trim().length > 30 || !isValidPhone(data.phone)) issues.push({ id: "phone", message: "Renseignez un téléphone valide (10 à 15 chiffres)." })
  if (!data.hasSlot) issues.push({ id: "deliverySlot", message: "Choisissez une date et un créneau disponible." })
  return issues
}
