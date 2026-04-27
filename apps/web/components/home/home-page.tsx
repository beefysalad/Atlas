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
      <main className="bg-background text-foreground min-h-svh">
        <HomeHero />
        <FeaturesSection />
        <HowItWorksSection />
        <CtaSection />

        {/* Footer */}
        <footer className="border-border bg-background border-t px-6 py-8">
          <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 sm:flex-row">
            <div className="flex items-center gap-2">
              <span className="bg-primary text-primary-foreground flex size-6 items-center justify-center rounded-md text-[10px] font-black">
                A
              </span>
              <span className="text-sm font-bold tracking-tight">Atlas</span>
            </div>
            <p className="text-muted-foreground text-center text-xs">
              © {new Date().getFullYear()} Atlas. Simple finances for smarter
              businesses.
            </p>
          </div>
        </footer>
      </main>
    </>
  )
}
