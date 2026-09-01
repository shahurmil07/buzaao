import { randomUUID } from 'node:crypto'
import type { PoolClient } from 'pg'
import { pool } from '../db/pool.js'

export type DiscountType = 'percent' | 'amount'

export interface CouponRecord {
  id: string
  code: string
  discount_type: DiscountType
  discount_value: number
  quantity: number
  used_count: number
  expires_at: string
  created_at: string
}

export async function listCoupons(): Promise<CouponRecord[]> {
  const result = await pool.query<CouponRecord>(
    `
      SELECT id, code, discount_type, discount_value, quantity, used_count,
             expires_at::text, created_at::text
      FROM coupons
      ORDER BY created_at DESC
    `,
  )
  return result.rows
}

export async function findCouponByCode(code: string): Promise<CouponRecord | null> {
  const result = await pool.query<CouponRecord>(
    `
      SELECT id, code, discount_type, discount_value, quantity, used_count,
             expires_at::text, created_at::text
      FROM coupons
      WHERE code = $1
      LIMIT 1
    `,
    [code],
  )
  return result.rows[0] ?? null
}

export async function findCouponById(id: string): Promise<CouponRecord | null> {
  const result = await pool.query<CouponRecord>(
    `
      SELECT id, code, discount_type, discount_value, quantity, used_count,
             expires_at::text, created_at::text
      FROM coupons
      WHERE id = $1
      LIMIT 1
    `,
    [id],
  )
  return result.rows[0] ?? null
}

export async function updateCouponRow(
  id: string,
  input: {
    code: string
    discountType: DiscountType
    discountValue: number
    quantity: number
    expiresAt: string
  },
): Promise<CouponRecord | null> {
  const result = await pool.query<CouponRecord>(
    `
      UPDATE coupons
      SET code = $2, discount_type = $3, discount_value = $4, quantity = $5, expires_at = $6
      WHERE id = $1
      RETURNING id, code, discount_type, discount_value, quantity, used_count,
                expires_at::text, created_at::text
    `,
    [id, input.code, input.discountType, input.discountValue, input.quantity, input.expiresAt],
  )
  return result.rows[0] ?? null
}

export async function redeemCouponWithClient(client: PoolClient, code: string): Promise<CouponRecord | null> {
  const result = await client.query<CouponRecord>(
    `
      UPDATE coupons
      SET used_count = used_count + 1
      WHERE code = $1
        AND used_count < quantity
        AND expires_at >= CURRENT_DATE
      RETURNING id, code, discount_type, discount_value, quantity, used_count,
                expires_at::text, created_at::text
    `,
    [code],
  )
  return result.rows[0] ?? null
}

export async function deleteCouponRow(id: string): Promise<boolean> {
  const result = await pool.query('DELETE FROM coupons WHERE id = $1', [id])
  return (result.rowCount ?? 0) > 0
}

export async function insertCoupon(input: {
  code: string
  discountType: DiscountType
  discountValue: number
  quantity: number
  expiresAt: string
}): Promise<CouponRecord> {
  const result = await pool.query<CouponRecord>(
    `
      INSERT INTO coupons (id, code, discount_type, discount_value, quantity, expires_at)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING id, code, discount_type, discount_value, quantity, used_count,
                expires_at::text, created_at::text
    `,
    [randomUUID(), input.code, input.discountType, input.discountValue, input.quantity, input.expiresAt],
  )

  const coupon = result.rows[0]
  if (!coupon) {
    throw new Error('Failed to create coupon')
  }
  return coupon
}
