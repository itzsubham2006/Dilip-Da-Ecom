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

export const STORAGE_KEYS = {
  CART: 'dilip-da-cart',
  THEME: 'dilip-da-theme',
} as const;

export const PAGINATION = {
  DEFAULT_PAGE_SIZE: 20,
  MAX_PAGE_SIZE: 100,
} as const;
