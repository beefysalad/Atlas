"use client"

import { useAuth } from "@clerk/nextjs"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import type { CreateInventoryItemRequest } from "@workspace/shared"

import { createInventoryItem } from "@/lib/api/inventory"
import { inventoryItemsQueryKey } from "@/hooks/inventory/use-inventory-items"

export function useCreateInventoryItem() {
  const { getToken } = useAuth()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (data: CreateInventoryItemRequest) => {
      const token = await getToken()
      if (!token) throw new Error("No token found")
      return createInventoryItem(token, data)
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: inventoryItemsQueryKey })
    },
  })
}
