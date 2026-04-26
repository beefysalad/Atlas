"use client"

import type { ReactNode } from "react"

interface InventoryPageHeaderProps {
  eyebrow?: string
  title: string
  description?: string
  actions?: ReactNode
}

export function InventoryPageHeader({
  eyebrow = "Inventory",
  title,
  description,
  actions,
}: InventoryPageHeaderProps) {
  return (
    <section className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
      <div className="space-y-1">
        <p className="text-sm text-muted-foreground">{eyebrow}</p>
        <h1 className="font-heading text-3xl font-semibold tracking-normal md:text-4xl">
          {title}
        </h1>
        {description ? (
          <p className="max-w-2xl text-sm text-muted-foreground">
            {description}
          </p>
        ) : null}
      </div>
      {actions ? (
        <div className="flex flex-wrap items-center gap-3">{actions}</div>
      ) : null}
    </section>
  )
}
