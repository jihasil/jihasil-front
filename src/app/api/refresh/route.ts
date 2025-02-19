import { cookies } from "next/headers";
import { permanentRedirect, redirect } from "next/navigation";
import { NextRequest, NextResponse } from "next/server";

import {
  generateTokenPair,
  getUserFromRefreshToken,
  setCookiesWithToken,
} from "@/shared/lib/auth";

export const GET = async (req: NextRequest) => {
  let rotateSuccess = false;

  try {
    console.log("refreshing token!");

    const refreshTokenHash = req.cookies.get("refreshToken")?.value;

    if (!refreshTokenHash) {
      throw new Error("AuthenticationError");
    }

    const user = await getUserFromRefreshToken(refreshTokenHash);

    if (!user) {
      throw new Error("AuthenticationError");
    }

    const tokenPair = await generateTokenPair(user);
    if (!tokenPair) {
      throw new Error("AuthenticationError");
    }

    await setCookiesWithToken(tokenPair);
    rotateSuccess = true;
  } catch (error: any) {
    console.error(error);
  }

  const noRedirect = Boolean(
    req.nextUrl.searchParams.get("noRedirect") ?? "false",
  );

  if (noRedirect) {
    if (rotateSuccess) {
      return new NextResponse(null, { status: 204 });
    } else {
      return new NextResponse(null, { status: 401 });
    }
  }

  const redirectTo = req.nextUrl.searchParams.get("from") ?? "/";
  console.log(redirectTo);

  if (!rotateSuccess) {
    const cookieStore = await cookies();
    cookieStore.set("accessToken", "invalidated");
  }

  redirect(redirectTo);
};
