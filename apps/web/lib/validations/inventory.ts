import { z } from "zod/v3"

import type {
  InventoryMovementType,
  InventoryUnit,
} from "@workspace/shared"

// ─── Enums as const arrays for form selects ──────────────────────────────────

export const INVENTORY_UNITS: InventoryUnit[] = [
  "BAG",
  "SACK",
  "KILOGRAM",
  "GRAM",
  "LITER",
  "MILLILITER",
  "TRAY",
  "PIECE",
  "HEAD",
  "CRATE",
  "BOX",
]

export const INVENTORY_MOVEMENT_TYPES: InventoryMovementType[] = [
  "PURCHASE",
  "PRODUCTION_IN",
  "SALE_OUT",
  "ADJUSTMENT_IN",
  "ADJUSTMENT_OUT",
  "SPOILAGE",
  "TRANSFER_OUT",
  "TRANSFER_IN",
]

// ─── Human-readable labels ────────────────────────────────────────────────────

export const UNIT_LABELS: Record<InventoryUnit, string> = {
  BAG: "Bag",
  SACK: "Sack",
  KILOGRAM: "Kilogram",
  GRAM: "Gram",
  LITER: "Liter",
  MILLILITER: "mL",
  TRAY: "Tray",
  PIECE: "Piece",
  HEAD: "Head",
  CRATE: "Crate",
  BOX: "Box",
}

export const MOVEMENT_TYPE_LABELS: Record<InventoryMovementType, string> = {
  PURCHASE: "Purchase / Delivery",
  PRODUCTION_IN: "Production In",
  SALE_OUT: "Sale Out",
  ADJUSTMENT_IN: "Adjustment In",
  ADJUSTMENT_OUT: "Adjustment Out",
  SPOILAGE: "Spoilage",
  TRANSFER_OUT: "Transfer Out",
  TRANSFER_IN: "Transfer In",
}

// ─── Zod schemas ─────────────────────────────────────────────────────────────

export const createMovementSchema = z.object({
  itemId: z.string().min(1, "Select an item"),
  type: z.enum(
    [
      "PURCHASE",
      "PRODUCTION_IN",
      "SALE_OUT",
      "ADJUSTMENT_IN",
      "ADJUSTMENT_OUT",
      "SPOILAGE",
      "TRANSFER_OUT",
      "TRANSFER_IN",
    ] as const,
    { message: "Select a movement type" }
  ),
  quantity: z
    .number()
    .positive("Quantity must be greater than zero"),
  unitCostSnapshot: z
    .number()
    .nonnegative("Unit cost cannot be negative")
    .optional(),
  reference: z.string().max(100).optional(),
  notes: z.string().max(500).optional(),
})

export type CreateMovementFormValues = z.infer<typeof createMovementSchema>

// ─── Add item schema ──────────────────────────────────────────────────────────

export const createItemSchema = z.object({
  name: z.string().min(1, "Item name is required").max(120),
  sku: z.string().min(1, "SKU is required").max(50),
  category: z
    .string()
    .trim()
    .min(1, "Category is required")
    .max(60, "Category must be 60 characters or fewer"),
  unit: z.enum(
    [
      "BAG",
      "SACK",
      "KILOGRAM",
      "GRAM",
      "LITER",
      "MILLILITER",
      "TRAY",
      "PIECE",
      "HEAD",
      "CRATE",
      "BOX",
    ] as const,
    { message: "Select a unit" }
  ),
  onHandQuantity: z.number().nonnegative("Cannot be negative"),
  reorderPoint: z.number().nonnegative("Cannot be negative"),
  unitCost: z.number().nonnegative("Cannot be negative"),
})

export type CreateItemFormValues = z.infer<typeof createItemSchema>
