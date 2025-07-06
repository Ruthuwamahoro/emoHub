import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';

const JWT_SECRET = process.env.JWT_SECRET as string;

export async function middleware(request: NextRequest) {
  const token = await getToken({ req: request, secret: JWT_SECRET });
  const { pathname } = request.nextUrl;


  const protectedRoutes = ['/dashboard', '/profile','/dashboard/*'];

  const isProtectedRoute = protectedRoutes.some((route) => pathname.startsWith(route));

  if (isProtectedRoute && !token) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  if (pathname === '/login' && token) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard', '/profile', '/login'],
};





// import { NextResponse } from 'next/server';
// import type { NextRequest } from 'next/server';
// import { getToken } from 'next-auth/jwt';

// const JWT_SECRET = process.env.JWT_SECRET as string;

// // Define role-based route mappings
// const BASE_ROLE_ROUTES = {
//   User: [
//     '/dashboard',
//     '/dashboard/emotioncheckins',
//     '/dashboard/dailyreflection',
//     '/dashboard/challenges',
//     '/dashboard/resources',
//     '/dashboard/community',
//     '/dashboard/events',
//     '/dashboard/askus',
//   ],
//   Specialist: [
//     '/dashboard',
//     '/dashboard/patients',
//     '/dashboard/appointments',
//     '/dashboard/treatment-plans',
//     '/dashboard/patient-analytics',
//     '/dashboard/resources',
//     '/dashboard/pro-community',
//     '/dashboard/events',
//   ],
//   Admin: [
//     '/dashboard/admin',
//     '/dashboard/admin/usermanagement',
//     '/dashboard/emotions',
//     '/dashboard/challenges',
//     '/dashboard/reflection',
//     '/dashboard/resources',
//     '/admin/analytics',
//     '/dashboard/community',
//     '/admin/events',
//     '/admin/settings',
//   ],
//   SuperAdmin: [
//     '/superadmin/dashboard',
//     '/superadmin/overview',
//     '/superadmin/admins',
//     '/superadmin/all-users',
//     '/superadmin/platform-analytics',
//     '/superadmin/config',
//     '/superadmin/security',
//     '/superadmin/database',
//   ],
// };

// // Create final ROLE_ROUTES with superadmin having access to all routes
// const ROLE_ROUTES: Record<string, string[]> = {
//   User: [...BASE_ROLE_ROUTES.User],
//   Specialist: [...BASE_ROLE_ROUTES.Specialist],
//   Admin: [...BASE_ROLE_ROUTES.Admin],
//   SuperAdmin: [
//     ...BASE_ROLE_ROUTES.SuperAdmin,
//     ...BASE_ROLE_ROUTES.Admin,
//     ...BASE_ROLE_ROUTES.Specialist,
//     ...BASE_ROLE_ROUTES.User,
//   ],
// };

// // Define role hierarchy (higher roles can access lower role routes)
// const ROLE_HIERARCHY = {
//   User: 1,
//   Specialist: 2,
//   Admin: 3,
//   SuperAdmin: 4,
// };

// // Helper function to check if user can access a route
// function canAccessRoute(userRole: string, pathname: string): boolean {
//   // Get routes for the user's role
//   const userRoutes = ROLE_ROUTES[userRole];
//   if (!userRoutes) return false;

//   // Direct role access check
//   if (userRoutes.some(route => 
//     pathname === route || pathname.startsWith(route + '/')
//   )) {
//     return true;
//   }

//   // Check hierarchy access (higher roles can access lower role routes)
//   const userRoleLevel = ROLE_HIERARCHY[userRole as keyof typeof ROLE_HIERARCHY] || 0;
  
//   for (const [role, routes] of Object.entries(ROLE_ROUTES)) {
//     const roleLevel = ROLE_HIERARCHY[role as keyof typeof ROLE_HIERARCHY] || 0;
    
//     if (userRoleLevel > roleLevel && Array.isArray(routes)) {
//       if (routes.some(route => pathname === route || pathname.startsWith(route + '/'))) {
//         return true;
//       }
//     }
//   }

//   return false;
// }

// // Get default dashboard route for each role
// function getDefaultRoute(role: string): string {
//   switch (role) {
//     case 'SuperAdmin':
//       return '/superadmin/dashboard';
//     case 'Admin':
//       return '/dashboard/admin';
//     case 'Specialist':
//       return '/dashboard';
//     case 'User':
//     default:
//       return '/dashboard';
//   }
// }

// export async function middleware(request: NextRequest) {
//   const token = await getToken({ req: request, secret: JWT_SECRET });
//   const { pathname } = request.nextUrl;

//   // Public routes that don't require authentication
//   const publicRoutes = ['/', '/login', '/register', '/forgot-password', '/api/auth'];
//   const isPublicRoute = publicRoutes.some(route => pathname.startsWith(route));

//   // Protected routes (all dashboard and admin routes)
//   const protectedRoutes = ['/dashboard', '/admin', '/superadmin', '/profile'];
//   const isProtectedRoute = protectedRoutes.some(route => pathname.startsWith(route));

//   // If accessing protected route without token, redirect to login
//   if (isProtectedRoute && !token) {
//     const loginUrl = new URL('/login', request.url);
//     loginUrl.searchParams.set('callbackUrl', pathname);
//     return NextResponse.redirect(loginUrl);
//   }

//   // If accessing login page with valid token, redirect to appropriate dashboard
//   if (pathname === '/login' && token) {
//     const userRole = token.role as string || 'user';
//     const defaultRoute = getDefaultRoute(userRole);
//     return NextResponse.redirect(new URL(defaultRoute, request.url));
//   }

//   // Role-based access control for protected routes
//   if (isProtectedRoute && token) {
//     const userRole = token.role as string || 'user';
    
//     // Check if user can access the requested route
//     if (!canAccessRoute(userRole, pathname)) {
//       // Redirect to appropriate dashboard with error message
//       const defaultRoute = getDefaultRoute(userRole);
//       const redirectUrl = new URL(defaultRoute, request.url);
//       redirectUrl.searchParams.set('error', 'access_denied');
//       redirectUrl.searchParams.set('message', 'You do not have permission to access this page');
      
//       return NextResponse.redirect(redirectUrl);
//     }
//   }

//   // Handle root dashboard redirect based on role
//   if (pathname === '/dashboard' && token) {
//     const userRole = token.role as string || 'user';
    
//     // Redirect superadmin to their specific dashboard
//     if (userRole === 'SuperAdmin') {
//       return NextResponse.redirect(new URL('/superadmin/dashboard', request.url));
//     }
    
//     // Redirect admin to their specific dashboard  
//     if (userRole === 'Admin') {
//       return NextResponse.redirect(new URL('/dashboard/admin', request.url));
//     }
    
//     // Users and specialists stay on /dashboard
//   }

//   return NextResponse.next();
// }

// export const config = {
//   matcher: [
//     // Protected dashboard routes
//     '/dashboard/:path*',
//     '/admin/:path*',
//     '/superadmin/:path*',
//     '/profile/:path*',
//     // Auth routes
//     '/login',
//     '/register',
//     // API routes that need protection
//     '/api/((?!auth).)*',
//   ],
// };