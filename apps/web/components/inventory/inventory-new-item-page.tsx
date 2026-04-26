"use client"

import { useRouter } from "next/navigation"
import { toast } from "sonner"

import { InventoryFormPageLayout } from "@/components/inventory/inventory-form-page-layout"
import { InventoryItemForm } from "@/components/inventory/inventory-item-form"
import { useCreateInventoryItem } from "@/hooks/inventory/use-create-inventory-item"
import type { CreateItemFormValues } from "@/lib/validations/inventory"

export function InventoryNewItemPage() {
  const router = useRouter()
  const createMutation = useCreateInventoryItem()

  async function handleSubmit(values: CreateItemFormValues) {
    await createMutation.mutateAsync({
      ...values,
      isActive: true,
    })
    toast.success("Item added to inventory")
    router.push("/inventory/items")
  }

  return (
    <InventoryFormPageLayout
      title="Add inventory item"
      description="Set up a stock record with its SKU, category, unit, opening quantity, and reorder point before you start posting movements."
    >
      <InventoryItemForm
        onSubmitAction={handleSubmit}
        isPending={createMutation.isPending}
      />
    </InventoryFormPageLayout>
  )
}
