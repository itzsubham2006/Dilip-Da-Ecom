function getPublicEnv(name: string): string | undefined {
  return process.env[`NEXT_PUBLIC_${name}`];
}

function getEnv(name: string): string | undefined {
  return process.env[name];
}

function isValidUrl(value: string | undefined): boolean {
  if (!value) return false;
  try {
    new URL(value);
    return true;
  } catch {
    return false;
  }
}

export const env = {
  supabase: {
    url: getPublicEnv('SUPABASE_URL'),
    anonKey: getPublicEnv('SUPABASE_ANON_KEY'),
    serviceRoleKey: getEnv('SUPABASE_SERVICE_ROLE_KEY'),
    isConfigured: isValidUrl(getPublicEnv('SUPABASE_URL')) && !!getPublicEnv('SUPABASE_ANON_KEY'),
  },
  app: {
    url: getPublicEnv('APP_URL') ?? 'http://localhost:3000',
    name: getPublicEnv('APP_NAME') ?? 'Dilip Da',
  },
  razorpay: {
    keyId: getPublicEnv('RAZORPAY_KEY_ID'),
    keySecret: getEnv('RAZORPAY_KEY_SECRET'),
    isConfigured: !!getPublicEnv('RAZORPAY_KEY_ID') && !!getEnv('RAZORPAY_KEY_SECRET'),
  },
};
