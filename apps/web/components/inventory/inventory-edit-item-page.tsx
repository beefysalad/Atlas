"use client"

import { useRouter } from "next/navigation"
import { toast } from "sonner"

import { InventoryFormPageLayout } from "@/components/inventory/inventory-form-page-layout"
import { InventoryItemForm } from "@/components/inventory/inventory-item-form"
import { useInventoryItem } from "@/hooks/inventory/use-inventory-item"
import { useUpdateInventoryItem } from "@/hooks/inventory/use-update-inventory-item"
import type { CreateItemFormValues } from "@/lib/validations/inventory"
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@workspace/ui/components/alert"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card"
import { Skeleton } from "@workspace/ui/components/skeleton"
import { RiErrorWarningLine } from "@remixicon/react"

interface InventoryEditItemPageProps {
  itemId: string
}

export function InventoryEditItemPage({ itemId }: InventoryEditItemPageProps) {
  const router = useRouter()
  const { data: item, isPending, isError } = useInventoryItem(itemId)
  const updateMutation = useUpdateInventoryItem(itemId)

  async function handleSubmit(values: CreateItemFormValues) {
    await updateMutation.mutateAsync({
      ...values,
      isActive: item?.isActive ?? true,
    })
    toast.success("Inventory item updated")
    router.push("/inventory/items")
  }

  return (
    <InventoryFormPageLayout
      title="Edit inventory item"
      description="Update the inventory record details for this SKU."
    >
      {isPending ? (
        <Card className="border-border/60">
          <CardHeader>
            <CardTitle className="text-base font-semibold">
              Loading item details
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Skeleton className="h-18 w-full rounded-3xl" />
            <Skeleton className="h-18 w-full rounded-3xl" />
            <Skeleton className="h-18 w-full rounded-3xl" />
          </CardContent>
        </Card>
      ) : isError || !item ? (
        <Alert variant="destructive">
          <RiErrorWarningLine />
          <AlertTitle>Couldn&apos;t load inventory item</AlertTitle>
          <AlertDescription>
            We couldn&apos;t load the item details needed for editing.
          </AlertDescription>
        </Alert>
      ) : (
        <InventoryItemForm
          initialValues={item}
          onSubmitAction={handleSubmit}
          isPending={updateMutation.isPending}
          submitLabel="Update item"
          pendingLabel="Updating item"
          cancelHref="/inventory/items"
        />
      )}
    </InventoryFormPageLayout>
  )
}
