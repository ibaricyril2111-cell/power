/**
 * Règle métier Click & Collect POWER validée : prévoir le réassort.
 * - commande vendredi : retrait samedi OU dimanche possible ;
 * - commande samedi : premier retrait lundi (pas de réassort dimanche) ;
 * - autres jours : retrait à partir du lendemain.
 *
 * Cette date minimale ne garantit pas un créneau : celui-ci doit aussi être
 * actif en base et validé côté serveur. Calculs en heure de Paris.
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

function addCalendarDays(parts: { year: number; month: number; day: number }, days: number): string {
  const d = new Date(Date.UTC(parts.year, parts.month - 1, parts.day + days))
  return `${d.getUTCFullYear()}-${String(d.getUTCMonth() + 1).padStart(2, "0")}-${String(d.getUTCDate()).padStart(2, "0")}`
}

export function minimumPickupDate(now = new Date()): string {
  const p = parisDateParts(now)
  return addCalendarDays(p, p.weekday === 6 ? 2 : 1)
}

export function isPickupDateAllowed(dateISO: string, now = new Date()): boolean {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(dateISO)) return false
  // Date peut normaliser silencieusement le 31 février : refuser ces valeurs.
  const parsed = new Date(`${dateISO}T00:00:00.000Z`)
  if (!Number.isFinite(parsed.getTime()) || parsed.toISOString().slice(0, 10) !== dateISO) return false
  return dateISO >= minimumPickupDate(now)
}
