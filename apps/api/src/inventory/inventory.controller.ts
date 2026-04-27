import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from "@nestjs/common"
import type {
  GetInventoryItemsResponse,
  GetInventoryMovementsResponse,
  InventoryItem,
  InventoryMovement,
  InventoryPaginationQuery,
} from "@workspace/shared"
import { ClerkAuthGuard } from "../common/guards/clerk-auth.guard"
import { CreateInventoryItemDto } from "./dto/create-inventory-item.dto"
import { CreateInventoryMovementDto } from "./dto/create-inventory-movement.dto"
import { InventoryService } from "./inventory.service"
import { UpdateInventoryItemDto } from "./dto/update-inventory-item.dto"
import { UpdateInventoryMovementDto } from "./dto/update-inventory-movement.dto"

@Controller("inventory")
@UseGuards(ClerkAuthGuard)
export class InventoryController {
  constructor(private readonly inventoryService: InventoryService) {}

  @Get("items")
  getInventoryItems(
    @Query("page") page?: string,
    @Query("pageSize") pageSize?: string
  ): Promise<GetInventoryItemsResponse> {
    return this.inventoryService.getInventoryItems(
      this.toPaginationQuery(page, pageSize)
    )
  }

  @Post("items")
  createInventoryItem(
    @Body() createInventoryItemDto: CreateInventoryItemDto
  ): Promise<InventoryItem> {
    return this.inventoryService.createInventoryItem(createInventoryItemDto)
  }

  @Get("items/:itemId")
  getInventoryItem(@Param("itemId") itemId: string): Promise<InventoryItem> {
    return this.inventoryService.getInventoryItem(itemId)
  }

  @Patch("items/:itemId")
  updateInventoryItem(
    @Param("itemId") itemId: string,
    @Body() updateInventoryItemDto: UpdateInventoryItemDto
  ): Promise<InventoryItem> {
    return this.inventoryService.updateInventoryItem(
      itemId,
      updateInventoryItemDto
    )
  }

  @Delete("items/:itemId")
  deleteInventoryItem(@Param("itemId") itemId: string): Promise<void> {
    return this.inventoryService.deleteInventoryItem(itemId)
  }

  @Get("movements")
  getInventoryMovements(
    @Query("page") page?: string,
    @Query("pageSize") pageSize?: string
  ): Promise<GetInventoryMovementsResponse> {
    return this.inventoryService.getInventoryMovements(
      this.toPaginationQuery(page, pageSize)
    )
  }

  @Post("movements")
  createInventoryMovement(
    @Body() createInventoryMovementDto: CreateInventoryMovementDto
  ): Promise<InventoryMovement> {
    return this.inventoryService.createInventoryMovement(
      createInventoryMovementDto
    )
  }

  @Get("movements/:movementId")
  getInventoryMovement(
    @Param("movementId") movementId: string
  ): Promise<InventoryMovement> {
    return this.inventoryService.getInventoryMovement(movementId)
  }

  @Patch("movements/:movementId")
  updateInventoryMovement(
    @Param("movementId") movementId: string,
    @Body() updateInventoryMovementDto: UpdateInventoryMovementDto
  ): Promise<InventoryMovement> {
    return this.inventoryService.updateInventoryMovement(
      movementId,
      updateInventoryMovementDto
    )
  }

  @Delete("movements/:movementId")
  deleteInventoryMovement(
    @Param("movementId") movementId: string
  ): Promise<void> {
    return this.inventoryService.deleteInventoryMovement(movementId)
  }

  private toPaginationQuery(
    page?: string,
    pageSize?: string
  ): InventoryPaginationQuery | undefined {
    if (page === undefined && pageSize === undefined) {
      return undefined
    }

    return {
      page: page !== undefined ? Number(page) : undefined,
      pageSize: pageSize !== undefined ? Number(pageSize) : undefined,
    }
  }
}
