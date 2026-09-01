import type { Request, Response } from 'express'
import { sendError } from '../lib/http-error.js'
import { CouponValidationError, previewCoupon } from '../services/coupon.js'

export async function previewCouponHandler(req: Request, res: Response) {
  const body = req.body as Record<string, unknown>
  const code = typeof body.code === 'string' ? body.code : ''
  const subtotal = Number(body.subtotal)

  try {
    const coupon = await previewCoupon(code, subtotal)
    res.json({ coupon })
  } catch (error) {
    if (error instanceof CouponValidationError) {
      sendError(res, 400, 'INVALID_INPUT', error.message)
      return
    }
    throw error
  }
}
