import { ShoppingBag } from 'lucide-react';
import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = { title: 'Your Bag' };

export default function CartPage() {
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
