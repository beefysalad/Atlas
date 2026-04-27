"use client"

import type { InventoryItem } from "@workspace/shared"
import { Cell, Pie, PieChart } from "recharts"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card"
import {
  ChartContainer,
  type ChartConfig,
  ChartTooltip,
  ChartTooltipContent,
} from "@workspace/ui/components/chart"
import { Skeleton } from "@workspace/ui/components/skeleton"

interface InventoryOverviewInsightsProps {
  items: InventoryItem[]
  isLoading: boolean
}

const PIE_COLORS = [
  "var(--chart-1)",
  "var(--chart-2)",
  "var(--chart-3)",
  "var(--chart-4)",
  "var(--chart-5)",
]

function slugifyCategory(value: string): string {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
}

function formatCurrency(value: number): string {
  return `₱${value.toLocaleString("en-PH", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`
}

export function InventoryOverviewInsights({
  items,
  isLoading,
}: InventoryOverviewInsightsProps) {
  if (isLoading) {
    return (
      <section className="grid gap-4 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,0.8fr)]">
        <Card className="rounded-xl bg-card shadow-sm">
          <CardHeader>
            <Skeleton className="h-5 w-36" />
            <Skeleton className="h-4 w-56" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-[260px] w-full" />
          </CardContent>
        </Card>
        <Card className="rounded-xl bg-card shadow-sm">
          <CardHeader>
            <Skeleton className="h-5 w-32" />
            <Skeleton className="h-4 w-48" />
          </CardHeader>
          <CardContent className="space-y-3">
            {Array.from({ length: 4 }).map((_, index) => (
              <Skeleton key={index} className="h-16 w-full" />
            ))}
          </CardContent>
        </Card>
      </section>
    )
  }

  const activeItems = items.filter((item) => item.isActive)
  const groupedByCategory = Object.values(
    activeItems.reduce<
      Record<
        string,
        { category: string; stockValue: number; itemCount: number }
      >
    >((accumulator, item) => {
      const stockValue = item.onHandQuantity * item.unitCost
      const existing = accumulator[item.category]

      if (existing) {
        existing.stockValue += stockValue
        existing.itemCount += 1
        return accumulator
      }

      accumulator[item.category] = {
        category: item.category,
        stockValue,
        itemCount: 1,
      }

      return accumulator
    }, {})
  )
    .sort((a, b) => b.stockValue - a.stockValue)
    .slice(0, 5)
    .map((entry, index) => ({
      ...entry,
      fill: PIE_COLORS[index % PIE_COLORS.length],
      key: slugifyCategory(entry.category) || `category-${index + 1}`,
    }))

  const chartConfig = groupedByCategory.reduce<ChartConfig>(
    (accumulator, entry) => {
      accumulator[entry.key] = {
        label: entry.category,
        color: entry.fill,
      }
      return accumulator
    },
    {}
  )

  const categoryCount = new Set(activeItems.map((item) => item.category)).size
  const lowStockCount = activeItems.filter(
    (item) =>
      item.onHandQuantity > 0 && item.onHandQuantity <= item.reorderPoint
  ).length
  const outOfStockCount = activeItems.filter(
    (item) => item.onHandQuantity === 0
  ).length
  const highestValueCategory = groupedByCategory[0]

  return (
    <section className="grid gap-4 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,0.8fr)]">
      <Card className="rounded-xl bg-card shadow-sm">
        <CardHeader>
          <CardTitle className="text-lg">Category Mix</CardTitle>
          <CardDescription>
            Current stock value split across your top inventory categories.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {groupedByCategory.length === 0 ? (
            <div className="text-muted-foreground flex h-[260px] items-center justify-center text-sm">
              Add inventory items to see the value breakdown.
            </div>
          ) : (
            <>
              <ChartContainer
                config={chartConfig}
                className="mx-auto h-[220px] w-full max-w-[220px] min-w-0 sm:h-[260px] sm:max-w-[260px]"
              >
                <PieChart>
                  <ChartTooltip
                    content={
                      <ChartTooltipContent
                        hideLabel
                        formatter={(value, name) => (
                          <>
                            <span className="text-muted-foreground">
                              {name}
                            </span>
                            <span className="text-foreground font-mono font-medium">
                              {formatCurrency(Number(value))}
                            </span>
                          </>
                        )}
                      />
                    }
                  />
                  <Pie
                    data={groupedByCategory}
                    dataKey="stockValue"
                    nameKey="category"
                    innerRadius={44}
                    outerRadius={74}
                    paddingAngle={3}
                    strokeWidth={4}
                  >
                    {groupedByCategory.map((entry) => (
                      <Cell key={entry.key} fill={entry.fill} />
                    ))}
                  </Pie>
                </PieChart>
              </ChartContainer>

              <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
                {groupedByCategory.map((entry) => (
                  <div
                    key={entry.key}
                    className="min-w-0 rounded-xl border bg-card p-3"
                  >
                    <div className="flex items-center gap-2">
                      <span
                        className="size-2.5 rounded-full"
                        style={{ backgroundColor: entry.fill }}
                      />
                      <p className="text-muted-foreground truncate text-xs">
                        {entry.category}
                      </p>
                    </div>
                    <p className="mt-1 text-sm font-semibold">
                      {formatCurrency(entry.stockValue)}
                    </p>
                    <p className="text-muted-foreground text-xs">
                      {entry.itemCount} tracked items
                    </p>
                  </div>
                ))}
              </div>
            </>
          )}
        </CardContent>
      </Card>

      <Card className="rounded-xl bg-card shadow-sm">
        <CardHeader>
          <CardTitle className="text-lg">Quick Stats</CardTitle>
          <CardDescription>
            A fast read on stock coverage and category spread.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-3 sm:grid-cols-2 lg:grid-cols-1">
          <div className="rounded-xl border bg-card p-4">
            <p className="text-muted-foreground text-xs">Tracked categories</p>
            <p className="mt-1 text-2xl font-semibold">{categoryCount}</p>
          </div>
          <div className="rounded-xl border bg-card p-4">
            <p className="text-muted-foreground text-xs">Low-stock items</p>
            <p className="mt-1 text-2xl font-semibold">{lowStockCount}</p>
          </div>
          <div className="rounded-xl border bg-card p-4">
            <p className="text-muted-foreground text-xs">Out-of-stock items</p>
            <p className="mt-1 text-2xl font-semibold">{outOfStockCount}</p>
          </div>
          <div className="rounded-xl border bg-card p-4">
            <p className="text-muted-foreground text-xs">
              Highest value category
            </p>
            <p className="mt-1 truncate text-base font-semibold">
              {highestValueCategory?.category ?? "—"}
            </p>
            <p className="text-muted-foreground text-xs">
              {highestValueCategory
                ? formatCurrency(highestValueCategory.stockValue)
                : "No inventory value yet"}
            </p>
          </div>
        </CardContent>
      </Card>
    </section>
  )
}
