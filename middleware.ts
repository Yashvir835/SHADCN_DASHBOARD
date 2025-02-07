// middleware.ts
import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';

// Define which routes are considered protected.
const isProtectedRoute = createRouteMatcher(['/dashboard(.*)', '/forum(.*)']);
// Define your landing page route.
const isLandingPage = createRouteMatcher(['/landingPage(.*)']);

export default clerkMiddleware(async (auth, req) => {
  const { userId } = await auth();
  const url = new URL(req.url);

  // If the user is not signed in and is trying to access a protected route,
  // redirect them to the landing page.
  if (!userId && isProtectedRoute(req)) {
    return NextResponse.redirect(new URL('/landingPage', req.url));
  }

  // If the user is signed in and is trying to access the landing page,
  // redirect them to the dashboard.
  if (userId && isLandingPage(req)) {
    return NextResponse.redirect(new URL('/dashboard', req.url));
  }

  // Otherwise, allow the request to continue.
  return;
});

export const config = {
  matcher: [
    // Skip Next.js internals and static files.
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes.
    '/(api|trpc)(.*)',
  ],
};
