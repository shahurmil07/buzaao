export type FeatureValue = boolean | string

export interface PricingPlan {
  id: string
  name: string
  price: number
  priceLabel: string
  popular?: boolean
}

export interface FeatureRow {
  name: string
  values: Record<string, FeatureValue>
}

export interface PlanCategory {
  id: 'business' | 'premises'
  title: string
  subtitle: string
  popularPlanId: string
  popularNote: string
  plans: PricingPlan[]
  features: FeatureRow[]
  faqs: FaqItem[]
}

export interface FaqItem {
  question: string
  answer: string
}

export interface Addon {
  id: string
  name: string
  price: number
  unit: string
  description: string
  category: 'business' | 'premises'
}

export interface SelectedAddon {
  addon: Addon
  quantity: number
}

export interface CheckoutFormData {
  fullName: string
  email: string
  phone: string
  company?: string
  notes?: string
}
