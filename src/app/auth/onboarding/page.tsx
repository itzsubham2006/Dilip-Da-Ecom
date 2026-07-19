import { redirect } from 'next/navigation';
import { getServerSession } from '@/features/auth/actions';
import { OnboardingForm } from '@/features/auth/components/OnboardingForm';
import type { Metadata } from 'next';

export const metadata: Metadata = { title: 'Set Up Your Account' };

export default async function OnboardingPage() {
  const { user } = await getServerSession();
  if (!user) redirect('/auth/login');
  if (user.role) redirect('/');

  return (
    <section className="page-pad flex items-center justify-center min-h-[calc(100vh-8rem)]">
      <OnboardingForm />
    </section>
  );
}
