"use client"

import { useAuth } from "@clerk/nextjs"
import { useQuery } from "@tanstack/react-query"
import type { InventoryItem } from "@workspace/shared"

import { getInventoryItem } from "@/lib/api/inventory"

export function inventoryItemQueryKey(itemId: string) {
  return ["inventory", "items", itemId] as const
}

export function useInventoryItem(itemId: string) {
  const { getToken } = useAuth()

  return useQuery<InventoryItem>({
    queryKey: inventoryItemQueryKey(itemId),
    queryFn: async () => {
      const token = await getToken()
      if (!token) throw new Error("No token found")
      return getInventoryItem(token, itemId)
    },
    enabled: Boolean(itemId),
  })
}
