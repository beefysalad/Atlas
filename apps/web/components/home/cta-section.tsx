"use client"

import { RiArrowRightLine } from "@remixicon/react"
import { motion } from "framer-motion"

import { Button } from "@workspace/ui/components/button"
import { Show, SignUpButton } from "@clerk/nextjs"
import { fadeUp, staggerContainer } from "@/components/home/motion-presets"

export function CtaSection() {
  return (
    <section className="border-b border-border bg-background">
      <div className="mx-auto max-w-6xl px-6 py-20 sm:py-28">
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.3 }}
          className="relative overflow-hidden rounded-3xl border border-primary/20 bg-primary/5 p-10 text-center sm:p-16"
        >
          {/* Background glow */}
          <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_center,oklch(var(--primary)/0.12)_0%,transparent_70%)]" />

          <motion.div variants={fadeUp} className="space-y-3">
            <h2 className="font-heading text-3xl font-black tracking-tight sm:text-4xl">
              Ready to take control of your finances?
            </h2>
            <p className="mx-auto max-w-lg text-base leading-relaxed text-muted-foreground">
              Join hundreds of businesses who've ditched the spreadsheets. Start for free — no credit card required.
            </p>
          </motion.div>

          <motion.div
            variants={fadeUp}
            className="mt-8 flex flex-wrap items-center justify-center gap-3"
          >
            <Show when="signed-out">
              <SignUpButton mode="modal" fallbackRedirectUrl="/dashboard">
                <Button
                  size="lg"
                  className="h-12 gap-2 rounded-xl px-8 text-sm font-semibold shadow-md shadow-primary/25 transition-all hover:shadow-lg hover:shadow-primary/35 active:scale-[0.98]"
                >
                  Get started free
                  <RiArrowRightLine className="size-4" />
                </Button>
              </SignUpButton>
            </Show>
            <Show when="signed-in">
              <Button
                size="lg"
                className="h-12 gap-2 rounded-xl px-8 text-sm font-semibold shadow-md shadow-primary/25"
                asChild
              >
                <a href="/dashboard">
                  Go to dashboard
                  <RiArrowRightLine className="size-4" />
                </a>
              </Button>
            </Show>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}
