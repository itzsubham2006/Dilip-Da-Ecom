import Link from 'next/link';
import { redirect } from 'next/navigation';
import { getServerSession } from '@/features/auth/actions';
import { Bike, Clock, MapPin, DollarSign } from 'lucide-react';

export default async function DeliveryDashboardPage() {
  const { user } = await getServerSession();
  if (!user) redirect('/auth/login');

  return (
    <div className="page-pad">
      <div className="container-z mx-auto">
        <h1 className="text-2xl font-bold text-ztext">Delivery dashboard</h1>
        <p className="mt-1 text-ztext-light text-sm">Available deliveries and your earnings.</p>

        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { icon: Bike, label: 'Available', value: '3', href: '#' },
            { icon: Clock, label: 'In transit', value: '0', href: '#' },
            { icon: MapPin, label: 'Completed today', value: '0', href: '#' },
            { icon: DollarSign, label: 'Earnings today', value: '₹0', href: '#' },
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
          <h2 className="text-sm font-bold text-ztext mb-4">Available deliveries</h2>
          <div className="bg-zcard rounded-xl shadow-z p-12 text-center">
            <Bike size={36} className="mx-auto mb-3" style={{ color: '#9C9C9C' }} />
            <p className="text-ztext-light">No deliveries available. Check back soon!</p>
          </div>
        </div>
      </div>
    </div>
  );
}
