"use client"

import type { InventoryItem } from "@workspace/shared"

import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@workspace/ui/components/empty"
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@workspace/ui/components/alert"
import { Badge } from "@workspace/ui/components/badge"
import { Skeleton } from "@workspace/ui/components/skeleton"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@workspace/ui/components/table"
import { RiArchiveLine, RiErrorWarningLine } from "@remixicon/react"

import { UNIT_LABELS } from "@/lib/validations/inventory"
import { InventoryItemActions } from "@/components/inventory/inventory-item-actions"

interface InventoryTableProps {
  items: InventoryItem[]
  isLoading: boolean
  isError: boolean
  showActions?: boolean
}

function stockStatus(item: InventoryItem): {
  label: string
  variant: "default" | "secondary" | "destructive" | "outline"
  className: string
} {
  if (item.onHandQuantity === 0) {
    return {
      label: "Out of stock",
      variant: "destructive",
      className: "",
    }
  }
  if (item.onHandQuantity <= item.reorderPoint) {
    return {
      label: "Low stock",
      variant: "outline",
      className:
        "border-amber-500/40 bg-amber-500/10 text-amber-600 dark:text-amber-400",
    }
  }
  return {
    label: "In stock",
    variant: "outline",
    className:
      "border-emerald-500/40 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
  }
}

function formatCurrency(value: number): string {
  return `₱${value.toLocaleString("en-PH", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
}

export function InventoryTable({
  items,
  isLoading,
  isError,
  showActions = false,
}: InventoryTableProps) {
  if (isLoading) {
    return (
      <div className="space-y-2">
        {Array.from({ length: 5 }).map((_, i) => (
          <Skeleton key={i} className="h-10 w-full" />
        ))}
      </div>
    )
  }

  if (isError) {
    return (
      <Alert variant="destructive">
        <RiErrorWarningLine />
        <AlertTitle>Couldn&apos;t load inventory items</AlertTitle>
        <AlertDescription>
          Please try again. We couldn&apos;t retrieve the current stock list.
        </AlertDescription>
      </Alert>
    )
  }

  const activeItems = items.filter((i) => i.isActive)

  if (activeItems.length === 0) {
    return (
      <Empty className="border border-dashed border-border py-16">
        <EmptyHeader>
          <EmptyMedia variant="icon">
            <RiArchiveLine />
          </EmptyMedia>
          <EmptyTitle>No inventory items yet</EmptyTitle>
          <EmptyDescription>
            Add your first tracked item to start monitoring stock on hand,
            reorder points, and value.
          </EmptyDescription>
        </EmptyHeader>
      </Empty>
    )
  }

  return (
    <>
      <div className="space-y-3 md:hidden">
        {activeItems.map((item) => {
          const status = stockStatus(item)
          const value = item.onHandQuantity * item.unitCost

          return (
            <div
              key={item.id}
              className="rounded-xl border bg-background p-4 shadow-sm"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium">{item.name}</p>
                  <p className="mt-1 font-mono text-xs text-muted-foreground">
                    {item.sku}
                  </p>
                </div>
                <Badge
                  variant={status.variant}
                  className={`shrink-0 text-[10px] ${status.className}`}
                >
                  {status.label}
                </Badge>
              </div>

              <div className="mt-4 grid grid-cols-2 gap-3 text-xs">
                <div>
                  <p className="text-muted-foreground">Category</p>
                  <p className="mt-1 truncate text-foreground">
                    {item.category}
                  </p>
                </div>
                <div>
                  <p className="text-muted-foreground">On hand</p>
                  <p className="mt-1 text-foreground tabular-nums">
                    {item.onHandQuantity.toLocaleString("en-PH")}{" "}
                    {UNIT_LABELS[item.unit]}
                  </p>
                </div>
                <div>
                  <p className="text-muted-foreground">Reorder point</p>
                  <p className="mt-1 text-foreground tabular-nums">
                    {item.reorderPoint.toLocaleString()}
                  </p>
                </div>
                <div>
                  <p className="text-muted-foreground">Stock value</p>
                  <p className="mt-1 font-medium text-foreground tabular-nums">
                    {formatCurrency(value)}
                  </p>
                </div>
              </div>

              {showActions ? (
                <div className="mt-4 flex justify-end">
                  <InventoryItemActions item={item} />
                </div>
              ) : null}
            </div>
          )
        })}
      </div>

      <div className="hidden overflow-x-auto rounded-xl border border-border md:block">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/40 hover:bg-muted/40">
              <TableHead className="w-[180px] text-xs">Item</TableHead>
              <TableHead className="text-xs">SKU</TableHead>
              <TableHead className="text-xs">Category</TableHead>
              <TableHead className="text-right text-xs">On Hand</TableHead>
              <TableHead className="text-right text-xs">Reorder Pt.</TableHead>
              <TableHead className="text-right text-xs">Unit Cost</TableHead>
              <TableHead className="text-right text-xs">Stock Value</TableHead>
              <TableHead className="text-xs">Status</TableHead>
              {showActions ? (
                <TableHead className="w-[88px] text-right text-xs">
                  Actions
                </TableHead>
              ) : null}
            </TableRow>
          </TableHeader>
          <TableBody>
            {activeItems.map((item) => {
              const status = stockStatus(item)
              const value = item.onHandQuantity * item.unitCost
              return (
                <TableRow key={item.id} className="text-sm">
                  <TableCell className="font-medium">{item.name}</TableCell>
                  <TableCell className="font-mono text-xs text-muted-foreground">
                    {item.sku}
                  </TableCell>
                  <TableCell className="text-xs text-muted-foreground">
                    {item.category}
                  </TableCell>
                  <TableCell className="text-right tabular-nums">
                    {item.onHandQuantity.toLocaleString("en-PH")}{" "}
                    <span className="text-xs text-muted-foreground">
                      {UNIT_LABELS[item.unit]}
                    </span>
                  </TableCell>
                  <TableCell className="text-right text-xs text-muted-foreground tabular-nums">
                    {item.reorderPoint.toLocaleString()}
                  </TableCell>
                  <TableCell className="text-right text-xs tabular-nums">
                    {formatCurrency(item.unitCost)}
                  </TableCell>
                  <TableCell className="text-right text-xs font-medium tabular-nums">
                    {formatCurrency(value)}
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={status.variant}
                      className={`text-[10px] ${status.className}`}
                    >
                      {status.label}
                    </Badge>
                  </TableCell>
                  {showActions ? (
                    <TableCell className="text-right">
                      <InventoryItemActions item={item} />
                    </TableCell>
                  ) : null}
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
      </div>
    </>
  )
}
