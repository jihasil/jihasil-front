import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

import {
  getSession,
  rotateRefreshToken,
} from "@/app/(back)/application/model/request-sign-in";
import { hasEnoughRole } from "@/app/(back)/domain/user";
import { RoleUnion } from "@/app/global/enum/roles";

export async function middleware(request: NextRequest) {
  const session = await getSession();

  if (!session) {
    const response = await rotateRefreshToken(request);
    if (response) {
      return response;
    }
  }

  const redirectToLoginPageIfNoSession = async (
    minimumRole: RoleUnion = "ROLE_USER",
  ) => {
    if (!session) {
      const nextUrl = new URL("/signIn", request.url);
      nextUrl.searchParams.set("from", request.nextUrl.pathname);

      return NextResponse.redirect(nextUrl);
    } else if (!hasEnoughRole(minimumRole, session.user.role)) {
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
    if (
      !session &&
      !request.nextUrl.pathname.startsWith("/api/user") &&
      !request.nextUrl.pathname.startsWith("/api/signIn")
    ) {
      return new NextResponse("로그인 후 다시 시도해주세요.", {
        status: 401,
      });
    }
  }

  // 사용자 수정 API
  if (
    request.nextUrl.pathname.startsWith("/api/user") &&
    request.method !== "POST"
  ) {
    if (!session) {
      return new NextResponse("로그인 후 다시 시도해주세요.", {
        status: 401,
      });
    } else if (
      // 슈퍼유저 아닌 사용자가 사용자 삭제 혹은 전체 사용자 리턴 금지
      session.user.role !== "ROLE_SUPERUSER" &&
      (request.nextUrl.pathname.startsWith("/api/user/all") ||
        request.method === "DELETE")
    ) {
      return new NextResponse("권한이 없습니다.", {
        status: 403,
      });
    }
  }

  // 페이지
  // 관리자 페이지 제한
  if (request.nextUrl.pathname.startsWith("/manage")) {
    return await redirectToLoginPageIfNoSession("ROLE_SUPERUSER");
  }

  // 사용자 페이지 제한
  if (
    request.nextUrl.pathname.startsWith("/post/edit") ||
    request.nextUrl.pathname.startsWith("/post/new") ||
    request.nextUrl.pathname.startsWith("/user")
  ) {
    return await redirectToLoginPageIfNoSession();
  }

  // 로그인 페이지 제한
  if (request.nextUrl.pathname.startsWith("/signIn")) {
    if (session) {
      // 이미 로그인 돼있을 시 유저 페이지로 리다이렉트
      return NextResponse.redirect(new URL(`/user/myPage`, request.url));
    }
  }
}
