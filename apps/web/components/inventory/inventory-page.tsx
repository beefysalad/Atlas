"use client"

import Link from "next/link"
import { RiAddLine } from "@remixicon/react"
import type { InventoryItem } from "@workspace/shared"

import { InventoryListShell } from "@/components/inventory/inventory-list-shell"
import { InventoryMovements } from "@/components/inventory/inventory-movements"
import { InventoryOverviewInsights } from "@/components/inventory/inventory-overview-insights"
import { InventoryPageHeader } from "@/components/inventory/inventory-page-header"
import { InventorySummary } from "@/components/inventory/inventory-summary"
import { InventoryTable } from "@/components/inventory/inventory-table"
import { useInventoryItems } from "@/hooks/inventory/use-inventory-items"
import { useInventoryMovements } from "@/hooks/inventory/use-inventory-movements"
import { Button } from "@workspace/ui/components/button"
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@workspace/ui/components/empty"
import { RiAlarmWarningLine } from "@remixicon/react"

function isLowStock(item: InventoryItem) {
  return item.onHandQuantity > 0 && item.onHandQuantity <= item.reorderPoint
}

export function InventoryPage() {
  const {
    data: itemsData,
    isPending: itemsPending,
    isError: itemsError,
  } = useInventoryItems()

  const {
    data: movementsData,
    isPending: movementsPending,
    isError: movementsError,
  } = useInventoryMovements()

  const items = itemsData?.items ?? []
  const movements = movementsData?.movements ?? []
  const lowStockItems = items.filter(
    (item) => item.isActive && isLowStock(item)
  )
  const previewItems = lowStockItems.slice(0, 5)
  const previewMovements = movements.slice(0, 5)
  const isLoading = itemsPending || movementsPending

  return (
    <main className="flex flex-1 flex-col gap-6 p-4 md:p-8">
      <InventoryPageHeader
        eyebrow="Operations"
        title="Inventory"
        description="Track on-hand stock, monitor low-stock items, and log every movement across your operation."
        actions={
          <>
            <Button
              asChild
              size="sm"
              variant="outline"
              className="w-full sm:w-auto"
            >
              <Link href="/inventory/items/new">
                <RiAddLine className="size-4" />
                Add item
              </Link>
            </Button>
            <Button asChild size="sm" className="w-full sm:w-auto">
              <Link href="/inventory/movements/new">
                <RiAddLine className="size-4" />
                Add movement
              </Link>
            </Button>
          </>
        }
      />

      {/* Summary cards */}
      <InventorySummary
        items={items}
        movements={movements}
        isLoading={isLoading}
      />

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)]">
        <section>
          <InventoryListShell
            title="Needs attention"
            description={
              lowStockItems.length > 0
                ? `${lowStockItems.length} items are at or below their reorder point.`
                : "No active low-stock items need attention right now."
            }
            pageLabel="Low stock"
            footer={
              <div className="flex justify-end">
                <Button asChild variant="ghost" size="sm" className="h-auto px-0 text-xs">
                  <Link href="/inventory/items">View all items</Link>
                </Button>
              </div>
            }
          >
            {lowStockItems.length > 0 ? (
              <InventoryTable
                items={previewItems}
                isLoading={itemsPending}
                isError={itemsError}
              />
            ) : (
              <div className="p-6">
                <Empty className="border-border border border-dashed py-12">
                  <EmptyHeader>
                    <EmptyMedia variant="icon">
                      <RiAlarmWarningLine />
                    </EmptyMedia>
                    <EmptyTitle>Nothing urgent right now</EmptyTitle>
                    <EmptyDescription>
                      Your tracked items are currently sitting above their reorder thresholds.
                    </EmptyDescription>
                  </EmptyHeader>
                </Empty>
              </div>
            )}
          </InventoryListShell>
        </section>

        <InventoryOverviewInsights items={items} isLoading={itemsPending} />
      </div>

      <section>
        <InventoryListShell
          title="Recent movements"
          description="Latest stock activity across receipts, usage, transfers, and adjustments."
          pageLabel="Activity"
          footer={
            <div className="flex justify-end">
              <Button asChild variant="ghost" size="sm" className="h-auto px-0 text-xs">
                <Link href="/inventory/movements">View all movements</Link>
              </Button>
            </div>
          }
        >
          <InventoryMovements
            movements={previewMovements}
            items={items}
            isLoading={movementsPending}
            isError={movementsError}
          />
        </InventoryListShell>
      </section>
    </main>
  )
}
