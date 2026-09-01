import { useEffect } from 'react'
import { createPortal } from 'react-dom'
import { formatPrice } from '../data/pricing'
import { formatDateTime } from '../lib/format'
import { initialsFromName } from '../lib/initials'
import type { PurchaseUser } from '../types/admin'

interface UserDetailDrawerProps {
  user: PurchaseUser
  onClose: () => void
}

export function UserDetailDrawer({ user, onClose }: UserDetailDrawerProps) {
  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [onClose])

  return createPortal(
    <div className="fixed inset-0 z-[1000] flex justify-end bg-[color-mix(in_srgb,var(--color-ink)_40%,transparent)]" role="dialog" aria-modal="true">
      <button type="button" className="h-full flex-1 cursor-default border-none bg-transparent" aria-label="Close" onClick={onClose} />
      <aside className="flex h-full w-[min(440px,100%)] flex-col bg-white shadow-[-12px_0_40px_rgba(17,17,17,0.12)]">
        <header className="flex items-start justify-between gap-3 border-b border-line px-5 py-4">
          <div className="flex min-w-0 items-center gap-3">
            <span className="flex size-11 shrink-0 items-center justify-center rounded-full bg-[#e31e24] font-display text-[0.85rem] font-bold text-white">
              {initialsFromName(user.fullName)}
            </span>
            <div className="min-w-0">
              <h2 className="m-0 truncate font-display text-[1.05rem] font-extrabold text-ink">{user.fullName}</h2>
              <p className="mt-0.5 mb-0 truncate text-[0.78rem] text-muted">{user.email}</p>
            </div>
          </div>
          <button
            type="button"
            className="cursor-pointer rounded-lg border border-line bg-white px-3 py-1.5 text-[0.78rem] font-bold text-ink hover:bg-page"
            onClick={onClose}
          >
            Close
          </button>
        </header>

        <div className="min-h-0 flex-1 overflow-y-auto px-5 py-4">
          <dl className="mb-5 grid grid-cols-2 gap-3 rounded-xl border border-line bg-page p-3.5">
            <div>
              <dt className="text-[0.68rem] font-bold tracking-[0.04em] text-muted uppercase">Phone</dt>
              <dd className="mt-1 mb-0 text-[0.85rem] font-semibold text-ink">{user.phone || '—'}</dd>
            </div>
            <div>
              <dt className="text-[0.68rem] font-bold tracking-[0.04em] text-muted uppercase">Company</dt>
              <dd className="mt-1 mb-0 text-[0.85rem] font-semibold text-ink">{user.company || '—'}</dd>
            </div>
            <div>
              <dt className="text-[0.68rem] font-bold tracking-[0.04em] text-muted uppercase">Orders</dt>
              <dd className="mt-1 mb-0 text-[0.85rem] font-semibold text-ink">{user.orderCount}</dd>
            </div>
            <div>
              <dt className="text-[0.68rem] font-bold tracking-[0.04em] text-muted uppercase">Total paid</dt>
              <dd className="mt-1 mb-0 text-[0.85rem] font-semibold text-ink">{formatPrice(user.totalSpent)}</dd>
            </div>
          </dl>

          <h3 className="mb-3 font-display text-[0.82rem] font-bold tracking-[0.04em] text-muted uppercase">
            Purchases
          </h3>
          <div className="flex flex-col gap-3">
            {user.orders.map((order) => (
              <article key={order.id} className="rounded-xl border border-line bg-white p-3.5">
                <div className="mb-3 flex items-start justify-between gap-2">
                  <p className="m-0 font-display text-[0.88rem] font-extrabold text-ink">
                    {order.planName}
                    <span className="ml-1.5 text-[0.72rem] font-semibold text-muted capitalize">
                      {order.planCategory}
                    </span>
                  </p>
                  <p className="m-0 shrink-0 text-[0.72rem] text-muted">{formatDateTime(order.createdAt)}</p>
                </div>
                <ul className="m-0 flex list-none flex-col gap-1.5 p-0">
                  <li className="flex justify-between gap-3 text-[0.82rem]">
                    <span>{order.planName} Plan (annual) × 1</span>
                    <span className="whitespace-nowrap text-muted">{formatPrice(order.planPrice)}</span>
                  </li>
                  {order.items.map((item) => (
                    <li key={`${order.id}-${item.name}`} className="flex justify-between gap-3 text-[0.82rem]">
                      <span>
                        {item.name} × {item.quantity}
                      </span>
                      <span className="whitespace-nowrap text-muted">{formatPrice(item.lineTotal)}</span>
                    </li>
                  ))}
                  {order.couponCode && order.couponDiscount > 0 ? (
                    <li className="flex justify-between gap-3 text-[0.82rem] text-[#067647]">
                      <span>Coupon {order.couponCode}</span>
                      <span>−{formatPrice(order.couponDiscount)}</span>
                    </li>
                  ) : null}
                </ul>
                {order.notes ? (
                  <p className="mt-2 mb-0 text-[0.75rem] text-muted">Notes: {order.notes}</p>
                ) : null}
                <p className="mt-3 mb-0 flex justify-between border-t border-dashed border-line pt-2 text-[0.85rem] font-bold">
                  <span>Paid</span>
                  <span>{formatPrice(order.total)}</span>
                </p>
              </article>
            ))}
          </div>
        </div>
      </aside>
    </div>,
    document.body,
  )
}
