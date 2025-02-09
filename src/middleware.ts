import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

import { auth } from "@/auth";

export async function middleware(request: NextRequest) {
  // 회원가입 제외한 모든 비인가 POST 요청 제한
  if (
    request.method === "POST" &&
    request.nextUrl.pathname.startsWith("/api")
  ) {
    const session = await auth();
    if (!session?.user && !request.nextUrl.pathname.startsWith("/api/user")) {
      return new NextResponse("로그인 후 다시 시도해주세요.", {
        status: 401,
      });
    }
  }

  if (
    request.method === "GET" &&
    request.nextUrl.pathname.startsWith("/api/user")
  ) {
    const session = await auth();
    if (!session?.user) {
      return new NextResponse("로그인 후 다시 시도해주세요.", {
        status: 401,
      });
    } else if (session?.user?.role !== "ROLE_SUPERUSER") {
      return new NextResponse("권한이 없습니다.", {
        status: 403,
      });
    }
  }

  if (request.nextUrl.pathname.startsWith("/manage")) {
    const session = await auth();
    if (!session?.user) {
      return new NextResponse("로그인 후 다시 시도해주세요.", {
        status: 401,
      });
    } else if (session?.user?.role !== "ROLE_SUPERUSER") {
      return new NextResponse("권한이 없습니다.", {
        status: 403,
      });
    }
  }

  // 글쓰기 페이지 제한
  if (request.nextUrl.pathname.startsWith("/post/edit")) {
    const session = await auth();

    if (!session?.user) {
      // 로그인 안 했을 시 로그인 페이지로 리다이렉트
      const signInUrl = new URL("/user/signIn", request.url);
      signInUrl.searchParams.set("from", request.nextUrl.pathname);
      return NextResponse.redirect(signInUrl);
    }
  }

  // 로그인 페이지 제한
  if (request.nextUrl.pathname.startsWith("/user/signIn")) {
    const session = await auth();

    if (session?.user) {
      // 이미 로그인 돼있을 시 유저 페이지로 리다이렉트
      return NextResponse.redirect(new URL(`/user/myPage`, request.url));
    }
  }

  // 유저 페이지 제한
  if (request.nextUrl.pathname.startsWith("/user/myPage")) {
    const session = await auth();

    if (!session?.user) {
      const signInUrl = new URL("/user/signIn", request.url);
      signInUrl.searchParams.set("from", request.nextUrl.pathname);
      return NextResponse.redirect(signInUrl);
    }
  }
}
