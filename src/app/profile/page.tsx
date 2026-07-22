'use client';

import { User, MapPin, Phone, Mail, LogOut, ClipboardList, ChevronRight, Store, Heart } from 'lucide-react';
import Link from 'next/link';
import { useAuthStore } from '@/features/auth/store';
import ThemeToggle from '@/components/shared/ThemeToggle';

export default function ProfilePage() {
  const { user, isAuthenticated, signOut } = useAuthStore();

  if (!isAuthenticated || !user) {
    return (
      <div className="page-pad">
        <div className="container-z mx-auto max-w-lg text-center py-16">
          <div className="w-20 h-20 rounded-full bg-zgray flex items-center justify-center mx-auto">
            <User size={36} className="text-ztext-muted" />
          </div>
          <h1 className="text-xl font-bold text-ztext mt-5">Welcome to Dilip Da</h1>
          <p className="text-sm text-ztext-light mt-2">
            Sign in to manage your profile, view orders, and save your delivery address.
          </p>
          <Link href="/auth/login" className="button-z button-z-primary mt-6">
            Sign in
          </Link>
          <Link href="/auth/signup" className="button-z button-z-outline mt-3">
            Create account
          </Link>
        </div>
      </div>
    );
  }

  const initials = (user.fullName || user.email || 'U')
    .split(' ')
    .map((w: string) => w[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  return (
    <div className="page-pad">
      <div className="container-z mx-auto max-w-lg">
        <h1 className="text-xl font-bold text-ztext mb-5">Profile</h1>

        {/* User card */}
        <div className="bg-zcard rounded-xl border border-zborder p-5 flex items-center gap-4">
          <div className="w-14 h-14 rounded-full bg-zred/15 flex items-center justify-center text-zred font-bold text-lg shrink-0">
            {initials}
          </div>
          <div className="min-w-0 flex-1">
            <p className="font-bold text-ztext text-sm truncate">
              {user.fullName || 'Dilip Da Customer'}
            </p>
            <p className="text-xs text-ztext-light truncate">{user.email}</p>
          </div>
        </div>

        {/* Settings list */}
        <div className="mt-4 bg-zcard rounded-xl border border-zborder divide-y divide-zborder">
          {/* Saved address */}
          <div className="p-4 flex items-center gap-3">
            <MapPin size={18} className="text-zred shrink-0" />
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-ztext text-sm">Delivery address</p>
              <p className="text-xs text-ztext-light mt-0.5 truncate">
                Near CIT Kokrajhar, 2nd Gate
              </p>
            </div>
            <ChevronRight size={16} className="text-ztext-muted shrink-0" />
          </div>

          {/* Phone */}
          <div className="p-4 flex items-center gap-3">
            <Phone size={18} className="text-zred shrink-0" />
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-ztext text-sm">Phone</p>
              <p className="text-xs text-ztext-light mt-0.5">{user.phone || 'Not set'}</p>
            </div>
            <ChevronRight size={16} className="text-ztext-muted shrink-0" />
          </div>

          {/* Email */}
          <div className="p-4 flex items-center gap-3">
            <Mail size={18} className="text-zred shrink-0" />
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-ztext text-sm">Email</p>
              <p className="text-xs text-ztext-light mt-0.5 truncate">{user.email}</p>
            </div>
          </div>

          {/* Orders link */}
          <Link href="/orders" className="p-4 flex items-center gap-3 hover:bg-zgray transition-colors">
            <ClipboardList size={18} className="text-zred shrink-0" />
            <div className="flex-1">
              <p className="font-semibold text-ztext text-sm">My Orders</p>
              <p className="text-xs text-ztext-light mt-0.5">View order history</p>
            </div>
            <ChevronRight size={16} className="text-ztext-muted shrink-0" />
          </Link>

          {/* Favorites link (Desktop only) */}
          <Link href="/favorites" className="hidden sm:flex p-4 items-center gap-3 hover:bg-zgray transition-colors">
            <Heart size={18} className="text-zred shrink-0" />
            <div className="flex-1">
              <p className="font-semibold text-ztext text-sm">Favorites</p>
              <p className="text-xs text-ztext-light mt-0.5">Your saved dishes</p>
            </div>
            <ChevronRight size={16} className="text-ztext-muted shrink-0" />
          </Link>

          {/* Theme toggle */}
          <div className="p-4 flex items-center gap-3">
            <ThemeToggle className="flex items-center gap-3 flex-1 text-sm font-semibold text-ztext" />
          </div>
        </div>

        {/* About section */}
        <div className="mt-4 bg-zcard rounded-xl border border-zborder p-5">
          <h2 className="text-sm font-bold text-ztext mb-2 flex items-center gap-2">
            <Store size={18} className="text-zred" /> About Dilip Da
          </h2>
          <p className="text-xs text-ztext-light leading-relaxed">
            Homestyle Bengali food service near CIT Kokrajhar&apos;s 2nd gate.
            Fresh, authentic meals cooked with love — from classic fish curry to evening chai.
          </p>
          <div className="mt-3 space-y-2">
            <div className="flex items-center gap-2 text-xs text-ztext-light">
              <MapPin size={14} className="text-ztext-muted" /> Near CIT Kokrajhar, 2nd Gate
            </div>
            <div className="flex items-center gap-2 text-xs text-ztext-light">
              <Phone size={14} className="text-ztext-muted" /> 6000212823
            </div>
          </div>
        </div>

        {/* Sign out */}
        <button
          onClick={signOut}
          className="mt-4 w-full bg-zcard rounded-xl border border-zborder p-4 flex items-center gap-3 hover:bg-red-500/5 transition-colors"
        >
          <LogOut size={18} className="text-zred shrink-0" />
          <span className="font-semibold text-zred text-sm">Sign out</span>
        </button>
      </div>
    </div>
  );
}
