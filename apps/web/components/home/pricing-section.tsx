"use client"

import Link from "next/link"
import { Show, SignUpButton } from "@clerk/nextjs"
import { RiArrowRightLine, RiCheckLine } from "@remixicon/react"
import { motion } from "framer-motion"

import { fadeUp, staggerContainer } from "@/components/home/motion-presets"
import { Button } from "@workspace/ui/components/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card"
import { cn } from "@workspace/ui/lib/utils"

const pricingPlans = [
  {
    name: "Starter",
    price: "Free",
    description: "For solo operators and early-stage businesses getting off spreadsheets.",
    eyebrow: "Get moving",
    features: [
      "Core dashboard and bookkeeping overview",
      "Inventory items and movement tracking",
      "Up to 1 workspace",
      "Basic reporting surfaces",
    ],
    cta: "Start free",
    href: null,
  },
  {
    name: "Growth",
    price: "₱1,490",
    interval: "/month",
    description:
      "For growing businesses that need tighter control over cash, stock, and daily operations.",
    eyebrow: "Most popular",
    featured: true,
    features: [
      "Everything in Starter",
      "Multi-location defaults and richer workflows",
      "Expanded reporting and exports",
      "Team-ready collaboration foundation",
    ],
    cta: "Choose Growth",
    href: "/pricing/growth",
  },
  {
    name: "Scale",
    price: "Custom",
    description:
      "For larger teams that need rollout help, tailored workflows, and deeper operational support.",
    eyebrow: "Talk to us",
    features: [
      "Everything in Growth",
      "Priority onboarding support",
      "Custom rollout guidance",
      "Planning for advanced modules",
    ],
    cta: "Talk to sales",
    href: "/pricing/contact-sales",
  },
]

export function PricingSection() {
  return (
    <section className="border-border bg-background border-b">
      <div className="mx-auto max-w-6xl px-6 py-20 sm:py-28">
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.15 }}
          className="space-y-14"
        >
          <motion.div
            variants={fadeUp}
            className="mx-auto max-w-2xl space-y-3 text-center"
          >
            <span className="text-primary text-xs font-semibold tracking-widest uppercase">
              Pricing
            </span>
            <h2 className="font-heading text-3xl font-black tracking-tight sm:text-4xl">
              Start simple. Upgrade when the operation needs more.
            </h2>
            <p className="text-muted-foreground text-base leading-relaxed">
              Atlas is designed to feel approachable on day one and structured enough
              to grow with your workflows, reporting, and team setup.
            </p>
          </motion.div>

          <div className="grid gap-6 lg:grid-cols-3">
            {pricingPlans.map((plan) => (
              <motion.div key={plan.name} variants={fadeUp}>
                <Card
                  className={cn(
                    "h-full rounded-3xl border shadow-sm",
                    plan.featured &&
                      "border-primary/35 shadow-primary/10 ring-primary/15 ring-1"
                  )}
                >
                  <CardHeader className="space-y-4">
                    <div className="flex items-center justify-between gap-3">
                      <span
                        className={cn(
                          "rounded-full px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.14em]",
                          plan.featured
                            ? "bg-primary/12 text-primary"
                            : "bg-muted text-muted-foreground"
                        )}
                      >
                        {plan.eyebrow}
                      </span>
                    </div>
                    <div className="space-y-2">
                      <CardTitle className="text-2xl font-semibold">
                        {plan.name}
                      </CardTitle>
                      <div className="flex items-end gap-1">
                        <span className="text-foreground text-4xl font-black tracking-tight">
                          {plan.price}
                        </span>
                        {plan.interval ? (
                          <span className="text-muted-foreground pb-1 text-sm">
                            {plan.interval}
                          </span>
                        ) : null}
                      </div>
                      <CardDescription className="text-sm leading-relaxed">
                        {plan.description}
                      </CardDescription>
                    </div>
                  </CardHeader>

                  <CardContent className="flex h-full flex-col gap-6">
                    <ul className="space-y-3">
                      {plan.features.map((feature) => (
                        <li
                          key={feature}
                          className="flex items-start gap-3 text-sm"
                        >
                          <span className="bg-primary/10 text-primary mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full">
                            <RiCheckLine className="size-3" />
                          </span>
                          <span className="text-muted-foreground leading-relaxed">
                            {feature}
                          </span>
                        </li>
                      ))}
                    </ul>

                    <div className="mt-auto pt-2">
                      {plan.href ? (
                        <Button
                          asChild
                          variant={plan.featured ? "default" : "outline"}
                          className="w-full"
                        >
                          <Link href={plan.href}>
                            {plan.cta}
                            <RiArrowRightLine className="size-4" />
                          </Link>
                        </Button>
                      ) : (
                        <>
                          <Show when="signed-out">
                            <SignUpButton
                              mode="modal"
                              fallbackRedirectUrl="/dashboard"
                            >
                              <Button
                                variant={plan.featured ? "default" : "outline"}
                                className="w-full"
                              >
                                {plan.cta}
                                <RiArrowRightLine className="size-4" />
                              </Button>
                            </SignUpButton>
                          </Show>
                          <Show when="signed-in">
                            <Button
                              asChild
                              variant={plan.featured ? "default" : "outline"}
                              className="w-full"
                            >
                              <a href="/dashboard">
                                {plan.cta}
                                <RiArrowRightLine className="size-4" />
                              </a>
                            </Button>
                          </Show>
                        </>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  )
}
