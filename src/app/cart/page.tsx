'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Minus, Plus, Trash2, ArrowLeft, ShoppingBag } from 'lucide-react';
import { useCartStore } from '@/features/cart/store';

export default function CartPage() {
  const store = useCartStore();
  const { items, updateQuantity, removeItem, clearCart, subtotal, deliveryFee, taxAmount, total, totalItems } = store;
  const count = totalItems();

  if (items.length === 0) {
    return (
      <div className="page-pad">
        <div className="container-z mx-auto max-w-3xl">
          <h1 className="text-2xl font-bold text-ztext">Your bag</h1>
          <div className="mt-8 bg-zcard rounded-xl shadow-z p-12 text-center">
            <ShoppingBag size={48} className="mx-auto mb-4" style={{ color: '#9C9C9C' }} />
            <p className="text-sm font-medium text-ztext-light">Your bag is empty</p>
            <p className="mt-1 text-sm text-ztext-lighter">Browse our menu and add items to get started.</p>
            <Link href="/" className="button-z button-z-primary mt-6">View menu</Link>
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
            <p className="text-ztext-light text-sm mt-1">Dilip Da • {count} item{count > 1 ? 's' : ''}</p>
          </div>
          <button onClick={clearCart} className="text-sm text-ztext-lighter hover:text-zred transition-colors">Clear</button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-3">
            {items.map((item) => (
              <div key={item.id} className="bg-zcard rounded-xl shadow-z p-4 flex gap-4 items-center">
                <div className="w-16 h-16 rounded-lg overflow-hidden bg-zgray shrink-0 relative">
                  <Image src={item.image} alt={item.name} fill className="object-cover" sizes="64px" />
                </div>
                <div className="flex-1 min-w-0">
                  <h2 className="font-semibold text-ztext text-sm truncate">{item.name}</h2>
                  <p className="text-sm font-medium text-ztext mt-0.5">₹{item.price}</p>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-1.5 border border-zborder rounded-lg">
                    <button onClick={() => updateQuantity(item.id, item.quantity - 1)} aria-label={`Decrease quantity of ${item.name}`} className="p-1.5 hover:bg-zgray transition-colors rounded-l-lg"><Minus size={13} /></button>
                    <span className="text-sm font-semibold w-5 text-center">{item.quantity}</span>
                    <button onClick={() => updateQuantity(item.id, item.quantity + 1)} aria-label={`Increase quantity of ${item.name}`} className="p-1.5 hover:bg-zgray transition-colors rounded-r-lg"><Plus size={13} /></button>
                  </div>
                  <p className="font-bold text-ztext w-14 text-right text-sm">₹{item.price * item.quantity}</p>
                  <button onClick={() => removeItem(item.id)} aria-label={`Remove ${item.name} from cart`} className="p-1.5 text-ztext-lighter hover:text-zred transition-colors"><Trash2 size={15} /></button>
                </div>
              </div>
            ))}
            <Link href="/" className="inline-flex items-center gap-1 text-sm font-medium text-zred hover:underline mt-2">
              <ArrowLeft size={14} /> Add more items
            </Link>
          </div>

          <div className="bg-zcard rounded-xl shadow-z p-6 h-fit sticky top-24">
            <h2 className="font-bold text-ztext mb-4">Bill details</h2>
            <div className="space-y-2.5 text-sm">
              <div className="flex justify-between text-ztext-light"><span>Item total</span><span className="font-medium text-ztext">₹{subtotal()}</span></div>
              <div className="flex justify-between text-ztext-light"><span>Delivery fee</span><span className="font-medium text-ztext">{deliveryFee() > 0 ? `₹${deliveryFee()}` : 'Free'}</span></div>
              <div className="flex justify-between text-ztext-light"><span>Tax</span><span className="font-medium text-ztext">₹{taxAmount()}</span></div>
              <div className="border-t border-zborder pt-3 flex justify-between font-bold text-ztext text-sm"><span>Total</span><span>₹{total()}</span></div>
            </div>
            <Link href="/checkout" className="button-z button-z-primary w-full mt-5 h-11 text-sm font-bold">
              Proceed to checkout
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
