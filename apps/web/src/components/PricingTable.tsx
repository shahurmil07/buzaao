import type { FeatureValue, PlanCategory, PricingPlan } from '../types'
import {
  CORPORATE_SOLUTION,
  CUSTOM_SOLUTION,
  corporateQuoteWhatsAppUrl,
  customEstimateWhatsAppUrl,
} from '../data/pricing'
import { cn } from '../lib/cn'
import { SolutionBanner } from './SolutionBanner'

interface PricingTableProps {
  category: PlanCategory
  selectedPlanId: string | null
  onSelectPlan: (planId: string) => void
}

function FeatureCell({ value }: { value: FeatureValue }) {
  if (value === true) {
    return (
      <span className="inline-flex items-center justify-center text-brand" aria-label="Included">
        <svg
          className="max-sm:size-[15px]"
          width="18"
          height="18"
          viewBox="0 0 18 18"
          fill="none"
          aria-hidden="true"
        >
          <circle cx="9" cy="9" r="9" fill="currentColor" opacity="0.12" />
          <path
            d="M5.5 9.2L7.8 11.5L12.5 6.5"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </span>
    )
  }
  if (value === false) {
    return (
      <span
        className="inline-flex items-center justify-center text-[0.95rem] font-semibold text-[#d1d5db] max-sm:text-[0.82rem]"
        aria-label="Not included"
      >
        —
      </span>
    )
  }
  return (
    <span className="inline-flex items-center justify-center text-[0.8rem] font-semibold leading-snug text-ink max-sm:text-[0.7rem]">
      {value}
    </span>
  )
}

function PlanCard({
  plan,
  selected,
  popular,
  delay,
  onSelect,
}: {
  plan: PricingPlan
  selected: boolean
  popular: boolean
  delay: string
  onSelect: () => void
}) {
  return (
    <article
      className={cn(
        'relative flex animate-fade-up flex-col rounded-2xl border-2 border-line bg-white px-5 pb-[1.15rem] pt-[1.35rem] transition-[border-color,box-shadow,transform] duration-280 ease-smooth hover:-translate-y-0.5 hover:border-[#d1d5db] hover:shadow-[0_8px_28px_rgba(17,17,17,0.07)] max-lg:scroll-ml-0 max-sm:w-[min(72vw,220px)] max-sm:shrink-0 max-sm:snap-start max-sm:px-[0.8rem] max-sm:py-[0.85rem] max-sm:hover:translate-y-0',
        popular &&
          'border-[color-mix(in_srgb,var(--color-brand)_30%,var(--color-line))] shadow-[0_4px_20px_rgba(227,30,36,0.08)]',
        selected &&
          'translate-y-[-2px] border-brand bg-[linear-gradient(180deg,#fffafa_0%,#fff_100%)] shadow-[0_0_0_1px_var(--color-brand),0_12px_32px_rgba(227,30,36,0.14)] max-sm:translate-y-0',
        selected && popular && 'bg-[linear-gradient(180deg,#fff5f5_0%,#fff_100%)]',
      )}
      style={{ animationDelay: delay }}
    >
      {popular && (
        <span className="absolute top-[-0.65rem] left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full bg-brand px-[0.7rem] py-[0.28rem] text-[0.65rem] font-bold tracking-[0.05em] text-white uppercase shadow-[0_2px_8px_rgba(227,30,36,0.3)] max-lg:static max-lg:mb-[0.65rem] max-lg:translate-x-0 max-lg:self-start max-sm:mb-1.5 max-sm:px-2 max-sm:py-[0.22rem] max-sm:text-[0.58rem]">
          Most Popular
        </span>
      )}

      <div className={cn('mb-[1.1rem] flex-1 pt-1 max-sm:mb-[0.7rem]', popular && 'pt-2')}>
        <h3 className="mb-2 font-display text-[1.1rem] font-extrabold tracking-[-0.02em] text-ink max-sm:mb-[0.35rem] max-sm:text-[0.88rem]">
          {plan.name}
        </h3>
        <div className="flex flex-wrap items-baseline gap-x-[0.35rem] gap-y-[0.2rem]">
          <span className="font-display text-[clamp(1.25rem,2.5vw,1.55rem)] font-extrabold leading-tight tracking-[-0.03em] text-brand max-sm:text-[1.05rem]">
            {plan.priceLabel}
          </span>
          <span className="text-[0.82rem] font-semibold text-muted max-sm:text-[0.72rem]">/ year</span>
        </div>
      </div>

      <button
        type="button"
        className={cn(
          'inline-flex w-full cursor-pointer items-center justify-center gap-1.5 rounded-[10px] border-[1.5px] px-4 py-[0.7rem] font-display text-[0.85rem] font-bold transition-[border-color,background-color,color,box-shadow,transform] duration-180 ease-smooth active:scale-[0.98] max-sm:rounded-lg max-sm:px-[0.7rem] max-sm:py-[0.55rem] max-sm:text-[0.74rem]',
          selected
            ? 'border-[#e31e24] bg-[#e31e24] text-white shadow-[0_4px_14px_rgba(227,30,36,0.25)] hover:bg-[#c4181e]'
            : 'border-line bg-white text-ink hover:border-[#e31e24] hover:text-[#e31e24]',
        )}
        onClick={onSelect}
        aria-pressed={selected}
      >
        {selected ? (
          <>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
              <path
                d="M3.5 8.2L6.3 11L12.5 4.5"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            Selected
          </>
        ) : (
          'Select plan'
        )}
      </button>
    </article>
  )
}

export function PricingTable({ category, selectedPlanId, onSelectPlan }: PricingTableProps) {
  const delays = ['40ms', '80ms', '120ms', '160ms']

  return (
    <div className="flex w-full flex-col gap-7 max-sm:gap-4">
      <div className="grid grid-cols-4 items-stretch gap-4 max-lg:grid-cols-2 max-lg:gap-x-[0.85rem] max-sm:-mx-[0.15rem] max-sm:mt-[-0.5rem] max-sm:flex max-sm:gap-[0.65rem] max-sm:overflow-x-auto max-sm:scroll-smooth max-sm:px-[0.15rem] max-sm:pt-2 max-sm:pb-[0.35rem] max-sm:snap-x max-sm:snap-mandatory max-sm:[scrollbar-width:none] max-sm:[&::-webkit-scrollbar]:hidden">
        {category.plans.map((plan, index) => (
          <PlanCard
            key={plan.id}
            plan={plan}
            selected={selectedPlanId === plan.id}
            popular={Boolean(plan.popular)}
            delay={delays[index] ?? '0ms'}
            onSelect={() => onSelectPlan(plan.id)}
          />
        ))}
      </div>

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

      <div className="w-full">
        <p className="mb-3 font-display text-[0.8rem] font-bold tracking-[0.07em] text-muted uppercase max-sm:mb-2 max-sm:text-[0.68rem]">
          Compare all features
        </p>
        <div className="w-full overflow-x-auto rounded-2xl border border-line bg-white shadow-[0_2px_16px_rgba(17,17,17,0.04)] [-webkit-overflow-scrolling:touch]">
          <table className="w-full min-w-[680px] table-fixed border-collapse">
            <caption className="sr-only">{category.title} feature comparison</caption>
            <thead>
              <tr>
                <th
                  className="sticky left-0 z-[2] w-[30%] min-w-[180px] border-b border-line bg-page px-[1.15rem] py-[0.9rem] text-left font-display text-[0.75rem] font-bold tracking-[0.06em] text-muted uppercase max-sm:min-w-[120px] max-sm:px-3 max-sm:py-[0.65rem] max-sm:text-[0.65rem]"
                  scope="col"
                >
                  Feature
                </th>
                {category.plans.map((plan) => {
                  const selected = selectedPlanId === plan.id
                  return (
                    <th
                      key={plan.id}
                      className={cn(
                        'border-b border-line bg-page px-2 py-[0.9rem] text-center font-display text-[0.82rem] font-bold text-ink transition-[background,color] duration-280 ease-smooth max-sm:px-[0.35rem] max-sm:py-[0.65rem] max-sm:text-[0.72rem]',
                        plan.popular && 'bg-[color-mix(in_srgb,var(--color-brand)_4%,var(--color-page))]',
                        selected &&
                          'bg-[color-mix(in_srgb,var(--color-brand)_8%,#fff)] text-brand shadow-[inset_0_-2px_0_var(--color-brand)]',
                      )}
                      scope="col"
                    >
                      {plan.name}
                    </th>
                  )
                })}
              </tr>
            </thead>
            <tbody>
              {category.features.map((row, index) => {
                const even = index % 2 === 0
                const last = index === category.features.length - 1
                return (
                  <tr key={row.name}>
                    <th
                      className={cn(
                        'sticky left-0 z-[1] border-b border-line px-[1.15rem] py-[0.7rem] text-left text-[0.86rem] font-semibold text-ink max-sm:min-w-[120px] max-sm:px-3 max-sm:py-[0.55rem] max-sm:text-[0.74rem]',
                        even ? 'bg-white' : 'bg-[#fafafa]',
                        last && 'border-b-0',
                      )}
                      scope="row"
                    >
                      {row.name}
                    </th>
                    {category.plans.map((plan) => {
                      const selected = selectedPlanId === plan.id
                      return (
                        <td
                          key={plan.id}
                          className={cn(
                            'border-b border-line px-[0.45rem] py-[0.7rem] text-center transition-colors duration-280 ease-smooth max-sm:px-[0.3rem] max-sm:py-[0.55rem]',
                            even ? 'bg-white' : 'bg-[#fafafa]',
                            selected &&
                              (even
                                ? 'bg-[color-mix(in_srgb,var(--color-brand)_5%,#fff)] shadow-[inset_1px_0_0_color-mix(in_srgb,var(--color-brand)_12%,transparent),inset_-1px_0_0_color-mix(in_srgb,var(--color-brand)_12%,transparent)]'
                                : 'bg-[color-mix(in_srgb,var(--color-brand)_5%,#fafafa)] shadow-[inset_1px_0_0_color-mix(in_srgb,var(--color-brand)_12%,transparent),inset_-1px_0_0_color-mix(in_srgb,var(--color-brand)_12%,transparent)]'),
                            last && 'border-b-0',
                          )}
                        >
                          <FeatureCell value={row.values[plan.id] ?? false} />
                        </td>
                      )
                    })}
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>

      <p className="m-0 flex items-start gap-2 rounded-xl border border-[color-mix(in_srgb,var(--color-brand)_12%,var(--color-line))] bg-[color-mix(in_srgb,var(--color-brand)_5%,#fff)] px-[1.1rem] py-[0.9rem] text-[0.88rem] font-semibold leading-[1.55] text-ink max-sm:px-3 max-sm:py-[0.65rem] max-sm:text-[0.74rem] max-sm:leading-[1.45]">
        <span className="shrink-0 leading-[1.55]" aria-hidden="true">
          ⭐
        </span>
        {category.popularNote}
      </p>
    </div>
  )
}
