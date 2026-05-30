import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { clerkMiddleware } from "@clerk/nextjs/server";

// Only run Clerk middleware if we have a real secret key provisioned
const isClerkConfigured = 
  process.env.CLERK_SECRET_KEY && 
  !process.env.CLERK_SECRET_KEY.startsWith("sk_test_clerkSecretKeyPlaceholder");

export default isClerkConfigured 
  ? clerkMiddleware()
  : function middleware(request: NextRequest) {
      return NextResponse.next();
    };

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
};
