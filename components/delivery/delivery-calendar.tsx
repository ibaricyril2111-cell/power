"use client"

import { useState, useEffect, useRef } from "react"
import { Calendar } from "@/components/ui/calendar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Clock, Calendar as CalendarIcon, CheckCircle2, Loader2 } from "lucide-react"
import { getAvailableDeliverySlots } from "@/app/actions/delivery"
import { formatLocalDate, parseDeliveryDate } from "@/lib/utils"
import { minimumPickupDate } from "@/lib/pickup-policy"

interface DeliverySlot {
  id: string
  date: string
  startTime: string
  endTime: string
  remainingSlots: number
}

interface DeliveryCalendarProps {
  onSelectDelivery: (delivery: { date: string; time: string; dateISO: string; slotId?: string } | null) => void
  selectedDelivery: { date: string; time: string } | null
  /** Mode de réception : adapte les libellés (Livraison vs Retrait / Click & Collect). */
  initialDate?: string
  initialSlotId?: string
  mode?: "livraison" | "retrait"
}

export default function DeliveryCalendar({ onSelectDelivery, selectedDelivery, mode = "livraison", initialDate, initialSlotId }: DeliveryCalendarProps) {
  const isRetrait = mode === "retrait"
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(() => {
    const tomorrow = new Date()
    tomorrow.setHours(0, 0, 0, 0)
    tomorrow.setDate(tomorrow.getDate() + 1)
    const minimum = isRetrait ? (parseDeliveryDate(minimumPickupDate()) || tomorrow) : tomorrow
    const initial = parseDeliveryDate(initialDate)
    if (!initial) return minimum
    initial.setHours(0, 0, 0, 0)
    return initial >= minimum ? initial : minimum
  })
  const [selectedTime, setSelectedTime] = useState<string>("")
  const [slots, setSlots] = useState<DeliverySlot[]>([])
  const [loadingSlots, setLoadingSlots] = useState(false)

  const initialSlot = useRef(initialSlotId)
  const notify = useRef(onSelectDelivery)
  notify.current = onSelectDelivery

  useEffect(() => {
    let cancelled = false
    setSlots([])
    setSelectedTime("")
    if (!selectedDate) { setLoadingSlots(false); return }
    setLoadingSlots(true)
    const dateStr = formatLocalDate(selectedDate)
    getAvailableDeliverySlots(dateStr, dateStr, mode)
      .then(res => {
        if (cancelled) return
        setSlots(res.success ? res.data : [])
        const slot = res.data.find(s => s.id === initialSlot.current && s.remainingSlots > 0)
        initialSlot.current = undefined
        if (res.success && slot && !isDateDisabled(selectedDate)) {
          const time = `${slot.startTime} - ${slot.endTime}`
          setSelectedTime(time)
          notify.current({ date: selectedDate.toLocaleDateString("fr-FR"), dateISO: dateStr, time, slotId: slot.id })
        }
      })
      .catch(() => { if (!cancelled) setSlots([]) })
      .finally(() => { if (!cancelled) setLoadingSlots(false) })
    return () => { cancelled = true }
  }, [selectedDate, mode])

  const handleDateSelect = (date: Date | undefined) => {
    initialSlot.current = undefined
    onSelectDelivery(null)
    setSlots([])
    setSelectedDate(date)
    setSelectedTime("")
  }

  const handleSlotSelect = (slot: { id: string; time: string }) => {
    setSelectedTime(slot.time)
    if (selectedDate) {
      onSelectDelivery({
        date: selectedDate.toLocaleDateString("fr-FR"),
        time: slot.time,
        dateISO: formatLocalDate(selectedDate),
        slotId: slot.id,
      })
    }
  }

  const isDateDisabled = (date: Date) => {
    const dateISO = formatLocalDate(date)
    if (isRetrait) {
      // Samedi → dimanche non proposé : pas de réassort possible le dimanche.
      // Vendredi → samedi et dimanche restent disponibles.
      return dateISO < minimumPickupDate()
    }
    const today = new Date()
    const tomorrow = new Date(today)
    tomorrow.setHours(0, 0, 0, 0)
    tomorrow.setDate(today.getDate() + 1)
    return date < tomorrow
  }

  // Uniquement les vrais créneaux configurés en base (plus aucun créneau fictif)
  const displaySlots = slots.map(s => ({
    id: s.id,
    time: `${s.startTime} - ${s.endTime}`,
    available: s.remainingSlots > 0,
    remaining: s.remainingSlots,
  }))

  return (
    <Card className="min-w-0 overflow-hidden rounded-[28px] border-[#ffcd47]/20 bg-[#0b4a36] text-white shadow-none">
      <CardHeader className="border-b border-white/10 px-4 pb-5 sm:px-6">
        <CardTitle className="flex flex-wrap items-center gap-2 text-xl font-black leading-snug sm:text-2xl">
          <CalendarIcon aria-hidden="true" className="h-6 w-6 shrink-0 text-[#ffcd47]" />
          <span>{isRetrait ? "Planifier le " : "Planifier la "}<span className="text-[#ffcd47]">{isRetrait ? "retrait" : "livraison"}</span></span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6 px-4 pt-5 sm:px-6">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:gap-8">
          <div className="min-w-0 space-y-3">
            <h4 className="text-sm font-bold text-white">Choisir une date</h4>
            <div className="flex justify-center rounded-2xl border border-white/10 bg-[#073b2d] p-1 sm:p-3">
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={handleDateSelect}
                disabled={isDateDisabled}
                className="rounded-2xl border-0 !bg-transparent text-white"
              />
            </div>
          </div>

          <div className="flex min-w-0 flex-col space-y-3" aria-busy={loadingSlots}>
            <h4 className="text-sm font-bold text-white">Choisir un créneau</h4>
            {loadingSlots ? (
              <div role="status" className="flex min-h-24 flex-1 items-center justify-center gap-2 text-[#ffcd47]">
                <Loader2 aria-hidden="true" className="h-5 w-5 animate-spin" />
                <span className="text-sm">Chargement des créneaux…</span>
              </div>
            ) : selectedDate ? (
              displaySlots.length === 0 ? (
                <div role="status" className="flex flex-1 items-center justify-center rounded-2xl border border-dashed border-white/20 bg-[#073b2d] px-4 py-6 text-center text-sm leading-relaxed text-emerald-50">
                  Aucun créneau de {isRetrait ? "retrait" : "livraison"} disponible pour cette date. Veuillez en choisir une autre.
                </div>
              ) : (
              <div className="grid flex-1 grid-cols-1 gap-3">
                {displaySlots.map((slot) => (
                  <Button
                    key={slot.id}
                    type="button"
                    variant={selectedTime === slot.time ? "default" : "outline"}
                    aria-pressed={selectedTime === slot.time}
                    className={`min-h-14 h-auto w-full justify-between gap-2 whitespace-normal rounded-2xl px-3 py-3 font-bold transition-colors focus-visible:ring-2 focus-visible:ring-[#ffcd47] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0b4a36] sm:px-5 ${selectedTime === slot.time
                        ? "border-transparent bg-[#ffcd47] text-[#073b2d] hover:bg-[#ffe18a] hover:text-[#073b2d]"
                        : "border-white/20 bg-[#073b2d] text-white hover:border-[#ffcd47] hover:bg-[#115741] hover:text-white"
                      }`}
                    disabled={!slot.available}
                    onClick={() => handleSlotSelect(slot)}
                  >
                    <span className="flex items-center gap-2">
                      <Clock aria-hidden="true" className={`h-4 w-4 shrink-0 ${selectedTime === slot.time ? "text-[#073b2d]" : "text-[#ffcd47]"}`} />
                      <span>{slot.time}</span>
                    </span>
                    {/* La capacité ne concerne que la livraison ; en retrait, pas de quota. */}
                    {isRetrait ? null : !slot.available ? (
                      <Badge variant="secondary" className="border-0 bg-white/10 text-xs text-white">
                        Complet
                      </Badge>
                    ) : (
                      <span className={`shrink-0 text-xs ${selectedTime === slot.time ? "text-[#073b2d]" : "text-emerald-100"}`}>{slot.remaining} places</span>
                    )}
                  </Button>
                ))}
              </div>
              )
            ) : (
              <div className="flex min-h-24 flex-1 items-center justify-center rounded-2xl border border-dashed border-white/20 px-4 py-6 text-center text-sm text-emerald-50">
                Sélectionnez une date d'abord
              </div>
            )}
          </div>
        </div>

        {selectedDelivery && (
          <div role="status" className="rounded-2xl border border-[#ffcd47]/30 bg-[#073b2d] p-4 sm:p-5">
            <div className="flex items-start gap-3 text-[#ffcd47]">
              <CheckCircle2 aria-hidden="true" className="h-5 w-5 shrink-0" />
              <p className="text-sm font-bold leading-relaxed">
                {isRetrait ? "Retrait programmé" : "Livraison programmée"} le {selectedDelivery.date} - {selectedDelivery.time}
              </p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
