"use client"

import { useAuth } from "@clerk/nextjs"
import { useQuery } from "@tanstack/react-query"
import type { InventoryMovement } from "@workspace/shared"

import { getInventoryMovement } from "@/lib/api/inventory"

export function inventoryMovementQueryKey(movementId: string) {
  return ["inventory", "movements", movementId] as const
}

export function useInventoryMovement(movementId: string) {
  const { getToken } = useAuth()

  return useQuery<InventoryMovement>({
    queryKey: inventoryMovementQueryKey(movementId),
    queryFn: async () => {
      const token = await getToken()
      if (!token) throw new Error("No token found")
      return getInventoryMovement(token, movementId)
    },
    enabled: Boolean(movementId),
  })
}
