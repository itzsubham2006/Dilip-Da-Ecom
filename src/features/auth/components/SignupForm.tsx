'use client';

import { useState } from 'react';
import Link from 'next/link';
import { authService } from '../services/auth-service';
import { OAuthButtons } from './OAuthButtons';

export default function SignupForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);
    const { user, error: err } = await authService.signUp(email, password, fullName);
    setLoading(false);
    if (err) { setError(err); return; }
    if (user) { window.location.href = '/auth/onboarding'; }
    else { setError('Check your email for a confirmation link.'); }
  }

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="bg-zcard rounded-xl shadow-z p-8">
        <h1 className="text-2xl font-bold text-ztext mb-1">Create account</h1>
        <p className="text-ztext-light text-sm mb-6">Join Dilip Da and start ordering</p>

        <OAuthButtons />

        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-zborder" /></div>
          <div className="relative flex justify-center text-xs"><span className="bg-zcard px-2 text-ztext-lighter">or sign up with email</span></div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-ztext mb-1.5">Full name</label>
            <input id="name" type="text" className="input-z" placeholder="John Doe" value={fullName} onChange={(e) => setFullName(e.target.value)} required />
          </div>
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-ztext mb-1.5">Email</label>
            <input id="email" type="email" className="input-z" placeholder="you@example.com" value={email} onChange={(e) => setEmail(e.target.value)} required />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-ztext mb-1.5">Password</label>
            <input id="password" type="password" className="input-z" placeholder="At least 6 characters" value={password} onChange={(e) => setPassword(e.target.value)} required minLength={6} />
          </div>
          {error && <p className="text-sm text-zred">{error}</p>}
          <button type="submit" className="button-z button-z-primary w-full h-12 text-sm" disabled={loading}>
            {loading ? 'Creating account...' : 'Create account'}
          </button>
        </form>

        <p className="text-center text-sm text-ztext-light mt-6">
          Already have an account?{' '}
          <Link href="/auth/login" className="font-semibold text-zred">Sign in</Link>
        </p>
      </div>
    </div>
  );
}
