'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, UtensilsCrossed, ShoppingBag, ClipboardList, User } from 'lucide-react';
import { useCartStore } from '@/features/cart/store';
import { useAuthStore } from '@/features/auth/store';

const tabs = [
  { label: 'Home', href: '/', icon: Home },
  { label: 'Menu', href: '/menu', icon: UtensilsCrossed },
  { label: 'Orders', href: '/orders', icon: ClipboardList },
  { label: 'Profile', href: '/profile', icon: User },
];

export default function BottomNav() {
  const pathname = usePathname();
  const cartCount = useCartStore((s) => s.totalItems());
  const { isAuthenticated } = useAuthStore();

  if (pathname?.startsWith('/admin')) return null;

  function isActive(href: string) {
    if (href === '/') return pathname === '/';
    return pathname.startsWith(href);
  }

  return (
    <nav className="bottom-nav" aria-label="Bottom navigation">
      {tabs.map((tab) => {
        const active = isActive(tab.href);
        const Icon = tab.icon;
        const href =
          tab.label === 'Profile' && !isAuthenticated
            ? '/auth/login'
            : tab.href;

        return (
          <Link
            key={tab.label}
            href={href}
            className={`bottom-nav-item ${active ? 'active' : ''}`}
            aria-current={active ? 'page' : undefined}
          >
            <Icon size={20} strokeWidth={active ? 2.5 : 2} />
            <span>{tab.label === 'Profile' && !isAuthenticated ? 'Sign In' : tab.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
