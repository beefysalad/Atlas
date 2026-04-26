export type InventoryCategory = string

export type InventoryUnit =
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

export type InventoryMovementType =
  | "PURCHASE"
  | "PRODUCTION_IN"
  | "SALE_OUT"
  | "ADJUSTMENT_IN"
  | "ADJUSTMENT_OUT"
  | "SPOILAGE"
  | "TRANSFER_OUT"
  | "TRANSFER_IN"

export type InventoryItem = {
  id: string
  name: string
  sku: string
  category: InventoryCategory
  unit: InventoryUnit
  onHandQuantity: number
  reorderPoint: number
  unitCost: number
  isActive: boolean
  createdAt: string
  updatedAt: string
}

export type InventoryMovement = {
  id: string
  itemId: string
  type: InventoryMovementType
  quantity: number
  unitCostSnapshot: number | null
  notes: string | null
  reference: string | null
  createdAt: string
}

export type InventoryPaginationQuery = {
  page?: number
  pageSize?: number
}

export type InventoryPaginationMeta = {
  page: number
  pageSize: number
  totalItems: number
  totalPages: number
}

export type GetInventoryItemsResponse = {
  items: InventoryItem[]
  pagination: InventoryPaginationMeta
}

export type GetInventoryMovementsResponse = {
  movements: InventoryMovement[]
  pagination: InventoryPaginationMeta
}

export type CreateInventoryItemRequest = {
  name: string
  sku: string
  category: InventoryCategory
  unit: InventoryUnit
  onHandQuantity?: number
  reorderPoint?: number
  unitCost?: number
  isActive?: boolean
}

export type CreateInventoryMovementRequest = {
  itemId: string
  type: InventoryMovementType
  quantity: number
  unitCostSnapshot?: number
  notes?: string
  reference?: string
}

export type UpdateInventoryItemRequest = {
  name: string
  sku: string
  category: InventoryCategory
  unit: InventoryUnit
  onHandQuantity?: number
  reorderPoint?: number
  unitCost?: number
  isActive?: boolean
}

export type UpdateInventoryMovementRequest = {
  itemId: string
  type: InventoryMovementType
  quantity: number
  unitCostSnapshot?: number
  notes?: string
  reference?: string
}
