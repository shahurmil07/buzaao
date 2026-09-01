import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import { useState } from 'react'
import { useAuth } from '../auth/useAuth'
import { cn } from '../lib/cn'
import iconImg from '../assets/buzaao-icon-transparent.png'

const NAV = [
  { to: '/admin/coupons', label: 'Coupons' },
  { to: '/admin/users', label: 'User details' },
]

function initialsFromEmail(email: string) {
  const local = email.split('@')[0] ?? 'A'
  return local.slice(0, 2).toUpperCase()
}

export function AdminLayout() {
  const { admin, logout } = useAuth()
  const navigate = useNavigate()
  const [signingOut, setSigningOut] = useState(false)

  async function handleLogout() {
    setSigningOut(true)
    try {
      await logout()
      navigate('/admin/login', { replace: true })
    } finally {
      setSigningOut(false)
    }
  }

  return (
    <div className="flex h-dvh overflow-hidden bg-page">
      <aside className="flex h-full w-[16.5rem] shrink-0 flex-col border-r border-line bg-white">
        <div className="flex items-center gap-2.5 border-b border-line px-4 py-4">
          <img src={iconImg} alt="" className="size-9 object-contain" aria-hidden="true" />
          <span className="flex flex-col leading-tight">
            <span className="font-display text-[0.95rem] font-extrabold tracking-[0.06em] text-ink">BUZAAO</span>
            <span className="text-[0.68rem] font-medium text-slate-500">Admin</span>
          </span>
        </div>

        <nav className="flex flex-1 flex-col gap-1 overflow-y-auto p-3" aria-label="Admin">
          {NAV.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                cn(
                  'rounded-lg px-3 py-2.5 font-display text-[0.82rem] font-bold no-underline transition-colors duration-150',
                  isActive ? 'bg-[#fff5f5] text-[#e31e24]' : 'text-muted hover:bg-page hover:text-ink',
                )
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="mt-auto flex items-center gap-3 border-t border-line bg-page px-3.5 py-3.5">
          <span
            className="flex size-10 shrink-0 items-center justify-center rounded-full bg-[#e31e24] font-display text-[0.78rem] font-bold text-white"
            aria-hidden="true"
          >
            {admin ? initialsFromEmail(admin.email) : 'AD'}
          </span>
          <span className="min-w-0 flex-1">
            <span className="block truncate text-[0.82rem] font-bold text-ink">{admin?.email}</span>
            <span className="mt-0.5 block text-[0.62rem] font-semibold tracking-[0.08em] text-muted uppercase">
              Administrator
            </span>
          </span>
          <button
            type="button"
            onClick={() => void handleLogout()}
            disabled={signingOut}
            className="flex size-9 shrink-0 cursor-pointer items-center justify-center rounded-md border-none bg-transparent text-muted transition-colors duration-150 hover:bg-[#fff5f5] hover:text-[#e31e24] disabled:opacity-50"
            aria-label={signingOut ? 'Signing out' : 'Sign out'}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path
                d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M16 17l5-5-5-5M21 12H9"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </div>
      </aside>

      <main className="flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden px-6 py-6 max-sm:px-3 max-sm:py-4">
        <Outlet />
      </main>
    </div>
  )
}
