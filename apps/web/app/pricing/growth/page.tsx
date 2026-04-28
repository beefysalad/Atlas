import { PricingCheckoutPage } from "@/components/home/pricing-checkout-page"

export default function Page() {
  return (
    <PricingCheckoutPage
      eyebrow="Growth Plan"
      title="Atlas Growth"
      description="Choose the Growth plan for tighter operations, stronger reporting, and more room to scale daily work."
      planName="Growth"
      planPrice="₱1,490"
      planInterval="per month"
      submitLabel="Complete checkout"
      summaryLines={[
        "Growth includes the Starter foundation plus richer operations and reporting.",
        "Ideal for businesses that need more control over stock, cash, and workflows.",
        "Includes room for broader team usage and more structured operating flows.",
      ]}
    />
  )
}
