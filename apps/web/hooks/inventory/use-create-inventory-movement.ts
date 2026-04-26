"use client"

import { useAuth } from "@clerk/nextjs"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import type { CreateInventoryMovementRequest } from "@workspace/shared"

import { createInventoryMovement } from "@/lib/api/inventory"
import { inventoryItemsQueryKey } from "@/hooks/inventory/use-inventory-items"
import { inventoryMovementsQueryKey } from "@/hooks/inventory/use-inventory-movements"

export function useCreateInventoryMovement() {
  const { getToken } = useAuth()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (data: CreateInventoryMovementRequest) => {
      const token = await getToken()
      if (!token) throw new Error("No token found")
      return createInventoryMovement(token, data)
    },
    onSuccess: () => {
      // Invalidate both items (onHandQuantity changes) and movements list
      void queryClient.invalidateQueries({ queryKey: inventoryItemsQueryKey })
      void queryClient.invalidateQueries({
        queryKey: inventoryMovementsQueryKey,
      })
    },
  })
}
