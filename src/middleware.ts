import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

import { auth } from "@/auth";

export async function middleware(request: NextRequest) {
  if (request.nextUrl.pathname.startsWith("/post")) {
    const session = await auth();
    if (!session?.user) {
      const signInUrl = new URL("/signIn", request.url);
      signInUrl.searchParams.set("from", request.nextUrl.pathname);
      return NextResponse.redirect(signInUrl);
    } else {
      return NextResponse.rewrite(new URL("/post", request.url));
    }
  }
}
