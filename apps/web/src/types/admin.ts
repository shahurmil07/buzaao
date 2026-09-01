export type DiscountType = 'percent' | 'amount'
export type CouponStatus = 'active' | 'expired' | 'exhausted'

export interface Coupon {
  id: string
  code: string
  discountType: DiscountType
  discountValue: number
  quantity: number
  usedCount: number
  remaining: number
  expiresAt: string
  createdAt: string
  status: CouponStatus
}

export interface PurchaseItem {
  name: string
  quantity: number
  unitPrice: number
  lineTotal: number
}

export interface PurchaseOrder {
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
  items: PurchaseItem[]
}

export interface PurchaseUser {
  email: string
  fullName: string
  phone: string
  company: string | null
  orderCount: number
  totalSpent: number
  lastPurchaseAt: string
  orders: PurchaseOrder[]
}
