import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

import { auth } from "@/auth";

export async function middleware(request: NextRequest) {
  if (request.nextUrl.pathname.startsWith("/post/edit")) {
    // 글쓰기 페이지 제한
    const session = await auth();

    if (!session?.user) {
      // 로그인 안 했을 시 로그인 페이지로 리다이렉트
      const signInUrl = new URL("/signIn", request.url);
      signInUrl.searchParams.set("from", request.nextUrl.pathname);
      return NextResponse.redirect(signInUrl);
    }
  } else if (request.nextUrl.pathname.startsWith("/signUp")) {
    // 회원가입 페이지 제한
    const session = await auth();

    if (!session?.user) {
      // 개발자 서버 아니면 회원가입 제한
      if (process.env.NODE_ENV !== "development") {
        return NextResponse.redirect(new URL("/not-found", request.url));
      }
    } else {
      // 이미 로그인 돼있을 시 유저 페이지로 리다이렉트
      return NextResponse.redirect(new URL(`/myPage`, request.url));
    }
  } else if (request.nextUrl.pathname.startsWith("/signIn")) {
    const session = await auth();

    if (session?.user) {
      return NextResponse.redirect(new URL(`/myPage`, request.url));
    }
  }
}
