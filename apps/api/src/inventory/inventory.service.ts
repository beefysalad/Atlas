import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import type {
  CreateInventoryItemRequest,
  CreateInventoryMovementRequest,
  GetInventoryItemsResponse,
  GetInventoryMovementsResponse,
  InventoryItem,
  InventoryMovement,
  InventoryPaginationQuery,
  UpdateInventoryItemRequest,
  UpdateInventoryMovementRequest,
} from '@workspace/shared';
import { InventoryRepository } from './inventory.repository';

const STOCK_INCREASE_TYPES = new Set([
  'PURCHASE',
  'PRODUCTION_IN',
  'ADJUSTMENT_IN',
  'TRANSFER_IN',
]);

const STOCK_DECREASE_TYPES = new Set([
  'SALE_OUT',
  'ADJUSTMENT_OUT',
  'SPOILAGE',
  'TRANSFER_OUT',
]);

@Injectable()
export class InventoryService {
  constructor(private readonly inventoryRepository: InventoryRepository) {}

  async getInventoryItems(
    pagination?: InventoryPaginationQuery,
  ): Promise<GetInventoryItemsResponse> {
    return await this.inventoryRepository.getInventoryItems(
      this.normalizePaginationQuery(pagination),
    );
  }

  async getInventoryMovements(
    pagination?: InventoryPaginationQuery,
  ): Promise<GetInventoryMovementsResponse> {
    return await this.inventoryRepository.getInventoryMovements(
      this.normalizePaginationQuery(pagination),
    );
  }

  async createInventoryItem(input: CreateInventoryItemRequest) {
    const normalizedInput = this.normalizeInventoryItemInput(input);

    return await this.inventoryRepository.createInventoryItem({
      ...normalizedInput,
      isActive: input.isActive ?? true,
    });
  }

  async getInventoryItem(itemId: string): Promise<InventoryItem> {
    const item = await this.inventoryRepository.findItemById(itemId);

    if (!item) {
      throw new NotFoundException('Inventory item not found');
    }

    return item;
  }

  async updateInventoryItem(
    itemId: string,
    input: UpdateInventoryItemRequest,
  ): Promise<InventoryItem> {
    await this.getInventoryItem(itemId);

    return await this.inventoryRepository.updateInventoryItem(
      itemId,
      this.normalizeInventoryItemInput(input),
    );
  }

  async deleteInventoryItem(itemId: string): Promise<void> {
    await this.getInventoryItem(itemId);

    const movementCount = await this.inventoryRepository.countMovementsForItem(
      itemId,
    );

    if (movementCount > 0) {
      await this.inventoryRepository.archiveInventoryItem(itemId);
      return;
    }

    await this.inventoryRepository.deleteInventoryItem(itemId);
  }

  async createInventoryMovement(
    input: CreateInventoryMovementRequest,
  ): Promise<InventoryMovement> {
    const quantity = this.parsePositiveNumber(input.quantity, 'quantity');
    const unitCostSnapshot =
      input.unitCostSnapshot === undefined ? null : this.parseNonNegativeNumber(input.unitCostSnapshot, 'unitCostSnapshot');

    const item = await this.inventoryRepository.findItemById(input.itemId);

    if (!item) {
      throw new NotFoundException('Inventory item not found');
    }

    if (!item.isActive) {
      throw new BadRequestException(
        'Inactive inventory items cannot receive movements',
      );
    }

    const nextOnHandQuantity = this.calculateNextOnHandQuantity(
      item.onHandQuantity,
      quantity,
      input.type,
    );

    return await this.inventoryRepository.createMovementAndUpdateItem({
      itemId: input.itemId,
      type: input.type,
      quantity,
      unitCostSnapshot,
      notes: input.notes?.trim() || null,
      reference: input.reference?.trim() || null,
      nextOnHandQuantity,
    });
  }

  async getInventoryMovement(movementId: string): Promise<InventoryMovement> {
    const movement = await this.inventoryRepository.findMovementById(movementId);

    if (!movement) {
      throw new NotFoundException('Inventory movement not found');
    }

    return movement;
  }

  async updateInventoryMovement(
    movementId: string,
    input: UpdateInventoryMovementRequest,
  ): Promise<InventoryMovement> {
    const existingMovement = await this.getInventoryMovement(movementId);
    const nextItem = await this.inventoryRepository.findItemById(input.itemId);

    if (!nextItem) {
      throw new NotFoundException('Inventory item not found');
    }

    if (!nextItem.isActive) {
      throw new BadRequestException(
        'Inactive inventory items cannot receive movements',
      );
    }

    const quantity = this.parsePositiveNumber(input.quantity, 'quantity');
    const unitCostSnapshot =
      input.unitCostSnapshot === undefined
        ? null
        : this.parseNonNegativeNumber(input.unitCostSnapshot, 'unitCostSnapshot');

    const previousItem = await this.getInventoryItem(existingMovement.itemId);
    const previousSignedQuantity = this.getSignedQuantity(
      existingMovement.type,
      existingMovement.quantity,
    );
    const nextSignedQuantity = this.getSignedQuantity(input.type, quantity);

    const nextOnHandQuantityByItemId: Record<string, number> = {};

    if (existingMovement.itemId === input.itemId) {
      const nextOnHandQuantity =
        previousItem.onHandQuantity - previousSignedQuantity + nextSignedQuantity;

      this.assertNonNegativeStock(nextOnHandQuantity);
      nextOnHandQuantityByItemId[input.itemId] = nextOnHandQuantity;
    } else {
      const restoredPreviousItemQuantity =
        previousItem.onHandQuantity - previousSignedQuantity;
      const nextTargetItemQuantity = nextItem.onHandQuantity + nextSignedQuantity;

      this.assertNonNegativeStock(restoredPreviousItemQuantity);
      this.assertNonNegativeStock(nextTargetItemQuantity);

      nextOnHandQuantityByItemId[existingMovement.itemId] =
        restoredPreviousItemQuantity;
      nextOnHandQuantityByItemId[input.itemId] = nextTargetItemQuantity;
    }

    return await this.inventoryRepository.updateMovementAndRebalanceStock(
      movementId,
      {
        itemId: input.itemId,
        type: input.type,
        quantity,
        previousItemId: existingMovement.itemId,
        previousSignedQuantity,
        nextSignedQuantity,
        previousUnitCostSnapshot: previousItem.unitCost,
        nextOnHandQuantityByItemId,
        unitCostSnapshot,
        notes: input.notes?.trim() || null,
        reference: input.reference?.trim() || null,
      },
    );
  }

  async deleteInventoryMovement(movementId: string): Promise<void> {
    const movement = await this.getInventoryMovement(movementId);
    const item = await this.getInventoryItem(movement.itemId);
    const signedQuantity = this.getSignedQuantity(movement.type, movement.quantity);
    const nextOnHandQuantity = item.onHandQuantity - signedQuantity;

    this.assertNonNegativeStock(nextOnHandQuantity);

    await this.inventoryRepository.deleteMovementAndRebalanceStock(movementId, {
      itemId: movement.itemId,
      nextOnHandQuantity,
    });
  }

  private normalizeInventoryItemInput(
    input: CreateInventoryItemRequest | UpdateInventoryItemRequest,
  ): Required<
    Pick<
      UpdateInventoryItemRequest,
      'name' | 'sku' | 'category' | 'unit' | 'isActive'
    >
  > & {
    onHandQuantity: number;
    reorderPoint: number;
    unitCost: number;
  } {
    const name = input.name.trim();
    const sku = input.sku.trim().toUpperCase();
    const category = input.category.trim();

    if (!name) {
      throw new BadRequestException('Inventory item name is required');
    }

    if (!sku) {
      throw new BadRequestException('Inventory item SKU is required');
    }

    if (!category) {
      throw new BadRequestException('Inventory item category is required');
    }

    return {
      name,
      sku,
      category,
      unit: input.unit,
      onHandQuantity: this.parseNonNegativeNumber(
        input.onHandQuantity ?? 0,
        'onHandQuantity',
      ),
      reorderPoint: this.parseNonNegativeNumber(
        input.reorderPoint ?? 0,
        'reorderPoint',
      ),
      unitCost: this.parseNonNegativeNumber(input.unitCost ?? 0, 'unitCost'),
      isActive: input.isActive ?? true,
    };
  }

  private normalizePaginationQuery(
    pagination?: InventoryPaginationQuery,
  ): InventoryPaginationQuery | undefined {
    if (
      pagination?.page === undefined &&
      pagination?.pageSize === undefined
    ) {
      return undefined;
    }

    const normalizedPage = this.parsePositiveInteger(pagination?.page, 'page');
    const normalizedPageSize = this.parsePositiveInteger(
      pagination?.pageSize,
      'pageSize',
    );

    if (normalizedPageSize > 100) {
      throw new BadRequestException('pageSize must be 100 or less');
    }

    return {
      page: normalizedPage,
      pageSize: normalizedPageSize,
    };
  }

  private calculateNextOnHandQuantity(
    currentOnHandQuantity: number,
    quantity: number,
    type: CreateInventoryMovementRequest['type'],
  ): number {
    if (STOCK_INCREASE_TYPES.has(type)) {
      return currentOnHandQuantity + quantity;
    }

    if (STOCK_DECREASE_TYPES.has(type)) {
      const nextOnHandQuantity = currentOnHandQuantity - quantity;

      if (nextOnHandQuantity < 0) {
        throw new BadRequestException(
          'Inventory movement would reduce stock below zero',
        );
      }

      return nextOnHandQuantity;
    }

    throw new BadRequestException('Unsupported inventory movement type');
  }

  private getSignedQuantity(
    type: CreateInventoryMovementRequest['type'] | UpdateInventoryMovementRequest['type'],
    quantity: number,
  ): number {
    if (STOCK_INCREASE_TYPES.has(type)) {
      return quantity;
    }

    if (STOCK_DECREASE_TYPES.has(type)) {
      return -quantity;
    }

    throw new BadRequestException('Unsupported inventory movement type');
  }

  private assertNonNegativeStock(onHandQuantity: number): void {
    if (onHandQuantity < 0) {
      throw new BadRequestException(
        'Inventory movement would reduce stock below zero',
      );
    }
  }

  private parsePositiveNumber(value: number, fieldName: string): number {
    if (!Number.isFinite(value) || value <= 0) {
      throw new BadRequestException(`${fieldName} must be greater than zero`);
    }

    return value;
  }

  private parseNonNegativeNumber(value: number, fieldName: string): number {
    if (!Number.isFinite(value) || value < 0) {
      throw new BadRequestException(`${fieldName} must be zero or greater`);
    }

    return value;
  }

  private parsePositiveInteger(
    value: number | undefined,
    fieldName: string,
  ): number {
    if (value === undefined || !Number.isInteger(value) || value <= 0) {
      throw new BadRequestException(`${fieldName} must be a positive integer`);
    }

    return value;
  }
}
