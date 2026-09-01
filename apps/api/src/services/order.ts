import { insertOrder, listItemsForOrders, listOrders } from '../models/order.js'

export class OrderValidationError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'OrderValidationError'
  }
}

export interface PurchaseUser {
  email: string
  fullName: string
  phone: string
  company: string | null
  orderCount: number
  totalSpent: number
  lastPurchaseAt: string
  orders: Array<{
    id: string
    planName: string
    planCategory: string
    planPrice: number
    notes: string | null
    subtotal: number
    couponCode: string | null
    couponDiscount: number
    total: number
    createdAt: string
    items: Array<{
      name: string
      quantity: number
      unitPrice: number
      lineTotal: number
    }>
  }>
}

function asPositiveInt(value: unknown) {
  return typeof value === 'number' && Number.isInteger(value) && value >= 0 ? value : null
}

export async function createPurchase(body: Record<string, unknown>) {
  const fullName = typeof body.fullName === 'string' ? body.fullName.trim() : ''
  const email = typeof body.email === 'string' ? body.email.trim().toLowerCase() : ''
  const phone = typeof body.phone === 'string' ? body.phone.trim() : ''
  const company = typeof body.company === 'string' ? body.company.trim() : ''
  const notes = typeof body.notes === 'string' ? body.notes.trim() : ''
  const couponCode =
    typeof body.couponCode === 'string' && body.couponCode.trim()
      ? body.couponCode.trim().toUpperCase()
      : null
  const plan = body.plan && typeof body.plan === 'object' ? (body.plan as Record<string, unknown>) : null
  const addons = Array.isArray(body.addons) ? body.addons : []

  if (!fullName || !email.includes('@') || !phone) {
    throw new OrderValidationError('Name, email and phone are required')
  }

  const planId = typeof plan?.id === 'string' ? plan.id : ''
  const planName = typeof plan?.name === 'string' ? plan.name : ''
  const planCategory = typeof plan?.category === 'string' ? plan.category : ''
  const planPrice = asPositiveInt(plan?.price)

  if (!planId || !planName || !planCategory || planPrice === null) {
    throw new OrderValidationError('A valid plan is required')
  }

  const items = addons.map((raw) => {
    const addon = raw && typeof raw === 'object' ? (raw as Record<string, unknown>) : {}
    const name = typeof addon.name === 'string' ? addon.name.trim() : ''
    const quantity = asPositiveInt(addon.quantity)
    const unitPrice = asPositiveInt(addon.price)
    if (!name || !quantity || quantity < 1 || unitPrice === null) {
      throw new OrderValidationError('Each add-on needs a name, quantity and price')
    }
    return { name, quantity, unitPrice, lineTotal: quantity * unitPrice }
  })

  const subtotal = planPrice + items.reduce((sum, item) => sum + item.lineTotal, 0)

  try {
    const order = await insertOrder({
      fullName,
      email,
      phone,
      company: company || null,
      notes: notes || null,
      planId,
      planName,
      planPrice,
      planCategory,
      subtotal,
      couponCode,
      items,
    })
    return { id: order.id, total: order.total, couponCode: order.coupon_code }
  } catch (error) {
    if (error instanceof Error && error.message === 'COUPON_UNAVAILABLE') {
      throw new OrderValidationError('This coupon is invalid or fully used')
    }
    throw error
  }
}

export async function listPurchasingUsers(): Promise<PurchaseUser[]> {
  const orders = await listOrders()
  const items = await listItemsForOrders(orders.map((order) => order.id))
  const itemsByOrder = new Map<string, typeof items>()

  for (const item of items) {
    const list = itemsByOrder.get(item.order_id) ?? []
    list.push(item)
    itemsByOrder.set(item.order_id, list)
  }

  const users = new Map<string, PurchaseUser>()

  for (const order of orders) {
    const subtotal = order.subtotal ?? order.total + (order.coupon_discount ?? 0)
    const orderView = {
      id: order.id,
      planName: order.plan_name,
      planCategory: order.plan_category,
      planPrice: order.plan_price,
      notes: order.notes,
      subtotal,
      couponCode: order.coupon_code,
      couponDiscount: order.coupon_discount ?? 0,
      total: order.total,
      createdAt: order.created_at,
      items: (itemsByOrder.get(order.id) ?? []).map((item) => ({
        name: item.name,
        quantity: item.quantity,
        unitPrice: item.unit_price,
        lineTotal: item.line_total,
      })),
    }

    const existing = users.get(order.email)
    if (!existing) {
      users.set(order.email, {
        email: order.email,
        fullName: order.full_name,
        phone: order.phone,
        company: order.company,
        orderCount: 1,
        totalSpent: order.total,
        lastPurchaseAt: order.created_at,
        orders: [orderView],
      })
      continue
    }

    existing.orderCount += 1
    existing.totalSpent += order.total
    existing.orders.push(orderView)
  }

  return [...users.values()]
}
