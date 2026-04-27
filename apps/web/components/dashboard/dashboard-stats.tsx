"use client"

import {
  RiBillLine,
  RiMoneyDollarCircleLine,
  RiPieChartLine,
} from "@remixicon/react"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card"

const dashboardStats = [
  {
    icon: RiMoneyDollarCircleLine,
    label: "Today's sales",
    value: "PHP 128,430",
    trend: "+14.2%",
  },
  {
    icon: RiBillLine,
    label: "Feed and supplies",
    value: "PHP 42,180",
    trend: "3 invoices due",
  },
  {
    icon: RiPieChartLine,
    label: "Receivables open",
    value: "PHP 64,210",
    trend: "8 accounts",
  },
]

export function DashboardStats() {
  return (
    <section className="grid gap-4 md:grid-cols-3">
      {dashboardStats.map((stat) => {
        const Icon = stat.icon

        return (
          <Card
            key={stat.label}
            className="bg-muted/30 rounded-xl border-none shadow-sm"
          >
            <CardHeader className="pb-2">
              <CardTitle className="text-muted-foreground flex items-center gap-2 text-xs font-medium tracking-wider uppercase">
                <Icon className="size-3.5" />
                {stat.label}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-baseline justify-between">
                <p className="text-3xl font-black tracking-tight">
                  {stat.value}
                </p>
                <span className="rounded bg-emerald-500/10 px-1.5 py-0.5 text-[10px] font-bold text-emerald-600">
                  {stat.trend}
                </span>
              </div>
            </CardContent>
          </Card>
        )
      })}
    </section>
  )
}
