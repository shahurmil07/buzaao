import type { Addon } from '../types'
import { formatPrice } from '../data/pricing'
import { AnimatedPrice } from './AnimatedPrice'
import { cn } from '../lib/cn'

interface AddonsSectionProps {
  addons: Addon[]
  quantities: Record<string, number>
  onQuantityChange: (addonId: string, quantity: number) => void
  subtitle: string
}

function isQrAddon(addon: Addon) {
  return addon.unit === 'QR'
}

function QuantityStepper({
  addon,
  qty,
  onQuantityChange,
}: {
  addon: Addon
  qty: number
  onQuantityChange: (addonId: string, quantity: number) => void
}) {
  const stepClass =
    'h-10 w-10 cursor-pointer border-none bg-page text-[1.1rem] font-bold text-ink transition-[background,transform] duration-180 ease-smooth hover:enabled:bg-[#eee] active:enabled:scale-[0.92] disabled:cursor-not-allowed disabled:opacity-35 max-[720px]:h-[2.15rem] max-[720px]:w-[2.15rem] max-[720px]:text-[0.95rem]'

  return (
    <>
      <label
        className="text-[0.78rem] font-semibold uppercase tracking-[0.05em] text-muted"
        htmlFor={`qty-${addon.id}`}
      >
        Quantity
      </label>
      <div className="flex w-fit items-center overflow-hidden rounded-[10px] border-[1.5px] border-line">
        <button
          type="button"
          className={stepClass}
          aria-label={`Decrease ${addon.name} quantity`}
          disabled={qty <= 0}
          onClick={() => onQuantityChange(addon.id, Math.max(0, qty - 1))}
        >
          −
        </button>
        <input
          id={`qty-${addon.id}`}
          className="h-10 w-14 [appearance:textfield] border-y-0 border-x-[1.5px] border-line bg-white text-center font-display text-base font-bold text-ink [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none max-[720px]:h-[2.15rem] max-[720px]:w-12 max-[720px]:text-[0.88rem]"
          type="number"
          min={0}
          max={9999}
          value={qty}
          onChange={(e) => {
            const next = Math.max(0, parseInt(e.target.value, 10) || 0)
            onQuantityChange(addon.id, next)
          }}
        />
        <button
          type="button"
          className={stepClass}
          aria-label={`Increase ${addon.name} quantity`}
          onClick={() => onQuantityChange(addon.id, qty + 1)}
        >
          +
        </button>
      </div>
    </>
  )
}

export function AddonsSection({ addons, quantities, onQuantityChange, subtitle }: AddonsSectionProps) {
  return (
    <section className="mt-10 w-full animate-fade-up max-[720px]:mt-6" aria-labelledby="addons-title">
      <header className="mb-5 max-[720px]:mb-3">
        <h2
          id="addons-title"
          className="mb-1.5 font-display text-[clamp(1.35rem,3vw,1.65rem)] font-extrabold tracking-[-0.02em] text-ink max-[720px]:text-[0.95rem]"
        >
          Add-ons
        </h2>
        <p className="m-0 text-[0.95rem] leading-relaxed text-muted max-[720px]:text-[0.76rem] max-[720px]:leading-[1.45]">
          {subtitle}
        </p>
      </header>

      <div className="grid grid-cols-3 gap-4 max-lg:grid-cols-2 max-[720px]:grid-cols-1 max-[720px]:gap-[0.65rem]">
        {addons.map((addon) => {
          const qty = quantities[addon.id] ?? 0
          const lineTotal = addon.price * qty
          const isQr = isQrAddon(addon)
          const added = qty > 0

          return (
            <article
              key={addon.id}
              className={cn(
                'flex flex-col justify-between gap-4 rounded-[14px] bg-white p-[1.15rem] transition-[border-color,box-shadow,transform] duration-280 ease-smooth hover:-translate-y-0.5 max-[720px]:gap-[0.85rem] max-[720px]:p-[0.85rem] max-[720px]:hover:translate-y-0',
                added
                  ? 'border border-brand shadow-[0_8px_24px_rgba(227,30,36,0.1)]'
                  : 'border border-line shadow-[0_2px_12px_rgba(17,17,17,0.04)] hover:shadow-[0_8px_22px_rgba(17,17,17,0.07)]',
              )}
            >
              <div>
                <h3 className="mb-1.5 font-display text-[1.05rem] font-bold text-ink max-[720px]:text-[0.86rem]">
                  {addon.name}
                </h3>
                <p className="mb-3 text-[0.88rem] leading-[1.55] text-muted max-[720px]:mb-[0.35rem] max-[720px]:text-[0.74rem] max-[720px]:leading-[1.45]">
                  {addon.description}
                </p>
                <p className="m-0 text-[0.9rem] text-muted max-[720px]:text-[0.78rem]">
                  <strong className="font-display text-[1.15rem] font-extrabold text-brand max-[720px]:text-[0.92rem]">
                    {formatPrice(addon.price)}
                  </strong>
                  <span> / {addon.unit}</span>
                </p>
              </div>

              <div className="flex flex-col gap-2">
                {isQr ? (
                  <QuantityStepper addon={addon} qty={qty} onQuantityChange={onQuantityChange} />
                ) : (
                  <button
                    type="button"
                    className={cn(
                      'inline-flex w-fit min-w-[5.5rem] cursor-pointer items-center justify-center gap-[0.3rem] rounded-lg border-[1.5px] px-[0.85rem] py-1.5 font-display text-[0.75rem] font-bold transition-[border-color,background-color,color,box-shadow,transform] duration-180 ease-smooth active:scale-[0.98] max-[720px]:min-w-[4.75rem] max-[720px]:rounded-[7px] max-[720px]:px-[0.7rem] max-[720px]:py-[0.32rem] max-[720px]:text-[0.7rem]',
                      added
                        ? 'border-[#e31e24] bg-[#e31e24] text-white shadow-[0_2px_8px_rgba(227,30,36,0.22)] hover:bg-[#c4181e]'
                        : 'border-line bg-white text-ink hover:border-[#e31e24] hover:text-[#e31e24]',
                    )}
                    aria-pressed={added}
                    onClick={() => onQuantityChange(addon.id, added ? 0 : 1)}
                  >
                    {added ? (
                      <>
                        <svg width="13" height="13" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                          <path
                            d="M3.5 8.2L6.3 11L12.5 4.5"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                        Added
                      </>
                    ) : (
                      'Add'
                    )}
                  </button>
                )}

                {added && (
                  <p className="mt-1 animate-line-in text-[0.85rem] text-muted max-[720px]:text-[0.76rem]">
                    Subtotal:{' '}
                    <AnimatedPrice
                      amount={lineTotal}
                      className="inline-block text-ink data-updating:animate-price-pop data-updating:text-brand"
                    />
                  </p>
                )}
              </div>
            </article>
          )
        })}
      </div>
    </section>
  )
}
