import { type NextRequest, NextResponse } from 'next/server';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const publicRoutes = new Set([
  '/',
  '/auth/login',
  '/auth/signup',
  '/auth/callback',
  '/cart',
  '/checkout',
  '/order/track',
]);

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname.startsWith('/_next') || pathname.startsWith('/api') || pathname.startsWith('/static')) {
    return NextResponse.next();
  }

  if (publicRoutes.has(pathname) || pathname.startsWith('/auth/')) {
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

  const { data: { session } } = await supabase.auth.getSession();

  if (!session) {
    const loginUrl = new URL('/auth/login', request.url);
    loginUrl.searchParams.set('redirect', pathname);
    return NextResponse.redirect(loginUrl);
  }

  if (session && (pathname === '/auth/login' || pathname === '/auth/signup')) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  if (session && pathname.startsWith('/dashboard') && pathname !== '/auth/onboarding') {
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', session.user.id)
      .maybeSingle();

    const role = (profile?.role ?? session.user.user_metadata?.role) as string | undefined;
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

  return response;
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};
