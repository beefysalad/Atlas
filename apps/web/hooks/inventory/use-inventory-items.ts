"use client"

import { useAuth } from "@clerk/nextjs"
import { keepPreviousData, useQuery } from "@tanstack/react-query"
import type {
  GetInventoryItemsResponse,
  InventoryPaginationQuery,
} from "@workspace/shared"

import { getInventoryItems } from "@/lib/api/inventory"

export const inventoryItemsQueryKey = ["inventory", "items"] as const

export function useInventoryItems(pagination?: InventoryPaginationQuery) {
  const { getToken } = useAuth()

  return useQuery<GetInventoryItemsResponse>({
    queryKey: [
      ...inventoryItemsQueryKey,
      pagination?.page ?? null,
      pagination?.pageSize ?? null,
    ],
    placeholderData: keepPreviousData,
    queryFn: async () => {
      const token = await getToken()
      if (!token) throw new Error("No token found")
      return getInventoryItems(token, pagination)
    },
  })
}
