"use client"

import type { ReactNode } from "react"

import { InventoryPageHeader } from "@/components/inventory/inventory-page-header"

interface InventoryFormPageLayoutProps {
  title: string
  description?: string
  children: ReactNode
}

export function InventoryFormPageLayout({
  title,
  description,
  children,
}: InventoryFormPageLayoutProps) {
  return (
    <main className="flex flex-1 flex-col gap-6 p-4 md:p-8">
      <div className="w-full">
        <InventoryPageHeader title={title} description={description} />
      </div>
      <div className="mx-auto w-full max-w-3xl">
        {children}
      </div>
    </main>
  )
}
