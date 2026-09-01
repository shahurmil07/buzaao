import { useEffect, useRef, useState } from 'react'
import { formatPrice } from '../data/pricing'

interface AnimatedPriceProps {
  amount: number
  className?: string
}

export function AnimatedPrice({ amount, className }: AnimatedPriceProps) {
  const [shown, setShown] = useState(amount)
  const [updating, setUpdating] = useState(false)
  const shownRef = useRef(amount)
  const frameRef = useRef(0)

  useEffect(() => {
    const from = shownRef.current
    const to = amount
    if (from === to) return

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduced) {
      shownRef.current = to
      setShown(to)
      return
    }

    setUpdating(true)
    const duration = 420
    const start = performance.now()
    cancelAnimationFrame(frameRef.current)

    const tick = (now: number) => {
      const progress = Math.min(1, (now - start) / duration)
      const eased = 1 - (1 - progress) ** 3
      const next = Math.round(from + (to - from) * eased)
      shownRef.current = next
      setShown(next)

      if (progress < 1) {
        frameRef.current = requestAnimationFrame(tick)
        return
      }

      shownRef.current = to
      setShown(to)
      setUpdating(false)
    }

    frameRef.current = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(frameRef.current)
  }, [amount])

  const classes = [className, updating ? 'is-updating' : ''].filter(Boolean).join(' ')

  return (
    <strong className={classes} data-updating={updating || undefined}>
      {formatPrice(shown)}
    </strong>
  )
}
