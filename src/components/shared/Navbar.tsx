'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { Menu, ShoppingBag, UserRound, X } from 'lucide-react';
import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import ThemeToggle from './ThemeToggle';

const navItems = [
  { label: 'Restaurants', href: '/restaurants' },
  { label: 'Track', href: '/track' },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-stone/86 backdrop-blur-xl">
      <nav className="mx-auto flex h-18 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-3" onClick={() => setOpen(false)}>
          <span className="font-display text-xl font-black tracking-tight">Dilip Da</span>
        </Link>

        <div className="hidden items-center gap-8 md:flex">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`text-sm font-bold transition ${pathname.startsWith(item.href) ? 'text-ink' : 'text-ink/58 hover:text-ink'}`}
            >
              {item.label}
            </Link>
          ))}
        </div>

        <div className="hidden items-center gap-2 md:flex">
          <ThemeToggle />
          <Link className="icon-button" href="/dashboard" aria-label="Account">
            <UserRound size={18} />
          </Link>
          <Link className="button button-dark" href="/cart">
            <ShoppingBag size={18} />
            Bag
          </Link>
        </div>

        <div className="flex items-center gap-2 md:hidden">
          <ThemeToggle />
          <button className="icon-button" type="button" onClick={() => setOpen((v) => !v)} aria-label="Menu">
            {open ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </nav>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden border-t border-border bg-stone md:hidden"
          >
            <div className="grid gap-1 px-4 py-4">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className="rounded-md px-3 py-3 text-lg font-semibold"
                >
                  {item.label}
                </Link>
              ))}
              <Link href="/login" onClick={() => setOpen(false)} className="button button-dark mt-2 justify-center">
                <UserRound size={18} /> Sign in
              </Link>
              <Link href="/cart" onClick={() => setOpen(false)} className="button button-light justify-center">
                <ShoppingBag size={18} /> Bag
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
