import { redirect } from "next/navigation";
import { NextRequest, NextResponse } from "next/server";

import { authService } from "@/app/(back)/application/model/auth-service";
import { REFRESH_TOKEN } from "@/app/(back)/shared/const/auth";

export const GET = async (req: NextRequest) => {
  let rotateSuccess = false;

  const refreshTokenHash = req.cookies.get(REFRESH_TOKEN)?.value;

  if (!refreshTokenHash) {
    await authService.invalidateAccessToken();
  } else {
    rotateSuccess = await authService.rotateTokenPair(refreshTokenHash);
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

  redirect(redirectTo);
};
