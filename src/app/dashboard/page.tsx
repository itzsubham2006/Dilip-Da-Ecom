import { redirect } from 'next/navigation';
import { getServerSession, getServerProfile } from '@/features/auth/actions';

export default async function DashboardPage() {
  const { user } = await getServerSession();
  if (!user) redirect('/auth/login');

  const { profile } = await getServerProfile();
  const role = profile?.role ?? user.role;

  const dashboards: Record<string, string> = {
    student: '/dashboard/student',
    merchant: '/dashboard/merchant',
    delivery: '/dashboard/delivery',
    admin: '/dashboard/admin',
    super_admin: '/dashboard/admin',
  };

  redirect(dashboards[role as string] ?? '/');
}
