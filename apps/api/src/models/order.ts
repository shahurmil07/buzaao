import { randomUUID } from 'node:crypto'
import { pool } from '../db/pool.js'
import { redeemCouponWithClient } from './coupon.js'
import { discountAmount } from '../lib/discount.js'

export interface OrderRecord {
  id: string
  full_name: string
  email: string
  phone: string
  company: string | null
  notes: string | null
  plan_id: string
  plan_name: string
  plan_price: number
  plan_category: string
  subtotal: number | null
  coupon_code: string | null
  coupon_discount: number
  total: number
  created_at: string
}

export interface OrderItemRecord {
  id: string
  order_id: string
  name: string
  quantity: number
  unit_price: number
  line_total: number
}

const ORDER_COLUMNS = `
  id, full_name, email, phone, company, notes, plan_id, plan_name,
  plan_price, plan_category, subtotal, coupon_code, coupon_discount, total, created_at::text
`

export async function listOrders(): Promise<OrderRecord[]> {
  const result = await pool.query<OrderRecord>(
    `
      SELECT ${ORDER_COLUMNS}
      FROM orders
      ORDER BY created_at DESC
    `,
  )
  return result.rows
}

export async function listItemsForOrders(orderIds: string[]): Promise<OrderItemRecord[]> {
  if (orderIds.length === 0) return []

  const result = await pool.query<OrderItemRecord>(
    `
      SELECT id, order_id, name, quantity, unit_price, line_total
      FROM order_items
      WHERE order_id = ANY($1)
      ORDER BY name ASC
    `,
    [orderIds],
  )
  return result.rows
}

export async function insertOrder(input: {
  fullName: string
  email: string
  phone: string
  company: string | null
  notes: string | null
  planId: string
  planName: string
  planPrice: number
  planCategory: string
  subtotal: number
  couponCode: string | null
  items: Array<{ name: string; quantity: number; unitPrice: number; lineTotal: number }>
}): Promise<OrderRecord> {
  const client = await pool.connect()

  try {
    await client.query('BEGIN')

    let couponCode: string | null = null
    let couponDiscount = 0
    if (input.couponCode) {
      const coupon = await redeemCouponWithClient(client, input.couponCode)
      if (!coupon) {
        throw new Error('COUPON_UNAVAILABLE')
      }
      couponCode = coupon.code
      couponDiscount = discountAmount(input.subtotal, coupon.discount_type, coupon.discount_value)
    }

    const total = input.subtotal - couponDiscount
    const orderId = randomUUID()
    const orderResult = await client.query<OrderRecord>(
      `
        INSERT INTO orders (
          id, full_name, email, phone, company, notes,
          plan_id, plan_name, plan_price, plan_category,
          subtotal, coupon_code, coupon_discount, total
        )
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)
        RETURNING ${ORDER_COLUMNS}
      `,
      [
        orderId,
        input.fullName,
        input.email,
        input.phone,
        input.company,
        input.notes,
        input.planId,
        input.planName,
        input.planPrice,
        input.planCategory,
        input.subtotal,
        couponCode,
        couponDiscount,
        total,
      ],
    )

    for (const item of input.items) {
      await client.query(
        `
          INSERT INTO order_items (id, order_id, name, quantity, unit_price, line_total)
          VALUES ($1, $2, $3, $4, $5, $6)
        `,
        [randomUUID(), orderId, item.name, item.quantity, item.unitPrice, item.lineTotal],
      )
    }

    await client.query('COMMIT')
    const order = orderResult.rows[0]
    if (!order) {
      throw new Error('Failed to create order')
    }
    return order
  } catch (error) {
    await client.query('ROLLBACK')
    throw error
  } finally {
    client.release()
  }
}
