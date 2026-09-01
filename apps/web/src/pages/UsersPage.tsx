import { useEffect, useMemo, useState } from 'react'
import { UserDetailDrawer } from '../components/UserDetailDrawer'
import { formatPrice } from '../data/pricing'
import { apiRequest } from '../lib/api'
import { formatDateTime } from '../lib/format'
import { initialsFromName } from '../lib/initials'
import type { PurchaseUser } from '../types/admin'

function matchesQuery(user: PurchaseUser, query: string) {
  if (!query) return true
  const haystack = [user.fullName, user.email, user.phone, user.company ?? ''].join(' ').toLowerCase()
  return haystack.includes(query)
}

export function UsersPage() {
  const [users, setUsers] = useState<PurchaseUser[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [query, setQuery] = useState('')
  const [selected, setSelected] = useState<PurchaseUser | null>(null)

  useEffect(() => {
    let cancelled = false
    apiRequest<{ users: PurchaseUser[] }>('/api/admin/users')
      .then((data) => {
        if (!cancelled) setUsers(data.users)
      })
      .catch(() => {
        if (!cancelled) setError('Unable to load user purchases')
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })
    return () => {
      cancelled = true
    }
  }, [])

  const filtered = useMemo(
    () => users.filter((user) => matchesQuery(user, query.trim().toLowerCase())),
    [users, query],
  )

  return (
    <section className="flex h-full min-h-0 flex-col">
      <header className="mb-5 flex shrink-0 flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="m-0 font-display text-[clamp(1.25rem,3vw,1.6rem)] font-extrabold tracking-[-0.02em] text-ink">
            User details
          </h1>
          <p className="mt-1 mb-0 text-[0.88rem] text-muted">Who purchased, what they bought, and quantity.</p>
        </div>
        <input
          className="w-full max-w-[260px] rounded-[10px] border-[1.5px] border-line bg-white px-3 py-2 text-[0.85rem] text-ink"
          placeholder="Search name, email, phone"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </header>

      <div className="flex min-h-0 flex-1 flex-col overflow-auto rounded-2xl border border-line bg-white shadow-[0_8px_28px_rgba(17,17,17,0.05)]">
        {loading ? (
          <p className="m-auto px-5 py-8 text-sm font-semibold text-muted">Loading purchases…</p>
        ) : error ? (
          <p className="m-auto px-5 py-8 text-sm font-semibold text-brand">{error}</p>
        ) : filtered.length === 0 ? (
          <p className="m-auto px-5 py-8 text-sm text-muted">
            {users.length === 0
              ? 'No purchases yet. When a customer places an order, they will show up here.'
              : 'No customers match that search.'}
          </p>
        ) : (
          <table className="w-full min-w-[860px] border-collapse text-left">
            <thead className="sticky top-0 bg-page">
              <tr>
                {['Customer', 'Contact', 'Company', 'Orders', 'Total paid', 'Last purchase', ''].map((label) => (
                  <th
                    key={label || 'action'}
                    className="px-4 py-3 text-[0.72rem] font-bold tracking-[0.04em] text-muted uppercase"
                  >
                    {label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((user) => (
                <tr key={user.email} className="border-t border-line">
                  <td className="px-4 py-3.5">
                    <div className="flex items-center gap-3">
                      <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-[#fff5f5] font-display text-[0.72rem] font-bold text-[#e31e24]">
                        {initialsFromName(user.fullName)}
                      </span>
                      <span className="font-display text-[0.88rem] font-bold text-ink">{user.fullName}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3.5 text-[0.82rem] text-ink">
                    <span className="block">{user.email}</span>
                    <span className="mt-0.5 block text-muted">{user.phone}</span>
                  </td>
                  <td className="px-4 py-3.5 text-[0.82rem] text-ink">{user.company || '—'}</td>
                  <td className="px-4 py-3.5 text-[0.82rem] text-ink">{user.orderCount}</td>
                  <td className="px-4 py-3.5 font-display text-[0.88rem] font-bold text-ink">
                    {formatPrice(user.totalSpent)}
                  </td>
                  <td className="px-4 py-3.5 text-[0.78rem] text-muted">{formatDateTime(user.lastPurchaseAt)}</td>
                  <td className="px-4 py-3.5 text-right">
                    <button
                      type="button"
                      className="cursor-pointer rounded-lg border-[1.5px] border-line bg-white px-3 py-1.5 font-display text-[0.75rem] font-bold text-ink hover:border-[#e31e24] hover:text-[#e31e24]"
                      onClick={() => setSelected(user)}
                    >
                      View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {selected ? <UserDetailDrawer user={selected} onClose={() => setSelected(null)} /> : null}
    </section>
  )
}
