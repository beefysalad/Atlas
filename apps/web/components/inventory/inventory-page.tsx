"use client"

import Link from "next/link"
import { RiAddLine } from "@remixicon/react"

import { InventoryMovements } from "@/components/inventory/inventory-movements"
import { InventoryPageHeader } from "@/components/inventory/inventory-page-header"
import { InventorySummary } from "@/components/inventory/inventory-summary"
import { InventoryTable } from "@/components/inventory/inventory-table"
import { useInventoryItems } from "@/hooks/inventory/use-inventory-items"
import { useInventoryMovements } from "@/hooks/inventory/use-inventory-movements"
import { Button } from "@workspace/ui/components/button"

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
  const previewItems = items.slice(0, 10)
  const previewMovements = movements.slice(0, 10)
  const isLoading = itemsPending || movementsPending

  return (
    <main className="flex flex-1 flex-col gap-6 p-4 md:p-8">
      <InventoryPageHeader
        eyebrow="Operations"
        title="Inventory"
        description="Track on-hand stock, monitor low-stock items, and log every movement across your operation."
        actions={
          <>
          <Button asChild size="sm" variant="outline" className="w-full sm:w-auto">
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

      {/* Items table */}
      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-semibold text-foreground">
            Stock on hand
          </h2>
          <Button asChild variant="ghost" size="sm" className="h-auto px-0 text-xs">
            <Link href="/inventory/items">View all items</Link>
          </Button>
        </div>
        <InventoryTable
          items={previewItems}
          isLoading={itemsPending}
          isError={itemsError}
        />
      </section>

      {/* Movements table */}
      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-semibold text-foreground">
            Recent movements
          </h2>
          <Button
            asChild
            variant="ghost"
            size="sm"
            className="h-auto px-0 text-xs"
          >
            <Link href="/inventory/movements">View all movements</Link>
          </Button>
        </div>
        <InventoryMovements
          movements={previewMovements}
          items={items}
          isLoading={movementsPending}
          isError={movementsError}
        />
      </section>
    </main>
  )
}
