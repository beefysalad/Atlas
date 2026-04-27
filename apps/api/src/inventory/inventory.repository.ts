import { Injectable } from "@nestjs/common"
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
} from "@workspace/shared"
import { PrismaService } from "../prisma/prisma.service"

function toInventoryItem(item: {
  id: string
  name: string
  sku: string
  category: string
  unit: string
  onHandQuantity: { toNumber(): number }
  reorderPoint: { toNumber(): number }
  unitCost: { toNumber(): number }
  isActive: boolean
  createdAt: Date
  updatedAt: Date
}): InventoryItem {
  return {
    id: item.id,
    name: item.name,
    sku: item.sku,
    category: item.category,
    unit: item.unit as InventoryItem["unit"],
    onHandQuantity: item.onHandQuantity.toNumber(),
    reorderPoint: item.reorderPoint.toNumber(),
    unitCost: item.unitCost.toNumber(),
    isActive: item.isActive,
    createdAt: item.createdAt.toISOString(),
    updatedAt: item.updatedAt.toISOString(),
  }
}

function toInventoryMovement(movement: {
  id: string
  itemId: string
  type: string
  quantity: { toNumber(): number }
  unitCostSnapshot: { toNumber(): number } | null
  notes: string | null
  reference: string | null
  createdAt: Date
}): InventoryMovement {
  return {
    id: movement.id,
    itemId: movement.itemId,
    type: movement.type as InventoryMovement["type"],
    quantity: movement.quantity.toNumber(),
    unitCostSnapshot: movement.unitCostSnapshot?.toNumber() ?? null,
    notes: movement.notes,
    reference: movement.reference,
    createdAt: movement.createdAt.toISOString(),
  }
}

@Injectable()
export class InventoryRepository {
  constructor(private readonly prisma: PrismaService) {}

  async getInventoryItems(
    pagination?: InventoryPaginationQuery
  ): Promise<GetInventoryItemsResponse> {
    const page = pagination?.page
    const pageSize = pagination?.pageSize
    const usePagination =
      page !== undefined && pageSize !== undefined && page > 0 && pageSize > 0

    const [items, totalItems] = await this.prisma.db.$transaction([
      this.prisma.db.inventoryItem.findMany({
        orderBy: [{ isActive: "desc" }, { name: "asc" }],
        ...(usePagination
          ? {
              skip: (page - 1) * pageSize,
              take: pageSize,
            }
          : {}),
      }),
      this.prisma.db.inventoryItem.count(),
    ])

    const effectivePageSize = usePagination
      ? pageSize
      : totalItems || items.length || 1
    const effectivePage = usePagination ? page : 1

    return {
      items: items.map(toInventoryItem),
      pagination: {
        page: effectivePage,
        pageSize: effectivePageSize,
        totalItems,
        totalPages: Math.max(1, Math.ceil(totalItems / effectivePageSize)),
      },
    }
  }

  async getInventoryMovements(
    pagination?: InventoryPaginationQuery
  ): Promise<GetInventoryMovementsResponse> {
    const page = pagination?.page
    const pageSize = pagination?.pageSize
    const usePagination =
      page !== undefined && pageSize !== undefined && page > 0 && pageSize > 0

    const [movements, totalItems] = await this.prisma.db.$transaction([
      this.prisma.db.inventoryMovement.findMany({
        orderBy: [{ createdAt: "desc" }],
        ...(usePagination
          ? {
              skip: (page - 1) * pageSize,
              take: pageSize,
            }
          : {}),
      }),
      this.prisma.db.inventoryMovement.count(),
    ])

    const effectivePageSize = usePagination
      ? pageSize
      : totalItems || movements.length || 1
    const effectivePage = usePagination ? page : 1

    return {
      movements: movements.map(toInventoryMovement),
      pagination: {
        page: effectivePage,
        pageSize: effectivePageSize,
        totalItems,
        totalPages: Math.max(1, Math.ceil(totalItems / effectivePageSize)),
      },
    }
  }

  async createInventoryItem(
    input: Required<
      Pick<
        CreateInventoryItemRequest,
        "name" | "sku" | "category" | "unit" | "isActive"
      >
    > & {
      onHandQuantity: number
      reorderPoint: number
      unitCost: number
    }
  ): Promise<InventoryItem> {
    const item = await this.prisma.db.inventoryItem.create({
      data: input,
    })

    return toInventoryItem(item)
  }

  async updateInventoryItem(
    itemId: string,
    input: Required<
      Pick<
        UpdateInventoryItemRequest,
        "name" | "sku" | "category" | "unit" | "isActive"
      >
    > & {
      onHandQuantity: number
      reorderPoint: number
      unitCost: number
    }
  ): Promise<InventoryItem> {
    const item = await this.prisma.db.inventoryItem.update({
      where: { id: itemId },
      data: input,
    })

    return toInventoryItem(item)
  }

  async findItemById(itemId: string): Promise<InventoryItem | null> {
    const item = await this.prisma.db.inventoryItem.findUnique({
      where: { id: itemId },
    })

    return item ? toInventoryItem(item) : null
  }

  async countMovementsForItem(itemId: string): Promise<number> {
    return await this.prisma.db.inventoryMovement.count({
      where: { itemId },
    })
  }

  async archiveInventoryItem(itemId: string): Promise<InventoryItem> {
    const item = await this.prisma.db.inventoryItem.update({
      where: { id: itemId },
      data: { isActive: false },
    })

    return toInventoryItem(item)
  }

  async deleteInventoryItem(itemId: string): Promise<void> {
    await this.prisma.db.inventoryItem.delete({
      where: { id: itemId },
    })
  }

  async findMovementById(
    movementId: string
  ): Promise<InventoryMovement | null> {
    const movement = await this.prisma.db.inventoryMovement.findUnique({
      where: { id: movementId },
    })

    return movement ? toInventoryMovement(movement) : null
  }

  async createMovementAndUpdateItem(
    input: Required<
      Pick<CreateInventoryMovementRequest, "itemId" | "type" | "quantity">
    > & {
      unitCostSnapshot: number | null
      notes: string | null
      reference: string | null
      nextOnHandQuantity: number
    }
  ): Promise<InventoryMovement> {
    const movement = await this.prisma.db.$transaction(async (tx) => {
      await tx.inventoryItem.update({
        where: { id: input.itemId },
        data: {
          onHandQuantity: input.nextOnHandQuantity,
          ...(input.unitCostSnapshot !== null
            ? { unitCost: input.unitCostSnapshot }
            : {}),
        },
      })

      return await tx.inventoryMovement.create({
        data: {
          itemId: input.itemId,
          type: input.type,
          quantity: input.quantity,
          unitCostSnapshot: input.unitCostSnapshot,
          notes: input.notes,
          reference: input.reference,
        },
      })
    })

    return toInventoryMovement(movement)
  }

  async updateMovementAndRebalanceStock(
    movementId: string,
    input: Required<
      Pick<UpdateInventoryMovementRequest, "itemId" | "type" | "quantity">
    > & {
      previousItemId: string
      previousSignedQuantity: number
      nextSignedQuantity: number
      previousUnitCostSnapshot: number | null
      nextOnHandQuantityByItemId: Record<string, number>
      unitCostSnapshot: number | null
      notes: string | null
      reference: string | null
    }
  ): Promise<InventoryMovement> {
    const movement = await this.prisma.db.$transaction(async (tx) => {
      for (const [itemId, onHandQuantity] of Object.entries(
        input.nextOnHandQuantityByItemId
      )) {
        const shouldApplyUnitCost =
          itemId === input.itemId && input.unitCostSnapshot !== null
        const itemUpdateData: {
          onHandQuantity: number
          unitCost?: number
        } = {
          onHandQuantity,
        }

        if (shouldApplyUnitCost) {
          itemUpdateData.unitCost = input.unitCostSnapshot ?? undefined
        }

        await tx.inventoryItem.update({
          where: { id: itemId },
          data: itemUpdateData,
        })
      }

      if (
        input.previousItemId !== input.itemId &&
        input.previousUnitCostSnapshot !== null
      ) {
        await tx.inventoryItem.update({
          where: { id: input.previousItemId },
          data: {
            unitCost: input.previousUnitCostSnapshot,
          },
        })
      }

      return await tx.inventoryMovement.update({
        where: { id: movementId },
        data: {
          itemId: input.itemId,
          type: input.type,
          quantity: input.quantity,
          unitCostSnapshot: input.unitCostSnapshot,
          notes: input.notes,
          reference: input.reference,
        },
      })
    })

    return toInventoryMovement(movement)
  }

  async deleteMovementAndRebalanceStock(
    movementId: string,
    input: {
      itemId: string
      nextOnHandQuantity: number
    }
  ): Promise<void> {
    await this.prisma.db.$transaction(async (tx) => {
      await tx.inventoryItem.update({
        where: { id: input.itemId },
        data: {
          onHandQuantity: input.nextOnHandQuantity,
        },
      })

      await tx.inventoryMovement.delete({
        where: { id: movementId },
      })
    })
  }
}
