import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/db"
import { auth } from "@/auth"
import { z } from "zod"
import { generateDeliveryPlanning } from "@/lib/delivery-planning"

const WEEKS_AHEAD = 4 // Générer 4 semaines à l'avance

/**
 * POST — Génération automatique des créneaux de livraison
 * Lundi → Dimanche, 9h → 17h, créneaux d'1h
 */
export async function POST(req: NextRequest) {
    try {
        const session = await auth()
        if (session?.user?.role !== "admin" || session.user.disabled) {
            return NextResponse.json({ error: "Non autorisé" }, { status: 401 })
        }

        const body = await req.json().catch(() => ({}))
        const parsed = z.object({
            weeksAhead: z.number().int().min(1).max(8).default(WEEKS_AHEAD),
            type: z.enum(["retrait", "livraison", "both"]).default("both"),
        }).safeParse(body)
        if (!parsed.success) return NextResponse.json({ error: "Planning invalide" }, { status: 400 })
        const { weeksAhead } = parsed.data
        const slotTypes = parsed.data.type === "both" ? ["livraison", "retrait"] : [parsed.data.type]

        const { created, skipped } = await generateDeliveryPlanning(weeksAhead, slotTypes)

        return NextResponse.json({
            success: true,
            message: `${created} créneaux créés, ${skipped} déjà existants`,
            created,
            skipped,
            planning: "Tous les jours, 9h-17h",
            semaines: weeksAhead,
        })
    } catch (error) {
        console.error("Auto-generate slots error:", error)
        return NextResponse.json({ error: "Erreur serveur" }, { status: 500 })
    }
}

/**
 * DELETE — Supprimer tous les créneaux futurs (reset)
 */
export async function DELETE() {
    try {
        const session = await auth()
        if (session?.user?.role !== "admin" || session.user.disabled) {
            return NextResponse.json({ error: "Non autorisé" }, { status: 401 })
        }

        const today = new Date()
        today.setHours(0, 0, 0, 0)

        // Récupérer les créneaux futurs sans commandes
        const futureSlots = await prisma.deliverySlot.findMany({
            where: {
                date: { gte: today },
                currentOrders: 0,
            }
        })

        let deleted = 0
        for (const slot of futureSlots) {
            await prisma.deliverySlot.delete({ where: { id: slot.id } })
            deleted++
        }

        return NextResponse.json({
            success: true,
            message: `${deleted} créneaux vides supprimés`,
            deleted,
        })
    } catch (error) {
        console.error("Delete future slots error:", error)
        return NextResponse.json({ error: "Erreur serveur" }, { status: 500 })
    }
}
