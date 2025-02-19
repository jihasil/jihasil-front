import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

import { getSession } from "@/features/request-sign-in";
import { roleOrdinal } from "@/shared/enum/roles";

export async function middleware(request: NextRequest) {
  const session = await getSession();

  if (!session) {
    const cookieStore = await cookies();
    const accessTokenHash = cookieStore.get("accessToken")?.value;

    if (
      request.nextUrl.pathname.match(
        RegExp("\.svg|/api|\.png|\.ico|static|_next"),
      ) === null &&
      accessTokenHash !== "invalidated"
    ) {
      const nextUrl = new URL("/api/refresh", request.url);
      nextUrl.searchParams.set("from", request.nextUrl.pathname);

      return NextResponse.redirect(nextUrl);
    }
  }

  const redirectToLoginPage = async (minimumRole: string = "ROLE_USER") => {
    if (!session) {
      const nextUrl = new URL("/user/signIn", request.url);
      nextUrl.searchParams.set("from", request.nextUrl.pathname);

      return NextResponse.redirect(nextUrl);
    } else if (
      roleOrdinal[session.user.role ?? "ROLE_USER"] < roleOrdinal[minimumRole]
    ) {
      return new NextResponse("권한이 없습니다.", {
        status: 403,
      });
    }
  };

  // API
  // 로그인 혹은 회원가입 제외한 모든 비인가 POST 요청 제한
  if (
    request.method === "POST" &&
    request.nextUrl.pathname.startsWith("/api")
  ) {
    if (!session && !request.nextUrl.pathname.startsWith("/api/user")) {
      return new NextResponse("로그인 후 다시 시도해주세요.", {
        status: 401,
      });
    }
  }

  if (
    request.nextUrl.pathname.startsWith("/api/user") &&
    request.method !== "POST"
  ) {
    if (!session) {
      return new NextResponse("로그인 후 다시 시도해주세요.", {
        status: 401,
      });
    } else if (
      request.nextUrl.pathname.startsWith("/api/user/all") &&
      session.user.role !== "ROLE_SUPERUSER"
    ) {
      return new NextResponse("권한이 없습니다.", {
        status: 403,
      });
    }
  }

  // 페이지
  // 관리자 페이지 제한
  if (request.nextUrl.pathname.startsWith("/manage")) {
    return await redirectToLoginPage();
  }

  // 글쓰기 페이지 제한
  if (request.nextUrl.pathname.startsWith("/post/edit")) {
    return await redirectToLoginPage();
  }

  // 로그인 페이지 제한
  if (request.nextUrl.pathname.startsWith("/user")) {
    if (request.nextUrl.pathname.startsWith("/user/signIn")) {
      if (session) {
        // 이미 로그인 돼있을 시 유저 페이지로 리다이렉트
        return NextResponse.redirect(new URL(`/user/myPage`, request.url));
      }
    } else {
      return await redirectToLoginPage();
    }
  }
}
