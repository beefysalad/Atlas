"use client"

import Link from "next/link"
import { zodResolver } from "@hookform/resolvers/zod"
import { RiAddLine, RiLoader4Line } from "@remixicon/react"
import type { InventoryItem, InventoryMovement } from "@workspace/shared"
import { useForm } from "react-hook-form"

import { Button } from "@workspace/ui/components/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card"
import { Input } from "@workspace/ui/components/input"
import { InventoryItemCombobox } from "@/components/inventory/inventory-item-combobox"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@workspace/ui/components/select"
import { Textarea } from "@workspace/ui/components/textarea"

import { InventoryFormField } from "@/components/inventory/inventory-form-field"
import {
  createMovementSchema,
  INVENTORY_MOVEMENT_TYPES,
  MOVEMENT_TYPE_LABELS,
  type CreateMovementFormValues,
} from "@/lib/validations/inventory"

interface InventoryMovementFormProps {
  items: InventoryItem[]
  initialValues?: Partial<CreateMovementFormValues> | InventoryMovement
  isPending?: boolean
  submitLabel?: string
  pendingLabel?: string
  cancelHref?: string
  onSubmitAction: (values: CreateMovementFormValues) => void | Promise<void>
}

export function InventoryMovementForm({
  items,
  initialValues,
  isPending = false,
  submitLabel = "Save movement",
  pendingLabel = "Saving movement",
  cancelHref = "/inventory",
  onSubmitAction,
}: InventoryMovementFormProps) {
  const itemValue = initialValues?.itemId
  const typeValue = initialValues?.type

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<CreateMovementFormValues>({
    resolver: zodResolver(createMovementSchema),
    defaultValues: {
      itemId: itemValue,
      type: typeValue,
      quantity: initialValues?.quantity,
      unitCostSnapshot: initialValues?.unitCostSnapshot ?? undefined,
      reference: initialValues?.reference ?? undefined,
      notes: initialValues?.notes ?? undefined,
    },
  })

  const selectedItemId = watch("itemId")
  const selectedType = watch("type")

  const activeItems = items.filter((i) => i.isActive)

  return (
    <Card className="border-border/60">
      <CardHeader className="gap-2">
        <CardTitle className="text-base font-semibold">
          Movement details
        </CardTitle>
        <CardDescription>
          Log receipts, usage, sales, transfers, write-offs, or adjustments
          against current stock on hand.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmitAction)} className="space-y-5">
          <InventoryFormField
            htmlFor="itemId"
            label="Inventory item"
            error={errors.itemId?.message}
          >
            <InventoryItemCombobox
              items={activeItems}
              value={selectedItemId}
              placeholder="Select item…"
              emptyText="No matching active items"
              onValueChange={(v) =>
                setValue("itemId", v, { shouldValidate: true })
              }
            />
          </InventoryFormField>

          <InventoryFormField
            htmlFor="type"
            label="Movement type"
            error={errors.type?.message}
          >
            <Select
              onValueChange={(v) =>
                setValue("type", v as CreateMovementFormValues["type"], {
                  shouldValidate: true,
                })
              }
            >
              <SelectTrigger id="type" className="w-full">
                <SelectValue placeholder="Select type…" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  {INVENTORY_MOVEMENT_TYPES.map((type) => (
                    <SelectItem key={type} value={type}>
                      {MOVEMENT_TYPE_LABELS[type]}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </InventoryFormField>

          <InventoryFormField
            htmlFor="quantity"
            label="Quantity"
            error={errors.quantity?.message}
          >
            <Input
              id="quantity"
              type="number"
              step="0.01"
              min="0.01"
              placeholder={
                selectedType === "SPOILAGE"
                  ? "e.g. 4 units written off"
                  : selectedType === "PURCHASE"
                    ? "e.g. 200 units received"
                    : "Enter quantity"
              }
              {...register("quantity", { valueAsNumber: true })}
            />
          </InventoryFormField>

          <InventoryFormField
            htmlFor="unitCostSnapshot"
            label="Unit cost"
            optional
            error={errors.unitCostSnapshot?.message}
          >
            <Input
              id="unitCostSnapshot"
              type="number"
              step="0.01"
              min="0"
              placeholder="₱ per unit at time of movement"
              {...register("unitCostSnapshot", { valueAsNumber: true })}
            />
          </InventoryFormField>

          <InventoryFormField
            htmlFor="reference"
            label="Reference"
            optional
            error={errors.reference?.message}
          >
            <Input
              id="reference"
              placeholder="e.g. PO-1042, INV-88, Transfer A1"
              {...register("reference")}
            />
          </InventoryFormField>

          <InventoryFormField
            htmlFor="notes"
            label="Notes"
            optional
            error={errors.notes?.message}
          >
            <Textarea
              id="notes"
              rows={3}
              placeholder={
                selectedType === "SPOILAGE"
                  ? "e.g. Damaged during handling"
                  : selectedType === "PURCHASE"
                    ? "e.g. Received from main vendor"
                    : "Additional details about this movement"
              }
              {...register("notes")}
            />
          </InventoryFormField>

          <div className="flex gap-3 pt-2">
            <Button asChild type="button" variant="outline" className="flex-1">
              <Link href={cancelHref}>Cancel</Link>
            </Button>
            <Button type="submit" className="flex-1" disabled={isPending}>
              {isPending ? (
                <>
                  <RiLoader4Line className="size-4 animate-spin" />
                  {pendingLabel}
                </>
              ) : (
                <>
                  <RiAddLine className="size-4" />
                  {submitLabel}
                </>
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
