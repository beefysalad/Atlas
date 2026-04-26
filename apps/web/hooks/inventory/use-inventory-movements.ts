"use client"

import { useAuth } from "@clerk/nextjs"
import { keepPreviousData, useQuery } from "@tanstack/react-query"
import type {
  GetInventoryMovementsResponse,
  InventoryPaginationQuery,
} from "@workspace/shared"

import { getInventoryMovements } from "@/lib/api/inventory"

export const inventoryMovementsQueryKey = ["inventory", "movements"] as const

export function useInventoryMovements(pagination?: InventoryPaginationQuery) {
  const { getToken } = useAuth()

  return useQuery<GetInventoryMovementsResponse>({
    queryKey: [
      ...inventoryMovementsQueryKey,
      pagination?.page ?? null,
      pagination?.pageSize ?? null,
    ],
    placeholderData: keepPreviousData,
    queryFn: async () => {
      const token = await getToken()
      if (!token) throw new Error("No token found")
      return getInventoryMovements(token, pagination)
    },
  })
}
