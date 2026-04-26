"use client"

import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@workspace/ui/components/pagination"

interface InventoryPaginationProps {
  currentPage: number
  totalPages: number
  totalItems: number
  pageSize: number
  onPageChange: (page: number) => void
}

function getVisiblePages(currentPage: number, totalPages: number): (number | "ellipsis")[] {
  if (totalPages <= 5) {
    return Array.from({ length: totalPages }, (_, index) => index + 1)
  }

  if (currentPage <= 3) {
    return [1, 2, 3, 4, "ellipsis", totalPages]
  }

  if (currentPage >= totalPages - 2) {
    return [1, "ellipsis", totalPages - 3, totalPages - 2, totalPages - 1, totalPages]
  }

  return [
    1,
    "ellipsis",
    currentPage - 1,
    currentPage,
    currentPage + 1,
    "ellipsis",
    totalPages,
  ]
}

export function InventoryPagination({
  currentPage,
  totalPages,
  totalItems,
  pageSize,
  onPageChange,
}: InventoryPaginationProps) {
  if (totalPages <= 1) {
    return null
  }

  const startItem = (currentPage - 1) * pageSize + 1
  const endItem = Math.min(currentPage * pageSize, totalItems)
  const visiblePages = getVisiblePages(currentPage, totalPages)
  const isPreviousDisabled = currentPage === 1
  const isNextDisabled = currentPage === totalPages

  return (
    <div className="flex flex-col gap-3 border-t pt-4 sm:flex-row sm:items-center sm:justify-between">
      <p className="text-xs text-muted-foreground">
        Showing {startItem}-{endItem} of {totalItems}
      </p>

      <Pagination className="mx-0 w-auto justify-start sm:justify-end">
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious
              href="#previous"
              onClick={(event) => {
                event.preventDefault()
                if (!isPreviousDisabled) {
                  onPageChange(currentPage - 1)
                }
              }}
              aria-disabled={isPreviousDisabled}
              tabIndex={isPreviousDisabled ? -1 : 0}
              className={isPreviousDisabled ? "pointer-events-none opacity-50" : ""}
            />
          </PaginationItem>

          {visiblePages.map((page, index) => (
            <PaginationItem key={`${page}-${index}`}>
              {page === "ellipsis" ? (
                <PaginationEllipsis />
              ) : (
                <PaginationLink
                  href={`#page-${page}`}
                  isActive={page === currentPage}
                  onClick={(event) => {
                    event.preventDefault()
                    onPageChange(page)
                  }}
                >
                  {page}
                </PaginationLink>
              )}
            </PaginationItem>
          ))}

          <PaginationItem>
            <PaginationNext
              href="#next"
              onClick={(event) => {
                event.preventDefault()
                if (!isNextDisabled) {
                  onPageChange(currentPage + 1)
                }
              }}
              aria-disabled={isNextDisabled}
              tabIndex={isNextDisabled ? -1 : 0}
              className={isNextDisabled ? "pointer-events-none opacity-50" : ""}
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  )
}
