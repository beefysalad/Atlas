"use client"

import { useRouter } from "next/navigation"
import { toast } from "sonner"

import { InventoryFormPageLayout } from "@/components/inventory/inventory-form-page-layout"
import { InventoryMovementForm } from "@/components/inventory/inventory-movement-form"
import { useCreateInventoryMovement } from "@/hooks/inventory/use-create-inventory-movement"
import { useInventoryItems } from "@/hooks/inventory/use-inventory-items"
import type { CreateMovementFormValues } from "@/lib/validations/inventory"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card"
import { Alert, AlertDescription, AlertTitle } from "@workspace/ui/components/alert"
import { Skeleton } from "@workspace/ui/components/skeleton"
import { RiErrorWarningLine } from "@remixicon/react"

export function InventoryNewMovementPage() {
  const router = useRouter()
  const {
    data,
    isPending,
    isError,
  } = useInventoryItems()
  const createMutation = useCreateInventoryMovement()

  const items = data?.items ?? []

  async function handleSubmit(values: CreateMovementFormValues) {
    await createMutation.mutateAsync(values)
    toast.success("Movement recorded")
    router.push("/inventory/movements")
  }

  return (
    <InventoryFormPageLayout
      title="Record stock movement"
      description="Post incoming or outgoing stock activity with enough detail to keep your inventory history clean and auditable."
    >
      {isPending ? (
        <Card className="border-border/60">
          <CardHeader className="gap-2">
            <CardTitle className="text-base font-semibold">
              Movement details
            </CardTitle>
            <CardDescription>
              Loading your active item list.
            </CardDescription>
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
          <AlertTitle>Couldn&apos;t load inventory items</AlertTitle>
          <AlertDescription>
            We need the item list before a movement can be recorded. Return to
            the inventory page and try again.
          </AlertDescription>
        </Alert>
      ) : (
        <InventoryMovementForm
          items={items}
          onSubmitAction={handleSubmit}
          isPending={createMutation.isPending}
        />
      )}
    </InventoryFormPageLayout>
  )
}
