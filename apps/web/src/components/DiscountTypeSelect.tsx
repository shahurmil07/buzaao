import { useEffect, useRef, useState } from 'react'
import { cn } from '../lib/cn'
import type { DiscountType } from '../types/admin'

const OPTIONS: Array<{ value: DiscountType; label: string }> = [
  { value: 'percent', label: 'Percent (%)' },
  { value: 'amount', label: 'Amount (₹)' },
]

interface DiscountTypeSelectProps {
  value: DiscountType
  onChange: (value: DiscountType) => void
}

export function DiscountTypeSelect({ value, onChange }: DiscountTypeSelectProps) {
  const [open, setOpen] = useState(false)
  const rootRef = useRef<HTMLDivElement>(null)
  const selected = OPTIONS.find((option) => option.value === value) ?? OPTIONS[0]!

  useEffect(() => {
    function onPointerDown(event: PointerEvent) {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false)
    }
    document.addEventListener('pointerdown', onPointerDown)
    return () => document.removeEventListener('pointerdown', onPointerDown)
  }, [])

  return (
    <div className="relative" ref={rootRef}>
      <button
        type="button"
        className="flex w-full cursor-pointer items-center justify-between rounded-[10px] border-[1.5px] border-line bg-white px-3 py-[0.7rem] text-left text-[0.92rem] font-medium text-ink"
        aria-haspopup="listbox"
        aria-expanded={open}
        onClick={() => setOpen((prev) => !prev)}
      >
        {selected.label}
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
          <path d="M4 6l4 4 4-4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
        </svg>
      </button>
      {open ? (
        <ul
          className="absolute top-[calc(100%+6px)] left-1/2 z-20 w-full min-w-full -translate-x-1/2 overflow-hidden rounded-[10px] border border-line bg-white py-1 shadow-[0_12px_28px_rgba(17,17,17,0.14)]"
          role="listbox"
        >
          {OPTIONS.map((option) => (
            <li key={option.value}>
              <button
                type="button"
                role="option"
                aria-selected={option.value === value}
                className={cn(
                  'flex w-full cursor-pointer border-none px-3 py-2.5 text-left text-[0.88rem] font-medium',
                  option.value === value ? 'bg-[#fff5f5] text-[#e31e24]' : 'bg-white text-ink hover:bg-page',
                )}
                onClick={() => {
                  onChange(option.value)
                  setOpen(false)
                }}
              >
                {option.label}
              </button>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  )
}
