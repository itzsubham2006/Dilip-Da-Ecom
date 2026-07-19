'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Search, MapPin, UserRound, ShoppingBag, ChevronDown, Menu, X } from 'lucide-react';
import { useAuthStore } from '@/features/auth/store';
import ThemeToggle from './ThemeToggle';

const navItems = [
  { label: 'Restaurants', href: '/restaurants' },
  { label: 'Track', href: '/track' },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const { user, isAuthenticated, signOut } = useAuthStore();

  const dashboardHref = user?.role
    ? `/dashboard/${user.role === 'super_admin' ? 'admin' : user.role}`
    : '/auth/login';

  return (
    <header className="nav-z">
      <div className="container-z mx-auto nav-inner px-4">
        <Link href="/" className="flex items-center gap-2 shrink-0">
          <span className="text-2xl font-black tracking-tight" style={{ color: '#E23744' }}>dilip<span className="text-black">da</span></span>
        </Link>

        <div className="hidden md:flex items-center gap-2 text-sm text-ztext-light">
          <MapPin size={16} />
          <span className="font-medium text-ztext truncate max-w-[120px]">Kolkata</span>
          <ChevronDown size={14} />
        </div>

        <div className="hidden lg:flex flex-1 max-w-lg">
          <div className="hero-search">
            <Search size={18} style={{ marginLeft: '1rem', color: '#9C9C9C' }} />
            <input placeholder="Search for restaurant, cuisine or a dish" />
          </div>
        </div>

        <div className="hidden md:flex items-center gap-1 ml-auto">
          {navItems.map((item) => (
            <Link key={item.href} href={item.href} className="button-z button-z-ghost text-sm font-medium">
              {item.label}
            </Link>
          ))}
          <ThemeToggle />
          {isAuthenticated ? (
            <>
              <Link href={dashboardHref} className="button-z button-z-ghost">
                <UserRound size={18} />
              </Link>
              <button onClick={signOut} className="button-z button-z-ghost text-xs">Logout</button>
            </>
          ) : (
            <Link href="/auth/login" className="button-z button-z-primary text-sm">Sign in</Link>
          )}
          <Link href="/cart" className="icon-button-z">
            <ShoppingBag size={18} />
          </Link>
        </div>

        <div className="flex items-center gap-2 md:hidden ml-auto">
          <ThemeToggle />
          <button className="icon-button-z" onClick={() => setOpen((v) => !v)}>
            {open ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {open && (
        <div className="border-t border-zborder bg-white md:hidden px-4 py-3 space-y-2">
          {navItems.map((item) => (
            <Link key={item.href} href={item.href} onClick={() => setOpen(false)} className="block py-2 text-sm font-medium">{item.label}</Link>
          ))}
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
