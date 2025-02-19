import { NextRequest, NextResponse } from "next/server";

import {
  generateTokenPair,
  getUserFromRefreshToken,
  setCookiesWithToken,
} from "@/shared/lib/auth";

export const POST = async (req: NextRequest) => {
  try {
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

    return new NextResponse(
      JSON.stringify({ message: `토큰이 발급됐습니다.` }),
      {
        status: 200,
      },
    );
  } catch (error: any) {
    if (error?.message === "AuthenticationError") {
      return new NextResponse(
        JSON.stringify({ message: "유효하지 않은 토큰입니다." }),
        {
          status: 401,
        },
      );
    }
    return new NextResponse(
      JSON.stringify({ message: "로그인에 실패하였습니다." }),
      {
        status: 500,
      },
    );
  }
};
