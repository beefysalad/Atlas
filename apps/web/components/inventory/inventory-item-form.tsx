"use client"

import Link from "next/link"
import { zodResolver } from "@hookform/resolvers/zod"
import { RiAddLine, RiLoader4Line } from "@remixicon/react"
import type { InventoryItem } from "@workspace/shared"
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
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@workspace/ui/components/select"

import { InventoryFormField } from "@/components/inventory/inventory-form-field"
import {
  createItemSchema,
  INVENTORY_UNITS,
  type CreateItemFormValues,
  UNIT_LABELS,
} from "@/lib/validations/inventory"

interface InventoryItemFormProps {
  initialValues?: Partial<CreateItemFormValues> | InventoryItem
  isPending?: boolean
  submitLabel?: string
  pendingLabel?: string
  cancelHref?: string
  onSubmitAction: (values: CreateItemFormValues) => void | Promise<void>
}

export function InventoryItemForm({
  initialValues,
  isPending = false,
  submitLabel = "Add item",
  pendingLabel = "Saving item",
  cancelHref = "/inventory",
  onSubmitAction,
}: InventoryItemFormProps) {
  const unitValue = initialValues?.unit

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<CreateItemFormValues>({
    resolver: zodResolver(createItemSchema),
    defaultValues: {
      name: initialValues?.name ?? "",
      sku: initialValues?.sku ?? "",
      category: initialValues?.category ?? "",
      unit: unitValue,
      onHandQuantity: initialValues?.onHandQuantity ?? 0,
      reorderPoint: initialValues?.reorderPoint ?? 0,
      unitCost: initialValues?.unitCost ?? 0,
    },
  })
  const selectedUnit = watch("unit")

  return (
    <Card className="border-border/60">
      <CardHeader className="gap-2">
        <CardTitle className="text-base font-semibold">
          Item details
        </CardTitle>
        <CardDescription>
          Create a stock record for a material, product, supply, or other item
          you want to track on hand.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form
          onSubmit={handleSubmit(onSubmitAction)}
          className="space-y-5"
        >
          <InventoryFormField htmlFor="name" label="Item name" error={errors.name?.message}>
            <Input
              id="name"
              placeholder="e.g. Corrugated Boxes, Cleaning Solution, Premium Rice"
              {...register("name")}
            />
          </InventoryFormField>

          <InventoryFormField htmlFor="sku" label="SKU" error={errors.sku?.message}>
            <Input
              id="sku"
              placeholder="e.g. RM-001, FG-BOX-12, SUP-045"
              className="font-mono"
              {...register("sku")}
            />
          </InventoryFormField>

          <div className="grid grid-cols-2 gap-3">
            <InventoryFormField
              htmlFor="category"
              label="Category"
              error={errors.category?.message}
            >
              <Input
                id="category"
                placeholder="e.g. Raw Material, Finished Good, Supply"
                {...register("category")}
              />
            </InventoryFormField>

            <InventoryFormField
              htmlFor="unit"
              label="Unit"
              error={errors.unit?.message}
            >
              <Select
                value={selectedUnit}
                onValueChange={(v) =>
                  setValue("unit", v as CreateItemFormValues["unit"], {
                    shouldValidate: true,
                  })
                }
              >
                <SelectTrigger id="unit" className="w-full">
                  <SelectValue placeholder="Select…" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    {INVENTORY_UNITS.map((unit) => (
                      <SelectItem key={unit} value={unit}>
                        {UNIT_LABELS[unit]}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </InventoryFormField>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <InventoryFormField
              htmlFor="onHandQuantity"
              label="Opening stock"
              error={errors.onHandQuantity?.message}
            >
              <Input
                id="onHandQuantity"
                type="number"
                step="0.01"
                min="0"
                placeholder="0"
                {...register("onHandQuantity", { valueAsNumber: true })}
              />
            </InventoryFormField>

            <InventoryFormField
              htmlFor="reorderPoint"
              label="Reorder point"
              error={errors.reorderPoint?.message}
            >
              <Input
                id="reorderPoint"
                type="number"
                step="0.01"
                min="0"
                placeholder="0"
                {...register("reorderPoint", { valueAsNumber: true })}
              />
            </InventoryFormField>
          </div>

          <InventoryFormField
            htmlFor="unitCost"
            label="Unit cost (₱)"
            error={errors.unitCost?.message}
          >
            <Input
              id="unitCost"
              type="number"
              step="0.01"
              min="0"
              placeholder="Cost per unit"
              {...register("unitCost", { valueAsNumber: true })}
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
