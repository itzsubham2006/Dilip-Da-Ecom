'use client';

import { useState } from 'react';
import { ClipboardList, RotateCcw, ChefHat, Minus, Plus, Trash2, ShoppingBag } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { useAuthStore } from '@/features/auth/store';
import { useCartStore } from '@/features/cart/store';

// We'll keep this empty as requested to remove dummy orders
const sampleOrders: { id: string, date: string, items: string[], total: number, status: string }[] = [];

const statusColors: Record<string, string> = {
  Placed: 'bg-yellow-500/15 text-yellow-500',
  Preparing: 'bg-orange-500/15 text-orange-400',
  'Out for delivery': 'bg-blue-500/15 text-blue-400',
  Delivered: 'bg-green-500/15 text-green-400',
  Cancelled: 'bg-red-500/15 text-red-400',
};

export default function OrdersPage() {
  const [activeTab, setActiveTab] = useState<'cart' | 'orders'>('cart');
  const { isAuthenticated } = useAuthStore();
  const { items: cartItems, updateQuantity, removeItem, clearCart, deliveryFee, taxAmount, total, totalItems } = useCartStore();
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
    <div className="page-pad pb-28">
      <div className="container-z mx-auto max-w-3xl">
        
        {/* Top Toggle Navigation */}
        <div className="flex items-center gap-2 mb-8 bg-zcard p-1 rounded-2xl border border-zborder max-w-xs mx-auto">
          <button 
            onClick={() => setActiveTab('cart')}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-bold transition-all ${
              activeTab === 'cart' 
                ? 'bg-zgray text-ztext shadow-sm' 
                : 'text-ztext-muted hover:text-ztext-light'
            }`}
          >
            <ShoppingBag size={16} /> Cart {cartCount > 0 && <span className="w-5 h-5 rounded-full bg-zred text-white text-[10px] flex items-center justify-center ml-1">{cartCount}</span>}
          </button>
          <button 
            onClick={() => setActiveTab('orders')}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-bold transition-all ${
              activeTab === 'orders' 
                ? 'bg-zgray text-ztext shadow-sm' 
                : 'text-ztext-muted hover:text-ztext-light'
            }`}
          >
            <ClipboardList size={16} /> Orders
          </button>
        </div>

        {/* CART TAB */}
        {activeTab === 'cart' && (
          <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
            {cartItems.length > 0 ? (
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
            ) : (
              <div className="bg-zcard rounded-xl border border-zborder p-8 text-center mt-4">
                <ShoppingBag size={40} className="mx-auto mb-4 text-ztext-muted/30" />
                <h1 className="text-xl font-bold text-ztext mb-2">Your cart is empty</h1>
                <p className="text-sm text-ztext-light mb-6">Looks like you haven&apos;t added anything to your cart yet.</p>
                <Link href="/menu" className="button-z button-z-primary px-8">
                  Browse Menu
                </Link>
              </div>
            )}
          </div>
        )}

        {/* ORDERS TAB */}
        {activeTab === 'orders' && (
          <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
            <h1 className="text-xl font-bold text-ztext mb-1">Past Orders</h1>
            <p className="text-sm text-ztext-light mb-6">Your order history from Dilip Da</p>

            {sampleOrders.length === 0 ? (
              <div className="bg-zcard rounded-xl border border-zborder p-8 text-center mt-4">
                <ClipboardList size={40} className="mx-auto mb-4 text-ztext-muted/30" />
                <p className="text-xl font-bold text-ztext mb-2">No past orders</p>
                <p className="text-sm text-ztext-light mt-1 mb-6">You haven&apos;t placed any orders yet.</p>
                <button onClick={() => setActiveTab('cart')} className="button-z button-z-primary px-8">
                  View Cart
                </button>
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
        )}

      </div>
    </div>
  );
}
