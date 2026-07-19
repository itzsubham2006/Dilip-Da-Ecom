import { type NextRequest, NextResponse } from 'next/server';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;

const publicRoutes = new Set([
  '/',
  '/login',
  '/register',
  '/forgot-password',
  '/restaurants',
  '/products',
  '/cart',
  '/track',
  '/search',
]);

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname.startsWith('/_next') || pathname.startsWith('/api') || pathname.startsWith('/static')) {
    return NextResponse.next();
  }

  const isPublicRoute =
    publicRoutes.has(pathname) ||
    pathname.startsWith('/product/') ||
    pathname.startsWith('/restaurant/');

  if (!supabaseUrl) {
    return NextResponse.next();
  }

  const { createServerClient } = await import('@supabase/ssr');

  let response = NextResponse.next({ request: { headers: request.headers } });

  const supabase = createServerClient(
    supabaseUrl,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
          response = NextResponse.next({ request: { headers: request.headers } });
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options),
          );
        },
      },
    },
  );

  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session && !isPublicRoute) {
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('redirect', pathname);
    return NextResponse.redirect(loginUrl);
  }

  if (session) {
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', session.user.id)
      .single();

    const userRole = profile?.role as string | undefined;

    if (userRole) {
      const roleRoutePrefixes: Record<string, string> = {
        student: '/dashboard/student',
        merchant: '/dashboard/merchant',
        delivery: '/dashboard/delivery',
        admin: '/dashboard/admin',
        super_admin: '/dashboard/admin',
      };
      const allowedPrefix = roleRoutePrefixes[userRole];
      if (pathname.startsWith('/dashboard') && allowedPrefix && !pathname.startsWith(allowedPrefix)) {
        return NextResponse.redirect(new URL(allowedPrefix, request.url));
      }
    }

    if (pathname === '/login' || pathname === '/register') {
      return NextResponse.redirect(new URL('/', request.url));
    }
  }

  return response;
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};
