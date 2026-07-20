'use server';

import { createServerSupabaseClient } from '@/infrastructure/supabase/server';

export async function getServerSession() {
  const supabase = await createServerSupabaseClient();
  if (!supabase) return { user: null };
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { user: null };

  return {
    user: {
      id: user.id,
      email: user.email ?? '',
      fullName: (user.user_metadata?.full_name as string) ?? user.email?.split('@')[0] ?? 'User',
      role: (user.user_metadata?.role as string) ?? null,
      avatarUrl: (user.user_metadata?.avatar_url as string) ?? null,
      phone: (user.user_metadata?.phone as string) ?? null,
    },
  };
}

export async function getServerProfile() {
  const supabase = await createServerSupabaseClient();
  if (!supabase) return { profile: null };

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { profile: null };

  const { data } = await supabase
    .from('profiles')
    .select('id, email, full_name, phone, avatar_url, role, is_active, created_at, updated_at')
    .eq('id', user.id)
    .single();

  return { profile: data };
}

export async function updateServerProfile(updates: { role?: string; phone?: string; full_name?: string }) {
  const supabase = await createServerSupabaseClient();
  if (!supabase) return { error: 'Supabase not configured' };

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: 'Not authenticated' };

  const { error } = await supabase
    .from('profiles')
    .upsert({ id: user.id, ...updates });

  if (error) return { error: error.message };

  if (updates.role) {
    await supabase.auth.updateUser({ data: { role: updates.role } });
  }

  return { error: null };
}

export async function completeOnboarding(formData: FormData) {
  const supabase = await createServerSupabaseClient();
  if (!supabase) return { error: 'Supabase not configured', redirect: null };

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: 'Not authenticated', redirect: null };

  const role = formData.get('role') as string;
  const phone = formData.get('phone') as string;

  if (!['student', 'merchant', 'delivery'].includes(role)) {
    return { error: 'Invalid role', redirect: null };
  }

  const { error: profileError } = await supabase
    .from('profiles')
    .upsert({ id: user.id, role, phone: phone || null });

  if (profileError) return { error: profileError.message, redirect: null };

  await supabase.auth.updateUser({ data: { role } });

  const dashboards: Record<string, string> = {
    student: '/dashboard/student',
    merchant: '/dashboard/merchant',
    delivery: '/dashboard/delivery',
  };

  return { error: null, redirect: dashboards[role] ?? '/' };
}
