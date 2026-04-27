"use client"

import Link from "next/link"
import { UserButton } from "@clerk/nextjs"
import { RiArrowRightSLine, RiMenuLine } from "@remixicon/react"
import { usePathname } from "next/navigation"
import { useState } from "react"

import {
  dashboardPrimaryNavItems,
  dashboardSecondaryNavItems,
  isDashboardNavItemActive,
} from "@/components/dashboard/dashboard-navigation"
import { Button } from "@workspace/ui/components/button"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@workspace/ui/components/sheet"
import { cn } from "@workspace/ui/lib/utils"

function DashboardMobileNav() {
  const pathname = usePathname()
  const [expandedHref, setExpandedHref] = useState<string | null>(() => {
    const activeItem = dashboardPrimaryNavItems.find((item) =>
      item.children?.length && isDashboardNavItemActive(pathname, item.href)
    )

    return activeItem?.href ?? null
  })

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="size-9 rounded-full text-foreground hover:bg-muted lg:hidden"
        >
          <RiMenuLine className="size-5" />
          <span className="sr-only">Open navigation</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="flex w-[88vw] max-w-sm flex-col p-0">
        <SheetHeader className="border-b px-6 py-4">
          <SheetTitle className="text-xl font-semibold tracking-tight">
            atlas
          </SheetTitle>
          <SheetDescription className="sr-only">
            Navigate between modules and account workspaces.
          </SheetDescription>
        </SheetHeader>

        <div className="flex-1 overflow-y-auto">
          <div className="flex flex-col gap-6 p-4">
            <div className="space-y-1">
              <div className="space-y-1">
                {dashboardPrimaryNavItems.map((item) => {
                  const isActive = isDashboardNavItemActive(pathname, item.href)
                  const hasChildren = Boolean(item.children?.length)
                  const isExpanded = expandedHref === item.href
                  const activeChildHref = item.children?.find((child) =>
                    child.href === item.href
                      ? pathname === child.href
                      : pathname === child.href ||
                        pathname.startsWith(`${child.href}/`)
                  )?.href

                  return (
                    <div key={item.href}>
                      {hasChildren ? (
                        <button
                          type="button"
                          onClick={() =>
                            setExpandedHref((current) =>
                              current === item.href ? null : item.href
                            )
                          }
                          className={cn(
                            "flex w-full items-center justify-between rounded-lg px-3 py-2.5 text-[0.9375rem] font-medium transition-colors outline-none focus-visible:ring-0",
                            isActive
                              ? "bg-primary/[0.08] text-primary"
                              : "text-muted-foreground hover:bg-muted hover:text-foreground"
                          )}
                        >
                          <span>{item.label}</span>
                          <RiArrowRightSLine
                            className={cn(
                              "size-4 transition-transform",
                              isExpanded
                                ? "rotate-90 text-primary"
                                : "text-muted-foreground"
                            )}
                          />
                        </button>
                      ) : (
                        <Link
                          href={item.href}
                          className={cn(
                            "flex items-center justify-between rounded-lg px-3 py-2.5 text-[0.9375rem] font-medium transition-colors outline-none focus-visible:ring-0",
                            isActive
                              ? "bg-primary/[0.08] text-primary"
                              : "text-muted-foreground hover:bg-muted hover:text-foreground"
                          )}
                        >
                          <span>{item.label}</span>
                        </Link>
                      )}

                      {isExpanded && item.children?.length ? (
                        <div className="ml-5 mt-1 space-y-1 border-l pl-3">
                          {item.children.map((child) => {
                            const isChildActive = activeChildHref === child.href

                            return (
                              <Link
                                key={child.href}
                                href={child.href}
                                className={cn(
                                  "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors outline-none focus-visible:ring-0",
                                  isChildActive
                                    ? "bg-primary/[0.05] font-medium text-primary"
                                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                                )}
                              >
                                {child.label}
                              </Link>
                            )
                          })}
                        </div>
                      ) : null}
                    </div>
                  )
                })}
              </div>
            </div>

            {dashboardSecondaryNavItems.length > 0 ? (
              <div className="border-t pt-4 space-y-1">
                <div className="space-y-1">
                  {dashboardSecondaryNavItems.map((item) => {
                    const isActive = isDashboardNavItemActive(
                      pathname,
                      item.href
                    )

                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        className={cn(
                          "flex items-center justify-between rounded-lg px-3 py-2.5 text-[0.9375rem] font-medium transition-colors outline-none focus-visible:ring-0",
                          isActive
                            ? "bg-primary/[0.08] text-primary"
                            : "text-muted-foreground hover:bg-muted hover:text-foreground"
                        )}
                      >
                        <span>{item.label}</span>
                      </Link>
                    )
                  })}
                </div>
              </div>
            ) : null}
          </div>
        </div>

        <div className="mt-auto border-t p-4">
          <div className="flex items-center gap-3">
            <UserButton
              appearance={{
                elements: {
                  avatarBox: "size-10",
                  userButtonAvatarBox: "size-10",
                  userButtonTrigger:
                    "size-10 rounded-full border border-border/70",
                },
              }}
            />
            <div className="flex flex-col">
              <span className="text-sm font-medium">Account</span>
              <span className="text-xs text-muted-foreground">
                Manage your settings
              </span>
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}

export { DashboardMobileNav }
