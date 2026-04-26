"use client"

import { useAuth } from "@clerk/nextjs"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import type { UpdateInventoryItemRequest } from "@workspace/shared"

import { inventoryItemQueryKey } from "@/hooks/inventory/use-inventory-item"
import { inventoryItemsQueryKey } from "@/hooks/inventory/use-inventory-items"
import { updateInventoryItem } from "@/lib/api/inventory"

export function useUpdateInventoryItem(itemId: string) {
  const { getToken } = useAuth()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (data: UpdateInventoryItemRequest) => {
      const token = await getToken()
      if (!token) throw new Error("No token found")
      return updateInventoryItem(token, itemId, data)
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: inventoryItemsQueryKey })
      void queryClient.invalidateQueries({
        queryKey: inventoryItemQueryKey(itemId),
      })
    },
  })
}
