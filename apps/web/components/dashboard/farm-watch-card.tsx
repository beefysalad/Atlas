"use client"

import {
  RiAlarmWarningLine,
  RiArrowRightUpLine,
  RiCheckboxCircleLine,
  RiStore2Line,
  RiTruckLine,
} from "@remixicon/react"

import { Badge } from "@workspace/ui/components/badge"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card"

import { SampleDataBadge } from "@/components/dashboard/dashboard-placeholder-indicator"

const watchItems = [
  {
    title: "Feed supplier due",
    detail: "Atlas Feeds invoice closes on Friday",
    status: "Due soon",
    icon: RiTruckLine,
  },
  {
    title: "Egg sales posted",
    detail: "South market remittance cleared today",
    status: "Cleared",
    icon: RiCheckboxCircleLine,
  },
  {
    title: "Retail branch variance",
    detail: "One store is short against expected cash",
    status: "Review",
    icon: RiStore2Line,
  },
]

export function FarmWatchCard() {
  return (
    <Card className="rounded-xl shadow-sm">
      <CardHeader>
        <div className="flex items-start justify-between gap-4">
          <div>
            <CardTitle className="text-lg">Farm Watch</CardTitle>
            <CardDescription>
              The next accounting checks for sheds, feed, and branch sales.
            </CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <SampleDataBadge />
            <div className="rounded-lg bg-amber-500/10 p-2 text-amber-600 dark:text-amber-300">
              <RiAlarmWarningLine className="size-5" />
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {watchItems.map((item) => {
          const Icon = item.icon

          return (
            <div
              key={item.title}
              className="border-border/60 bg-muted/20 flex items-start gap-3 rounded-xl border p-3"
            >
              <div className="bg-background text-muted-foreground mt-0.5 rounded-lg p-2">
                <Icon className="size-4" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-start justify-between gap-3">
                  <p className="text-sm font-semibold">{item.title}</p>
                  <Badge variant="secondary" className="shrink-0">
                    {item.status}
                  </Badge>
                </div>
                <p className="text-muted-foreground mt-1 text-sm">
                  {item.detail}
                </p>
              </div>
            </div>
          )
        })}

        <div className="border-border/70 flex items-center justify-between rounded-xl border border-dashed px-3 py-2.5 text-sm">
          <span className="text-muted-foreground">
            3 workflow checks need attention this week
          </span>
          <span className="font-medium">
            Open queue
            <RiArrowRightUpLine className="ml-1 inline size-4" />
          </span>
        </div>
      </CardContent>
    </Card>
  )
}
