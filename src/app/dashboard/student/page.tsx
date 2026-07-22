import Link from 'next/link';
import { redirect } from 'next/navigation';
import { getServerSession } from '@/features/auth/actions';
import { Clock, CreditCard, ShoppingBag, History } from 'lucide-react';

export default async function StudentDashboardPage() {
  const { user } = await getServerSession();
  if (!user) redirect('/auth/login');

  return (
    <div className="page-pad">
      <div className="container-z mx-auto">
        <h1 className="text-2xl font-bold text-ztext">Welcome back{user.fullName ? `, ${user.fullName.split(' ')[0]}` : ''}</h1>
        <p className="mt-1 text-ztext-light text-sm">Hungry? Let&apos;s find you something good.</p>

        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { icon: ShoppingBag, label: 'Active orders', value: '2', href: '/orders' },
            { icon: CreditCard, label: 'Ethics Pay credit', value: 'View &rarr;', href: '/dashboard/student/credit' },
            { icon: Clock, label: 'Past orders', value: '12', href: '/orders' },
            { icon: History, label: 'Saved addresses', value: '3', href: '#' },
          ].map((s) => (
            <Link key={s.label} href={s.href} className="bg-zcard rounded-xl shadow-z p-5 transition-shadow hover:shadow-z-hover">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-red-500/10 shrink-0 text-zred">
                  <s.icon size={22} />
                </div>
                <div>
                  <p className="text-xs text-ztext-light">{s.label}</p>
                  <p className="font-bold text-ztext text-sm">{s.value}</p>
                </div>
              </div>
            </Link>
          ))}
        </div>

        <div className="mt-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-bold text-ztext">Recent orders</h2>
            <Link href="/" className="text-sm font-semibold text-zred">Order now &rarr;</Link>
          </div>
          <div className="bg-zcard rounded-xl shadow-z p-12 text-center">
            <ShoppingBag size={36} className="mx-auto mb-3" style={{ color: '#9C9C9C' }} />
            <p className="text-ztext-light">No orders yet. Browse our menu!</p>
            <Link href="/" className="button-z button-z-primary mt-4">View menu</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
