import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

import { auth } from "@/auth";

export async function middleware(request: NextRequest) {
  // 개발환경에서의 회원가입 제외한 모든 POST 요청 제한
  if (
    request.method === "POST" &&
    request.nextUrl.pathname.startsWith("/api")
  ) {
    const session = await auth();
    if (
      !session?.user &&
      !(
        request.nextUrl.pathname.startsWith("/api/user") &&
        process.env.NODE_ENV === "development"
      )
    ) {
      return new NextResponse("권한이 없습니다.", {
        status: 401,
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

  // 회원가입 페이지 제한
  if (request.nextUrl.pathname.startsWith("/user/signUp")) {
    const session = await auth();

    if (!session?.user) {
      // 개발자 서버 아니면 회원가입 제한
      if (process.env.NODE_ENV !== "development") {
        return new NextResponse(
          "회원가입을 하실 수 없습니다. 개발자에게 문의하세요.",
          { status: 401 },
        );
      }
    } else {
      // 이미 로그인 돼있을 시 유저 페이지로 리다이렉트
      return NextResponse.redirect(new URL(`/user/myPage`, request.url));
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
