import { redirect } from 'next/navigation';
import { getServerSession, getServerProfile } from '@/features/auth/actions';
import { Shield } from 'lucide-react';

export default async function AdminDashboardPage() {
  const { user } = await getServerSession();
  if (!user) redirect('/auth/login');

  const { profile } = await getServerProfile();
  if (!profile || !['admin', 'super_admin'].includes(profile.role)) redirect('/');

  return (
    <div className="page-pad">
      <div className="container-z mx-auto">
        <div className="flex items-center gap-3 mb-2">
              <Shield size={24} className="text-zred" />
          <h1 className="text-2xl font-bold text-ztext">Admin panel</h1>
        </div>
        <p className="text-ztext-light text-sm">Platform management and oversight.</p>

        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { label: 'Users', value: '0', desc: 'Total registered' },
            { label: 'Restaurants', value: '0', desc: 'Active listings' },
            { label: 'Orders', value: '0', desc: 'All time' },
            { label: 'BNPL accounts', value: '0', desc: 'Active credit' },
          ].map((s) => (
            <div key={s.label} className="bg-zcard rounded-xl shadow-z p-5">
              <p className="text-xs text-ztext-lighter">{s.desc}</p>
              <p className="text-3xl font-bold text-ztext mt-1">{s.value}</p>
              <p className="text-sm text-ztext-light mt-1">{s.label}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
