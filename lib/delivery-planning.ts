import { prisma } from "@/lib/db"
import { parisDateParts } from "@/lib/pickup-policy"
/** Idempotent renewal of the approved seven-day schedule; inactive slots stay closed. */
export async function generateDeliveryPlanning(weeks = 4, types = ["livraison", "retrait"]) {
  if (!Number.isInteger(weeks) || weeks < 1 || weeks > 8 || types.some(type => !["livraison", "retrait"].includes(type))) throw new Error("Planning invalide")
  const now = parisDateParts()
  const start = Date.UTC(now.year, now.month - 1, now.day)
  const data = []
  for (const type of types) for (let offset = 1; offset <= weeks * 7; offset++) {
    const date = new Date(start + offset * 86_400_000)
    for (let hour = 9; hour < 17; hour++) data.push({ date, type,
      startTime: `${String(hour).padStart(2, "0")}:00`, endTime: `${String(hour + 1).padStart(2, "0")}:00`,
      maxOrders: 10, isActive: true })
  }
  const result = await prisma.deliverySlot.createMany({ data, skipDuplicates: true })
  return { created: result.count, skipped: data.length - result.count }
}
