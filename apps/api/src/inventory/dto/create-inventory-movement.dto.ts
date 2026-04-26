import type { CreateInventoryMovementRequest } from '@workspace/shared';

export class CreateInventoryMovementDto implements CreateInventoryMovementRequest {
  itemId!: string;
  type!: CreateInventoryMovementRequest['type'];
  quantity!: number;
  unitCostSnapshot?: number;
  notes?: string;
  reference?: string;
}
