"use client"

import { Badge } from "@workspace/ui/components/badge"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@workspace/ui/components/tooltip"

function SampleDataBadge() {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Badge variant="outline" className="cursor-default text-[10px]">
          Sample data
        </Badge>
      </TooltipTrigger>
      <TooltipContent sideOffset={8}>Mock data only</TooltipContent>
    </Tooltip>
  )
}

function PlaceholderTooltip({ children }: { children: React.ReactNode }) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>{children}</TooltipTrigger>
      <TooltipContent sideOffset={8}>Sample button only</TooltipContent>
    </Tooltip>
  )
}

export { PlaceholderTooltip, SampleDataBadge }
