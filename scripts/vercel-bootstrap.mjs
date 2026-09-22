import "dotenv/config"
import { spawnSync } from "node:child_process"
import { PrismaClient } from "@prisma/client"
import { PrismaNeonHttp } from "@prisma/adapter-neon"

const url = (process.env.DATABASE_URL || "").replace(/&channel_binding=[^&]*/g, "")
if (!url) throw new Error("DATABASE_URL est obligatoire")

const prisma = new PrismaClient({ adapter: new PrismaNeonHttp(url, { fullResults: false }) })

try {
  const existingProducts = await prisma.product.count()

  if (existingProducts === 0) {
    console.log("Initialisation du catalogue Power...")
    const result = spawnSync(
      process.execPath,
      ["--experimental-strip-types", "prisma/seed.ts"],
      { stdio: "inherit", env: process.env },
    )
    if (result.status !== 0) throw new Error("Le seed Power a échoué")
  } else {
    console.log("Base Power déjà initialisée — données conservées")
  }

  const ownerEmail = (process.env.OWNER_EMAIL || "ibaricyril2111@gmail.com").trim().toLowerCase()
  const [products, owner] = await Promise.all([
    prisma.product.count(),
    prisma.user.findUnique({ where: { email: ownerEmail } }),
  ])

  if (products === 0) throw new Error("Catalogue Power vide après initialisation")
  if (!owner || owner.role !== "admin") throw new Error("Compte administrateur Power absent")

  console.log(`Power prêt : ${products} produits et administrateur sécurisé`)
} finally {
  await prisma.$disconnect()
}
