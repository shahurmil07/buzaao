import { FormEvent, useState } from 'react'
import { Navigate } from 'react-router-dom'
import { useAuth } from '../auth/useAuth'
import { ApiError } from '../lib/api'
import iconImg from '../assets/buzaao-icon-transparent.png'

export function AdminLoginPage() {
  const { admin, ready, login } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)

  if (ready && admin) {
    return <Navigate to="/admin" replace />
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError(null)
    setSubmitting(true)

    try {
      await login(email, password)
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Unable to sign in')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="flex h-dvh w-full items-center justify-center bg-[radial-gradient(1100px_420px_at_50%_-5%,rgba(227,30,36,0.06),transparent_55%),var(--color-page)] px-4">
      <div className="w-full max-w-[400px] rounded-2xl border border-line bg-white px-7 py-8 shadow-[0_8px_28px_rgba(17,17,17,0.07)] max-sm:px-5 max-sm:py-6">
        <div className="mb-6 flex flex-col items-center text-center">
          <img src={iconImg} alt="" className="mb-3 size-11 object-contain" aria-hidden="true" />
          <p className="m-0 font-display text-[1.15rem] font-extrabold tracking-[0.06em] text-ink">BUZAAO</p>
          <h1 className="mt-3 mb-1 font-display text-[1.35rem] font-extrabold tracking-[-0.02em] text-ink">
            Admin
          </h1>
          <p className="m-0 text-[0.88rem] text-muted">Sign in to continue</p>
        </div>

        <form className="flex flex-col gap-4" onSubmit={(e) => void handleSubmit(e)}>
          <label className="flex flex-col gap-1.5 text-[0.78rem] font-semibold text-muted">
            Email
            <input
              className="rounded-[10px] border-[1.5px] border-line bg-white px-3 py-[0.7rem] text-[0.92rem] font-medium text-ink"
              type="email"
              name="email"
              autoComplete="username"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </label>

          <label className="flex flex-col gap-1.5 text-[0.78rem] font-semibold text-muted">
            Password
            <input
              className="rounded-[10px] border-[1.5px] border-line bg-white px-3 py-[0.7rem] text-[0.92rem] font-medium text-ink"
              type="password"
              name="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={8}
            />
          </label>

          {error ? (
            <p className="m-0 rounded-lg bg-[#fff5f5] px-3 py-2 text-[0.82rem] font-semibold text-brand" role="alert">
              {error}
            </p>
          ) : null}

          <button
            type="submit"
            disabled={submitting || !ready}
            className="mt-1 cursor-pointer rounded-[10px] border-none bg-[#e31e24] px-4 py-[0.75rem] font-display text-[0.88rem] font-bold text-white shadow-[0_4px_14px_rgba(227,30,36,0.25)] transition-[background-color,transform] duration-180 ease-smooth hover:bg-[#c4181e] active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {submitting ? 'Signing in…' : 'Sign in'}
          </button>
        </form>
      </div>
    </div>
  )
}
