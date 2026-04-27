"use client"

import { useEffect, useState } from "react"
import { useTheme } from "next-themes"
import { RiMoonLine, RiSunLine } from "@remixicon/react"

import { Button } from "@workspace/ui/components/button"
import { cn } from "@workspace/ui/lib/utils"

interface ThemeModeToggleProps {
  className?: string
  iconClassName?: string
}

function ThemeModeToggle({
  className,
  iconClassName,
}: ThemeModeToggleProps) {
  const { resolvedTheme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const isDark = mounted && resolvedTheme === "dark"

  return (
    <Button
      type="button"
      variant="ghost"
      size="icon"
      className={cn("rounded-full", className)}
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
      onClick={() => setTheme(isDark ? "light" : "dark")}
    >
      {isDark ? (
        <RiSunLine className={cn("size-4.5", iconClassName)} />
      ) : (
        <RiMoonLine className={cn("size-4.5", iconClassName)} />
      )}
    </Button>
  )
}

export { ThemeModeToggle }
