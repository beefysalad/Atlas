"use client"

import Link from "next/link"
import { useState } from "react"
import { RiDeleteBinLine, RiEditLine } from "@remixicon/react"
import type { InventoryMovement } from "@workspace/shared"
import { toast } from "sonner"

import { useDeleteInventoryMovement } from "@/hooks/inventory/use-delete-inventory-movement"
import { Button } from "@workspace/ui/components/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@workspace/ui/components/dialog"

interface InventoryMovementActionsProps {
  movement: InventoryMovement
}

export function InventoryMovementActions({
  movement,
}: InventoryMovementActionsProps) {
  const [open, setOpen] = useState(false)
  const { mutate, isPending } = useDeleteInventoryMovement()

  return (
    <>
      <div className="flex items-center justify-end gap-1">
        <Button asChild variant="ghost" size="icon-sm">
          <Link href={`/inventory/movements/${movement.id}/edit`}>
            <RiEditLine className="size-4" />
            <span className="sr-only">Edit movement</span>
          </Link>
        </Button>
        <Button
          variant="ghost"
          size="icon-sm"
          className="text-destructive hover:text-destructive"
          onClick={() => setOpen(true)}
        >
          <RiDeleteBinLine className="size-4" />
          <span className="sr-only">Delete movement</span>
        </Button>
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete inventory movement?</DialogTitle>
            <DialogDescription>
              This will reverse the stock effect of the movement and remove it
              from your audit trail.
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
                mutate(movement.id, {
                  onSuccess: () => {
                    toast.success("Inventory movement removed")
                    setOpen(false)
                  },
                  onError: (err) => {
                    toast.error(
                      err instanceof Error
                        ? err.message
                        : "Failed to delete inventory movement"
                    )
                  },
                })
              }}
            >
              Delete movement
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
