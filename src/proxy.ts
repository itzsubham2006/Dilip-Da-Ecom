import { type NextRequest, NextResponse } from 'next/server';
import { rateLimit, RATE_LIMIT_CONFIGS, rateLimitKey } from '@/lib/rate-limit';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const publicRoutes = new Set([
  '/',
  '/auth/login',
  '/auth/signup',
  '/auth/callback',
  '/cart',
  '/checkout',
  '/menu',
  '/favorites',
  '/orders',
  '/profile',
]);

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname.startsWith('/_next') || pathname.startsWith('/api') || pathname.startsWith('/static')) {
    return NextResponse.next();
  }

  const isServerAction = request.headers.get('Next-Action') !== null;
  const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? 'unknown';

  if (!isServerAction && (pathname === '/auth/login' || pathname === '/auth/signup')) {
    const result = await rateLimit(rateLimitKey('auth', ip), RATE_LIMIT_CONFIGS.strict);
    if (!result.success) {
      return NextResponse.json({ error: 'Too many requests. Please try again later.' }, { status: 429 });
    }
  }

  if (!isServerAction && pathname.startsWith('/dashboard')) {
    const result = await rateLimit(rateLimitKey('dashboard', ip), RATE_LIMIT_CONFIGS.default);
    if (!result.success) {
      return NextResponse.json({ error: 'Too many requests. Please try again later.' }, { status: 429 });
    }
  }

  if (publicRoutes.has(pathname) || pathname.startsWith('/auth/') || pathname.startsWith('/order/')) {
    return NextResponse.next();
  }

  if (!supabaseUrl || !supabaseAnonKey) {
    return NextResponse.next();
  }

  const { createServerClient } = await import('@supabase/ssr');

  let response = NextResponse.next({ request: { headers: request.headers } });

  const supabase = createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      getAll() { return request.cookies.getAll(); },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
        response = NextResponse.next({ request: { headers: request.headers } });
        cookiesToSet.forEach(({ name, value, options }) => response.cookies.set(name, value, options));
      },
    },
  });

  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    const loginUrl = new URL('/auth/login', request.url);
    const redirectParam = pathname;
    if (redirectParam.startsWith('/') && !redirectParam.startsWith('//') && !redirectParam.startsWith('/\\')) {
      loginUrl.searchParams.set('redirect', redirectParam);
    }
    return NextResponse.redirect(loginUrl);
  }

  if (user && (pathname === '/auth/login' || pathname === '/auth/signup')) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  if (user && pathname.startsWith('/dashboard') && pathname !== '/auth/onboarding') {
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .maybeSingle();

    const role = (profile?.role ?? user.user_metadata?.role) as string | undefined;
    if (!role) {
      return NextResponse.redirect(new URL('/auth/onboarding', request.url));
    }

    const prefix: Record<string, string> = {
      student: '/dashboard/student',
      merchant: '/dashboard/merchant',
      delivery: '/dashboard/delivery',
      admin: '/dashboard/admin',
      super_admin: '/dashboard/admin',
    };
    const allowed = prefix[role];
    if (allowed && !pathname.startsWith(allowed)) {
      return NextResponse.redirect(new URL(allowed, request.url));
    }
  }

  response.headers.set('X-Frame-Options', 'DENY');
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');

  return response;
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};
