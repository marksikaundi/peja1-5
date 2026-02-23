import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

import { hasClerkSessionFromCookieLookup } from "@/src/auth";

function unauthorizedApiResponse() {
  return NextResponse.json(
    {
      error: "UNAUTHORIZED",
      message: "Sign in with Clerk to access admin routes.",
    },
    { status: 401 },
  );
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const isAdminPath = pathname.startsWith("/admin");
  const isAdminApiPath = pathname.startsWith("/api/admin");

  if (!isAdminPath && !isAdminApiPath) {
    return NextResponse.next();
  }

  const hasSession = hasClerkSessionFromCookieLookup(
    (name) => request.cookies.get(name)?.value,
  );
  if (hasSession) {
    return NextResponse.next();
  }

  if (isAdminApiPath) {
    return unauthorizedApiResponse();
  }

  const redirectUrl = new URL("/sign-in", request.url);
  redirectUrl.searchParams.set("redirect_url", pathname);

  return NextResponse.redirect(redirectUrl);
}

export const config = {
  matcher: ["/admin/:path*", "/api/admin/:path*"],
};
