"use client"

import { AuthHeader } from "@/components/auth/auth-header"
import { HomeHero } from "@/components/home/home-hero"
import { FeaturesSection } from "@/components/home/features-section"
import { HowItWorksSection } from "@/components/home/how-it-works-section"
import { CtaSection } from "@/components/home/cta-section"

export function HomePage() {
  return (
    <>
      <AuthHeader />
      <main className="min-h-svh bg-background text-foreground">
        <HomeHero />
        <FeaturesSection />
        <HowItWorksSection />
        <CtaSection />

        {/* Footer */}
        <footer className="border-t border-border bg-background px-6 py-8">
          <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 sm:flex-row">
            <div className="flex items-center gap-2">
              <span className="flex size-6 items-center justify-center rounded-md bg-primary text-[10px] font-black text-primary-foreground">
                A
              </span>
              <span className="text-sm font-bold tracking-tight">Atlas</span>
            </div>
            <p className="text-xs text-muted-foreground text-center">
              © {new Date().getFullYear()} Atlas. Simple finances for smarter businesses.
            </p>
          </div>
        </footer>
      </main>
    </>
  )
}
