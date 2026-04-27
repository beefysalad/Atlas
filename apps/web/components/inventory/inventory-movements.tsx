"use client"

import type { InventoryItem, InventoryMovement } from "@workspace/shared"

import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@workspace/ui/components/alert"
import { Badge } from "@workspace/ui/components/badge"
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@workspace/ui/components/empty"
import { Skeleton } from "@workspace/ui/components/skeleton"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@workspace/ui/components/table"
import { RiErrorWarningLine, RiSwapLine } from "@remixicon/react"

import { MOVEMENT_TYPE_LABELS } from "@/lib/validations/inventory"
import { InventoryMovementActions } from "@/components/inventory/inventory-movement-actions"

interface InventoryMovementsProps {
  movements: InventoryMovement[]
  items: InventoryItem[]
  isLoading: boolean
  isError: boolean
  showActions?: boolean
}

// Movement types that increase stock
const INCREASE_TYPES = new Set([
  "PURCHASE",
  "PRODUCTION_IN",
  "ADJUSTMENT_IN",
  "TRANSFER_IN",
])

function movementBadgeClass(type: InventoryMovement["type"]): string {
  if (INCREASE_TYPES.has(type)) {
    return "border-emerald-500/40 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
  }
  if (type === "SPOILAGE") {
    return "border-red-500/40 bg-red-500/10 text-red-600 dark:text-red-400"
  }
  return "border-muted-foreground/30 bg-muted/40 text-muted-foreground"
}

function formatDate(dateStr: string): string {
  const d = new Date(dateStr)
  return d.toLocaleString("en-PH", {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  })
}

function formatCurrency(value: number): string {
  return `₱${value.toLocaleString("en-PH", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
}

export function InventoryMovements({
  movements,
  items,
  isLoading,
  isError,
  showActions = false,
}: InventoryMovementsProps) {
  const itemMap = new Map(items.map((i) => [i.id, i]))

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
        <AlertTitle>Couldn&apos;t load inventory movements</AlertTitle>
        <AlertDescription>
          Please try again. We couldn&apos;t retrieve the latest movement log.
        </AlertDescription>
      </Alert>
    )
  }

  const recent = [...movements].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  )

  if (recent.length === 0) {
    return (
      <Empty className="border-border border border-dashed py-16">
        <EmptyHeader>
          <EmptyMedia variant="icon">
            <RiSwapLine />
          </EmptyMedia>
          <EmptyTitle>No movements recorded yet</EmptyTitle>
          <EmptyDescription>
            Record a receipt, issue, transfer, or adjustment to start your
            inventory history.
          </EmptyDescription>
        </EmptyHeader>
      </Empty>
    )
  }

  return (
    <div className="border-border overflow-x-auto rounded-xl border">
      <Table>
        <TableHeader>
          <TableRow className="bg-muted/40 hover:bg-muted/40">
            <TableHead className="text-xs">Date</TableHead>
            <TableHead className="text-xs">Item</TableHead>
            <TableHead className="text-xs">Type</TableHead>
            <TableHead className="text-right text-xs">Qty</TableHead>
            <TableHead className="text-right text-xs">Unit Cost</TableHead>
            <TableHead className="text-xs">Reference</TableHead>
            <TableHead className="text-xs">Notes</TableHead>
            {showActions ? (
              <TableHead className="w-[88px] text-right text-xs">
                Actions
              </TableHead>
            ) : null}
          </TableRow>
        </TableHeader>
        <TableBody>
          {recent.map((movement) => {
            const item = itemMap.get(movement.itemId)
            const isIncrease = INCREASE_TYPES.has(movement.type)
            return (
              <TableRow key={movement.id} className="text-sm">
                <TableCell className="text-muted-foreground text-xs whitespace-nowrap tabular-nums">
                  {formatDate(movement.createdAt)}
                </TableCell>
                <TableCell className="font-medium">
                  {item?.name ?? (
                    <span className="text-muted-foreground text-xs">
                      Unknown
                    </span>
                  )}
                </TableCell>
                <TableCell>
                  <Badge
                    variant="outline"
                    className={`text-[10px] ${movementBadgeClass(movement.type)}`}
                  >
                    {MOVEMENT_TYPE_LABELS[movement.type]}
                  </Badge>
                </TableCell>
                <TableCell
                  className={`text-right text-xs font-semibold tabular-nums ${isIncrease ? "text-emerald-600 dark:text-emerald-400" : "text-muted-foreground"}`}
                >
                  {isIncrease ? "+" : "−"}
                  {movement.quantity.toLocaleString()}
                </TableCell>
                <TableCell className="text-muted-foreground text-right text-xs tabular-nums">
                  {movement.unitCostSnapshot != null
                    ? formatCurrency(movement.unitCostSnapshot)
                    : "—"}
                </TableCell>
                <TableCell className="text-muted-foreground text-xs">
                  {movement.reference ?? "—"}
                </TableCell>
                <TableCell className="text-muted-foreground max-w-[200px] truncate text-xs">
                  {movement.notes ?? "—"}
                </TableCell>
                {showActions ? (
                  <TableCell className="text-right">
                    <InventoryMovementActions movement={movement} />
                  </TableCell>
                ) : null}
              </TableRow>
            )
          })}
        </TableBody>
      </Table>
    </div>
  )
}
