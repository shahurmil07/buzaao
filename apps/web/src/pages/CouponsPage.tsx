import { useCallback, useEffect, useState } from 'react'
import { AddCouponDialog, type CouponPayload } from '../components/AddCouponDialog'
import { ConfirmDialog } from '../components/ConfirmDialog'
import { apiRequest } from '../lib/api'
import { cn } from '../lib/cn'
import { formatIsoDate } from '../lib/format'
import { formatPrice } from '../data/pricing'
import type { Coupon } from '../types/admin'

function discountLabel(coupon: Coupon) {
  if (coupon.discountType === 'percent') return `${coupon.discountValue}% off`
  return `${formatPrice(coupon.discountValue)} off`
}

const statusClass: Record<Coupon['status'], string> = {
  active: 'bg-[#ecfdf3] text-[#067647]',
  expired: 'bg-[#f3f4f6] text-muted',
  exhausted: 'bg-[#fff5f5] text-brand',
}

const iconBtn =
  'inline-flex size-8 cursor-pointer items-center justify-center rounded-lg border-none bg-transparent text-muted transition-colors duration-150 hover:bg-page hover:text-ink disabled:opacity-50'

export function CouponsPage() {
  const [coupons, setCoupons] = useState<Coupon[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editing, setEditing] = useState<Coupon | null>(null)
  const [deleting, setDeleting] = useState<Coupon | null>(null)
  const [deleteBusy, setDeleteBusy] = useState(false)

  const loadCoupons = useCallback(async () => {
    const data = await apiRequest<{ coupons: Coupon[] }>('/api/admin/coupons')
    setCoupons(data.coupons)
  }, [])

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    loadCoupons()
      .catch(() => {
        if (!cancelled) setError('Unable to load coupons')
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })
    return () => {
      cancelled = true
    }
  }, [loadCoupons])

  async function saveCoupon(payload: CouponPayload) {
    if (editing) {
      await apiRequest(`/api/admin/coupons/${editing.id}`, {
        method: 'PATCH',
        body: JSON.stringify(payload),
      })
      return
    }
    await apiRequest('/api/admin/coupons', {
      method: 'POST',
      body: JSON.stringify(payload),
    })
  }

  async function confirmDelete() {
    if (!deleting) return
    setDeleteBusy(true)
    try {
      await apiRequest(`/api/admin/coupons/${deleting.id}`, { method: 'DELETE' })
      await loadCoupons()
      setDeleting(null)
    } finally {
      setDeleteBusy(false)
    }
  }

  return (
    <section className="flex h-full min-h-0 flex-col">
      <header className="mb-5 flex shrink-0 flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="m-0 font-display text-[clamp(1.25rem,3vw,1.6rem)] font-extrabold tracking-[-0.02em] text-ink">
            Coupons
          </h1>
          <p className="mt-1 mb-0 text-[0.88rem] text-muted">Discount codes with usage limits and expiry.</p>
        </div>
        <button
          type="button"
          onClick={() => {
            setEditing(null)
            setDialogOpen(true)
          }}
          className="cursor-pointer rounded-[10px] border-none bg-[#e31e24] px-4 py-2.5 font-display text-[0.82rem] font-bold text-white shadow-[0_4px_14px_rgba(227,30,36,0.22)]"
        >
          Add coupon
        </button>
      </header>

      <div className="flex min-h-0 flex-1 flex-col overflow-auto rounded-2xl border border-line bg-white shadow-[0_8px_28px_rgba(17,17,17,0.05)]">
        {loading ? (
          <p className="m-auto px-5 py-8 text-sm font-semibold text-muted">Loading coupons…</p>
        ) : error ? (
          <p className="m-auto px-5 py-8 text-sm font-semibold text-brand">{error}</p>
        ) : coupons.length === 0 ? (
          <p className="m-auto px-5 py-8 text-sm text-muted">No coupons yet. Add one to get started.</p>
        ) : (
          <table className="w-full min-w-[820px] border-collapse text-left">
            <thead className="sticky top-0 bg-page">
              <tr>
                {['Code', 'Discount', 'Quantity', 'Used', 'Remaining', 'Expiry', 'Status', 'Action'].map((label) => (
                  <th
                    key={label}
                    className={cn(
                      'px-4 py-3 text-[0.72rem] font-bold tracking-[0.04em] text-muted uppercase',
                      label === 'Action' && 'text-right',
                    )}
                  >
                    {label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {coupons.map((coupon) => (
                <tr key={coupon.id} className="border-t border-line">
                  <td className="px-4 py-3.5 font-display text-[0.88rem] font-bold text-ink">{coupon.code}</td>
                  <td className="px-4 py-3.5 text-[0.88rem] text-ink">{discountLabel(coupon)}</td>
                  <td className="px-4 py-3.5 text-[0.88rem] text-ink">{coupon.quantity}</td>
                  <td className="px-4 py-3.5 text-[0.88rem] text-ink">{coupon.usedCount}</td>
                  <td className="px-4 py-3.5 text-[0.88rem] text-ink">{coupon.remaining}</td>
                  <td className="px-4 py-3.5 text-[0.88rem] text-ink">{formatIsoDate(coupon.expiresAt)}</td>
                  <td className="px-4 py-3.5">
                    <span
                      className={cn(
                        'inline-flex rounded-full px-2.5 py-1 text-[0.7rem] font-bold capitalize',
                        statusClass[coupon.status],
                      )}
                    >
                      {coupon.status}
                    </span>
                  </td>
                  <td className="px-4 py-3.5">
                    <div className="flex items-center justify-end gap-1">
                      <button
                        type="button"
                        className={iconBtn}
                        aria-label={`Edit ${coupon.code}`}
                        onClick={() => {
                          setEditing(coupon)
                          setDialogOpen(true)
                        }}
                      >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                          <path
                            d="M12 20h9M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4 12.5-12.5z"
                            stroke="currentColor"
                            strokeWidth="1.8"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      </button>
                      <button
                        type="button"
                        className={cn(iconBtn, 'hover:bg-[#fff5f5] hover:text-[#e31e24]')}
                        aria-label={`Delete ${coupon.code}`}
                        onClick={() => setDeleting(coupon)}
                      >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                          <path
                            d="M4 7h16M9 7V5h6v2M6 7l1 13h10l1-13"
                            stroke="currentColor"
                            strokeWidth="1.8"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {dialogOpen ? (
        <AddCouponDialog
          coupon={editing}
          onClose={() => {
            setDialogOpen(false)
            setEditing(null)
          }}
          onSaved={loadCoupons}
          onSubmit={saveCoupon}
        />
      ) : null}

      {deleting ? (
        <ConfirmDialog
          title="Delete coupon"
          message={`Delete ${deleting.code}? This cannot be undone.`}
          confirmLabel="Delete"
          busy={deleteBusy}
          onCancel={() => setDeleting(null)}
          onConfirm={() => void confirmDelete()}
        />
      ) : null}
    </section>
  )
}
