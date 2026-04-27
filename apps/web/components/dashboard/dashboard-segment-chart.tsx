"use client"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card"
import {
  ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@workspace/ui/components/chart"
import { Cell, Pie, PieChart } from "recharts"

import { SampleDataBadge } from "@/components/dashboard/dashboard-placeholder-indicator"

const segmentData = [
  {
    segment: "Egg trays",
    value: 46,
    fill: "var(--color-eggs)",
  },
  {
    segment: "Live broilers",
    value: 31,
    fill: "var(--color-broilers)",
  },
  {
    segment: "Retail shop",
    value: 23,
    fill: "var(--color-retail)",
  },
]

const segmentChartConfig = {
  eggs: {
    label: "Egg trays",
    color: "var(--chart-1)",
  },
  broilers: {
    label: "Live broilers",
    color: "var(--chart-2)",
  },
  retail: {
    label: "Retail shop",
    color: "var(--chart-5)",
  },
} satisfies ChartConfig

export function DashboardSegmentChart() {
  return (
    <Card className="min-w-0 rounded-xl shadow-sm">
      <CardHeader>
        <div className="flex items-start justify-between gap-3">
          <div>
            <CardTitle className="text-lg">Revenue Mix</CardTitle>
            <CardDescription>
              Share of this week&apos;s revenue by line.
            </CardDescription>
          </div>
          <SampleDataBadge />
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <ChartContainer
          config={segmentChartConfig}
          className="mx-auto h-[210px] w-full min-w-0 sm:h-[240px]"
        >
          <PieChart>
            <ChartTooltip
              content={
                <ChartTooltipContent
                  nameKey="segment"
                  hideLabel
                  formatter={(value, name) => (
                    <>
                      <span className="text-muted-foreground">{name}</span>
                      <span className="text-foreground font-mono font-medium">
                        {value}%
                      </span>
                    </>
                  )}
                />
              }
            />
            <Pie
              data={segmentData}
              dataKey="value"
              nameKey="segment"
              innerRadius={56}
              outerRadius={84}
              paddingAngle={3}
              strokeWidth={4}
            >
              {segmentData.map((entry) => (
                <Cell key={entry.segment} fill={entry.fill} />
              ))}
            </Pie>
            <ChartLegend content={<ChartLegendContent nameKey="segment" />} />
          </PieChart>
        </ChartContainer>

        <div className="grid gap-3 sm:grid-cols-3">
          {segmentData.map((item) => (
            <div
              key={item.segment}
              className="bg-muted/20 rounded-xl border p-3"
            >
              <p className="text-muted-foreground text-xs">{item.segment}</p>
              <p className="mt-1 text-lg font-semibold">{item.value}%</p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
