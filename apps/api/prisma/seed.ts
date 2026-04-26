import { randomUUID } from "node:crypto"
import { existsSync } from "node:fs"
import { join } from "node:path"

import { PrismaPg } from "@prisma/adapter-pg"
import { config as loadEnv } from "dotenv"

import { PrismaClient } from "../src/generated/prisma/client"

type SeedUnit =
  | "BAG"
  | "SACK"
  | "KILOGRAM"
  | "GRAM"
  | "LITER"
  | "MILLILITER"
  | "TRAY"
  | "PIECE"
  | "HEAD"
  | "CRATE"
  | "BOX"

type SeedMovementType =
  | "PURCHASE"
  | "PRODUCTION_IN"
  | "SALE_OUT"
  | "ADJUSTMENT_IN"
  | "ADJUSTMENT_OUT"
  | "SPOILAGE"
  | "TRANSFER_OUT"
  | "TRANSFER_IN"

type SeedItem = {
  id: string
  name: string
  sku: string
  category: string
  unit: SeedUnit
  reorderPoint: number
  onHandQuantity: number
  unitCost: number
  isActive: boolean
}

type SeedMovement = {
  id: string
  itemId: string
  type: SeedMovementType
  quantity: number
  unitCostSnapshot: number | null
  reference: string
  notes: string | null
}

type ItemBlueprint = {
  category: string
  name: string
  skuPrefix: string
  unit: SeedUnit
  reorderPointBase: number
  reorderPointStep: number
  inboundType: Extract<SeedMovementType, "PURCHASE" | "PRODUCTION_IN">
  inboundQuantityBase: number
  inboundQuantityStep: number
  inboundCostBase: number
  inboundCostStep: number
  outboundType: Extract<
    SeedMovementType,
    "SALE_OUT" | "ADJUSTMENT_OUT" | "TRANSFER_OUT" | "SPOILAGE"
  >
  outboundQuantityBase: number
  outboundQuantityStep: number
}

const BATCH_SIZE = 25

const itemBlueprints: ItemBlueprint[] = [
  {
    category: "Raw Material",
    name: "Food-Grade Plastic Pellets",
    skuPrefix: "RM-PLT",
    unit: "SACK",
    reorderPointBase: 8,
    reorderPointStep: 1,
    inboundType: "PURCHASE",
    inboundQuantityBase: 48,
    inboundQuantityStep: 4,
    inboundCostBase: 920,
    inboundCostStep: 24,
    outboundType: "ADJUSTMENT_OUT",
    outboundQuantityBase: 3,
    outboundQuantityStep: 1,
  },
  {
    category: "Raw Material",
    name: "Corrugated Board Sheets",
    skuPrefix: "RM-CBD",
    unit: "BOX",
    reorderPointBase: 10,
    reorderPointStep: 2,
    inboundType: "PURCHASE",
    inboundQuantityBase: 60,
    inboundQuantityStep: 5,
    inboundCostBase: 440,
    inboundCostStep: 18,
    outboundType: "TRANSFER_OUT",
    outboundQuantityBase: 5,
    outboundQuantityStep: 1,
  },
  {
    category: "Packaging",
    name: "Corrugated Shipping Boxes",
    skuPrefix: "PKG-BX",
    unit: "BOX",
    reorderPointBase: 16,
    reorderPointStep: 2,
    inboundType: "PURCHASE",
    inboundQuantityBase: 72,
    inboundQuantityStep: 6,
    inboundCostBase: 58,
    inboundCostStep: 3,
    outboundType: "SALE_OUT",
    outboundQuantityBase: 12,
    outboundQuantityStep: 2,
  },
  {
    category: "Packaging",
    name: "Label Sticker Rolls",
    skuPrefix: "PKG-LBL",
    unit: "PIECE",
    reorderPointBase: 20,
    reorderPointStep: 2,
    inboundType: "PURCHASE",
    inboundQuantityBase: 95,
    inboundQuantityStep: 7,
    inboundCostBase: 14,
    inboundCostStep: 1,
    outboundType: "TRANSFER_OUT",
    outboundQuantityBase: 11,
    outboundQuantityStep: 1,
  },
  {
    category: "Supply",
    name: "Industrial Cleaning Solution",
    skuPrefix: "SUP-CLN",
    unit: "LITER",
    reorderPointBase: 12,
    reorderPointStep: 1,
    inboundType: "PURCHASE",
    inboundQuantityBase: 36,
    inboundQuantityStep: 3,
    inboundCostBase: 146,
    inboundCostStep: 6,
    outboundType: "ADJUSTMENT_OUT",
    outboundQuantityBase: 4,
    outboundQuantityStep: 1,
  },
  {
    category: "Supply",
    name: "Protective Gloves",
    skuPrefix: "SUP-GLV",
    unit: "BOX",
    reorderPointBase: 9,
    reorderPointStep: 1,
    inboundType: "PURCHASE",
    inboundQuantityBase: 32,
    inboundQuantityStep: 3,
    inboundCostBase: 122,
    inboundCostStep: 5,
    outboundType: "SALE_OUT",
    outboundQuantityBase: 6,
    outboundQuantityStep: 1,
  },
  {
    category: "Finished Good",
    name: "Premium Rice 25 kg",
    skuPrefix: "FG-RCE",
    unit: "SACK",
    reorderPointBase: 10,
    reorderPointStep: 1,
    inboundType: "PRODUCTION_IN",
    inboundQuantityBase: 44,
    inboundQuantityStep: 4,
    inboundCostBase: 1280,
    inboundCostStep: 20,
    outboundType: "SALE_OUT",
    outboundQuantityBase: 9,
    outboundQuantityStep: 2,
  },
  {
    category: "Finished Good",
    name: "Refined Cooking Oil 1L",
    skuPrefix: "FG-OIL",
    unit: "CRATE",
    reorderPointBase: 11,
    reorderPointStep: 1,
    inboundType: "PRODUCTION_IN",
    inboundQuantityBase: 40,
    inboundQuantityStep: 4,
    inboundCostBase: 780,
    inboundCostStep: 18,
    outboundType: "SALE_OUT",
    outboundQuantityBase: 8,
    outboundQuantityStep: 1,
  },
  {
    category: "Consumable",
    name: "Printer Thermal Rolls",
    skuPrefix: "CON-THM",
    unit: "PIECE",
    reorderPointBase: 18,
    reorderPointStep: 2,
    inboundType: "PURCHASE",
    inboundQuantityBase: 84,
    inboundQuantityStep: 5,
    inboundCostBase: 9,
    inboundCostStep: 1,
    outboundType: "ADJUSTMENT_OUT",
    outboundQuantityBase: 7,
    outboundQuantityStep: 1,
  },
  {
    category: "MRO",
    name: "Maintenance Lubricant",
    skuPrefix: "MRO-LUB",
    unit: "LITER",
    reorderPointBase: 7,
    reorderPointStep: 1,
    inboundType: "PURCHASE",
    inboundQuantityBase: 28,
    inboundQuantityStep: 2,
    inboundCostBase: 210,
    inboundCostStep: 8,
    outboundType: "TRANSFER_OUT",
    outboundQuantityBase: 3,
    outboundQuantityStep: 1,
  },
]

const stockIncreaseTypes = new Set<SeedMovementType>([
  "PURCHASE",
  "PRODUCTION_IN",
  "ADJUSTMENT_IN",
  "TRANSFER_IN",
])

function loadDatabaseEnv() {
  if (process.env.DATABASE_URL) {
    return
  }

  const envPath = [
    ".env",
    "apps/api/.env",
    join(__dirname, "../.env"),
  ].find((path) => existsSync(path))

  if (envPath) {
    loadEnv({ path: envPath })
  }
}

function roundQuantity(value: number): number {
  return Number(value.toFixed(2))
}

function getSignedQuantity(type: SeedMovementType, quantity: number): number {
  return stockIncreaseTypes.has(type) ? quantity : -quantity
}

function createSeedDataset() {
  const items: SeedItem[] = []
  const movements: SeedMovement[] = []

  for (let index = 0; index < 50; index += 1) {
    const blueprint = itemBlueprints[index % itemBlueprints.length]
    const sequence = Math.floor(index / itemBlueprints.length) + 1
    const itemId = randomUUID()

    const inboundQuantity = roundQuantity(
      blueprint.inboundQuantityBase + sequence * blueprint.inboundQuantityStep
    )
    const outboundQuantity = roundQuantity(
      blueprint.outboundQuantityBase + sequence * blueprint.outboundQuantityStep
    )
    const unitCost = roundQuantity(
      blueprint.inboundCostBase + sequence * blueprint.inboundCostStep
    )
    const reorderPoint =
      blueprint.reorderPointBase + sequence * blueprint.reorderPointStep
    const onHandQuantity = roundQuantity(inboundQuantity - outboundQuantity)

    if (onHandQuantity < 0) {
      throw new Error(
        `Generated seed stock below zero for ${blueprint.skuPrefix}-${String(sequence).padStart(3, "0")}`
      )
    }

    const sku = `${blueprint.skuPrefix}-${String(sequence).padStart(3, "0")}`

    items.push({
      id: itemId,
      name: `${blueprint.name} ${sequence}`,
      sku,
      category: blueprint.category,
      unit: blueprint.unit,
      reorderPoint,
      onHandQuantity,
      unitCost,
      isActive: true,
    })

    movements.push({
      id: randomUUID(),
      itemId,
      type: blueprint.inboundType,
      quantity: inboundQuantity,
      unitCostSnapshot: unitCost,
      reference: `SEED-IN-${String(index + 1).padStart(4, "0")}`,
      notes:
        blueprint.inboundType === "PURCHASE"
          ? "Opening seeded receipt"
          : "Opening seeded production entry",
    })

    movements.push({
      id: randomUUID(),
      itemId,
      type: blueprint.outboundType,
      quantity: outboundQuantity,
      unitCostSnapshot: null,
      reference: `SEED-OUT-${String(index + 1).padStart(4, "0")}`,
      notes:
        blueprint.outboundType === "SALE_OUT"
          ? "Sample outgoing sales movement"
          : blueprint.outboundType === "SPOILAGE"
            ? "Sample write-off movement"
            : "Sample operational stock movement",
    })
  }

  return { items, movements }
}

async function createInBatches<T>(
  values: T[],
  createBatch: (batch: T[]) => Promise<unknown>
) {
  for (let index = 0; index < values.length; index += BATCH_SIZE) {
    await createBatch(values.slice(index, index + BATCH_SIZE))
  }
}

async function main() {
  loadDatabaseEnv()

  const connectionString = process.env.DATABASE_URL

  if (!connectionString) {
    throw new Error("DATABASE_URL is required to seed the database")
  }

  const prisma = new PrismaClient({
    adapter: new PrismaPg(connectionString),
  })

  try {
    const [itemCount, movementCount] = await Promise.all([
      prisma.inventoryItem.count(),
      prisma.inventoryMovement.count(),
    ])

    if (itemCount > 0 || movementCount > 0) {
      console.log(
        `Skipping inventory seed because existing data was found (${itemCount} items, ${movementCount} movements).`
      )
      return
    }

    const { items, movements } = createSeedDataset()

    for (const item of items) {
      const signedQuantity = movements
        .filter((movement) => movement.itemId === item.id)
        .reduce(
          (sum, movement) =>
            sum + getSignedQuantity(movement.type, movement.quantity),
          0
        )

      if (roundQuantity(signedQuantity) !== item.onHandQuantity) {
        throw new Error(`Seed totals do not match for item ${item.sku}`)
      }
    }

    await prisma.$transaction(async (tx) => {
      await createInBatches(items, async (batch) => {
        await tx.inventoryItem.createMany({
          data: batch,
        })
      })

      await createInBatches(movements, async (batch) => {
        await tx.inventoryMovement.createMany({
          data: batch,
        })
      })
    })

    console.log(
      `Seeded ${items.length} inventory items and ${movements.length} inventory movements in batches of ${BATCH_SIZE}.`
    )
  } finally {
    await prisma.$disconnect()
  }
}

main().catch((error) => {
  console.error("Inventory seed failed.")
  console.error(error)
  process.exit(1)
})
