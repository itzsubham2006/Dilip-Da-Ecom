'use client';

import Link from 'next/link';

export default function LandingFooter() {
  return (
    <footer className="bg-[#1A1A1A] text-white/70">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          <div className="col-span-2 md:col-span-1">
            <Link href="/" className="text-xl font-bold tracking-tight">
              <span className="text-white">Dilip </span>
              <span style={{ color: '#E23744' }}>Stores</span>
            </Link>
            <p className="text-white/50 text-sm mt-3 leading-relaxed max-w-xs">
              Kokrajhar&apos;s finest dining experience. Authentic Bengali cuisine served with love since 2009.
            </p>
          </div>
          <div>
            <h4 className="text-white font-semibold text-sm uppercase tracking-wider mb-4">Quick Links</h4>
            <div className="space-y-2.5">
              <Link href="/menu" className="block text-sm hover:text-white transition-colors">Menu</Link>
              <Link href="/order/track" className="block text-sm hover:text-white transition-colors">Track Order</Link>
              <Link href="/cart" className="block text-sm hover:text-white transition-colors">Cart</Link>
            </div>
          </div>
          <div>
            <h4 className="text-white font-semibold text-sm uppercase tracking-wider mb-4">Legal</h4>
            <div className="space-y-2.5">
              <Link href="/privacy" className="block text-sm hover:text-white transition-colors">Privacy Policy</Link>
              <Link href="/terms" className="block text-sm hover:text-white transition-colors">Terms of Service</Link>
              <Link href="/security" className="block text-sm hover:text-white transition-colors">Security</Link>
            </div>
          </div>
          <div>
            <h4 className="text-white font-semibold text-sm uppercase tracking-wider mb-4">Connect</h4>
            <div className="space-y-2.5">
              <p className="text-sm hover:text-white transition-colors cursor-pointer">Instagram</p>
              <p className="text-sm hover:text-white transition-colors cursor-pointer">Facebook</p>
              <p className="text-sm hover:text-white transition-colors cursor-pointer">WhatsApp</p>
            </div>
          </div>
        </div>
        <div className="mt-10 sm:mt-14 pt-6 sm:pt-8 border-t border-white/10 text-center text-sm text-white/40">
          &copy; {new Date().getFullYear()} Dilip Stores. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
