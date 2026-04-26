"use client"

import Link from "next/link"
import { useEffect, useState } from "react"
import { RiAddLine } from "@remixicon/react"

import { InventoryMovements } from "@/components/inventory/inventory-movements"
import { InventoryPagination } from "@/components/inventory/inventory-pagination"
import { InventoryPageHeader } from "@/components/inventory/inventory-page-header"
import { useInventoryItems } from "@/hooks/inventory/use-inventory-items"
import { useInventoryMovements } from "@/hooks/inventory/use-inventory-movements"
import { Button } from "@workspace/ui/components/button"

const MOVEMENTS_PAGE_SIZE = 10

export function InventoryMovementsPage() {
  const [currentPage, setCurrentPage] = useState(1)
  const {
    data: itemsData,
    isPending: itemsPending,
    isError: itemsError,
  } = useInventoryItems()
  const {
    data: movementsData,
    isPending: movementsPending,
    isError: movementsError,
  } = useInventoryMovements({
    page: currentPage,
    pageSize: MOVEMENTS_PAGE_SIZE,
  })

  const items = itemsData?.items ?? []
  const movements = movementsData?.movements ?? []
  const totalPages = movementsData?.pagination.totalPages ?? 1
  const totalItems = movementsData?.pagination.totalItems ?? 0

  useEffect(() => {
    if (!movementsData?.pagination) {
      return
    }

    setCurrentPage((page) => Math.min(page, totalPages))
  }, [movementsData?.pagination, totalPages])

  return (
    <main className="flex flex-1 flex-col gap-6 p-4 md:p-8">
      <InventoryPageHeader
        title="Movements"
        description="Audit incoming and outgoing stock activity across receipts, sales, write-offs, transfers, and adjustments."
        actions={
          <Button asChild size="sm" className="w-full sm:w-auto">
            <Link href="/inventory/movements/new">
             <RiAddLine className="size-4" />
              Add movement
            </Link>
          </Button>
        }
      />

      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-semibold text-foreground">
            Recent movements
          </h2>
          <span className="text-xs text-muted-foreground">
            {totalItems} total entries
          </span>
        </div>
        <InventoryMovements
          movements={movements}
          items={items}
          isLoading={itemsPending || movementsPending}
          isError={itemsError || movementsError}
          showActions
        />
        <InventoryPagination
          currentPage={currentPage}
          totalPages={totalPages}
          totalItems={totalItems}
          pageSize={MOVEMENTS_PAGE_SIZE}
          onPageChange={setCurrentPage}
        />
      </section>
    </main>
  )
}
