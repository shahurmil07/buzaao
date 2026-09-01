import type { Request, Response } from 'express'
import { sendError } from '../lib/http-error.js'
import {
  CouponConflictError,
  CouponNotFoundError,
  CouponValidationError,
  createCoupon,
  getCoupons,
  removeCoupon,
  updateCoupon,
} from '../services/coupon.js'
import type { DiscountType } from '../models/coupon.js'

function couponPayload(body: Record<string, unknown>) {
  return {
    code: typeof body.code === 'string' ? body.code : '',
    discountType: body.discountType as DiscountType,
    discountValue: Number(body.discountValue),
    quantity: Number(body.quantity),
    expiresAt: typeof body.expiresAt === 'string' ? body.expiresAt : '',
  }
}

function handleCouponError(res: Response, error: unknown) {
  if (error instanceof CouponValidationError) {
    sendError(res, 400, 'INVALID_INPUT', error.message)
    return true
  }
  if (error instanceof CouponConflictError) {
    sendError(res, 409, 'CONFLICT', error.message)
    return true
  }
  if (error instanceof CouponNotFoundError) {
    sendError(res, 404, 'NOT_FOUND', error.message)
    return true
  }
  return false
}

export async function listCouponsHandler(_req: Request, res: Response) {
  const coupons = await getCoupons()
  res.json({ coupons })
}

export async function createCouponHandler(req: Request, res: Response) {
  try {
    const coupon = await createCoupon(couponPayload(req.body as Record<string, unknown>))
    res.status(201).json({ coupon })
  } catch (error) {
    if (!handleCouponError(res, error)) throw error
  }
}

export async function updateCouponHandler(req: Request, res: Response) {
  try {
    const coupon = await updateCoupon(req.params.id ?? '', couponPayload(req.body as Record<string, unknown>))
    res.json({ coupon })
  } catch (error) {
    if (!handleCouponError(res, error)) throw error
  }
}

export async function deleteCouponHandler(req: Request, res: Response) {
  try {
    await removeCoupon(req.params.id ?? '')
    res.json({ ok: true })
  } catch (error) {
    if (!handleCouponError(res, error)) throw error
  }
}
