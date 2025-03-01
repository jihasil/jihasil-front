import "server-only";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

import { ACCESS_TOKEN, INVALIDATED } from "@/shared/const/auth";
import { RoleUnion } from "@/shared/enum/roles";
import { Session } from "@/shared/types/auth-types";
import { decode } from "@auth/core/jwt";

declare module "@auth/core/jwt" {
  interface JWT {
    exp: number;
    sub: string;
    name: string;
    role: RoleUnion;
  }
}

export const getSession = async (): Promise<Session | null> => {
  const cookieStore = await cookies();
  const accessTokenHash = cookieStore.get(ACCESS_TOKEN)?.value;

  try {
    const secret = process.env.TOKEN_SECRET;
    if (!secret) throw new Error("Secret not set");

    if (accessTokenHash) {
      const [salt, encryptedAccessToken] = accessTokenHash.split("|");
      const accessToken = await decode({
        salt,
        secret,
        token: encryptedAccessToken,
      });

      if (accessToken && accessToken.exp > Date.now() / 1000) {
        return {
          user: {
            id: accessToken.sub,
            name: accessToken.name,
            role: accessToken.role,
          },
        };
      }
    }
  } catch (error) {
    // 조작된 것으로 판단. 추후 refresh token rotate 방지
    cookieStore.set(ACCESS_TOKEN, INVALIDATED);
    console.error(error);
    return null;
  }

  return null;
};

export const rotateRefreshToken = async (request: NextRequest) => {
  const cookieStore = await cookies();
  const accessTokenHash = cookieStore.get(ACCESS_TOKEN)?.value;

  if (
    !request.nextUrl.pathname.startsWith("/api") &&
    accessTokenHash !== INVALIDATED
  ) {
    const nextUrl = new URL("/api/refresh", request.url);
    nextUrl.searchParams.set("from", request.nextUrl.pathname);

    return NextResponse.redirect(nextUrl);
  }

  return null;
};
