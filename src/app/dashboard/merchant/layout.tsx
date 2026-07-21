'use client';

import { useState, useCallback } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard, ShoppingBag, UtensilsCrossed, Package, FolderTree,
  BarChart3, Bell, Settings, Menu, X, LogOut, Store,
} from 'lucide-react';
import { useAuthStore } from '@/features/auth/store';

const navItems = [
  { label: 'Dashboard', href: '/dashboard/merchant', icon: LayoutDashboard },
  { label: 'Orders', href: '/dashboard/merchant/orders', icon: ShoppingBag },
  { label: 'Products', href: '/dashboard/merchant/products', icon: UtensilsCrossed },
  { label: 'Categories', href: '/dashboard/merchant/categories', icon: FolderTree },
  { label: 'Inventory', href: '/dashboard/merchant/inventory', icon: Package },
  { label: 'Analytics', href: '/dashboard/merchant/analytics', icon: BarChart3 },
  { label: 'Notifications', href: '/dashboard/merchant/notifications', icon: Bell },
  { label: 'Settings', href: '/dashboard/merchant/settings', icon: Settings },
];

export default function MerchantLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { signOut } = useAuthStore();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const closeSidebar = useCallback(() => setSidebarOpen(false), []);

  return (
    <div className="min-h-screen bg-gray-50">
      <aside className={`fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-gray-200 transform transition-transform duration-300 lg:translate-x-0 lg:static lg:z-auto ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="flex items-center justify-between h-16 px-6 border-b border-gray-200">
          <Link href="/dashboard/merchant" className="flex items-center gap-2">
            <Store size={22} className="text-zred" />
            <span className="font-bold text-lg text-gray-900">Merchant</span>
          </Link>
          <button onClick={closeSidebar} aria-label="Close sidebar" className="lg:hidden p-1 rounded-lg hover:bg-gray-100 text-gray-500">
            <X size={20} />
          </button>
        </div>
        <nav className="p-4 space-y-1">
          {navItems.map((item) => {
            const active = pathname === item.href || (item.href !== '/dashboard/merchant' && pathname.startsWith(item.href));
            return (
              <Link key={item.href} href={item.href} onClick={closeSidebar}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                  active ? 'bg-zred text-white shadow-sm' : 'text-gray-600 hover:bg-gray-100'
                }`}>
                <item.icon size={18} />
                {item.label}
              </Link>
            );
          })}
          <div className="pt-4 mt-4 border-t border-gray-200">
            <Link href="/" className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-gray-600 hover:bg-gray-100 transition-colors">
              <Store size={18} /> View store
            </Link>
            <button onClick={signOut} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-gray-600 hover:bg-gray-100 transition-colors">
              <LogOut size={18} /> Sign out
            </button>
          </div>
        </nav>
      </aside>

      {sidebarOpen && (
        <div className="fixed inset-0 bg-black/30 z-40 lg:hidden" onClick={closeSidebar} />
      )}

      <div className="lg:pl-64">
        <header className="sticky top-0 z-30 bg-white sm:bg-white/80 sm:backdrop-blur-md border-b border-gray-200 h-16 flex items-center px-4 sm:px-6">
          <button onClick={() => setSidebarOpen(true)} aria-label="Open sidebar" className="lg:hidden p-2 rounded-lg hover:bg-gray-100 text-gray-600 mr-3">
            <Menu size={20} />
          </button>
          <div className="flex-1" />
          <Link href="/dashboard/merchant/notifications" aria-label="Notifications" className="relative p-2 rounded-lg hover:bg-gray-100 text-gray-600">
            <Bell size={20} />
          </Link>
        </header>
        <main className="p-4 sm:p-6 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
