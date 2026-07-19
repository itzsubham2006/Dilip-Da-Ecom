'use client';

import { create } from 'zustand';
import type { CartItem, CartStore } from '@/features/cart/types';

const DELIVERY_FEE = 20;
const TAX_RATE = 0.05;

export const useCartStore = create<CartStore>((set, get) => ({
  items: [] as CartItem[],

  addItem: (item) => {
    const existing = get().items.find((i) => i.id === item.id);
    if (existing) {
      set({ items: get().items.map((i) => i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i) });
    } else {
      set({ items: [...get().items, { ...item, quantity: 1 }] });
    }
  },

  removeItem: (id) => {
    set({ items: get().items.filter((i) => i.id !== id) });
  },

  updateQuantity: (id, quantity) => {
    if (quantity <= 0) { get().removeItem(id); return; }
    set({ items: get().items.map((i) => i.id === id ? { ...i, quantity } : i) });
  },

  clearCart: () => set({ items: [] }),

  totalItems: () => get().items.reduce((sum, i) => sum + i.quantity, 0),
  subtotal: () => get().items.reduce((sum, i) => sum + i.price * i.quantity, 0),
  deliveryFee: () => get().items.length > 0 ? DELIVERY_FEE : 0,
  taxAmount: () => Math.round(get().subtotal() * TAX_RATE),
  total: () => get().subtotal() + get().deliveryFee() + get().taxAmount(),
}));
