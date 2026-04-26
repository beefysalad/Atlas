"use client"

import {
  RiBarChartBoxLine,
  RiCalendarLine,
  RiFileTextLine,
  RiGroupLine,
  RiMoneyDollarCircleLine,
  RiShieldCheckLine,
} from "@remixicon/react"
import { motion } from "framer-motion"

import { fadeUp, staggerContainer } from "@/components/home/motion-presets"

const features = [
  {
    icon: RiMoneyDollarCircleLine,
    title: "Cost Tracking",
    description:
      "Log every transaction — purchases, payroll, utilities. Know exactly where your money is going at all times.",
  },
  {
    icon: RiBarChartBoxLine,
    title: "Performance Insights",
    description:
      "Compare revenue, expenses, and margins across periods to spot trends and make data-driven decisions.",
  },
  {
    icon: RiFileTextLine,
    title: "Simple Bookkeeping",
    description:
      "Organized income and expense records you can actually understand. Generate summaries without touching a spreadsheet.",
  },
  {
    icon: RiCalendarLine,
    title: "Scheduling & Planning",
    description:
      "Plan ahead with visibility into upcoming costs and revenue. Stay on top of your calendar without surprises.",
  },
  {
    icon: RiGroupLine,
    title: "Multi-Entity Support",
    description:
      "Manage multiple businesses or branches from one account. Switch between them instantly with a unified view.",
  },
  {
    icon: RiShieldCheckLine,
    title: "Secure & Reliable",
    description:
      "Your data is encrypted and backed up automatically. Always available when you need it.",
  },
]

export function FeaturesSection() {
  return (
    <section className="border-b border-border bg-background">
      <div className="mx-auto max-w-6xl px-6 py-20 sm:py-28">
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.15 }}
          className="space-y-14"
        >
          {/* Heading */}
          <motion.div variants={fadeUp} className="max-w-xl space-y-3">
            <span className="text-xs font-semibold uppercase tracking-widest text-primary">
              Features
            </span>
            <h2 className="font-heading text-3xl font-black tracking-tight sm:text-4xl">
              Everything you need. Nothing you don't.
            </h2>
            <p className="text-muted-foreground text-base leading-relaxed">
              Atlas focuses on what matters — financial clarity, operational visibility, and simplicity.
            </p>
          </motion.div>

          {/* Grid */}
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((f) => (
              <motion.div
                key={f.title}
                variants={fadeUp}
                className="group rounded-2xl border border-border bg-card p-6 transition-all hover:border-primary/30 hover:shadow-md hover:shadow-primary/5"
              >
                <div className="mb-4 flex size-10 items-center justify-center rounded-xl bg-primary/10 transition-colors group-hover:bg-primary/15">
                  <f.icon className="size-5 text-primary" />
                </div>
                <h3 className="mb-1.5 text-sm font-bold text-foreground">{f.title}</h3>
                <p className="text-sm leading-relaxed text-muted-foreground">
                  {f.description}
                </p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  )
}
