"use client"

import type { ReactNode } from "react"

import { Label } from "@workspace/ui/components/label"

interface InventoryFormFieldProps {
  htmlFor: string
  label: string
  optional?: boolean
  error?: string
  children: ReactNode
}

export function InventoryFormField({
  htmlFor,
  label,
  optional = false,
  error,
  children,
}: InventoryFormFieldProps) {
  return (
    <div className="space-y-1.5">
      <Label htmlFor={htmlFor}>
        {label}
        {optional ? (
          <>
            {" "}
            <span className="text-muted-foreground text-xs">(optional)</span>
          </>
        ) : null}
      </Label>
      {children}
      {error ? <p className="text-destructive text-xs">{error}</p> : null}
    </div>
  )
}
