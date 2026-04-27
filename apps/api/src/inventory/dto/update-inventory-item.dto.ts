import type { UpdateInventoryItemRequest } from "@workspace/shared"

export class UpdateInventoryItemDto implements UpdateInventoryItemRequest {
  name!: string
  sku!: string
  category!: UpdateInventoryItemRequest["category"]
  unit!: UpdateInventoryItemRequest["unit"]
  onHandQuantity?: number
  reorderPoint?: number
  unitCost?: number
  isActive?: boolean
}
