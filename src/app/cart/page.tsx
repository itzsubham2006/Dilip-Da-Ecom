'use client';

import { Minus, Plus, Trash2, ArrowLeft, ShoppingBag } from 'lucide-react';
import Link from 'next/link';
import { useCartStore } from '@/features/cart/store';
import type { CartItem } from '@/features/cart/types';

export default function CartPage() {
  const store = useCartStore();
  const items: CartItem[] = store.items;
  const { restaurantName, restaurantSlug, updateQuantity, removeItem, clearCart, subtotal, deliveryFee, taxAmount, total, totalItems } = store;

  if (items.length === 0) {
    return (
      <div className="page-pad">
        <div className="container-z mx-auto max-w-3xl">
          <h1 className="text-2xl font-bold text-ztext">Your bag</h1>
          <div className="mt-8 bg-white rounded-xl shadow-z p-12 text-center">
            <ShoppingBag size={48} className="mx-auto mb-4" style={{ color: '#9C9C9C' }} />
            <p className="text-lg font-medium text-ztext-light">Your bag is empty</p>
            <p className="mt-1 text-sm text-ztext-lighter">Add items from a restaurant to get started.</p>
            <Link href="/restaurants" className="button-z button-z-primary mt-6">Browse restaurants</Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="page-pad">
      <div className="container-z mx-auto max-w-4xl">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-ztext">Your bag</h1>
            <p className="text-ztext-light text-sm mt-1">{restaurantName} • {totalItems()} item{totalItems() > 1 ? 's' : ''}</p>
          </div>
          <button onClick={clearCart} className="text-sm text-ztext-lighter hover:text-zred transition-colors">Clear</button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-3">
            {items.map((item) => (
              <div key={item.id} className="bg-white rounded-xl shadow-z p-4 flex gap-4 items-center">
                <div className="w-16 h-16 rounded-lg overflow-hidden bg-zgray shrink-0">
                  <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-ztext text-sm truncate">{item.name}</h3>
                  <p className="text-sm font-medium text-ztext mt-0.5">₹{item.price}</p>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-2 border border-zborder rounded-lg">
                    <button onClick={() => updateQuantity(item.id, item.quantity - 1)} className="p-2 hover:bg-zgray transition-colors rounded-l-lg"><Minus size={14} /></button>
                    <span className="text-sm font-semibold w-6 text-center">{item.quantity}</span>
                    <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="p-2 hover:bg-zgray transition-colors rounded-r-lg"><Plus size={14} /></button>
                  </div>
                  <p className="font-bold text-ztext w-16 text-right">₹{item.price * item.quantity}</p>
                  <button onClick={() => removeItem(item.id)} className="p-2 text-ztext-lighter hover:text-zred transition-colors"><Trash2 size={16} /></button>
                </div>
              </div>
            ))}
            <Link href={`/restaurant/${restaurantSlug}`} className="inline-flex items-center gap-1 text-sm font-medium text-zred hover:underline mt-2">
              <ArrowLeft size={14} /> Add more items
            </Link>
          </div>

          <div className="bg-white rounded-xl shadow-z p-6 h-fit sticky top-24">
            <h2 className="font-bold text-ztext mb-4">Bill details</h2>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between text-ztext-light"><span>Item total</span><span className="font-medium text-ztext">₹{subtotal()}</span></div>
              <div className="flex justify-between text-ztext-light"><span>Delivery fee</span><span className="font-medium text-ztext">{deliveryFee() > 0 ? `₹${deliveryFee()}` : 'Free'}</span></div>
              <div className="flex justify-between text-ztext-light"><span>Tax (5%)</span><span className="font-medium text-ztext">₹{taxAmount()}</span></div>
              <div className="border-t border-zborder pt-3 flex justify-between font-bold text-ztext text-base"><span>Total</span><span>₹{total()}</span></div>
            </div>
            <Link href="/checkout" className="button-z button-z-primary w-full mt-6 h-12 text-base font-bold">Proceed to checkout</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
