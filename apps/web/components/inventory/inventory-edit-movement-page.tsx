"use client"

import { useRouter } from "next/navigation"
import { toast } from "sonner"

import { InventoryFormPageLayout } from "@/components/inventory/inventory-form-page-layout"
import { InventoryMovementForm } from "@/components/inventory/inventory-movement-form"
import { useInventoryItems } from "@/hooks/inventory/use-inventory-items"
import { useInventoryMovement } from "@/hooks/inventory/use-inventory-movement"
import { useUpdateInventoryMovement } from "@/hooks/inventory/use-update-inventory-movement"
import type { CreateMovementFormValues } from "@/lib/validations/inventory"
import { Alert, AlertDescription, AlertTitle } from "@workspace/ui/components/alert"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card"
import { Skeleton } from "@workspace/ui/components/skeleton"
import { RiErrorWarningLine } from "@remixicon/react"

interface InventoryEditMovementPageProps {
  movementId: string
}

export function InventoryEditMovementPage({
  movementId,
}: InventoryEditMovementPageProps) {
  const router = useRouter()
  const {
    data: itemsData,
    isPending: itemsPending,
    isError: itemsError,
  } = useInventoryItems()
  const {
    data: movement,
    isPending: movementPending,
    isError: movementError,
  } = useInventoryMovement(movementId)
  const updateMutation = useUpdateInventoryMovement(movementId)

  async function handleSubmit(values: CreateMovementFormValues) {
    await updateMutation.mutateAsync(values)
    toast.success("Inventory movement updated")
    router.push("/inventory/movements")
  }

  const items = itemsData?.items ?? []
  const isLoading = itemsPending || movementPending
  const isError = itemsError || movementError || !movement

  return (
    <InventoryFormPageLayout
      title="Edit inventory movement"
      description="Update the movement details and keep the stock history accurate."
    >
      {isLoading ? (
        <Card className="border-border/60">
          <CardHeader>
            <CardTitle className="text-base font-semibold">
              Loading movement details
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Skeleton className="h-18 w-full rounded-3xl" />
            <Skeleton className="h-18 w-full rounded-3xl" />
            <Skeleton className="h-18 w-full rounded-3xl" />
          </CardContent>
        </Card>
      ) : isError ? (
        <Alert variant="destructive">
          <RiErrorWarningLine />
          <AlertTitle>Couldn&apos;t load inventory movement</AlertTitle>
          <AlertDescription>
            We couldn&apos;t load the movement details needed for editing.
          </AlertDescription>
        </Alert>
      ) : (
        <InventoryMovementForm
          items={items}
          initialValues={movement}
          onSubmitAction={handleSubmit}
          isPending={updateMutation.isPending}
          submitLabel="Update movement"
          pendingLabel="Updating movement"
          cancelHref="/inventory/movements"
        />
      )}
    </InventoryFormPageLayout>
  )
}
