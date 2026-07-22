'use client';

import { ClipboardList, RotateCcw, ChefHat, Minus, Plus, Trash2, ArrowLeft, ShoppingBag } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { useAuthStore } from '@/features/auth/store';
import { useCartStore } from '@/features/cart/store';

const sampleOrders = [
  {
    id: 'DD-X7K2L9P',
    date: 'Jul 20, 2025',
    items: ['Kolkata Biryani x1', 'Macher Jhol x1', 'Misti Doi x2'],
    total: 660,
    status: 'Delivered',
  },
  {
    id: 'DD-M3N8Q2R',
    date: 'Jul 18, 2025',
    items: ['Mutton Kosha x1', 'Daal & Rice x2'],
    total: 640,
    status: 'Delivered',
  },
  {
    id: 'DD-P5T1W4Y',
    date: 'Jul 22, 2025',
    items: ['Shorshe Ilish x1', 'Rosogolla x3'],
    total: 560,
    status: 'Preparing',
  },
];

const statusColors: Record<string, string> = {
  Placed: 'bg-yellow-500/15 text-yellow-500',
  Preparing: 'bg-orange-500/15 text-orange-400',
  'Out for delivery': 'bg-blue-500/15 text-blue-400',
  Delivered: 'bg-green-500/15 text-green-400',
  Cancelled: 'bg-red-500/15 text-red-400',
};

export default function OrdersPage() {
  const { isAuthenticated } = useAuthStore();
  const { items: cartItems, updateQuantity, removeItem, clearCart, subtotal, deliveryFee, taxAmount, total, totalItems } = useCartStore();
  const cartCount = totalItems();

  if (!isAuthenticated) {
    return (
      <div className="page-pad">
        <div className="container-z mx-auto max-w-lg text-center py-16">
          <ClipboardList size={48} className="mx-auto mb-4 text-ztext-muted" />
          <h1 className="text-xl font-bold text-ztext">Sign in to view orders</h1>
          <p className="text-sm text-ztext-light mt-2">
            Log in to see your order history and active cart.
          </p>
          <Link href="/auth/login" className="button-z button-z-primary mt-6">
            Sign in
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="page-pad">
      <div className="container-z mx-auto max-w-3xl">
        
        {/* Active Cart Section */}
        {cartItems.length > 0 && (
          <div className="mb-12">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h1 className="text-xl font-bold text-ztext">Active Cart</h1>
                <p className="text-ztext-light text-xs mt-0.5">{cartCount} item{cartCount > 1 ? 's' : ''}</p>
              </div>
              <button onClick={clearCart} className="text-xs text-ztext-lighter hover:text-zred transition-colors">Clear</button>
            </div>

            <div className="bg-zcard rounded-xl border border-zborder p-4 shadow-sm">
              <div className="space-y-4">
                {cartItems.map((item) => (
                  <div key={item.id} className="flex gap-3 items-center">
                    <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-lg overflow-hidden bg-zgray shrink-0 relative">
                      <Image src={item.image} alt={item.name} fill className="object-cover" sizes="64px" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h2 className="font-semibold text-ztext text-sm truncate">{item.name}</h2>
                      <p className="text-xs font-medium text-ztext-light mt-0.5">₹{item.price}</p>
                    </div>
                    <div className="flex items-center gap-2 sm:gap-3">
                      <div className="flex items-center gap-1 border border-zborder rounded-lg">
                        <button onClick={() => updateQuantity(item.id, item.quantity - 1)} aria-label={`Decrease quantity`} className="p-1.5 hover:bg-zgray transition-colors rounded-l-lg"><Minus size={12} /></button>
                        <span className="text-xs font-semibold w-4 text-center">{item.quantity}</span>
                        <button onClick={() => updateQuantity(item.id, item.quantity + 1)} aria-label={`Increase quantity`} className="p-1.5 hover:bg-zgray transition-colors rounded-r-lg"><Plus size={12} /></button>
                      </div>
                      <p className="font-bold text-ztext w-12 text-right text-xs sm:text-sm">₹{item.price * item.quantity}</p>
                      <button onClick={() => removeItem(item.id)} className="p-1 text-ztext-lighter hover:text-zred transition-colors"><Trash2 size={14} /></button>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="mt-6 pt-4 border-t border-zborder flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <p className="text-sm font-bold text-ztext">Total: ₹{total()}</p>
                  <p className="text-[10px] text-ztext-light mt-0.5">Includes ₹{deliveryFee() + taxAmount()} fees</p>
                </div>
                <Link href="/checkout" className="button-z button-z-primary text-sm font-bold px-8 h-10 w-full sm:w-auto">
                  Checkout
                </Link>
              </div>
            </div>
          </div>
        )}

        {/* Order History Section */}
        <div>
          <h1 className="text-xl font-bold text-ztext mb-1">Past Orders</h1>
          <p className="text-sm text-ztext-light mb-6">Your order history from Dilip Da</p>

          {sampleOrders.length === 0 ? (
            <div className="bg-zcard rounded-xl border border-zborder p-8 text-center">
              <ClipboardList size={32} className="mx-auto mb-3 text-ztext-muted" />
              <p className="font-semibold text-ztext">No past orders</p>
              <p className="text-xs text-ztext-light mt-1">Place an order to see it here.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {sampleOrders.map((order) => (
                <div key={order.id} className="bg-zcard rounded-xl border border-zborder p-4 sm:p-5">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-2.5">
                      <div className="w-9 h-9 rounded-lg bg-zgray flex items-center justify-center shrink-0">
                        <ChefHat size={18} className="text-zred" />
                      </div>
                      <div>
                        <p className="font-semibold text-ztext text-sm">Dilip Da</p>
                        <p className="text-xs text-ztext-lighter">{order.date}</p>
                      </div>
                    </div>
                    <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full ${statusColors[order.status] ?? 'bg-zgray text-ztext-light'}`}>
                      {order.status}
                    </span>
                  </div>

                  <div className="mt-3 pt-3 border-t border-zborder">
                    <p className="text-xs text-ztext-light line-clamp-2">
                      {order.items.join(' • ')}
                    </p>
                    <div className="flex items-center justify-between mt-3">
                      <p className="text-sm font-bold text-ztext">₹{order.total}</p>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] text-ztext-lighter font-medium">#{order.id}</span>
                        <Link href="/menu" className="inline-flex items-center gap-1 text-xs font-semibold text-zred hover:text-zred-dark transition-colors">
                          <RotateCcw size={12} /> Reorder
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
