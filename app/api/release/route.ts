import { NextResponse } from "next/server"
export const dynamic = "force-dynamic"
// Public deployment identity only; never include environment values or credentials.
export async function GET() {
  return NextResponse.json({ project: "power", commit: process.env.VERCEL_GIT_COMMIT_SHA || "local" },
    { headers: { "Cache-Control": "no-store" } })
}
