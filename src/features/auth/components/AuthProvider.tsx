'use client';

import { useEffect } from 'react';
import { useAuthStore } from '@/features/auth/store';
import { createClient } from '@/infrastructure/supabase/client';

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const initialize = useAuthStore((s) => s.initialize);
  const setUser = useAuthStore((s) => s.setUser);

  useEffect(() => {
    initialize();

    try {
      const supabase = createClient();
      const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
        if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
          useAuthStore.getState().initialize();
        }
        if (event === 'SIGNED_OUT') {
          setUser(null);
        }
      });
      return () => subscription?.unsubscribe();
    } catch {
      // Supabase may not be configured; ignore
    }
  }, [initialize, setUser]);

  return <>{children}</>;
}
