"use client"

import Link from "next/link"
import { useEffect, useState } from "react"
import { RiAddLine } from "@remixicon/react"

import { InventoryPagination } from "@/components/inventory/inventory-pagination"
import { InventoryPageHeader } from "@/components/inventory/inventory-page-header"
import { InventoryTable } from "@/components/inventory/inventory-table"
import { useInventoryItems } from "@/hooks/inventory/use-inventory-items"
import { Button } from "@workspace/ui/components/button"

const ITEMS_PAGE_SIZE = 10

export function InventoryItemsPage() {
  const [currentPage, setCurrentPage] = useState(1)
  const {
    data,
    isPending,
    isError,
  } = useInventoryItems({
    page: currentPage,
    pageSize: ITEMS_PAGE_SIZE,
  })

  const items = data?.items ?? []
  const totalPages = data?.pagination.totalPages ?? 1
  const totalItems = data?.pagination.totalItems ?? 0

  useEffect(() => {
    if (!data?.pagination) {
      return
    }

    setCurrentPage((page) => Math.min(page, totalPages))
  }, [data?.pagination, totalPages])

  return (
    <main className="flex flex-1 flex-col gap-6 p-4 md:p-8">
      <InventoryPageHeader
        title="Items"
        description="Review every active SKU across materials, products, supplies, and packaged goods."
        actions={
          <Button asChild size="sm" className="w-full sm:w-auto">
            <Link href="/inventory/items/new">
              <RiAddLine className="size-4" />
              Add item
            </Link>
          </Button>
        }
      />

      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-semibold text-foreground">
            Stock on hand
          </h2>
          <span className="text-xs text-muted-foreground">
            {totalItems} total SKUs
          </span>
        </div>
        <InventoryTable
          items={items}
          isLoading={isPending}
          isError={isError}
          showActions
        />
        <InventoryPagination
          currentPage={currentPage}
          totalPages={totalPages}
          totalItems={totalItems}
          pageSize={ITEMS_PAGE_SIZE}
          onPageChange={setCurrentPage}
        />
      </section>
    </main>
  )
}
