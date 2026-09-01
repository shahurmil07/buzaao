import { FormEvent, useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import { DiscountTypeSelect } from './DiscountTypeSelect'
import { ApiError } from '../lib/api'
import { cn } from '../lib/cn'
import { todayIsoDate } from '../lib/format'
import type { Coupon, DiscountType } from '../types/admin'

export interface CouponPayload {
  code: string
  discountType: DiscountType
  discountValue: number
  quantity: number
  expiresAt: string
}

interface AddCouponDialogProps {
  coupon?: Coupon | null
  onClose: () => void
  onSaved: () => Promise<void> | void
  onSubmit: (payload: CouponPayload) => Promise<void>
}

const fieldClass =
  'w-full rounded-[10px] border-[1.5px] border-line bg-white px-3 py-[0.7rem] text-[0.92rem] font-medium text-ink'

export function AddCouponDialog({ coupon, onClose, onSaved, onSubmit }: AddCouponDialogProps) {
  const isEdit = Boolean(coupon)
  const [code, setCode] = useState(coupon?.code ?? '')
  const [discountType, setDiscountType] = useState<DiscountType>(coupon?.discountType ?? 'percent')
  const [discountValue, setDiscountValue] = useState(String(coupon?.discountValue ?? 10))
  const [quantity, setQuantity] = useState(String(coupon?.quantity ?? 10))
  const [expiresAt, setExpiresAt] = useState(coupon?.expiresAt.slice(0, 10) ?? todayIsoDate())
  const [error, setError] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    const previous = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = previous
    }
  }, [])

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [onClose])

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError(null)
    setSaving(true)
    try {
      await onSubmit({
        code,
        discountType,
        discountValue: Number(discountValue),
        quantity: Number(quantity),
        expiresAt,
      })
      await onSaved()
      onClose()
    } catch (err) {
      setError(err instanceof ApiError ? err.message : isEdit ? 'Unable to update coupon' : 'Unable to add coupon')
    } finally {
      setSaving(false)
    }
  }

  return createPortal(
    <div
      className="fixed inset-0 z-[1000] flex min-h-dvh items-center justify-center bg-[color-mix(in_srgb,var(--color-ink)_48%,transparent)] p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="add-coupon-title"
      onClick={onClose}
    >
      <form
        className="w-full max-w-[440px] rounded-2xl border border-line bg-white p-6 shadow-[0_24px_60px_rgba(17,17,17,0.22)]"
        onClick={(e) => e.stopPropagation()}
        onSubmit={(e) => void handleSubmit(e)}
      >
        <h2 id="add-coupon-title" className="mb-4 font-display text-[1.25rem] font-extrabold text-ink">
          {isEdit ? 'Edit coupon' : 'Add coupon'}
        </h2>

        <div className="flex flex-col gap-3.5">
          <label className="flex flex-col gap-1.5 text-[0.78rem] font-semibold text-muted">
            Code
            <input
              className={fieldClass}
              value={code}
              onChange={(e) => setCode(e.target.value.toUpperCase())}
              placeholder="SAVE10"
              required
            />
          </label>

          <div className="grid grid-cols-2 gap-3">
            <label className="flex flex-col gap-1.5 text-[0.78rem] font-semibold text-muted">
              Discount type
              <DiscountTypeSelect value={discountType} onChange={setDiscountType} />
            </label>
            <label className="flex flex-col gap-1.5 text-[0.78rem] font-semibold text-muted">
              Discount
              <input
                className={fieldClass}
                type="number"
                min={1}
                max={discountType === 'percent' ? 100 : undefined}
                value={discountValue}
                onChange={(e) => setDiscountValue(e.target.value)}
                required
              />
            </label>
          </div>

          <label className="flex flex-col gap-1.5 text-[0.78rem] font-semibold text-muted">
            Quantity (times it can be used)
            <input
              className={fieldClass}
              type="number"
              min={1}
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              required
            />
          </label>

          <label className="flex flex-col gap-1.5 text-[0.78rem] font-semibold text-muted">
            Expiry date
            <input
              className={fieldClass}
              type="date"
              min={todayIsoDate()}
              value={expiresAt}
              onChange={(e) => setExpiresAt(e.target.value)}
              required
            />
          </label>
        </div>

        {error ? (
          <p className="mt-3 mb-0 rounded-lg bg-[#fff5f5] px-3 py-2 text-[0.82rem] font-semibold text-brand" role="alert">
            {error}
          </p>
        ) : null}

        <div className="mt-5 flex justify-end gap-2">
          <button
            type="button"
            className="cursor-pointer rounded-[10px] border border-line bg-white px-4 py-2.5 font-display text-[0.82rem] font-bold text-ink"
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={saving}
            className={cn(
              'cursor-pointer rounded-[10px] border-none bg-[#e31e24] px-4 py-2.5 font-display text-[0.82rem] font-bold text-white disabled:opacity-60',
            )}
          >
            {saving ? 'Saving…' : isEdit ? 'Save changes' : 'Add coupon'}
          </button>
        </div>
      </form>
    </div>,
    document.body,
  )
}
