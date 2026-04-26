import {
  RiArchiveLine,
  RiDashboardLine,
  RiLayoutGridLine,
  RiSettings3Line,
} from "@remixicon/react"

const dashboardNavItems = [
  {
    href: "/dashboard",
    icon: RiDashboardLine,
    label: "Overview",
  },
  {
    href: "/inventory",
    icon: RiArchiveLine,
    label: "Inventory",
  },
  {
    href: "/components",
    icon: RiLayoutGridLine,
    label: "Components",
  },
  {
    href: "/settings",
    icon: RiSettings3Line,
    label: "Settings",
  },
]

export { dashboardNavItems }
