import { useMemo, useState } from 'react'
import { Header } from '../components/Header'
import { AddonsSection } from '../components/AddonsSection'
import { Checkout } from '../components/Checkout'
import { FaqAccordion } from '../components/FaqAccordion'
import { OrderSummary } from '../components/OrderSummary'
import { PricingTable } from '../components/PricingTable'
import { SolutionBanner } from '../components/SolutionBanner'
import {
  ADDONS,
  CORPORATE_SOLUTION,
  CUSTOM_SOLUTION,
  PAGE,
  PLAN_CATEGORIES,
  corporateQuoteWhatsAppUrl,
  customEstimateWhatsAppUrl,
} from '../data/pricing'
import type { SelectedAddon } from '../types'
import { cn } from '../lib/cn'

export function PricingPage() {
  const [activeCategoryId, setActiveCategoryId] = useState<'business' | 'premises'>('business')
  const [selectedPlanKey, setSelectedPlanKey] = useState<string | null>(null)
  const [addonQuantities, setAddonQuantities] = useState<Record<string, number>>({})
  const [checkoutOpen, setCheckoutOpen] = useState(false)
  const [orderPlaced, setOrderPlaced] = useState(false)

  const activeCategory = PLAN_CATEGORIES.find((c) => c.id === activeCategoryId)!

  const selectedPlan = useMemo(() => {
    if (!selectedPlanKey?.startsWith(`${activeCategoryId}:`)) return null
    return activeCategory.plans.find((plan) => `${activeCategoryId}:${plan.id}` === selectedPlanKey) ?? null
  }, [activeCategory, activeCategoryId, selectedPlanKey])

  const selectedPlanId = selectedPlan?.id ?? null

  const visibleAddons = useMemo(
    () => ADDONS.filter((addon) => addon.category === activeCategoryId),
    [activeCategoryId],
  )

  const selectedAddons: SelectedAddon[] = useMemo(
    () =>
      visibleAddons
        .filter((addon) => (addonQuantities[addon.id] ?? 0) > 0)
        .map((addon) => ({
          addon,
          quantity: addonQuantities[addon.id] ?? 0,
        })),
    [addonQuantities, visibleAddons],
  )

  const addonsTotal = selectedAddons.reduce(
    (sum, { addon, quantity }) => sum + addon.price * quantity,
    0,
  )
  const total = (selectedPlan?.price ?? 0) + addonsTotal

  function handleSelectPlan(planId: string) {
    const key = `${activeCategoryId}:${planId}`
    setSelectedPlanKey((prev) => (prev === key ? null : key))
  }

  function handleAddonQuantityChange(addonId: string, quantity: number) {
    setAddonQuantities((prev) => ({ ...prev, [addonId]: quantity }))
  }

  function handleCheckoutClose() {
    setCheckoutOpen(false)
    if (orderPlaced) {
      setSelectedPlanKey(null)
      setAddonQuantities({})
      setOrderPlaced(false)
    }
  }

  return (
    <div
      className="min-h-full bg-[radial-gradient(1100px_420px_at_50%_-5%,rgba(227,30,36,0.06),transparent_55%),var(--color-page)]"
    >
      <Header />

      <main className="mx-auto w-full max-w-[1400px] px-6 pb-24 pt-8 max-sm:px-4 max-sm:pt-5 max-sm:pb-[calc(5rem+env(safe-area-inset-bottom,0px))]">
        <section className="mx-auto mb-7 max-w-[44rem] animate-fade-up text-center max-sm:mb-5 [animation-duration:0.5s]">
          <h1 className="mb-3 font-display text-[clamp(1.25rem,2.5vw,1.55rem)] font-extrabold leading-tight tracking-[-0.02em] text-ink max-sm:mb-2.5 max-sm:text-base">
            {PAGE.title}
          </h1>
          <p className="m-0 text-[0.88rem] leading-[1.65] text-muted max-sm:text-[0.76rem] max-sm:leading-[1.55]">
            {PAGE.description}
          </p>
        </section>

        <div
          className="mx-auto mb-8 flex w-full max-w-[360px] animate-fade-up gap-1 rounded-[10px] border border-line bg-white p-1 shadow-[0_1px_8px_rgba(17,17,17,0.04)] max-sm:mb-6 max-sm:max-w-none max-sm:p-[0.25rem] [animation-delay:60ms] [animation-duration:0.5s]"
          role="tablist"
          aria-label="Plan categories"
        >
          {PLAN_CATEGORIES.map((category) => {
            const active = activeCategoryId === category.id
            return (
              <button
                key={category.id}
                type="button"
                role="tab"
                aria-selected={active}
                aria-controls={`${category.id}-panel`}
                className={cn(
                  'flex-1 cursor-pointer rounded-lg border-none px-3 py-[0.65rem] font-display text-[0.78rem] font-bold transition-[background-color,color,box-shadow,transform] duration-180 ease-smooth active:scale-[0.98] max-sm:px-2 max-sm:py-[0.55rem] max-sm:text-[0.72rem]',
                  active
                    ? 'bg-[#e31e24] text-white shadow-[0_2px_10px_rgba(227,30,36,0.22)]'
                    : 'bg-transparent text-muted hover:text-ink',
                )}
                onClick={() => setActiveCategoryId(category.id)}
              >
                {category.title}
              </button>
            )
          })}
        </div>

        {PLAN_CATEGORIES.map((category) => {
          if (category.id !== activeCategoryId) return null

          const categoryAddons = ADDONS.filter((addon) => addon.category === category.id)

          return (
            <div key={category.id} id={`${category.id}-panel`} role="tabpanel">
              <section className="w-full animate-fade-up" aria-labelledby="plan-section-title">
                <header className="mb-7 border-b border-line pb-6 max-sm:mb-5 max-sm:pb-4">
                  <h2
                    id="plan-section-title"
                    className="mb-2.5 font-display text-[clamp(1.35rem,3vw,1.75rem)] font-extrabold tracking-[-0.02em] text-ink max-sm:mb-2 max-sm:text-[1.05rem]"
                  >
                    {category.title}
                  </h2>
                  <p className="m-0 max-w-[48rem] text-[0.95rem] leading-[1.7] text-muted max-sm:text-[0.78rem] max-sm:leading-[1.55]">
                    {category.subtitle}
                  </p>
                </header>

                <PricingTable
                  category={category}
                  selectedPlanId={selectedPlanId}
                  onSelectPlan={handleSelectPlan}
                />
              </section>

              <AddonsSection
                addons={categoryAddons}
                quantities={addonQuantities}
                onQuantityChange={handleAddonQuantityChange}
                subtitle={
                  category.id === 'business'
                    ? 'Optional modules to extend your Business plan.'
                    : 'QR mapping add-ons for your Premises plan. Set quantity to add to your total.'
                }
              />

              <div className="mt-8 animate-fade-up max-sm:mt-5">
                {category.id === 'business' ? (
                  <SolutionBanner
                    kicker={CUSTOM_SOLUTION.startsFrom}
                    headline={CUSTOM_SOLUTION.priceLabel}
                    title={CUSTOM_SOLUTION.title}
                    subtitle={CUSTOM_SOLUTION.features}
                    note={CUSTOM_SOLUTION.note}
                    whatsappLabel={CUSTOM_SOLUTION.whatsappLabel}
                    whatsappUrl={customEstimateWhatsAppUrl()}
                  />
                ) : (
                  <SolutionBanner
                    kicker={CORPORATE_SOLUTION.kicker}
                    title={CORPORATE_SOLUTION.title}
                    subtitle={CORPORATE_SOLUTION.cta}
                    whatsappLabel={CORPORATE_SOLUTION.whatsappLabel}
                    whatsappUrl={corporateQuoteWhatsAppUrl()}
                  />
                )}
              </div>

              <FaqAccordion title={`FAQs — ${category.title}`} items={category.faqs} />
            </div>
          )
        })}

        <p className="mt-10 animate-fade-up rounded-[10px] border border-dashed border-line bg-white px-[1.15rem] py-4 text-center text-[0.88rem] leading-[1.6] text-muted max-sm:mt-6 max-sm:p-3 max-sm:text-[0.74rem] max-sm:leading-normal [animation-delay:80ms]">
          {PAGE.footerNote}
        </p>
      </main>

      <OrderSummary
        selectedPlan={selectedPlan}
        selectedAddons={selectedAddons}
        total={total}
        onCheckout={() => {
          if (!selectedPlan) return
          setOrderPlaced(false)
          setCheckoutOpen(true)
        }}
      />

      {checkoutOpen && selectedPlan && (
        <Checkout
          selectedPlan={selectedPlan}
          planCategory={activeCategoryId}
          selectedAddons={selectedAddons}
          total={total}
          onClose={handleCheckoutClose}
          onComplete={() => setOrderPlaced(true)}
        />
      )}
    </div>
  )
}
