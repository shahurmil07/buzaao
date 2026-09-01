import type { PricingPlan, SelectedAddon } from '../types'
import { AnimatedPrice } from './AnimatedPrice'

interface OrderSummaryProps {
  selectedPlan: PricingPlan | null
  selectedAddons: SelectedAddon[]
  total: number
  onCheckout: () => void
}

export function OrderSummary({
  selectedPlan,
  selectedAddons,
  total,
  onCheckout,
}: OrderSummaryProps) {
  const canCheckout = selectedPlan !== null
  const addonCount = selectedAddons.reduce((sum, item) => sum + item.quantity, 0)

  return (
    <aside
      className="sticky bottom-0 z-20 border-t border-line bg-white/96 pb-[env(safe-area-inset-bottom,0px)] shadow-[0_-4px_20px_rgba(17,17,17,0.06)] backdrop-blur-[8px]"
      aria-live="polite"
    >
      <div className="mx-auto flex w-full max-w-[1400px] items-center justify-between gap-4 px-6 py-[0.65rem] max-sm:flex-col max-sm:items-stretch max-sm:gap-1.5 max-sm:px-3 max-sm:py-2 max-sm:pb-[calc(0.5rem+env(safe-area-inset-bottom,0px))]">
        <p className="m-0 min-w-0 flex-1 overflow-hidden text-ellipsis whitespace-nowrap text-[0.8rem] font-medium text-muted max-sm:whitespace-normal max-sm:text-center max-sm:text-[0.7rem] max-sm:leading-tight">
          {!selectedPlan
            ? 'Select a plan to continue'
            : `${selectedPlan.name} plan${addonCount > 0 ? ` · ${addonCount} add-on${addonCount === 1 ? '' : 's'}` : ''}`}
        </p>

        <div className="flex shrink-0 items-center gap-[0.85rem] max-sm:justify-between max-sm:gap-2.5 max-[380px]:flex-col max-[380px]:items-stretch">
          <p className="m-0 flex items-baseline gap-1.5 whitespace-nowrap max-[380px]:justify-center">
            <span className="text-[0.75rem] font-semibold text-muted max-sm:text-[0.68rem]">Total</span>
            <AnimatedPrice
              amount={total}
              className="inline-block origin-left font-display text-[1.15rem] font-extrabold tracking-[-0.02em] text-ink max-sm:text-base data-updating:animate-price-pop data-updating:text-brand"
            />
          </p>
          <button
            type="button"
            className="cursor-pointer whitespace-nowrap rounded-lg border-none bg-brand px-[1.15rem] py-[0.55rem] font-display text-[0.82rem] font-bold text-white transition-[background,transform] duration-180 ease-smooth hover:enabled:bg-brand-dark active:enabled:scale-[0.97] disabled:cursor-not-allowed disabled:opacity-40 max-sm:max-w-[8.5rem] max-sm:flex-1 max-sm:px-[0.85rem] max-sm:py-2 max-sm:text-[0.76rem] max-[380px]:max-w-none max-[380px]:w-full"
            disabled={!canCheckout}
            onClick={onCheckout}
          >
            Checkout
          </button>
        </div>
      </div>
    </aside>
  )
}
