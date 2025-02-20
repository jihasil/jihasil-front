import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { NextRequest, NextResponse } from "next/server";

import { ACCESS_TOKEN, INVALIDATED, REFRESH_TOKEN } from "@/shared/const/auth";
import {
  generateTokenPair,
  getUserFromRefreshToken,
  setCookiesWithToken,
} from "@/shared/lib/auth";

export const GET = async (req: NextRequest) => {
  let rotateSuccess = false;

  try {
    console.log("refreshing token!");

    const refreshTokenHash = req.cookies.get(REFRESH_TOKEN)?.value;

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

  const noRedirect = req.nextUrl.searchParams.get("noRedirect") === "true";

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
    cookieStore.set(ACCESS_TOKEN, INVALIDATED);
  }

  redirect(redirectTo);
};
