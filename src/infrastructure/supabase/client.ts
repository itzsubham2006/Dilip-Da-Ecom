import { createBrowserClient } from '@supabase/ssr';
import { env } from '@/config/env';

export function createClient() {
  if (!env.supabase.isConfigured) {
    throw new Error(
      'Supabase not configured. Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY in .env.local',
    );
  }

  return createBrowserClient(env.supabase.url!, env.supabase.anonKey!);
}
