import { PricingCheckoutPage } from "@/components/home/pricing-checkout-page"

export default function Page() {
  return (
    <PricingCheckoutPage
      eyebrow="Sales Contact"
      title="Talk to sales"
      description="Tell us about your team, rollout goals, and operating setup so we can recommend the right Atlas package."
      planName="Scale"
      planPrice="Custom"
      submitLabel="Send sales request"
      salesMode
      summaryLines={[
        "Scale is intended for larger teams that need rollout help and tailored workflows.",
        "Best for businesses that want implementation guidance and broader operational support.",
        "Use this path when you need a more tailored setup than self-serve onboarding.",
      ]}
    />
  )
}
