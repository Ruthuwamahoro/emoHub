import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';

export default async function middleware(request: NextRequest) {
  const token = await getToken({
    req: request,
    secret: process.env.JWT_SECRET
  });

  const { pathname } = request.nextUrl;
  const publicRoutes = ['/login', '/register', '/forgot-password'];
  const protectedRoutes = ['/dashboard'];
  const onboardingRoute = '/onboarding';
  
  const userOnlyRoutes = [
    '/dashboard/emotioncheckins',
    '/dashboard/dailyreflection',
    '/dashboard/community',
    '/dashboard/events',
    '/dashboard/profile',
    '/dashboard/challenges',
    '/dashboard/resources'
  ];
  
  const adminOnlyRoutes = [
    '/dashboard/admin',
    '/dashboard/admin/usermanagement',
    '/dashboard/emotions',
    '/dashboard/reflection',
    '/admin/events'
  ];
  
  const sharedRoutes = [
    '/dashboard/emotioncheckins',
    '/dashboard/challenges', 
    '/dashboard/resources',
    '/dashboard/community',
    '/dashboard/profile'
  ];
  
  if (pathname === '/') {
    return NextResponse.next();
  }

  const isProtectedRoute = protectedRoutes.some(route =>
    pathname.startsWith(route)
  );
  const isPublicRoute = publicRoutes.some(route =>
    pathname.startsWith(route)
  );

  if (isProtectedRoute && !token) {
    const response = NextResponse.redirect(new URL('/login', request.url));
    response.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
    response.headers.set('Pragma', 'no-cache');
    response.headers.set('Expires', '0');
    return response;
  }


  if (token) {
    if (isPublicRoute) {
      if (token.isOnboardingCompleted === false) {
        return NextResponse.redirect(new URL('/onboarding', request.url));
      } else {
        if (token.role === 'Admin') {
          return NextResponse.redirect(new URL('/dashboard/admin', request.url));
        } else {
          return NextResponse.redirect(new URL('/dashboard', request.url));
        }
      }
    }

    if (token.isOnboardingCompleted === false && pathname !== onboardingRoute) {
      console.log('Onboarding not completed, redirecting to onboarding');
      return NextResponse.redirect(new URL('/onboarding', request.url));
    }

    if (token.isOnboardingCompleted === true && pathname === onboardingRoute) {
      if (token.role === 'Admin') {
        return NextResponse.redirect(new URL('/dashboard/admin', request.url));
      } else {
        return NextResponse.redirect(new URL('/dashboard', request.url));
      }
    }

    if (pathname === '/dashboard' && token.role === 'Admin') {
      return NextResponse.redirect(new URL('/dashboard/admin', request.url));
    }

    const isSharedRoute = sharedRoutes.some(route => pathname.startsWith(route));
    
    if (!isSharedRoute) {
      const isUserOnlyRoute = userOnlyRoutes.some(route => pathname.startsWith(route));
      const isAdminOnlyRoute = adminOnlyRoutes.some(route => pathname.startsWith(route));

      if (isUserOnlyRoute && token.role === 'Admin') {
        return NextResponse.redirect(new URL('/dashboard/admin', request.url));
      }

      if (isAdminOnlyRoute && token.role === 'User') {
        return NextResponse.redirect(new URL('/dashboard', request.url));
      }
    }
  }

  const response = NextResponse.next();
  
  // if (isProtectedRoute || pathname.startsWith('/onboarding')) {
  //   response.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
  //   response.headers.set('Pragma', 'no-cache');
  //   response.headers.set('Expires', '0');
  //   response.headers.set('Surrogate-Control', 'no-store');
  // }
  
  return response;
}

export const config = {
  matcher: [
    '/',
    '/dashboard/:path*',
    '/login',
    '/register',
    '/onboarding',
    '/forgot-password'
  ],
};