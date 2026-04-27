"use client"

import Link from "next/link"
import { UserButton } from "@clerk/nextjs"
import {
  RiAddLine,
  RiNotification3Line,
  RiQuestionLine,
  RiSearchLine,
} from "@remixicon/react"
import { usePathname } from "next/navigation"

import {
  dashboardPrimaryNavItems,
  isDashboardNavItemActive,
  type DashboardModuleNavItem,
} from "@/components/dashboard/dashboard-navigation"
import { Button } from "@workspace/ui/components/button"
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@workspace/ui/components/hover-card"
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from "@workspace/ui/components/navigation-menu"
import { cn } from "@workspace/ui/lib/utils"

const topNavLinkClass =
  "inline-flex h-10 w-max items-center justify-center rounded-full !bg-transparent px-4 text-sm font-medium !text-primary-foreground transition-colors outline-none hover:!bg-white/12 hover:!text-primary-foreground active:!bg-white/14 active:!text-primary-foreground focus-visible:!ring-2 focus-visible:!ring-white/30 focus-visible:!outline-none data-[active=true]:!bg-white/14 data-[active=true]:!text-primary-foreground data-[active=true]:hover:!bg-white/16"

function DashboardTopNav() {
  const pathname = usePathname()

  return (
    <header className="bg-primary text-primary-foreground border-b border-white/10">
      <div className="flex min-h-16 items-center justify-between gap-4 px-4 md:px-6">
        <div className="flex min-w-0 items-center gap-4">
          <Link
            href="/dashboard"
            className="shrink-0 text-2xl font-semibold tracking-tight"
          >
            atlas
          </Link>

          <NavigationMenu
            className="hidden max-w-full justify-start lg:flex"
            viewport={false}
          >
            <NavigationMenuList className="justify-start gap-0.5">
              {dashboardPrimaryNavItems.map((item) =>
                item.children?.length ? (
                  <HoverNavItem
                    key={item.href}
                    item={item}
                    pathname={pathname}
                  />
                ) : (
                  <NavigationMenuItem key={item.href}>
                    <NavigationMenuLink
                      asChild
                      active={isDashboardNavItemActive(pathname, item.href)}
                      className={topNavLinkClass}
                    >
                      <Link href={item.href}>{item.label}</Link>
                    </NavigationMenuLink>
                  </NavigationMenuItem>
                )
              )}
            </NavigationMenuList>
          </NavigationMenu>
        </div>

        <div className="hidden items-center gap-2 md:flex">
          <HeaderIconButton icon={RiAddLine} label="Create" />
          <HeaderIconButton icon={RiSearchLine} label="Search" />
          <HeaderIconButton icon={RiQuestionLine} label="Help" />
          <HeaderIconButton icon={RiNotification3Line} label="Notifications" />
          <UserButton
            appearance={{
              elements: {
                avatarBox: "size-9",
                userButtonAvatarBox: "size-9",
                userButtonTrigger:
                  "size-10 rounded-full border border-white/20 bg-white/10",
              },
            }}
          />
        </div>
      </div>
    </header>
  )
}

function HoverNavItem({
  item,
  pathname,
}: {
  item: DashboardModuleNavItem
  pathname: string
}) {
  const isActive = isDashboardNavItemActive(pathname, item.href)

  return (
    <NavigationMenuItem>
      <HoverCard openDelay={120} closeDelay={100}>
        <HoverCardTrigger asChild>
          <NavigationMenuLink
            asChild
            active={isActive}
            className={topNavLinkClass}
          >
            <Link href={item.href}>{item.label}</Link>
          </NavigationMenuLink>
        </HoverCardTrigger>
        <HoverCardContent
          align="start"
          sideOffset={10}
          className="w-[220px] overflow-hidden rounded-2xl p-1.5"
        >
          <div className="space-y-0.5">
            {item.children?.map((child) => {
              const isOverviewRoute = child.href === item.href
              const isChildActive = isOverviewRoute
                ? pathname === child.href
                : pathname === child.href ||
                  pathname.startsWith(`${child.href}/`)

              return (
                <Link
                  key={child.href}
                  href={child.href}
                  className={cn(
                    "block rounded-xl px-4 py-2.5 text-sm font-medium transition-colors",
                    isChildActive
                      ? "bg-primary/[0.12] text-primary"
                      : "text-foreground hover:bg-muted hover:text-foreground"
                  )}
                >
                  {child.label}
                </Link>
              )
            })}
          </div>
        </HoverCardContent>
      </HoverCard>
    </NavigationMenuItem>
  )
}

function HeaderIconButton({
  icon: Icon,
  label,
}: {
  icon: React.ComponentType<{ className?: string }>
  label: string
}) {
  return (
    <button
      type="button"
      aria-label={label}
      className="flex size-10 items-center justify-center rounded-full bg-white/10 transition-colors hover:bg-white/16"
    >
      <Icon className="size-4.5" />
    </button>
  )
}

export { DashboardTopNav }
