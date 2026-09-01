import { createPortal } from 'react-dom'

interface ConfirmDialogProps {
  title: string
  message: string
  confirmLabel: string
  busy?: boolean
  onCancel: () => void
  onConfirm: () => void
}

export function ConfirmDialog({
  title,
  message,
  confirmLabel,
  busy,
  onCancel,
  onConfirm,
}: ConfirmDialogProps) {
  return createPortal(
    <div
      className="fixed inset-0 z-[1000] flex min-h-dvh items-center justify-center bg-[color-mix(in_srgb,var(--color-ink)_48%,transparent)] p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="confirm-title"
      onClick={onCancel}
    >
      <div
        className="w-full max-w-[400px] rounded-2xl border border-line bg-white p-6 shadow-[0_24px_60px_rgba(17,17,17,0.22)]"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 id="confirm-title" className="m-0 font-display text-[1.2rem] font-extrabold text-ink">
          {title}
        </h2>
        <p className="mt-2 mb-5 text-[0.9rem] leading-relaxed text-muted">{message}</p>
        <div className="flex justify-end gap-2">
          <button
            type="button"
            className="cursor-pointer rounded-[10px] border border-line bg-white px-4 py-2.5 font-display text-[0.82rem] font-bold text-ink"
            onClick={onCancel}
            disabled={busy}
          >
            Cancel
          </button>
          <button
            type="button"
            className="cursor-pointer rounded-[10px] border-none bg-[#e31e24] px-4 py-2.5 font-display text-[0.82rem] font-bold text-white disabled:opacity-60"
            onClick={onConfirm}
            disabled={busy}
          >
            {busy ? 'Deleting…' : confirmLabel}
          </button>
        </div>
      </div>
    </div>,
    document.body,
  )
}
