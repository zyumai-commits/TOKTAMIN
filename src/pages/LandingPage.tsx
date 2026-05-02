import HeroSection from '@/components/landing/HeroSection'
import BenefitsSection from '@/components/landing/BenefitsSection'
import PlanComparisonTable from '@/components/landing/PlanComparisonTable'
import CTASection from '@/components/landing/CTASection'

export default function LandingPage() {
  return (
    <>
      <HeroSection />
      <BenefitsSection />
      <PlanComparisonTable />
      <CTASection />
    </>
  )
}
