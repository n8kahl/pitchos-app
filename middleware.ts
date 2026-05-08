import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const PUBLIC = ["/enter", "/api/auth/unlock"];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (PUBLIC.some((p) => pathname.startsWith(p))) {
    return NextResponse.next();
  }

  if (request.cookies.get("pitchos_access")?.value === "granted") {
    return NextResponse.next();
  }

  const url = request.nextUrl.clone();
  url.pathname = "/enter";
  url.searchParams.set("next", pathname);
  return NextResponse.redirect(url);
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|icon.svg|manifest).*)"],
};
