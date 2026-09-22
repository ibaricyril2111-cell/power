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

  // Mise à niveau non destructive du catalogue : les visuels sont servis localement
  // pour garantir qu'un intitulé corresponde toujours à la bonne photo.
  const categoryData = [
    { name: "Fruits", slug: "fruits", description: "Fruits frais de saison" },
    { name: "Fruits rouges", slug: "fruits-rouges", description: "Fraises et fruits rouges selon les arrivages" },
    { name: "Légumes", slug: "legumes", description: "Légumes frais et locaux" },
    { name: "Aromates", slug: "aromates", description: "Herbes fraîches et aromates" },
    { name: "Exotiques", slug: "exotiques", description: "Fruits et légumes exotiques" },
  ]
  const categories = {}
  for (const category of categoryData) {
    categories[category.name] = await prisma.category.upsert({
      where: { slug: category.slug },
      update: { name: category.name, description: category.description },
      create: category,
    })
  }

  const imageByProduct = {
    "Pommes Gala": "/products/pommes-gala.db50f5f5.webp",
    "Bananes": "/products/bananes.43975856.webp",
    "Oranges Navel": "/products/oranges-navel.1c3b565c.webp",
    "Fraises Gariguette": "/products/fraises-gariguette.8d0b6c80.webp",
    "Citrons Bio": "/products/citrons-jaune.0b78a0a6.webp",
    "Poires Conférence": "/products/poires-conference.71dd833b.webp",
    "Tomates Grappe": "/products/tomate-grappe.13fd4dfd.webp",
    "Carottes Nouvelles": "/products/carottes-nouvelles.1965b54d.webp",
    "Courgettes": "/products/courgettes.6ffce5fd.webp",
    "Salade Batavia": "/products/salade-batavia.165cc991.webp",
    "Poivrons Tricolores": "/products/poivrons-tricolores.eaf5da56.webp",
    "Aubergines": "/products/aubergines.d55b60f4.webp",
    "Basilic Frais": "/products/basilic-frais.webp",
    "Menthe Fraîche": "/products/menthe-fraiche.a42d7b0e.webp",
    "Persil Plat": "/products/persil-plat.webp",
    "Coriandre Fraîche": "/products/coriandre-fraiche.webp",
    "Persil Frisé": "/products/persil-frise.webp",
    "Mangue Kent": "/products/mangue-bateau.8897206b.webp",
    "Avocat Hass": "/products/avocat-hass.cf2c89dc.webp",
    "Ananas Victoria": "/products/ananas-sweet.a5ddbb05.webp",
  }
  for (const [name, image] of Object.entries(imageByProduct)) {
    await prisma.product.updateMany({ where: { name }, data: { image } })
  }

  // Les fruits rouges et les aromates ont leurs propres rayons.
  await prisma.product.updateMany({
    where: { name: { in: ["Fraises Gariguette"] } },
    data: { categoryId: categories["Fruits rouges"].id },
  })
  const herbProducts = [
    { name: "Coriandre Fraîche", price: 1.5, image: "/products/coriandre-fraiche.webp", description: "Coriandre fraîche et parfumée", organic: false },
    { name: "Persil Frisé", price: 1.5, image: "/products/persil-frise.webp", description: "Persil frisé croquant, idéal en finition", organic: false },
  ]
  for (const herb of herbProducts) {
    const existing = await prisma.product.findFirst({ where: { name: herb.name } })
    if (existing) {
      await prisma.product.update({ where: { id: existing.id }, data: { ...herb, categoryId: categories.Aromates.id } })
    } else {
      await prisma.product.create({
        data: { ...herb, unit: "botte", categoryId: categories.Aromates.id, inStock: true, currentStock: 20, minimumStock: 5 },
      })
    }
  }

  async function ensureComposition({ name, type, description, basePrice, imageUrl, sizes, options }) {
    let composition = await prisma.composition.findFirst({ where: { name } })
    composition = composition
      ? await prisma.composition.update({ where: { id: composition.id }, data: { type, description, basePrice, imageUrl } })
      : await prisma.composition.create({ data: { name, type, description, basePrice, imageUrl } })

    if ((await prisma.compositionSize.count({ where: { compositionId: composition.id } })) === 0) {
      for (const size of sizes) await prisma.compositionSize.create({ data: { ...size, compositionId: composition.id } })
    }
    if ((await prisma.compositionOption.count({ where: { compositionId: composition.id } })) === 0) {
      for (const option of options) await prisma.compositionOption.create({ data: { ...option, compositionId: composition.id } })
    }
  }

  await ensureComposition({
    name: "Panier de saison",
    type: "panier",
    description: "Un assortiment de fruits et légumes choisi selon les meilleurs arrivages du jour.",
    basePrice: 20,
    imageUrl: "/products/panier-saison.webp",
    sizes: [
      { name: "Solo", price: 20, description: "L'essentiel pour une personne", isDefault: true, order: 1 },
      { name: "Duo", price: 30, description: "Un panier varié pour deux", order: 2 },
      { name: "Familial", price: 40, description: "Le grand format pour la famille", order: 3 },
    ],
    options: [
      { name: "Barquette de fraises", extraPrice: 5, order: 1 },
      { name: "Mélange fruits rouges", extraPrice: 5, order: 2 },
      { name: "Sans produit précis — à indiquer en commentaire", extraPrice: 0, order: 3 },
    ],
  })
  await ensureComposition({
    name: "Power Bowl",
    type: "power-bowl",
    description: "Fruits frais découpés le matin, sans additif ni conservateur.",
    basePrice: 5.9,
    imageUrl: "/products/power-bowl.webp",
    sizes: [
      { name: "450 g", price: 5.9, description: "Une belle portion fraîche", isDefault: true, order: 1 },
      { name: "À partager", price: 10.9, description: "Pour deux à trois personnes", order: 2 },
    ],
    options: [
      { name: "Mangue", extraPrice: 0, includedByDefault: true, order: 1 },
      { name: "Ananas", extraPrice: 0, includedByDefault: true, order: 2 },
      { name: "Kiwi", extraPrice: 0, includedByDefault: true, order: 3 },
      { name: "Fruits rouges", extraPrice: 2, order: 4 },
    ],
  })

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
