"use client"

import { motion } from "framer-motion"

import { fadeUp, staggerContainer } from "@/components/home/motion-presets"

const steps = [
  {
    step: "01",
    title: "Create your account",
    description:
      "Sign up and set up your workspace in minutes. No training or accounting background required.",
  },
  {
    step: "02",
    title: "Record your transactions",
    description:
      "Log income, expenses, and other entries as they happen. Atlas keeps everything organized automatically.",
  },
  {
    step: "03",
    title: "See the full picture",
    description:
      "Get instant summaries of your financial position — anytime, from any device.",
  },
]

export function HowItWorksSection() {
  return (
    <section className="border-b border-border bg-muted/30">
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
              How it works
            </span>
            <h2 className="font-heading text-3xl font-black tracking-tight sm:text-4xl">
              Simple enough for day one.
            </h2>
            <p className="text-muted-foreground text-base leading-relaxed">
              We designed Atlas so anyone can get up and running without a complicated setup process.
            </p>
          </motion.div>

          {/* Steps */}
          <div className="grid gap-8 sm:grid-cols-3">
            {steps.map((s, i) => (
              <motion.div key={s.step} variants={fadeUp} className="relative space-y-4">
                {/* Connector line */}
                {i < steps.length - 1 && (
                  <div className="absolute top-5 left-10 hidden h-px w-[calc(100%+2rem)] bg-border sm:block" />
                )}
                <div className="relative flex size-10 items-center justify-center rounded-xl border border-primary/30 bg-primary/10 text-sm font-black text-primary">
                  {s.step}
                </div>
                <h3 className="text-base font-bold text-foreground">{s.title}</h3>
                <p className="text-sm leading-relaxed text-muted-foreground">{s.description}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  )
}
