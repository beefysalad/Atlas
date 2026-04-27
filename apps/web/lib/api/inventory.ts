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

import { apiClient } from "@/lib/axios"

type InventoryListQuery = InventoryPaginationQuery

async function getInventoryItems(
  token: string,
  query?: InventoryListQuery
): Promise<GetInventoryItemsResponse> {
  const response = await apiClient.get<GetInventoryItemsResponse>(
    "/inventory/items",
    {
      headers: { Authorization: `Bearer ${token}` },
      params: query,
    }
  )
  return response.data
}

async function getInventoryMovements(
  token: string,
  query?: InventoryListQuery
): Promise<GetInventoryMovementsResponse> {
  const response = await apiClient.get<GetInventoryMovementsResponse>(
    "/inventory/movements",
    {
      headers: { Authorization: `Bearer ${token}` },
      params: query,
    }
  )
  return response.data
}

async function getInventoryItem(
  token: string,
  itemId: string
): Promise<InventoryItem> {
  const response = await apiClient.get<InventoryItem>(
    `/inventory/items/${itemId}`,
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  )
  return response.data
}

async function createInventoryItem(
  token: string,
  data: CreateInventoryItemRequest
): Promise<InventoryItem> {
  const response = await apiClient.post<InventoryItem>(
    "/inventory/items",
    data,
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  )
  return response.data
}

async function updateInventoryItem(
  token: string,
  itemId: string,
  data: UpdateInventoryItemRequest
): Promise<InventoryItem> {
  const response = await apiClient.patch<InventoryItem>(
    `/inventory/items/${itemId}`,
    data,
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  )
  return response.data
}

async function deleteInventoryItem(
  token: string,
  itemId: string
): Promise<void> {
  await apiClient.delete(`/inventory/items/${itemId}`, {
    headers: { Authorization: `Bearer ${token}` },
  })
}

async function createInventoryMovement(
  token: string,
  data: CreateInventoryMovementRequest
): Promise<InventoryMovement> {
  const response = await apiClient.post<InventoryMovement>(
    "/inventory/movements",
    data,
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  )
  return response.data
}

async function getInventoryMovement(
  token: string,
  movementId: string
): Promise<InventoryMovement> {
  const response = await apiClient.get<InventoryMovement>(
    `/inventory/movements/${movementId}`,
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  )
  return response.data
}

async function updateInventoryMovement(
  token: string,
  movementId: string,
  data: UpdateInventoryMovementRequest
): Promise<InventoryMovement> {
  const response = await apiClient.patch<InventoryMovement>(
    `/inventory/movements/${movementId}`,
    data,
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  )
  return response.data
}

async function deleteInventoryMovement(
  token: string,
  movementId: string
): Promise<void> {
  await apiClient.delete(`/inventory/movements/${movementId}`, {
    headers: { Authorization: `Bearer ${token}` },
  })
}

export {
  createInventoryItem,
  createInventoryMovement,
  deleteInventoryItem,
  deleteInventoryMovement,
  getInventoryItem,
  getInventoryItems,
  getInventoryMovement,
  getInventoryMovements,
  updateInventoryItem,
  updateInventoryMovement,
}
