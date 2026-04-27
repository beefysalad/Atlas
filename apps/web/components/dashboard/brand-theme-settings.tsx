"use client"

import { RiCheckLine } from "@remixicon/react"

import { useBrandTheme } from "@/components/theme/brand-theme-provider"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card"
import { ScrollArea, ScrollBar } from "@workspace/ui/components/scroll-area"
import { cn } from "@workspace/ui/lib/utils"

type BrandThemePreset = ReturnType<typeof useBrandTheme>["presets"][number]
type BrandThemeId = BrandThemePreset["id"]

function BrandThemeSettings() {
  const { activeTheme, presets, setBrandTheme } = useBrandTheme()

  return (
    <Card className="rounded-lg shadow-sm">
      <CardHeader>
        <CardTitle>Brand Theme</CardTitle>
        <CardDescription>
          Color presets that keep buttons readable in light and dark mode.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-5">
        <ScrollArea className="w-full sm:hidden">
          <div className="flex gap-3 pb-3">
            {presets.map((preset) => (
              <ThemePresetButton
                key={preset.id}
                preset={preset}
                isActive={preset.id === activeTheme.id}
                onSelect={setBrandTheme}
                compact
              />
            ))}
          </div>
          <ScrollBar orientation="horizontal" />
        </ScrollArea>

        <div className="hidden gap-3 sm:grid sm:grid-cols-[repeat(auto-fit,minmax(180px,1fr))]">
          {presets.map((preset) => (
            <ThemePresetButton
              key={preset.id}
              preset={preset}
              isActive={preset.id === activeTheme.id}
              onSelect={setBrandTheme}
            />
          ))}
        </div>

        <div className="bg-muted/30 flex items-center justify-between gap-4 rounded-xl border p-4">
          <div className="flex items-center gap-3">
            <span
              className="border-border block size-8 rounded-full border shadow-sm"
              style={{ backgroundColor: activeTheme.swatch }}
            />
            <div className="space-y-1">
              <p className="text-sm font-medium">{activeTheme.label}</p>
              <p className="text-muted-foreground text-xs">
                Active workspace accent preset
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

function ThemePresetButton({
  preset,
  isActive,
  onSelect,
  compact = false,
}: {
  preset: BrandThemePreset
  isActive: boolean
  onSelect: (themeId: BrandThemeId) => void
  compact?: boolean
}) {
  return (
    <button
      type="button"
      aria-pressed={isActive}
      onClick={() => onSelect(preset.id)}
      className={cn(
        "bg-background hover:border-primary/50 hover:bg-accent/40 relative flex items-start rounded-xl border text-left transition-all",
        compact
          ? "min-h-20 min-w-[150px] shrink-0 flex-col justify-between p-3"
          : "min-h-24 flex-col justify-between p-4",
        isActive &&
          "border-primary bg-primary/[0.03] shadow-sm ring-1 ring-primary/30"
      )}
    >
      {isActive ? (
        <span className="absolute top-3 right-3">
          <RiCheckLine className="text-primary size-4" />
        </span>
      ) : null}

      <div className={cn("space-y-3", compact && "space-y-2")}>
        <span
          className={cn(
            "border-border block rounded-full border shadow-sm",
            compact ? "size-7" : "size-8"
          )}
          style={{ backgroundColor: preset.swatch }}
        />
        <div className="space-y-1">
          <p className="text-sm font-medium">{preset.label}</p>
          {!compact ? (
            <p className="text-muted-foreground text-xs">Accent preset</p>
          ) : null}
        </div>
      </div>

      <span className="text-muted-foreground text-xs">
        {isActive ? "Currently applied" : "Set as active"}
      </span>
    </button>
  )
}

export { BrandThemeSettings }
