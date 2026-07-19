export const ROLES = {
  STUDENT: 'student',
  MERCHANT: 'merchant',
  DELIVERY: 'delivery',
  ADMIN: 'admin',
  SUPER_ADMIN: 'super_admin',
} as const;

export const ORDER_STATUS = {
  PENDING: 'pending',
  ACCEPTED: 'accepted',
  DECLINED: 'declined',
  PREPARING: 'preparing',
  READY: 'ready',
  ASSIGNED: 'assigned',
  OUT_FOR_DELIVERY: 'out_for_delivery',
  DELIVERED: 'delivered',
  COMPLETED: 'completed',
  CANCELLED: 'cancelled',
} as const;

export const PAYMENT_STATUS = {
  PENDING: 'pending',
  CONFIRMED: 'confirmed',
  FAILED: 'failed',
  REFUNDED: 'refunded',
} as const;

export const BNPL_STATUS = {
  ACTIVE: 'active',
  SUSPENDED: 'suspended',
  CLOSED: 'closed',
} as const;

export const BNPL_VERIFICATION_STATUS = {
  PENDING: 'pending',
  VERIFIED: 'verified',
  REJECTED: 'rejected',
} as const;

export const BNPL_TRANSACTION_TYPES = {
  PURCHASE: 'purchase',
  REPAYMENT: 'repayment',
  FEE: 'fee',
  ADJUSTMENT: 'adjustment',
  RESTORATION: 'restoration',
} as const;

export const BNPL_REPAYMENT_STATUS = {
  PENDING: 'pending',
  PAID: 'paid',
  OVERDUE: 'overdue',
  PARTIAL: 'partial',
} as const;

export const BNPL_AUDIT_ACTIONS = {
  CREDIT_APPROVED: 'credit_approved',
  CREDIT_REJECTED: 'credit_rejected',
  CREDIT_LIMIT_SET: 'credit_limit_set',
  CREDIT_LIMIT_CHANGED: 'credit_limit_changed',
  BNPL_PURCHASE: 'bnpl_purchase',
  REPAYMENT: 'repayment',
  LATE_FEE_APPLIED: 'late_fee_applied',
  MANUAL_ADJUSTMENT: 'manual_adjustment',
  REPAYMENT_FAILED: 'repayment_failed',
  CREDIT_RESTORED: 'credit_restored',
  ACCOUNT_SUSPENDED: 'account_suspended',
  ACCOUNT_ACTIVATED: 'account_activated',
} as const;

export const DEFAULT_CREDIT_LIMIT = 5000;
export const MAX_CREDIT_LIMIT = 50000;
export const DEFAULT_DUE_DAYS = 15;
export const DEFAULT_GRACE_PERIOD_DAYS = 3;
export const DEFAULT_LATE_FEE_RATE = 2.0;

export const STORAGE_KEYS = {
  CART: 'dilip-da-cart',
  THEME: 'dilip-da-theme',
} as const;

export const PAGINATION = {
  DEFAULT_PAGE_SIZE: 20,
  MAX_PAGE_SIZE: 100,
} as const;
