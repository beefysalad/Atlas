"use client"

import { useAuth } from "@clerk/nextjs"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import type { UpdateInventoryMovementRequest } from "@workspace/shared"

import { inventoryItemQueryKey } from "@/hooks/inventory/use-inventory-item"
import { inventoryItemsQueryKey } from "@/hooks/inventory/use-inventory-items"
import { inventoryMovementQueryKey } from "@/hooks/inventory/use-inventory-movement"
import { inventoryMovementsQueryKey } from "@/hooks/inventory/use-inventory-movements"
import { updateInventoryMovement } from "@/lib/api/inventory"

export function useUpdateInventoryMovement(movementId: string) {
  const { getToken } = useAuth()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (data: UpdateInventoryMovementRequest) => {
      const token = await getToken()
      if (!token) throw new Error("No token found")
      return updateInventoryMovement(token, movementId, data)
    },
    onSuccess: (movement) => {
      void queryClient.invalidateQueries({ queryKey: inventoryItemsQueryKey })
      void queryClient.invalidateQueries({
        queryKey: inventoryMovementsQueryKey,
      })
      void queryClient.invalidateQueries({
        queryKey: inventoryMovementQueryKey(movementId),
      })
      void queryClient.invalidateQueries({
        queryKey: inventoryItemQueryKey(movement.itemId),
      })
    },
  })
}
