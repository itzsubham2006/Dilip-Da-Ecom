'use client';

import { useState } from 'react';
import { useAuthStore } from '../store';
import { authService } from '../services/auth-service';

const roles = [
  { value: 'student', label: 'Hungry Student', desc: 'Order food, pay later with Ethics Pay BNPL', emoji: '🎓' },
  { value: 'merchant', label: 'Restaurant Owner', desc: 'List your food and manage orders', emoji: '🍽️' },
  { value: 'delivery', label: 'Delivery Partner', desc: 'Deliver food and earn money', emoji: '🛵' },
] as const;

export function OnboardingForm() {
  const setUser = useAuthStore((s) => s.setUser);
  const [selectedRole, setSelectedRole] = useState<string | null>(null);
  const [phone, setPhone] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!selectedRole) { setError('Please select a role'); return; }
    setError(''); setLoading(true);
    const { user } = await authService.updateUserMetadata({ role: selectedRole, phone: phone || null });
    if (!user) { setError('Failed to update profile'); setLoading(false); return; }
    const { error: profileError } = await authService.updateProfile(user.id, { full_name: user.fullName, role: selectedRole, phone: phone || undefined, email: user.email });
    if (profileError) { setError(profileError); setLoading(false); return; }
    setUser({ ...user, role: selectedRole as 'student' | 'merchant' | 'delivery' | 'admin' | 'super_admin', phone: phone || null });
    const dashboards: Record<string, string> = { student: '/dashboard/student', merchant: '/dashboard/merchant', delivery: '/dashboard/delivery' };
    window.location.href = dashboards[selectedRole] ?? '/';
  }

  return (
    <div className="w-full max-w-lg mx-auto">
      <div className="bg-white rounded-xl shadow-z p-8">
        <h1 className="text-2xl font-bold text-ztext mb-1">Almost there!</h1>
        <p className="text-ztext-light text-sm mb-6">Choose how you&apos;ll use Dilip Da</p>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-3">
            {roles.map((r) => (
              <button key={r.value} type="button" onClick={() => { setSelectedRole(r.value); setError(''); }}
                className={`w-full text-left p-4 rounded-xl border-2 transition-all ${selectedRole === r.value ? 'border-[#E23744] bg-red-50' : 'border-zborder hover:border-ztext-light'}`}>
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{r.emoji}</span>
                  <div>
                    <div className="font-semibold text-ztext">{r.label}</div>
                    <div className="text-sm text-ztext-light">{r.desc}</div>
                  </div>
                </div>
              </button>
            ))}
          </div>
          <div>
            <label htmlFor="phone" className="block text-sm font-medium text-ztext mb-1.5">Phone (optional)</label>
            <input id="phone" type="tel" className="input-z" placeholder="+91 98765 43210" value={phone} onChange={(e) => setPhone(e.target.value)} />
          </div>
          {error && <p className="text-sm" style={{ color: '#E23744' }}>{error}</p>}
          <button type="submit" className="button-z button-z-primary w-full h-12 text-base" disabled={loading || !selectedRole}>
            {loading ? 'Setting up...' : 'Get started'}
          </button>
        </form>
      </div>
    </div>
  );
}
