import Link from 'next/link';
import { redirect } from 'next/navigation';
import { getServerSession } from '@/features/auth/actions';
import { UtensilsCrossed, ClipboardList, TrendingUp, Settings } from 'lucide-react';

export default async function MerchantDashboardPage() {
  const { user } = await getServerSession();
  if (!user) redirect('/auth/login');

  return (
    <div className="page-pad">
      <div className="container-z mx-auto">
        <h1 className="text-2xl font-bold text-ztext">Restaurant dashboard</h1>
        <p className="mt-1 text-ztext-light text-sm">Manage your restaurant, menu, and orders.</p>

        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { icon: UtensilsCrossed, label: 'Menu items', value: '0', href: '#' },
            { icon: ClipboardList, label: 'Pending orders', value: '0', href: '#' },
            { icon: TrendingUp, label: 'Today&apos;s revenue', value: '₹0', href: '#' },
            { icon: Settings, label: 'Settings', value: 'Configure', href: '#' },
          ].map((s) => (
            <Link key={s.label} href={s.href} className="bg-white rounded-xl shadow-z p-5 transition-shadow hover:shadow-z-hover">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-red-50 shrink-0" style={{ color: '#E23744' }}>
                  <s.icon size={22} />
                </div>
                <div>
                  <p className="text-xs text-ztext-light">{s.label}</p>
                  <p className="font-bold text-ztext text-lg">{s.value}</p>
                </div>
              </div>
            </Link>
          ))}
        </div>

        <div className="mt-8 grid gap-6 sm:grid-cols-2">
          <div className="bg-white rounded-xl shadow-z p-6">
            <h2 className="font-bold text-ztext">Quick actions</h2>
            <div className="mt-4 space-y-2">
              <Link href="#" className="button-z button-z-primary w-full">Add menu item</Link>
              <Link href="#" className="button-z button-z-outline w-full">Update hours</Link>
              <Link href="#" className="button-z button-z-outline w-full">View reports</Link>
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-z p-6">
            <h2 className="font-bold text-ztext">Recent orders</h2>
            <div className="mt-6 text-center text-ztext-light text-sm py-8">
              <ClipboardList size={28} className="mx-auto mb-2" style={{ color: '#9C9C9C' }} />
              <p>No orders yet</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
