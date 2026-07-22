'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ShoppingBag } from 'lucide-react';
import { useCartStore } from '@/features/cart/store';

export default function FloatingCart() {
  const pathname = usePathname();
  const { total, totalItems } = useCartStore();
  const cartCount = totalItems();

  // Don't show on the orders page since cart and orders are merged there
  if (cartCount === 0 || pathname === '/orders' || pathname === '/checkout' || pathname?.startsWith('/admin')) {
    return null;
  }

  return (
    <div className="fixed bottom-20 left-4 right-4 sm:bottom-6 sm:left-1/2 sm:-translate-x-1/2 sm:w-[500px] z-[60] animate-in slide-in-from-bottom-5">
      <div className="bg-zcard border border-zborder rounded-2xl shadow-2xl p-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-zred/10 flex items-center justify-center">
            <ShoppingBag size={20} className="text-zred" />
          </div>
          <div>
            <p className="text-sm font-bold text-ztext">{cartCount} item{cartCount > 1 ? 's' : ''}</p>
            <p className="text-xs text-ztext-light mt-0.5">₹{total()}</p>
          </div>
        </div>
        <Link href="/orders" className="button-z button-z-primary text-sm px-6 py-2.5 shadow-sm rounded-xl">
          View cart
        </Link>
      </div>
    </div>
  );
}
