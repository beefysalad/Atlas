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
  return movements.filter(
    (m) => new Date(m.createdAt).toDateString() === today
  ).length
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
          <Card key={i} className="rounded-xl border-none bg-muted/30 shadow-sm">
            <CardHeader className="pb-2">
              <Skeleton className="h-3 w-24" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-8 w-28 mb-1" />
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
          <Card
            key={card.key}
            className="rounded-xl border-none bg-muted/30 shadow-sm"
          >
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-xs font-medium tracking-wider text-muted-foreground uppercase">
                <Icon className={`size-3.5 ${showAlert ? "text-amber-500" : ""}`} />
                {card.label}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-baseline justify-between gap-2">
                <p
                  className={`text-3xl font-black tracking-tight ${showAlert ? "text-amber-500" : ""}`}
                >
                  {value}
                </p>
                <span className="rounded bg-muted px-1.5 py-0.5 text-[10px] font-medium text-muted-foreground">
                  {sub}
                </span>
              </div>
            </CardContent>
          </Card>
        )
      })}
    </section>
  )
}
