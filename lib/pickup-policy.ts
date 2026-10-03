/**
 * Règle métier Click & Collect POWER.
 *
 * Le retrait magasin peut être proposé le jour même. La disponibilité réelle
 * reste contrôlée par les créneaux actifs configurés en base : si aucun créneau
 * futur n'existe pour aujourd'hui, le calendrier n'en proposera pas.
 */
export function parisDateParts(now = new Date()): { year: number; month: number; day: number; weekday: number } {
  const parts = new Intl.DateTimeFormat("en-GB", {
    timeZone: "Europe/Paris",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    weekday: "short",
  }).formatToParts(now)
  const value = (type: Intl.DateTimeFormatPartTypes) => parts.find(p => p.type === type)?.value || ""
  const weekdays: Record<string, number> = { Sun: 0, Mon: 1, Tue: 2, Wed: 3, Thu: 4, Fri: 5, Sat: 6 }
  return {
    year: Number(value("year")),
    month: Number(value("month")),
    day: Number(value("day")),
    weekday: weekdays[value("weekday")] ?? -1,
  }
}

function dateISO(parts: { year: number; month: number; day: number }): string {
  return `${parts.year}-${String(parts.month).padStart(2, "0")}-${String(parts.day).padStart(2, "0")}`
}

export function minimumPickupDate(now = new Date()): string {
  return dateISO(parisDateParts(now))
}

export function isPickupDateAllowed(date: string, now = new Date()): boolean {
  return /^\d{4}-\d{2}-\d{2}$/.test(date) && date >= minimumPickupDate(now)
}
