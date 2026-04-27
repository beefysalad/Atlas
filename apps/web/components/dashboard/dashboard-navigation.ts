import {
  RiArchiveLine,
  RiDashboardLine,
  RiLayoutGridLine,
  RiSettings3Line,
} from "@remixicon/react"

type DashboardNavItem = {
  href: string
  icon: React.ComponentType<{ className?: string }>
  label: string
}

type DashboardModuleNavItem = DashboardNavItem & {
  children?: Array<{
    href: string
    label: string
  }>
}

const dashboardPrimaryNavItems: DashboardModuleNavItem[] = [
  {
    href: "/dashboard",
    icon: RiDashboardLine,
    label: "Home",
  },
  {
    href: "/inventory",
    icon: RiArchiveLine,
    label: "Inventory",
    children: [
      {
        href: "/inventory",
        label: "Overview",
      },
      {
        href: "/inventory/items",
        label: "Items",
      },
      {
        href: "/inventory/movements",
        label: "Movements",
      },
    ],
  },
  {
    href: "/settings",
    icon: RiSettings3Line,
    label: "Settings",
  },
]

const dashboardSecondaryNavItems: DashboardNavItem[] = [
  {
    href: "/components",
    icon: RiLayoutGridLine,
    label: "Components",
  },
]

function isDashboardNavItemActive(pathname: string, href: string): boolean {
  if (href === "/dashboard") {
    return pathname === href
  }

  return pathname === href || pathname.startsWith(`${href}/`)
}

function getDashboardModuleSubnav(pathname: string) {
  return (
    dashboardPrimaryNavItems.find((item) =>
      isDashboardNavItemActive(pathname, item.href)
    )?.children ?? []
  )
}

const dashboardNavItems = dashboardPrimaryNavItems.map(
  ({ children: _children, ...item }) => item
)

export {
  dashboardNavItems,
  dashboardPrimaryNavItems,
  dashboardSecondaryNavItems,
  getDashboardModuleSubnav,
  isDashboardNavItemActive,
}
export type { DashboardModuleNavItem, DashboardNavItem }
