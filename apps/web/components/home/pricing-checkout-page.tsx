"use client"

import Link from "next/link"
import {
  RiArrowLeftLine,
  RiBankCardLine,
  RiBuildingLine,
  RiCheckboxCircleLine,
  RiLock2Line,
} from "@remixicon/react"

import { AuthHeader } from "@/components/auth/auth-header"
import { Button } from "@workspace/ui/components/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card"
import { Input } from "@workspace/ui/components/input"

interface PricingCheckoutPageProps {
  eyebrow: string
  title: string
  description: string
  planName: string
  planPrice: string
  planInterval?: string
  submitLabel: string
  summaryLines: string[]
  salesMode?: boolean
}

export function PricingCheckoutPage({
  eyebrow,
  title,
  description,
  planName,
  planPrice,
  planInterval,
  submitLabel,
  summaryLines,
  salesMode = false,
}: PricingCheckoutPageProps) {
  return (
    <>
      <AuthHeader />
      <main className="bg-background text-foreground min-h-svh pt-16">
        <section className="border-border border-b">
          <div className="mx-auto max-w-5xl px-6 py-16 sm:py-24">
            <div className="mb-10 space-y-4">
              <Button
                asChild
                variant="ghost"
                size="sm"
                className="h-auto w-fit px-0"
              >
                <Link href="/">
                  <RiArrowLeftLine className="size-4" />
                  Back to pricing
                </Link>
              </Button>

              <div className="space-y-3">
                <p className="text-primary text-xs font-semibold tracking-widest uppercase">
                  {eyebrow}
                </p>
                <h1 className="font-heading text-4xl font-black tracking-tight sm:text-5xl">
                  {title}
                </h1>
                <p className="text-muted-foreground max-w-2xl text-base leading-relaxed">
                  {description}
                </p>
              </div>
            </div>

            <div className="grid gap-6 lg:grid-cols-[minmax(0,1.1fr)_360px]">
              <Card className="rounded-3xl shadow-sm">
                <CardHeader>
                  <CardTitle>
                    {salesMode ? "Billing contact" : "Payment details"}
                  </CardTitle>
                  <CardDescription>
                    {salesMode
                      ? "Share your team and rollout details so we can match the right plan setup."
                      : "Enter your billing details to continue with the selected Atlas plan."}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-5">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <Input placeholder="Full name" />
                    <Input placeholder="Work email" type="email" />
                  </div>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <Input placeholder="Company name" />
                    <Input placeholder="Phone number" />
                  </div>

                  {salesMode ? (
                    <div className="grid gap-4 sm:grid-cols-2">
                      <Input placeholder="Team size" />
                      <Input placeholder="Target rollout month" />
                    </div>
                  ) : (
                    <>
                      <div className="grid gap-4 sm:grid-cols-2">
                        <Input placeholder="Cardholder name" />
                        <Input placeholder="Card number" />
                      </div>
                      <div className="grid gap-4 sm:grid-cols-3">
                        <Input placeholder="MM / YY" />
                        <Input placeholder="CVC" />
                        <Input placeholder="ZIP / Postal code" />
                      </div>
                    </>
                  )}

                  <div className="bg-muted/40 rounded-2xl border p-4">
                    <div className="flex items-start gap-3">
                      <span className="bg-primary/10 text-primary flex size-9 shrink-0 items-center justify-center rounded-full">
                        {salesMode ? (
                          <RiBuildingLine className="size-4.5" />
                        ) : (
                          <RiBankCardLine className="size-4.5" />
                        )}
                      </span>
                      <div className="space-y-1">
                        <p className="text-sm font-medium">
                          {salesMode
                            ? "Sales request"
                            : "Secure payment"}
                        </p>
                        <p className="text-muted-foreground text-sm">
                          {salesMode
                            ? "Tell us how your team operates and we’ll guide you to the right rollout path."
                            : "Your plan, billing details, and next steps are collected here before activation."}
                        </p>
                      </div>
                    </div>
                  </div>

                  <Button className="w-full">
                    {salesMode ? (
                      <RiCheckboxCircleLine className="size-4" />
                    ) : (
                      <RiLock2Line className="size-4" />
                    )}
                    {submitLabel}
                  </Button>
                </CardContent>
              </Card>

              <Card className="rounded-3xl shadow-sm">
                <CardHeader>
                  <CardTitle>Order summary</CardTitle>
                  <CardDescription>
                    Review the plan details for the current selection.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-5">
                  <div className="rounded-2xl border p-4">
                    <div className="flex items-start justify-between gap-4">
                      <div className="space-y-1">
                        <p className="text-sm font-medium">{planName}</p>
                        <p className="text-muted-foreground text-sm">
                          Atlas plan selection
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-2xl font-black tracking-tight">
                          {planPrice}
                        </p>
                        {planInterval ? (
                          <p className="text-muted-foreground text-xs">
                            {planInterval}
                          </p>
                        ) : null}
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    {summaryLines.map((line) => (
                      <div key={line} className="flex items-start gap-3 text-sm">
                        <span className="bg-primary/10 text-primary mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full">
                          <RiCheckboxCircleLine className="size-3" />
                        </span>
                        <span className="text-muted-foreground leading-relaxed">
                          {line}
                        </span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
      </main>
    </>
  )
}
