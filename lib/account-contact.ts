import { prisma } from "@/lib/db"
import type { CheckoutContact } from "@/lib/contact-details"

/** Server-only callers supply the authenticated user ID, never an ID from a form. */
export async function persistAccountContact(userId: string, contact: CheckoutContact) {
  return prisma.user.update({
    where: { id: userId },
    data: {
      phone: contact.phone,
      ...(contact.address ? { address: contact.address } : {}),
      ...(contact.postalCode ? { postalCode: contact.postalCode } : {}),
      ...(contact.city ? { city: contact.city } : {}),
    },
    select: { phone: true, address: true, postalCode: true, city: true },
  })
}
