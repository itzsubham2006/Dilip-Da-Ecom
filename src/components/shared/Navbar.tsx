'use client';

import { useState } from 'react';
import Link from 'next/link';
import { UserRound, ShoppingBag, Menu, X } from 'lucide-react';
import { useAuthStore } from '@/features/auth/store';
import { useCartStore } from '@/features/cart/store';
import ThemeToggle from './ThemeToggle';

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const { user, isAuthenticated, signOut } = useAuthStore();
  const cartCount = useCartStore((s) => s.totalItems());

  const dashboardHref = user?.role
    ? `/dashboard/${user.role === 'super_admin' ? 'admin' : user.role}`
    : '/auth/login';

  return (
    <header className="nav-z">
      <div className="container-z mx-auto nav-inner px-3 sm:px-4">
        <Link href="/" className="flex items-center gap-1 shrink-0">
          <span className="text-xl sm:text-2xl font-black tracking-tight" style={{ color: '#E23744' }}>dilip<span className="text-black">da</span></span>
        </Link>

        <div className="hidden sm:flex items-center gap-1 ml-auto">
          <Link href="/" className="button-z button-z-ghost text-sm font-medium">Menu</Link>
          <Link href="/order/track" className="button-z button-z-ghost text-sm font-medium">Track</Link>
          <ThemeToggle />
          {isAuthenticated ? (
            <>
              <Link href={dashboardHref} className="icon-button-z"><UserRound size={18} /></Link>
              <button onClick={signOut} className="button-z button-z-ghost text-xs">Logout</button>
            </>
          ) : (
            <Link href="/auth/login" className="button-z button-z-primary text-sm px-4">Sign in</Link>
          )}
          <Link href="/cart" className="icon-button-z relative">
            <ShoppingBag size={18} />
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-zred text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                {cartCount > 9 ? '9+' : cartCount}
              </span>
            )}
          </Link>
        </div>

        <div className="flex items-center gap-1 sm:hidden ml-auto">
          <ThemeToggle />
          <button className="icon-button-z" onClick={() => setOpen((v) => !v)}>
            {open ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {open && (
        <div className="border-t border-zborder bg-white sm:hidden px-4 py-3 space-y-2">
          <Link href="/" onClick={() => setOpen(false)} className="block py-2 text-sm font-medium">Menu</Link>
          <Link href="/order/track" onClick={() => setOpen(false)} className="block py-2 text-sm font-medium">Track</Link>
          <div className="pt-2 border-t border-zborder">
            {isAuthenticated ? (
              <>
                <Link href={dashboardHref} onClick={() => setOpen(false)} className="block py-2 text-sm font-medium">Dashboard</Link>
                <button onClick={() => { signOut(); setOpen(false); }} className="block py-2 text-sm font-medium text-zred">Sign out</button>
              </>
            ) : (
              <Link href="/auth/login" onClick={() => setOpen(false)} className="block py-2 text-sm font-medium text-zred">Sign in</Link>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
