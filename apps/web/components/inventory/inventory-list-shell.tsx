"use client"

import type { ReactNode } from "react"

import { Badge } from "@workspace/ui/components/badge"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card"

interface InventoryListShellProps {
  title: string
  description: string
  pageLabel?: string
  children: ReactNode
  footer?: ReactNode
}

export function InventoryListShell({
  title,
  description,
  pageLabel,
  children,
  footer,
}: InventoryListShellProps) {
  return (
    <Card className="border-border/70 rounded-xl shadow-sm">
      <CardHeader className="border-border/60 flex flex-col gap-3 border-b pb-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="space-y-1">
          <CardTitle className="text-base font-semibold">{title}</CardTitle>
          <CardDescription className="text-sm">{description}</CardDescription>
        </div>
        {pageLabel ? (
          <Badge variant="outline" className="w-fit rounded-full px-3 py-1">
            {pageLabel}
          </Badge>
        ) : null}
      </CardHeader>
      <CardContent className="p-4 md:p-5">{children}</CardContent>
      {footer ? (
        <div className="border-border/60 border-t p-4">{footer}</div>
      ) : null}
    </Card>
  )
}
