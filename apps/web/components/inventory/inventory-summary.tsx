"use client"

import {
  RiAlertLine,
  RiBox3Line,
  RiExchangeLine,
  RiMoneyDollarCircleLine,
} from "@remixicon/react"
import type { InventoryItem, InventoryMovement } from "@workspace/shared"

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card"
import { Skeleton } from "@workspace/ui/components/skeleton"

interface InventorySummaryProps {
  items: InventoryItem[]
  movements: InventoryMovement[]
  isLoading: boolean
}

function isLowStock(item: InventoryItem): boolean {
  return item.onHandQuantity > 0 && item.onHandQuantity <= item.reorderPoint
}

function isOutOfStock(item: InventoryItem): boolean {
  return item.onHandQuantity === 0
}

function calcInventoryValue(items: InventoryItem[]): number {
  return items.reduce(
    (sum, item) => sum + item.onHandQuantity * item.unitCost,
    0
  )
}

function countMovementsToday(movements: InventoryMovement[]): number {
  const today = new Date().toDateString()
  return movements.filter((m) => new Date(m.createdAt).toDateString() === today)
    .length
}

function formatCurrency(value: number): string {
  return `₱${value.toLocaleString("en-PH", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
}

const cardDefs = [
  {
    key: "skus",
    icon: RiBox3Line,
    label: "Total SKUs",
    getValue: (items: InventoryItem[], _: InventoryMovement[]) =>
      String(items.filter((i) => i.isActive).length),
    sub: (items: InventoryItem[], _: InventoryMovement[]) =>
      `${items.filter((i) => isOutOfStock(i)).length} out of stock`,
  },
  {
    key: "lowStock",
    icon: RiAlertLine,
    label: "Low Stock",
    getValue: (items: InventoryItem[], _: InventoryMovement[]) =>
      String(items.filter(isLowStock).length),
    sub: (items: InventoryItem[], _: InventoryMovement[]) =>
      `${items.filter((i) => i.onHandQuantity <= i.reorderPoint).length} need reorder`,
    alert: true,
  },
  {
    key: "value",
    icon: RiMoneyDollarCircleLine,
    label: "Inventory Value",
    getValue: (items: InventoryItem[], _: InventoryMovement[]) =>
      formatCurrency(calcInventoryValue(items)),
    sub: (_items: InventoryItem[], _movements: InventoryMovement[]) =>
      "On-hand stock estimate",
  },
  {
    key: "movements",
    icon: RiExchangeLine,
    label: "Movements Today",
    getValue: (_: InventoryItem[], movements: InventoryMovement[]) =>
      String(countMovementsToday(movements)),
    sub: (_items: InventoryItem[], _movements: InventoryMovement[]) =>
      "Entries recorded today",
  },
]

export function InventorySummary({
  items,
  movements,
  isLoading,
}: InventorySummaryProps) {
  if (isLoading) {
    return (
      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Card key={i} className="bg-card rounded-xl shadow-sm">
            <CardHeader className="pb-2">
              <Skeleton className="h-3 w-24" />
            </CardHeader>
            <CardContent>
              <Skeleton className="mb-1 h-8 w-28" />
              <Skeleton className="h-3 w-20" />
            </CardContent>
          </Card>
        ))}
      </section>
    )
  }

  return (
    <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {cardDefs.map((card) => {
        const Icon = card.icon
        const value = card.getValue(items, movements)
        const sub = card.sub(items, movements)
        const lowStockCount = items.filter(isLowStock).length
        const showAlert = card.alert && lowStockCount > 0

        return (
          <Card key={card.key} className="bg-card rounded-xl shadow-sm">
            <CardHeader className="pb-3">
              <CardTitle className="text-muted-foreground flex items-center gap-2 text-xs font-medium tracking-wider uppercase">
                <span
                  className={`flex size-7 items-center justify-center rounded-full ${
                    showAlert
                      ? "bg-red-500/12 text-red-500"
                      : "bg-primary/12 text-primary"
                  }`}
                >
                  <Icon className="size-3.5" />
                </span>
                {card.label}
              </CardTitle>
            </CardHeader>
            <CardContent className="flex min-h-28 flex-col justify-between gap-5">
              <div className="space-y-2">
                <p
                  className={`text-3xl font-black tracking-tight ${
                    showAlert ? "text-red-500" : "text-foreground"
                  }`}
                >
                  {value}
                </p>
              </div>
              <div className="border-border/60 mt-auto flex items-center justify-between gap-3 border-t pt-3">
                <span className="text-foreground text-xs font-medium">
                  {sub}
                </span>
                <span
                  className={`rounded-full px-2.5 py-1 text-[10px] font-semibold tracking-[0.14em] uppercase ${
                    showAlert
                      ? "bg-red-500/12 text-red-600 dark:text-red-400"
                      : "bg-primary/10 text-primary"
                  }`}
                >
                  {card.key === "skus"
                    ? "Stock health"
                    : card.key === "lowStock"
                      ? "Attention"
                      : card.key === "value"
                        ? "Snapshot"
                        : "Today"}
                </span>
              </div>
            </CardContent>
          </Card>
        )
      })}
    </section>
  )
}
