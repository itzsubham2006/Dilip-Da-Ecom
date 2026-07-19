import { SignupForm } from '@/features/auth/components/SignupForm';
import type { Metadata } from 'next';

export const metadata: Metadata = { title: 'Sign Up' };

export default function SignupPage() {
  return (
    <section className="page-pad flex items-center justify-center min-h-[calc(100vh-8rem)]">
      <SignupForm />
    </section>
  );
}
