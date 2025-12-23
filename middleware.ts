// middleware.ts
export const runtime = "nodejs";

import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { verifyToken } from "@/lib/auth";

export function middleware(req: NextRequest) {
  const token = req.cookies.get("token")?.value;
  const path = req.nextUrl.pathname;

  const isApi = path.startsWith("/api/todos");
  const isTodosPage = path.startsWith("/todos");
  const isAuthPage = path === "/login" || path === "/register";

  if (!token) {
    if (isApi)
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

    if (isTodosPage)
      return NextResponse.redirect(new URL("/login", req.url));

    return NextResponse.next();
  }

  const payload: any = verifyToken(token);
  if (!payload?.id) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  if (isAuthPage) {
    return NextResponse.redirect(new URL("/todos", req.url));
  }

  const headers = new Headers(req.headers);
  headers.set("x-user-id", payload.id);

  return NextResponse.next({ request: { headers } });
}

export const config = {
  matcher: ["/api/todos/:path*", "/todos", "/login", "/register", "/api/profile/:path*"],
};
