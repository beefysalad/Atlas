import type { UpdateInventoryMovementRequest } from "@workspace/shared"

export class UpdateInventoryMovementDto implements UpdateInventoryMovementRequest {
  itemId!: string
  type!: UpdateInventoryMovementRequest["type"]
  quantity!: number
  unitCostSnapshot?: number
  notes?: string
  reference?: string
}
