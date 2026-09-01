import { useState } from 'react'
import type { PricingPlan, SelectedAddon } from '../types'
import { formatPrice } from '../data/pricing'
import { apiRequest, ApiError } from '../lib/api'
import { cn } from '../lib/cn'

export interface AppliedCoupon {
  code: string
  discountType: 'percent' | 'amount'
  discountValue: number
  discountAmount: number
  payable: number
}

interface CheckoutSummaryProps {
  selectedPlan: PricingPlan
  selectedAddons: SelectedAddon[]
  subtotal: number
  applied: AppliedCoupon | null
  onApplied: (coupon: AppliedCoupon | null) => void
}

export function CheckoutSummary({
  selectedPlan,
  selectedAddons,
  subtotal,
  applied,
  onApplied,
}: CheckoutSummaryProps) {
  const [code, setCode] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [applying, setApplying] = useState(false)
  const payable = applied?.payable ?? subtotal

  async function applyCoupon() {
    setError(null)
    setApplying(true)
    try {
      const data = await apiRequest<{ coupon: AppliedCoupon }>('/api/coupons/preview', {
        method: 'POST',
        body: JSON.stringify({ code, subtotal }),
      })
      onApplied(data.coupon)
      setCode('')
    } catch (err) {
      onApplied(null)
      setError(err instanceof ApiError ? err.message : 'Unable to apply coupon')
    } finally {
      setApplying(false)
    }
  }

  return (
    <aside className="self-start rounded-xl border border-line bg-page p-4 max-[720px]:order-first">
      <h3 className="mb-[0.85rem] font-display text-base">Order summary</h3>
      <ul className="m-0 flex list-none flex-col gap-[0.65rem] p-0">
        <li className="flex justify-between gap-3 text-[0.9rem]">
          <span>{selectedPlan.name} Plan (annual) × 1</span>
          <span className="whitespace-nowrap text-muted">{selectedPlan.priceLabel}</span>
        </li>
        {selectedAddons.map(({ addon, quantity }) => (
          <li key={addon.id} className="flex justify-between gap-3 text-[0.9rem]">
            <span>
              {addon.name} × {quantity}
            </span>
            <span className="whitespace-nowrap text-muted">{formatPrice(addon.price * quantity)}</span>
          </li>
        ))}
      </ul>

      <div className="mt-4 border-t border-dashed border-line pt-3">
        <p className="mb-2 text-[0.78rem] font-semibold text-muted">Discount coupon</p>
        {applied ? (
          <div className="flex items-center justify-between gap-2 rounded-lg border border-line bg-white px-3 py-2">
            <span className="text-[0.82rem] font-bold text-ink">
              {applied.code}
              <span className="ml-1.5 font-semibold text-[#067647]">−{formatPrice(applied.discountAmount)}</span>
            </span>
            <button
              type="button"
              className="cursor-pointer border-none bg-transparent text-[0.75rem] font-bold text-brand"
              onClick={() => onApplied(null)}
            >
              Remove
            </button>
          </div>
        ) : (
          <div className="flex gap-2">
            <input
              className="min-w-0 flex-1 rounded-[9px] border-[1.5px] border-line bg-white px-3 py-2 text-[0.88rem] font-semibold uppercase text-ink"
              value={code}
              onChange={(e) => setCode(e.target.value.toUpperCase())}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault()
                  if (code.trim()) void applyCoupon()
                }
              }}
              placeholder="SAVE10"
              aria-label="Coupon code"
            />
            <button
              type="button"
              disabled={applying || !code.trim()}
              onClick={() => void applyCoupon()}
              className="cursor-pointer rounded-[9px] border-none bg-[#e31e24] px-3 py-2 font-display text-[0.78rem] font-bold text-white disabled:opacity-50"
            >
              {applying ? '…' : 'Apply'}
            </button>
          </div>
        )}
        {error ? (
          <p className="mt-2 mb-0 text-[0.75rem] font-semibold text-brand" role="alert">
            {error}
          </p>
        ) : null}
      </div>

      {applied ? (
        <p className="mt-3 mb-0 flex justify-between text-[0.82rem] text-muted">
          <span>Subtotal</span>
          <span>{formatPrice(subtotal)}</span>
        </p>
      ) : null}

      <p
        className={cn(
          'mb-0 flex items-baseline justify-between pt-[0.85rem]',
          applied ? 'mt-2 border-t border-dashed border-line' : 'mt-4 border-t border-dashed border-line',
        )}
      >
        <span>Total</span>
        <strong className="font-display text-[1.2rem]">{formatPrice(payable)}</strong>
      </p>
    </aside>
  )
}
