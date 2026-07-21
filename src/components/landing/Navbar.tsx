'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ShoppingBag, Menu, X } from 'lucide-react';
import { useAuthStore } from '@/features/auth/store';
import { useCartStore } from '@/features/cart/store';

const navLinks = [
 { label: 'Home', href: '/' },
 { label: 'Menu', href: '/menu' },
 { label: 'Track', href: '/order/track' },
];

export default function LandingNavbar() {
 const [scrolled, setScrolled] = useState(false);
 const [mobileOpen, setMobileOpen] = useState(false);
 const { isAuthenticated, signOut } = useAuthStore();
 const cartCount = useCartStore((s) => s.totalItems());

 useEffect(() => {
 const onScroll = () => setScrolled(window.scrollY > 80);
 window.addEventListener('scroll', onScroll, { passive: true });
 return () => window.removeEventListener('scroll', onScroll);
 }, []);

 return (
 <header
 className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
 scrolled
  ? 'bg-zgray sm:bg-zgray/80 sm:backdrop-blur-md shadow-[0_1px_8px_rgba(0,0,0,0.06)]'
 : 'bg-transparent'
 }`}
 >
 <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
 <div className="flex items-center justify-between h-16 sm:h-20">
 <Link href="/" className="text-xl sm:text-2xl font-bold tracking-tight shrink-0">
 <span className="text-white">Dilip</span>
  <span className="text-zred"> Da</span>
 </Link>

 <nav className="hidden sm:flex items-center gap-1">
 {navLinks.map((link) => (
 <Link
 key={link.label}
 href={link.href}
 className={`px-4 py-2 text-sm font-medium rounded-xl transition-colors ${
 scrolled
  ? 'text-ztext hover:bg-zsurface'
 : 'text-white/90 hover:text-white hover:bg-white/10'
 }`}
 >
 {link.label}
 </Link>
 ))}
 {isAuthenticated ? (
 <>
 <Link
 href="/dashboard"
 className={`px-4 py-2 text-sm font-medium rounded-xl transition-colors ${
 scrolled
  ? 'text-ztext hover:bg-zsurface'
 : 'text-white/90 hover:text-white hover:bg-white/10'
 }`}
 >
 Dashboard
 </Link>
 <button
 onClick={signOut}
 className={`px-4 py-2 text-sm font-medium rounded-xl transition-colors ${
 scrolled
 ? 'text-zred hover:bg-red-500/10'
 : 'text-white/90 hover:text-white hover:bg-white/10'
 }`}
 >
 Sign out
 </button>
 </>
 ) : (
 <Link
 href="/auth/login"
 className={`px-5 py-2 text-sm font-semibold rounded-xl transition-all ${
 scrolled
 ? 'bg-zred text-white hover:bg-zred-dark'
  : 'bg-zcard text-zred hover:bg-zsurface'
 }`}
 >
 Sign in
 </Link>
 )}
 <Link
 href="/cart"
 aria-label="Shopping cart"
 className={`relative p-2.5 rounded-xl transition-colors ${
 scrolled
  ? 'text-ztext hover:bg-zsurface'
 : 'text-white/90 hover:text-white hover:bg-white/10'
 }`}
 >
 <ShoppingBag size={18} />
 {cartCount > 0 && (
 <span className="absolute -top-0.5 -right-0.5 bg-zred text-white text-[10px] font-bold w-4.5 h-4.5 rounded-full flex items-center justify-center min-w-[18px] min-h-[18px]">
 {cartCount > 9 ? '9+' : cartCount}
 </span>
 )}
 </Link>
 </nav>

 <div className="flex items-center gap-2 sm:hidden">
 <Link
 href="/cart"
 aria-label="Shopping cart"
 className={`relative p-2 rounded-lg transition-colors ${
  scrolled ? 'text-ztext ' : 'text-white'
 }`}
 >
 <ShoppingBag size={20} />
 {cartCount > 0 && (
 <span className="absolute -top-0.5 -right-0.5 bg-zred text-white text-[10px] font-bold w-4.5 h-4.5 rounded-full flex items-center justify-center min-w-[18px] min-h-[18px]">
 {cartCount > 9 ? '9+' : cartCount}
 </span>
 )}
 </Link>
 <button
 onClick={() => setMobileOpen((v) => !v)}
 aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
 className={`p-2 rounded-lg transition-colors ${
  scrolled ? 'text-ztext ' : 'text-white'
 }`}
 >
 {mobileOpen ? <X size={20} /> : <Menu size={20} />}
 </button>
 </div>
 </div>
 </div>

 {mobileOpen && (
  <div className="sm:hidden bg-zgray border-t border-zborder px-4 py-4 space-y-1 z-[60] relative">
 {navLinks.map((link) => (
 <Link
 key={link.label}
 href={link.href}
 onClick={() => setMobileOpen(false)}
 className="block py-2.5 px-3 text-sm font-medium text-ztext rounded-lg hover:bg-zsurface "
 >
 {link.label}
 </Link>
 ))}
 <div className="pt-2 mt-2 border-t border-zborder ">
 {isAuthenticated ? (
 <>
 <Link
 href="/dashboard"
 onClick={() => setMobileOpen(false)}
 className="block py-2.5 px-3 text-sm font-medium text-ztext rounded-lg hover:bg-zsurface "
 >
 Dashboard
 </Link>
 <button
 onClick={() => { signOut(); setMobileOpen(false); }}
  className="block w-full text-left py-2.5 px-3 text-sm font-medium text-zred rounded-lg hover:bg-red-950 "
 >
 Sign out
 </button>
 </>
 ) : (
 <Link
 href="/auth/login"
 onClick={() => setMobileOpen(false)}
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
