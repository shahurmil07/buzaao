import { discountAmount } from '../lib/discount.js'
import {
  deleteCouponRow,
  findCouponByCode,
  findCouponById,
  insertCoupon,
  listCoupons,
  updateCouponRow,
  type CouponRecord,
  type DiscountType,
} from '../models/coupon.js'

export class CouponConflictError extends Error {
  constructor() {
    super('A coupon with this code already exists')
    this.name = 'CouponConflictError'
  }
}

export class CouponValidationError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'CouponValidationError'
  }
}

export class CouponNotFoundError extends Error {
  constructor() {
    super('Coupon not found')
    this.name = 'CouponNotFoundError'
  }
}

export interface CouponInput {
  code: string
  discountType: DiscountType
  discountValue: number
  quantity: number
  expiresAt: string
}

export interface CouponView {
  id: string
  code: string
  discountType: DiscountType
  discountValue: number
  quantity: number
  usedCount: number
  remaining: number
  expiresAt: string
  createdAt: string
  status: 'active' | 'expired' | 'exhausted'
}

function todayIsoDate() {
  const now = new Date()
  const month = String(now.getMonth() + 1).padStart(2, '0')
  const day = String(now.getDate()).padStart(2, '0')
  return `${now.getFullYear()}-${month}-${day}`
}

function toCouponView(row: CouponRecord): CouponView {
  const remaining = Math.max(0, row.quantity - row.used_count)
  const expired = row.expires_at < todayIsoDate()
  const exhausted = remaining === 0

  return {
    id: row.id,
    code: row.code,
    discountType: row.discount_type,
    discountValue: row.discount_value,
    quantity: row.quantity,
    usedCount: row.used_count,
    remaining,
    expiresAt: row.expires_at,
    createdAt: row.created_at,
    status: expired ? 'expired' : exhausted ? 'exhausted' : 'active',
  }
}

function parsedCouponInput(input: CouponInput, minQuantity = 1) {
  const code = input.code.trim().toUpperCase()
  if (!/^[A-Z0-9][A-Z0-9_-]{2,31}$/.test(code)) {
    throw new CouponValidationError('Use 3–32 letters, numbers, hyphens or underscores')
  }

  if (input.discountType !== 'percent' && input.discountType !== 'amount') {
    throw new CouponValidationError('Discount type must be percent or amount')
  }

  if (!Number.isInteger(input.discountValue) || input.discountValue <= 0) {
    throw new CouponValidationError('Discount must be a positive whole number')
  }

  if (input.discountType === 'percent' && input.discountValue > 100) {
    throw new CouponValidationError('Percent discount cannot exceed 100')
  }

  if (!Number.isInteger(input.quantity) || input.quantity < minQuantity) {
    throw new CouponValidationError(`Quantity must be at least ${minQuantity}`)
  }

  if (!/^\d{4}-\d{2}-\d{2}$/.test(input.expiresAt) || input.expiresAt < todayIsoDate()) {
    throw new CouponValidationError('Expiry date must be today or later')
  }

  return {
    code,
    discountType: input.discountType,
    discountValue: input.discountValue,
    quantity: input.quantity,
    expiresAt: input.expiresAt,
  }
}

export async function getCoupons() {
  const rows = await listCoupons()
  return rows.map(toCouponView)
}

export async function createCoupon(input: CouponInput) {
  const parsed = parsedCouponInput(input)
  const existing = await findCouponByCode(parsed.code)
  if (existing) {
    throw new CouponConflictError()
  }
  return toCouponView(await insertCoupon(parsed))
}

export async function updateCoupon(id: string, input: CouponInput) {
  const current = await findCouponById(id)
  if (!current) {
    throw new CouponNotFoundError()
  }

  const parsed = parsedCouponInput(input, Math.max(1, current.used_count))
  const existing = await findCouponByCode(parsed.code)
  if (existing && existing.id !== id) {
    throw new CouponConflictError()
  }

  const row = await updateCouponRow(id, parsed)
  if (!row) {
    throw new CouponNotFoundError()
  }
  return toCouponView(row)
}

export async function removeCoupon(id: string) {
  const deleted = await deleteCouponRow(id)
  if (!deleted) {
    throw new CouponNotFoundError()
  }
}

export interface CouponPreview {
  code: string
  discountType: DiscountType
  discountValue: number
  discountAmount: number
  payable: number
}

export async function previewCoupon(codeInput: string, subtotal: number): Promise<CouponPreview> {
  const code = codeInput.trim().toUpperCase()
  if (!code) {
    throw new CouponValidationError('Enter a coupon code')
  }
  if (!Number.isInteger(subtotal) || subtotal < 0) {
    throw new CouponValidationError('Invalid order total')
  }

  const coupon = await findCouponByCode(code)
  if (!coupon) {
    throw new CouponValidationError('Invalid coupon code')
  }
  if (coupon.expires_at < todayIsoDate()) {
    throw new CouponValidationError('This coupon has expired')
  }
  if (coupon.used_count >= coupon.quantity) {
    throw new CouponValidationError('This coupon has been fully used')
  }

  const amount = discountAmount(subtotal, coupon.discount_type, coupon.discount_value)
  return {
    code: coupon.code,
    discountType: coupon.discount_type,
    discountValue: coupon.discount_value,
    discountAmount: amount,
    payable: subtotal - amount,
  }
}
