export type PlanTier = 'free' | 'starter' | 'professional' | 'enterprise';

export interface SubscriptionPlan {
  id: string;
  name: string;
  tier: PlanTier;
  price: number;
  interval: 'month' | 'year';
  features: string[];
  limits: PlanLimits;
  stripePriceId?: string;
}

export interface PlanLimits {
  maxStores: number;
  maxProducts: number;
  maxOrders: number;
  maxStorage: number;
}

export interface Subscription {
  id: string;
  userId: string;
  plan: PlanTier;
  status: 'active' | 'canceled' | 'past_due' | 'trialing' | 'incomplete';
  currentPeriodStart: string;
  currentPeriodEnd: string;
  cancelAtPeriodEnd: boolean;
  stripeSubscriptionId?: string;
  stripeCustomerId?: string;
}

export interface Invoice {
  id: string;
  amount: number;
  currency: string;
  status: 'paid' | 'open' | 'draft' | 'void' | 'uncollectible';
  invoiceDate: string;
  pdfUrl?: string;
}

export interface PaymentMethod {
  id: string;
  type: string;
  card?: {
    brand: string;
    last4: string;
    expMonth: number;
    expYear: number;
  };
  isDefault: boolean;
}

export interface CheckoutSession {
  url: string;
  sessionId: string;
}

export interface CreateCheckoutRequest {
  planId: string;
  successUrl?: string;
  cancelUrl?: string;
}

export interface CancelSubscriptionRequest {
  cancelAtPeriodEnd?: boolean;
  reason?: string;
}

const PLAN_LIMITS: Record<PlanTier, PlanLimits> = {
  free: { maxStores: 1, maxProducts: 10, maxOrders: 50, maxStorage: 100 },
  starter: { maxStores: 2, maxProducts: 100, maxOrders: 500, maxStorage: 1024 },
  professional: { maxStores: 5, maxProducts: 1000, maxOrders: 5000, maxStorage: 10240 },
  enterprise: { maxStores: Infinity, maxProducts: Infinity, maxOrders: Infinity, maxStorage: Infinity },
};

export function getPlanLimits(plan?: PlanTier): PlanLimits {
  return PLAN_LIMITS[plan || 'free'];
}

export function canCreateStore(currentCount: number, plan?: PlanTier): boolean {
  const limits = getPlanLimits(plan);
  return currentCount < limits.maxStores;
}

export function canAddProduct(currentCount: number, plan?: PlanTier): boolean {
  const limits = getPlanLimits(plan);
  return currentCount < limits.maxProducts;
}
