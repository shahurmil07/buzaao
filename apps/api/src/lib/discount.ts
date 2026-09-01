import type { DiscountType } from '../models/coupon.js'

export function discountAmount(subtotal: number, type: DiscountType, value: number) {
  const raw = type === 'percent' ? Math.round(subtotal * (value / 100)) : value
  return Math.min(subtotal, Math.max(0, raw))
}
