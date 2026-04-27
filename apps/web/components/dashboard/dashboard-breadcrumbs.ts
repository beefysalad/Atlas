import { dashboardNavItems } from "@/components/dashboard/dashboard-data"

type BreadcrumbContext = {
  segment: string
  index: number
  href: string
  pathSegments: string[]
}

type BreadcrumbResolver =
  | string
  | ((context: BreadcrumbContext) => string | null)

const breadcrumbResolvers: Record<string, BreadcrumbResolver> = {
  dashboard: "Overview",
  inventory: "Inventory",
  items: "Items",
  movements: "Movements",
  components: "Components",
  settings: "Settings",
  "error-preview": "Error Preview",
  "not-found-preview": "Not Found Preview",
  new: ({ pathSegments, index }) => {
    const resourceSegment = pathSegments[index - 1]

    if (resourceSegment === "items") {
      return "Add Item"
    }

    if (resourceSegment === "movements") {
      return "Record Movement"
    }

    return "New"
  },
  edit: ({ pathSegments, index }) => {
    const previousSegment = pathSegments[index - 1]
    const resourceSegment = isOpaqueBreadcrumbSegment(previousSegment)
      ? pathSegments[index - 2]
      : previousSegment

    if (resourceSegment === "items") {
      return "Edit Item"
    }

    if (resourceSegment === "movements") {
      return "Edit Movement"
    }

    return "Edit"
  },
}

function formatBreadcrumbFallback(segment: string): string {
  return decodeURIComponent(segment)
    .split("-")
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ")
}

function isOpaqueBreadcrumbSegment(segment?: string): boolean {
  if (!segment) {
    return false
  }

  const uuidPattern =
    /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i

  return uuidPattern.test(segment)
}

function resolveBreadcrumbLabel(context: BreadcrumbContext): string | null {
  const navLabel = dashboardNavItems.find(
    (item) => item.href === context.href
  )?.label

  if (navLabel) {
    return navLabel
  }

  if (isOpaqueBreadcrumbSegment(context.segment)) {
    return null
  }

  const resolver = breadcrumbResolvers[context.segment]

  if (typeof resolver === "function") {
    return resolver(context)
  }

  if (typeof resolver === "string") {
    return resolver
  }

  return formatBreadcrumbFallback(context.segment)
}

export function getDashboardBreadcrumbSegments(pathname: string) {
  const pathSegments = pathname.split("/").filter(Boolean)

  return pathSegments
    .map((segment, index) => {
      const href = `/${pathSegments.slice(0, index + 1).join("/")}`
      const label = resolveBreadcrumbLabel({
        segment,
        index,
        href,
        pathSegments,
      })

      if (!label) {
        return null
      }

      return {
        href,
        label,
      }
    })
    .filter((segment): segment is { href: string; label: string } =>
      Boolean(segment)
    )
}
