export type SubscriptionStatus = 'none' | 'lite' | 'basic' | 'pro' | 'couple'
export type HealthGoal = 'sleep' | 'energy' | 'muscle' | 'immunity'

export interface Profile {
  id: string
  email: string
  full_name: string | null
  health_goal: HealthGoal | null
  subscription_status: SubscriptionStatus
  created_at: string
  updated_at: string
}

export interface Subscription {
  id: string
  user_id: string
  plan_type: SubscriptionStatus
  start_date: string
  next_billing_date: string | null
  payment_method_id: string | null
  toss_order_id: string | null
  toss_payment_key: string | null
  amount: number | null
  status: 'active' | 'cancelled' | 'paused'
  created_at: string
}

export interface HabitLog {
  id: string
  user_id: string
  date: string // YYYY-MM-DD
  status: boolean
  created_at: string
}

export interface Plan {
  id: SubscriptionStatus
  name: string
  price: number
  priceLabel: string
  description: string
  features: string[]
  recommended?: boolean
  color: string
}
