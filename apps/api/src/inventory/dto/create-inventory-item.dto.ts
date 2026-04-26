import type { CreateInventoryItemRequest } from '@workspace/shared';

export class CreateInventoryItemDto implements CreateInventoryItemRequest {
  name!: string;
  sku!: string;
  category!: CreateInventoryItemRequest['category'];
  unit!: CreateInventoryItemRequest['unit'];
  onHandQuantity?: number;
  reorderPoint?: number;
  unitCost?: number;
  isActive?: boolean;
}
