'use server';

import { createServerSupabaseClient } from '@/infrastructure/supabase/server';

export async function getServerSession() {
  const supabase = await createServerSupabaseClient();
  if (!supabase) return { user: null };
  const { data } = await supabase.auth.getSession();
  if (!data.session?.user) return { user: null };

  const user = data.session.user;
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

  const { data: { session } } = await supabase.auth.getSession();
  if (!session?.user) return { profile: null };

  const { data } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', session.user.id)
    .single();

  return { profile: data };
}

export async function updateServerProfile(updates: { role?: string; phone?: string; full_name?: string }) {
  const supabase = await createServerSupabaseClient();
  if (!supabase) return { error: 'Supabase not configured' };

  const { data: { session } } = await supabase.auth.getSession();
  if (!session?.user) return { error: 'Not authenticated' };

  const { error } = await supabase
    .from('profiles')
    .update(updates)
    .eq('id', session.user.id);

  if (error) return { error: error.message };

  if (updates.role) {
    await supabase.auth.updateUser({ data: { role: updates.role } });
  }

  return { error: null };
}

export async function completeOnboarding(formData: FormData) {
  const supabase = await createServerSupabaseClient();
  if (!supabase) return { error: 'Supabase not configured', redirect: null };

  const { data: { session } } = await supabase.auth.getSession();
  if (!session?.user) return { error: 'Not authenticated', redirect: null };

  const role = formData.get('role') as string;
  const phone = formData.get('phone') as string;

  if (!['student', 'merchant', 'delivery'].includes(role)) {
    return { error: 'Invalid role', redirect: null };
  }

  const { error: profileError } = await supabase
    .from('profiles')
    .update({ role, phone: phone || null })
    .eq('id', session.user.id);

  if (profileError) return { error: profileError.message, redirect: null };

  await supabase.auth.updateUser({ data: { role } });

  const dashboards: Record<string, string> = {
    student: '/dashboard/student',
    merchant: '/dashboard/merchant',
    delivery: '/dashboard/delivery',
  };

  return { error: null, redirect: dashboards[role] ?? '/' };
}
