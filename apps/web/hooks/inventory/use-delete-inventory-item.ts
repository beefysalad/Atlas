"use client"

import { useAuth } from "@clerk/nextjs"
import { useMutation, useQueryClient } from "@tanstack/react-query"

import { inventoryItemsQueryKey } from "@/hooks/inventory/use-inventory-items"
import { deleteInventoryItem } from "@/lib/api/inventory"

export function useDeleteInventoryItem() {
  const { getToken } = useAuth()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (itemId: string) => {
      const token = await getToken()
      if (!token) throw new Error("No token found")
      return deleteInventoryItem(token, itemId)
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: inventoryItemsQueryKey })
    },
  })
}
