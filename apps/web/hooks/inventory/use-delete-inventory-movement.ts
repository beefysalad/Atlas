"use client"

import { useAuth } from "@clerk/nextjs"
import { useMutation, useQueryClient } from "@tanstack/react-query"

import { inventoryItemsQueryKey } from "@/hooks/inventory/use-inventory-items"
import { inventoryMovementsQueryKey } from "@/hooks/inventory/use-inventory-movements"
import { deleteInventoryMovement } from "@/lib/api/inventory"

export function useDeleteInventoryMovement() {
  const { getToken } = useAuth()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (movementId: string) => {
      const token = await getToken()
      if (!token) throw new Error("No token found")
      return deleteInventoryMovement(token, movementId)
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: inventoryItemsQueryKey })
      void queryClient.invalidateQueries({
        queryKey: inventoryMovementsQueryKey,
      })
    },
  })
}
