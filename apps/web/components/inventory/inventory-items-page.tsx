"use client"

import Link from "next/link"
import { useEffect, useState } from "react"
import { RiAddLine } from "@remixicon/react"

import { InventoryListShell } from "@/components/inventory/inventory-list-shell"
import { InventoryPagination } from "@/components/inventory/inventory-pagination"
import { InventoryPageHeader } from "@/components/inventory/inventory-page-header"
import { InventoryTable } from "@/components/inventory/inventory-table"
import { useInventoryItems } from "@/hooks/inventory/use-inventory-items"
import { Button } from "@workspace/ui/components/button"

const ITEMS_PAGE_SIZE = 10

export function InventoryItemsPage() {
  const [currentPage, setCurrentPage] = useState(1)
  const { data, isPending, isError } = useInventoryItems({
    page: currentPage,
    pageSize: ITEMS_PAGE_SIZE,
  })

  const items = data?.items ?? []
  const totalPages = data?.pagination.totalPages ?? 1
  const totalItems = data?.pagination.totalItems ?? 0
  const startItem =
    totalItems === 0 ? 0 : (currentPage - 1) * ITEMS_PAGE_SIZE + 1
  const endItem =
    totalItems === 0 ? 0 : Math.min(currentPage * ITEMS_PAGE_SIZE, totalItems)

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

      <section>
        <InventoryListShell
          title="Stock on hand"
          description={
            totalItems > 0
              ? `Showing ${startItem}-${endItem} of ${totalItems} tracked items across your inventory records.`
              : "No tracked items yet."
          }
          pageLabel={`Page ${currentPage} of ${totalPages}`}
          footer={
            <InventoryPagination
              currentPage={currentPage}
              totalPages={totalPages}
              totalItems={totalItems}
              pageSize={ITEMS_PAGE_SIZE}
              onPageChange={setCurrentPage}
            />
          }
        >
          <InventoryTable
            items={items}
            isLoading={isPending}
            isError={isError}
            showActions
          />
        </InventoryListShell>
      </section>
    </main>
  )
}
