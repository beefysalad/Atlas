"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Fragment } from "react"

import { getDashboardBreadcrumbSegments } from "@/components/dashboard/dashboard-breadcrumbs"
import { DashboardMobileNav } from "@/components/dashboard/dashboard-mobile-nav"
import { DashboardTopNav } from "@/components/dashboard/dashboard-top-nav"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@workspace/ui/components/breadcrumb"
import { TooltipProvider } from "@workspace/ui/components/tooltip"

type DashboardShellProps = {
  children: React.ReactNode
}

function DashboardShell({ children }: DashboardShellProps) {
  const pathname = usePathname()
  const breadcrumbSegments = getDashboardBreadcrumbSegments(pathname)

  return (
    <TooltipProvider>
      <div className="dark:bg-background flex min-h-screen flex-col bg-[#e6e7e9]">
        <div className="lg:hidden">
          <div className="bg-background flex min-h-16 items-center justify-between gap-4 border-b px-4">
            <Link
              href="/dashboard"
              className="text-foreground text-2xl font-semibold tracking-tight"
            >
              atlas
            </Link>
            <DashboardMobileNav />
          </div>
        </div>

        <div className="hidden lg:block">
          <DashboardTopNav />
        </div>

        <header className="bg-background border-b">
          <div className="flex min-h-12 items-center overflow-x-auto px-4 md:min-h-14 md:px-6">
            <Breadcrumb className="min-w-0 overflow-hidden">
              <BreadcrumbList>
                <BreadcrumbItem>
                  <BreadcrumbLink asChild>
                    <Link href="/dashboard">Workspace</Link>
                  </BreadcrumbLink>
                </BreadcrumbItem>
                {breadcrumbSegments.map((segment, index) => {
                  const isLast = index === breadcrumbSegments.length - 1

                  return (
                    <Fragment key={segment.href}>
                      <BreadcrumbSeparator className="hidden sm:block" />
                      <BreadcrumbItem>
                        {isLast ? (
                          <BreadcrumbPage className="truncate">
                            {segment.label}
                          </BreadcrumbPage>
                        ) : (
                          <BreadcrumbLink asChild>
                            <Link href={segment.href}>{segment.label}</Link>
                          </BreadcrumbLink>
                        )}
                      </BreadcrumbItem>
                    </Fragment>
                  )
                })}
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </header>

        <main className="dark:bg-background min-w-0 flex-1 overflow-x-hidden bg-[#e6e7e9]">
          {children}
        </main>
      </div>
    </TooltipProvider>
  )
}

export { DashboardShell }
