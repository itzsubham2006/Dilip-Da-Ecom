'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { authService } from '../services/auth-service';
import { OAuthButtons } from './OAuthButtons';

export function LoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);
    const { user, error: err } = await authService.signIn(email, password);
    setLoading(false);
    if (err) { setError(err); return; }
    if (user?.role) { router.push('/'); } else { router.push('/auth/onboarding'); }
    router.refresh();
  }

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="bg-white rounded-xl shadow-z p-8">
        <h1 className="text-2xl font-bold text-ztext mb-1">Welcome back</h1>
        <p className="text-ztext-light text-sm mb-6">Sign in to your Dilip Da account</p>

        <OAuthButtons />

        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-zborder" /></div>
          <div className="relative flex justify-center text-xs"><span className="bg-white px-2 text-ztext-lighter">or continue with email</span></div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-ztext mb-1.5">Email</label>
            <input id="email" type="email" className="input-z" placeholder="you@example.com" value={email} onChange={(e) => setEmail(e.target.value)} required />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-ztext mb-1.5">Password</label>
            <input id="password" type="password" className="input-z" placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} required />
          </div>
          {error && <p className="text-sm" style={{ color: '#E23744' }}>{error}</p>}
          <button type="submit" className="button-z button-z-primary w-full h-12 text-base" disabled={loading}>
            {loading ? 'Signing in...' : 'Sign in'}
          </button>
        </form>

        <p className="text-center text-sm text-ztext-light mt-6">
          Don&apos;t have an account?{' '}
          <Link href="/auth/signup" className="font-semibold" style={{ color: '#E23744' }}>Sign up</Link>
        </p>
      </div>
    </div>
  );
}
