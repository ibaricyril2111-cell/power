/**
 * Règle métier Click & Collect POWER.
 *
 * Les achats de réassort sont faits dans la nuit précédant le samedi.
 * - commande vendredi : retrait samedi OU dimanche possible ;
 * - commande samedi : dimanche n'est pas garanti, premier retrait lundi ;
 * - autres jours : retrait à partir du lendemain.
 *
 * Les calculs sont faits en heure de Paris côté serveur comme côté navigateur.
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
  // Samedi : pas de réassort le dimanche, donc retrait garanti à partir de lundi.
  return addCalendarDays(p, p.weekday === 6 ? 2 : 1)
}

export function isPickupDateAllowed(dateISO: string, now = new Date()): boolean {
  return /^\d{4}-\d{2}-\d{2}$/.test(dateISO) && dateISO >= minimumPickupDate(now)
}
