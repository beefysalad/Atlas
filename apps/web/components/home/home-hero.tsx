"use client"

import { useEffect, useRef } from "react"
import { RiArrowRightLine, RiBarChartBoxLine } from "@remixicon/react"
import { motion, useInView } from "framer-motion"

import { Button } from "@workspace/ui/components/button"
import { Show, SignInButton, SignUpButton } from "@clerk/nextjs"
import {
  fadeUp,
  scaleIn,
  staggerContainer,
} from "@/components/home/motion-presets"
import { useCountUp } from "@/hooks/use-count-up"

// ─── stat configs ────────────────────────────────────────────────────────────

const statConfigs = [
  {
    label: "Businesses Active",
    end: 830,
    decimals: 0,
    format: (n: number) => `${Math.round(n)}+`,
  },
  {
    label: "Transactions Tracked",
    end: 1.2,
    decimals: 1,
    format: (n: number) => `${n.toFixed(1)}M+`,
  },
  {
    label: "Avg. Time Saved",
    end: 6,
    decimals: 0,
    format: (n: number) => `${Math.round(n)} hrs/wk`,
  },
]

// ─── single animated stat ────────────────────────────────────────────────────

function AnimatedStat({
  end,
  decimals = 0,
  format,
  label,
  inView,
}: {
  end: number
  decimals?: number
  format: (n: number) => string
  label: string
  inView: boolean
}) {
  const { value, start } = useCountUp({ end, duration: 1600, decimals })

  useEffect(() => {
    if (inView) start()
    // start is stable (ref-backed), safe to omit from deps
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inView])

  return (
    <div className="text-center lg:text-left">
      <div className="text-foreground text-xl font-black tabular-nums">
        {format(value)}
      </div>
      <div className="text-muted-foreground text-xs">{label}</div>
    </div>
  )
}

// ─── stats row (owns the inView ref) ─────────────────────────────────────────

function StatsRow() {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: "-40px" })

  return (
    <motion.div
      ref={ref}
      variants={fadeUp}
      className="flex flex-wrap items-center justify-center gap-6 pt-2 lg:justify-start"
    >
      {statConfigs.map((s) => (
        <AnimatedStat
          key={s.label}
          end={s.end}
          decimals={s.decimals}
          format={s.format}
          label={s.label}
          inView={inView}
        />
      ))}
    </motion.div>
  )
}

// ─── hero ─────────────────────────────────────────────────────────────────────

export function HomeHero() {
  return (
    <section className="border-border bg-background relative overflow-hidden border-b pt-24">
      {/* Subtle grid */}
      <div className="absolute inset-0 -z-10 bg-[linear-gradient(to_right,oklch(0.88_0_0)_1px,transparent_1px),linear-gradient(to_bottom,oklch(0.88_0_0)_1px,transparent_1px)] bg-[size:40px_40px] opacity-30 dark:bg-[linear-gradient(to_right,oklch(1_0_0/4%)_1px,transparent_1px),linear-gradient(to_bottom,oklch(1_0_0/4%)_1px,transparent_1px)]" />

      {/* Glow blobs */}
      <div className="bg-primary/10 absolute -top-32 -left-32 -z-10 h-[500px] w-[500px] rounded-full blur-[120px]" />
      <div className="absolute top-10 -right-16 -z-10 h-[300px] w-[300px] rounded-full bg-amber-400/8 blur-[80px]" />

      <div className="mx-auto max-w-6xl px-6 py-20 sm:py-32">
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate="show"
          className="flex flex-col items-center gap-16 text-center lg:grid lg:grid-cols-[1fr_1fr] lg:items-center lg:text-left"
        >
          {/* Left — copy */}
          <motion.div
            variants={staggerContainer}
            className="max-w-xl space-y-8 lg:max-w-none"
          >
            {/* Badge */}
            <motion.div variants={fadeUp}>
              <span className="border-primary/20 bg-primary/8 text-primary inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-semibold">
                Financial management, simplified
              </span>
            </motion.div>

            <motion.div variants={fadeUp} className="space-y-4">
              <h1 className="font-heading text-5xl font-black tracking-tight text-balance sm:text-6xl lg:text-7xl">
                Your finances, <span className="text-primary">finally</span>{" "}
                under control.
              </h1>
              <p className="text-muted-foreground max-w-lg text-lg leading-relaxed">
                Atlas gives you a clear picture of where your money goes. Track
                costs, monitor performance, and make smarter decisions — without
                the spreadsheet chaos.
              </p>
            </motion.div>

            <motion.div
              variants={fadeUp}
              className="flex flex-wrap items-center justify-center gap-3 lg:justify-start"
            >
              <Show when="signed-out">
                <SignUpButton mode="modal" fallbackRedirectUrl="/dashboard">
                  <Button
                    size="lg"
                    className="shadow-primary/20 hover:shadow-primary/30 h-12 gap-2 rounded-xl px-6 text-sm font-semibold shadow-md transition-all hover:shadow-lg active:scale-[0.98]"
                  >
                    Get started free
                    <RiArrowRightLine className="size-4" />
                  </Button>
                </SignUpButton>
                <SignInButton mode="modal" fallbackRedirectUrl="/dashboard">
                  <Button
                    size="lg"
                    variant="outline"
                    className="h-12 rounded-xl px-6 text-sm font-semibold"
                  >
                    Sign in
                  </Button>
                </SignInButton>
              </Show>
              <Show when="signed-in">
                <Button
                  size="lg"
                  className="shadow-primary/20 h-12 gap-2 rounded-xl px-6 text-sm font-semibold shadow-md"
                  asChild
                >
                  <a href="/dashboard">
                    Go to dashboard
                    <RiArrowRightLine className="size-4" />
                  </a>
                </Button>
              </Show>
            </motion.div>

            {/* Animated stats */}
            <StatsRow />
          </motion.div>

          {/* Right — dashboard mockup */}
          <motion.div
            variants={scaleIn}
            className="w-full max-w-lg lg:max-w-none"
          >
            <div className="relative">
              <div className="bg-primary/8 absolute -inset-6 rounded-3xl blur-3xl" />
              <div className="border-border bg-card relative overflow-hidden rounded-2xl border shadow-2xl shadow-black/8 dark:shadow-black/40">
                {/* Mockup title bar */}
                <div className="border-border bg-muted/40 flex items-center justify-between border-b px-5 py-3.5">
                  <div className="flex items-center gap-2">
                    <span className="bg-primary text-primary-foreground flex size-5 items-center justify-center rounded text-[9px] font-black">
                      A
                    </span>
                    <span className="text-foreground text-xs font-semibold">
                      Atlas — Overview
                    </span>
                  </div>
                  <div className="flex gap-1.5">
                    <div className="size-2.5 rounded-full bg-red-400/60" />
                    <div className="size-2.5 rounded-full bg-amber-400/60" />
                    <div className="size-2.5 rounded-full bg-emerald-400/60" />
                  </div>
                </div>

                {/* Mockup body */}
                <div className="space-y-4 p-5">
                  {/* Metric cards */}
                  <div className="grid grid-cols-3 gap-3">
                    {[
                      {
                        label: "Revenue",
                        value: "₱284k",
                        delta: "+12% this month",
                        up: true,
                      },
                      {
                        label: "Expenses",
                        value: "₱91k",
                        delta: "−4.1% vs last",
                        up: true,
                      },
                      {
                        label: "Net Profit",
                        value: "₱193k",
                        delta: "+18% vs last",
                        up: true,
                      },
                    ].map((card) => (
                      <div
                        key={card.label}
                        className="border-border bg-background space-y-1 rounded-xl border p-3"
                      >
                        <div className="text-muted-foreground text-[10px] font-medium tracking-wider uppercase">
                          {card.label}
                        </div>
                        <div className="text-foreground text-lg leading-none font-black">
                          {card.value}
                        </div>
                        <div
                          className={`text-[10px] font-medium ${card.up ? "text-emerald-500" : "text-red-400"}`}
                        >
                          {card.delta}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Bar chart mock */}
                  <div className="border-border bg-background space-y-3 rounded-xl border p-4">
                    <div className="flex items-center justify-between">
                      <div className="text-foreground flex items-center gap-1.5 text-xs font-semibold">
                        <RiBarChartBoxLine className="text-primary size-3.5" />
                        Revenue vs. Expenses
                      </div>
                      <span className="text-muted-foreground text-[10px]">
                        Last 6 months
                      </span>
                    </div>
                    <div className="flex h-20 items-end gap-2">
                      {[65, 78, 55, 90, 82, 95].map((h, i) => (
                        <div
                          key={i}
                          className="flex flex-1 flex-col items-center gap-1"
                        >
                          <div
                            className="bg-primary/80 w-full rounded-t-sm"
                            style={{ height: `${h}%` }}
                          />
                          <div
                            className="bg-muted-foreground/20 w-full rounded-t-sm"
                            style={{ height: `${h * 0.6}%` }}
                          />
                        </div>
                      ))}
                    </div>
                    <div className="text-muted-foreground flex items-center gap-3 text-[10px]">
                      <span className="flex items-center gap-1">
                        <span className="bg-primary/80 inline-block size-2 rounded-sm" />{" "}
                        Revenue
                      </span>
                      <span className="flex items-center gap-1">
                        <span className="bg-muted-foreground/20 inline-block size-2 rounded-sm" />{" "}
                        Expenses
                      </span>
                    </div>
                  </div>

                  {/* Recent activity */}
                  <div className="border-border bg-background divide-border divide-y overflow-hidden rounded-xl border">
                    {[
                      {
                        label: "Invoice #1041",
                        desc: "Client payment received",
                        time: "2h ago",
                        amount: "+₱72,000",
                      },
                      {
                        label: "Expense #039",
                        desc: "Supplier payment recorded",
                        time: "Yesterday",
                        amount: "−₱18,400",
                      },
                      {
                        label: "Invoice #1040",
                        desc: "Issued to client",
                        time: "2 days ago",
                        amount: "+₱48,000",
                      },
                    ].map((row) => (
                      <div
                        key={row.label}
                        className="flex items-center justify-between px-3 py-2.5"
                      >
                        <div>
                          <div className="text-foreground text-xs font-semibold">
                            {row.desc}
                          </div>
                          <div className="text-muted-foreground text-[10px]">
                            {row.label} · {row.time}
                          </div>
                        </div>
                        <div
                          className={`text-xs font-bold ${row.amount.startsWith("+") ? "text-emerald-500" : "text-muted-foreground"}`}
                        >
                          {row.amount}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}
