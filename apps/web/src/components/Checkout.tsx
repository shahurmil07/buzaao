import { useEffect, useState, type FormEvent } from 'react'
import { createPortal } from 'react-dom'
import type { CheckoutFormData, PricingPlan, SelectedAddon } from '../types'
import { formatPrice } from '../data/pricing'
import { apiRequest, ApiError } from '../lib/api'
import { cn } from '../lib/cn'
import { CheckoutSummary, type AppliedCoupon } from './CheckoutSummary'

interface CheckoutProps {
  selectedPlan: PricingPlan
  planCategory: 'business' | 'premises'
  selectedAddons: SelectedAddon[]
  total: number
  onClose: () => void
  onComplete: () => void
}

const EMPTY_FORM: CheckoutFormData = {
  fullName: '',
  email: '',
  phone: '',
  company: '',
  notes: '',
}

const fieldClass =
  'w-full resize-y rounded-[9px] border-[1.5px] border-line bg-page px-[0.8rem] py-[0.7rem] text-[0.95rem] text-ink focus:border-brand focus:outline-2 focus:outline-[color-mix(in_srgb,var(--color-brand)_55%,transparent)]'

export function Checkout({
  selectedPlan,
  planCategory,
  selectedAddons,
  total,
  onClose,
  onComplete,
}: CheckoutProps) {
  const [form, setForm] = useState<CheckoutFormData>(EMPTY_FORM)
  const [submitted, setSubmitted] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)
  const [applied, setApplied] = useState<AppliedCoupon | null>(null)
  const payable = applied?.payable ?? total

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

  function updateField<K extends keyof CheckoutFormData>(key: K, value: CheckoutFormData[K]) {
    setForm((prev) => ({ ...prev, [key]: value }))
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setSubmitError(null)
    setSaving(true)
    try {
      await apiRequest('/api/orders', {
        method: 'POST',
        body: JSON.stringify({
          fullName: form.fullName,
          email: form.email,
          phone: form.phone,
          company: form.company,
          notes: form.notes,
          couponCode: applied?.code ?? null,
          plan: {
            id: selectedPlan.id,
            name: selectedPlan.name,
            price: selectedPlan.price,
            category: planCategory,
          },
          addons: selectedAddons.map(({ addon, quantity }) => ({
            id: addon.id,
            name: addon.name,
            price: addon.price,
            quantity,
          })),
        }),
      })
      setSubmitted(true)
      onComplete()
    } catch (error) {
      setSubmitError(error instanceof ApiError ? error.message : 'Unable to place order')
    } finally {
      setSaving(false)
    }
  }

  const overlayClass =
    'fixed inset-0 z-[1000] flex min-h-dvh w-full items-center justify-center bg-[color-mix(in_srgb,var(--color-ink)_48%,transparent)] p-5 max-[720px]:items-end max-[720px]:p-0'

  const panelClass =
    'mx-auto flex w-[min(920px,100%)] max-h-[min(90dvh,880px)] flex-col overflow-hidden rounded-2xl border border-line bg-white shadow-[0_24px_60px_rgba(17,17,17,0.22)] max-[720px]:mx-0 max-[720px]:w-full max-[720px]:max-h-[92dvh] max-[720px]:rounded-t-2xl max-[720px]:rounded-b-none'

  const primaryClass =
    'w-[min(100%,280px)] cursor-pointer rounded-[10px] border-none bg-brand px-5 py-[0.9rem] font-display text-[0.95rem] font-bold text-white transition-[background,transform] duration-180 ease-smooth hover:bg-brand-dark active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60 max-[720px]:w-full'

  const content = submitted ? (
    <div
      className={overlayClass}
      role="dialog"
      aria-modal="true"
      aria-labelledby="checkout-done-title"
      onClick={onClose}
    >
      <div
        className={cn(
          panelClass,
          'w-[min(440px,100%)] max-h-none p-7 text-center max-[720px]:mt-auto max-[720px]:mb-0 max-[720px]:w-full',
        )}
        onClick={(e) => e.stopPropagation()}
      >
        <h2 id="checkout-done-title" className="m-0 font-display text-2xl tracking-[-0.03em]">
          Order placed
        </h2>
        <p className="mt-3 mb-5 leading-[1.55] text-muted">
          Thanks {form.fullName}. We received your order for {selectedPlan.name} plan totalling{' '}
          {formatPrice(payable)}.
        </p>
        <button type="button" className={cn(primaryClass, 'w-full')} onClick={onClose}>
          Done
        </button>
      </div>
    </div>
  ) : (
    <div
      className={overlayClass}
      role="dialog"
      aria-modal="true"
      aria-labelledby="checkout-title"
      onClick={onClose}
    >
      <div className={panelClass} onClick={(e) => e.stopPropagation()}>
        <header className="flex shrink-0 items-start justify-between gap-4 border-b border-line px-[1.4rem] pt-5 pb-[1.1rem] max-[720px]:px-4 max-[720px]:pt-4 max-[720px]:pb-[0.85rem]">
          <div>
            <p className="mb-1 text-[0.75rem] tracking-[0.08em] text-muted uppercase">
              Annual plan checkout
            </p>
            <h2 id="checkout-title" className="m-0 font-display text-2xl tracking-[-0.03em]">
              Complete your order
            </h2>
          </div>
          <button
            type="button"
            className="cursor-pointer rounded-lg border border-line bg-transparent px-3 py-[0.45rem] text-[0.85rem] text-ink transition-[background,border-color] duration-180 ease-smooth hover:bg-page"
            onClick={onClose}
            aria-label="Close checkout"
          >
            Close
          </button>
        </header>

        <form className="flex min-h-0 flex-1 flex-col" onSubmit={(e) => void handleSubmit(e)}>
          <div className="grid min-h-0 flex-1 grid-cols-[minmax(0,1.35fr)_minmax(260px,0.85fr)] gap-5 overflow-hidden px-[1.4rem] py-5 max-[720px]:grid-cols-1 max-[720px]:overflow-auto max-[720px]:p-4">
            <div className="flex min-h-0 flex-col gap-[0.85rem] overflow-y-auto pr-1">
              <label className="flex flex-col gap-[0.35rem] text-[0.85rem] text-muted">
                <span>Full name</span>
                <input
                  required
                  name="fullName"
                  autoComplete="name"
                  value={form.fullName}
                  onChange={(e) => updateField('fullName', e.target.value)}
                  className={fieldClass}
                />
              </label>

              <label className="flex flex-col gap-[0.35rem] text-[0.85rem] text-muted">
                <span>Email</span>
                <input
                  required
                  type="email"
                  name="email"
                  autoComplete="email"
                  value={form.email}
                  onChange={(e) => updateField('email', e.target.value)}
                  className={fieldClass}
                />
              </label>

              <label className="flex flex-col gap-[0.35rem] text-[0.85rem] text-muted">
                <span>Phone</span>
                <input
                  required
                  type="tel"
                  name="phone"
                  autoComplete="tel"
                  value={form.phone}
                  onChange={(e) => updateField('phone', e.target.value)}
                  className={fieldClass}
                />
              </label>

              <label className="flex flex-col gap-[0.35rem] text-[0.85rem] text-muted">
                <span>Company (optional)</span>
                <input
                  name="company"
                  autoComplete="organization"
                  value={form.company}
                  onChange={(e) => updateField('company', e.target.value)}
                  className={fieldClass}
                />
              </label>

              <label className="flex flex-col gap-[0.35rem] text-[0.85rem] text-muted">
                <span>Notes (optional)</span>
                <textarea
                  name="notes"
                  rows={3}
                  value={form.notes}
                  onChange={(e) => updateField('notes', e.target.value)}
                  className={fieldClass}
                />
              </label>
            </div>

            <CheckoutSummary
              selectedPlan={selectedPlan}
              selectedAddons={selectedAddons}
              subtotal={total}
              applied={applied}
              onApplied={setApplied}
            />
          </div>

          {submitError ? (
            <p
              className="mx-[1.4rem] mb-0 rounded-lg bg-[#fff5f5] px-3 py-2 text-[0.82rem] font-semibold text-brand max-[720px]:mx-4"
              role="alert"
            >
              {submitError}
            </p>
          ) : null}

          <footer className="flex shrink-0 justify-end border-t border-line px-[1.4rem] py-4 max-[720px]:justify-stretch max-[720px]:px-4 max-[720px]:py-[0.85rem] max-[720px]:pb-[calc(0.85rem+env(safe-area-inset-bottom,0px))]">
            <button type="submit" className={primaryClass} disabled={saving}>
              {saving ? 'Placing order…' : `Place order · ${formatPrice(payable)}`}
            </button>
          </footer>
        </form>
      </div>
    </div>
  )

  return createPortal(content, document.body)
}
