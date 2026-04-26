"use client"

import Link from "next/link"
import { useState } from "react"
import { RiDeleteBinLine, RiEditLine } from "@remixicon/react"
import type { InventoryItem } from "@workspace/shared"
import { toast } from "sonner"

import { useDeleteInventoryItem } from "@/hooks/inventory/use-delete-inventory-item"
import { Button } from "@workspace/ui/components/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@workspace/ui/components/dialog"

interface InventoryItemActionsProps {
  item: InventoryItem
}

export function InventoryItemActions({ item }: InventoryItemActionsProps) {
  const [open, setOpen] = useState(false)
  const { mutate, isPending } = useDeleteInventoryItem()

  return (
    <>
      <div className="flex items-center justify-end gap-1">
        <Button asChild variant="ghost" size="icon-sm">
          <Link href={`/inventory/items/${item.id}/edit`}>
            <RiEditLine className="size-4" />
            <span className="sr-only">Edit item</span>
          </Link>
        </Button>
        <Button
          variant="ghost"
          size="icon-sm"
          className="text-destructive hover:text-destructive"
          onClick={() => setOpen(true)}
        >
          <RiDeleteBinLine className="size-4" />
          <span className="sr-only">Delete item</span>
        </Button>
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete inventory item?</DialogTitle>
            <DialogDescription>
              Items with movement history will be archived and removed from the
              active list. Items with no movement history will be deleted.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              isLoading={isPending}
              loadingText="Deleting"
              onClick={() => {
                mutate(item.id, {
                  onSuccess: () => {
                    toast.success("Inventory item removed")
                    setOpen(false)
                  },
                  onError: (err) => {
                    toast.error(
                      err instanceof Error
                        ? err.message
                        : "Failed to delete inventory item"
                    )
                  },
                })
              }}
            >
              Delete item
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
