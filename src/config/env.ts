function getEnv(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing environment variable: ${name}`);
  }
  return value;
}

function getPublicEnv(name: string): string {
  const value = process.env[`NEXT_PUBLIC_${name}`];
  if (!value) {
    throw new Error(`Missing environment variable: NEXT_PUBLIC_${name}`);
  }
  return value;
}

export const env = {
  supabase: {
    url: getPublicEnv('SUPABASE_URL'),
    anonKey: getPublicEnv('SUPABASE_ANON_KEY'),
    serviceRoleKey: getEnv('SUPABASE_SERVICE_ROLE_KEY'),
  },
  app: {
    url: getPublicEnv('APP_URL'),
    name: getPublicEnv('APP_NAME'),
  },
  razorpay: {
    keyId: getPublicEnv('RAZORPAY_KEY_ID'),
    keySecret: getEnv('RAZORPAY_KEY_SECRET'),
  },
};
