'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { UserRound, ShoppingBag, Menu, X, Home } from 'lucide-react';
import { useAuthStore } from '@/features/auth/store';
import { useCartStore } from '@/features/cart/store';
import ThemeToggle from './ThemeToggle';
const navLinks = [
 { label: 'Home', href: '/' },
 { label: 'Menu', href: '/menu' },
 { label: 'Track', href: '/order/track' },
];

export default function Navbar() {
 const [open, setOpen] = useState(false);
 const pathname = usePathname();
 const { user, isAuthenticated, signOut } = useAuthStore();
 const cartCount = useCartStore((s) => s.totalItems());

 const dashboardHref = user?.role
 ? `/dashboard/${user.role === 'super_admin' ? 'admin' : user.role}`
 : '/auth/login';

 function isActive(href: string): boolean {
 if (href === '/') return pathname === '/';
 return pathname.startsWith(href);
 }

 return (
 <header className="nav-z">
 <div className="container-z mx-auto nav-inner px-3 sm:px-4">
  <Link href="/" className="flex items-center gap-1.5 shrink-0 group" aria-label="Dilip Da">
  <span className="text-xl sm:text-2xl font-black tracking-tight">
  <span className="text-ztext">Dilip</span> <span className="text-zred">Da</span>
 </span>
 </Link>

 <nav className="hidden sm:flex items-center gap-1 ml-auto" aria-label="Main navigation">
 {navLinks.map((link) => (
 <Link
 key={link.label}
 href={link.href}
 className={`button-z button-z-ghost text-sm font-medium transition-colors ${
 isActive(link.href) ? 'text-white bg-zred' : ''
 }`}
 aria-current={isActive(link.href) ? 'page' : undefined}
 >
 {link.label === 'Home' && <Home size={14} className="mr-1" />}
 {link.label}
 </Link>
 ))}
  </nav>

  <div className="hidden sm:flex items-center gap-1">
  <ThemeToggle className="icon-button-z" />
  {isAuthenticated ? (
 <>
 <Link href={dashboardHref} className="icon-button-z" aria-label="Dashboard">
 <UserRound size={18} />
 </Link>
 <button onClick={signOut} className="button-z button-z-ghost text-xs">
 Logout
 </button>
 </>
 ) : (
 <Link href="/auth/login" className="button-z button-z-primary text-sm px-4">
 Sign in
 </Link>
 )}
 <Link href="/cart" className="icon-button-z relative" aria-label="Shopping cart">
 <ShoppingBag size={18} />
 {cartCount > 0 && (
 <span className="absolute -top-1 -right-1 bg-zred text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
 {cartCount > 9 ? '9+' : cartCount}
 </span>
 )}
 </Link>
 </div>

 <div className="flex items-center gap-1 sm:hidden ml-auto">
 <Link href="/cart" className="icon-button-z relative" aria-label="Shopping cart">
 <ShoppingBag size={20} />
 {cartCount > 0 && (
 <span className="absolute -top-1 -right-1 bg-zred text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
 {cartCount > 9 ? '9+' : cartCount}
 </span>
  )}
  </Link>
  <button className="icon-button-z" onClick={() => setOpen((v) => !v)} aria-label={open ? 'Close menu' : 'Open menu'}>
 {open ? <X size={20} /> : <Menu size={20} />}
 </button>
 </div>
 </div>

 {open && (
   <div className="border-t border-zborder bg-zgray sm:hidden px-4 py-3 space-y-1 z-[60] relative">
 {navLinks.map((link) => (
 <Link
 key={link.label}
 href={link.href}
 onClick={() => setOpen(false)}
 className={`flex items-center gap-2 py-2.5 px-3 text-sm font-medium rounded-lg ${
 isActive(link.href)
 ? 'text-white bg-zred'
  : 'text-ztext hover:bg-zgray'
  }`}
  aria-current={isActive(link.href) ? 'page' : undefined}
  >
  {link.label === 'Home' && <Home size={16} />}
  {link.label}
  </Link>
  ))}
  <div className="pt-2 mt-2 border-t border-zborder">
  <ThemeToggle className="flex items-center gap-2 w-full py-2.5 px-3 text-sm font-medium rounded-lg text-ztext hover:bg-zgray" />
  {isAuthenticated ? (
  <>
  <Link
  href={dashboardHref}
  onClick={() => setOpen(false)}
  className={`block py-2.5 px-3 text-sm font-medium rounded-lg ${
  isActive(dashboardHref)
  ? 'text-white bg-zred'
  : 'text-ztext hover:bg-zgray'
 }`}
 >
 Dashboard
 </Link>
 <button
 onClick={() => { signOut(); setOpen(false); }}
 className="block w-full text-left py-2.5 px-3 text-sm font-medium text-zred rounded-lg hover:bg-zred hover:text-white transition-colors"
 >
 Sign out
 </button>
 </>
 ) : (
 <Link
 href="/auth/login"
 onClick={() => setOpen(false)}
 className="block py-2.5 px-3 text-sm font-semibold text-white bg-zred rounded-lg text-center hover:bg-zred-dark"
 >
 Sign in
 </Link>
 )}
 </div>
 </div>
 )}
 </header>
 );
}
