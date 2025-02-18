import { NextRequest, NextResponse } from "next/server";

import {
  authorizeUser,
  generateTokenPair,
  setCookiesWithToken,
} from "@/shared/lib/auth";
import { UserSignInRequestDTO } from "@/shared/types/user-types";

export const POST = async (nextRequest: NextRequest) => {
  const credentials: UserSignInRequestDTO = await nextRequest.json();

  try {
    const user = await authorizeUser(credentials);

    if (!user) {
      throw new Error("AuthenticationError");
    }

    const tokenPair = await generateTokenPair(user);
    if (!tokenPair) {
      throw new Error("AuthenticationError");
    }

    await setCookiesWithToken(tokenPair);

    return new NextResponse(
      JSON.stringify({ message: `환영합니다. ${user.name} 님` }),
      {
        status: 200,
      },
    );
  } catch (e: any) {
    console.error(e);

    if (e?.message === "AuthenticationError") {
      return new NextResponse(
        JSON.stringify({ message: "아이디나 비밀번호를 확인해주세요." }),
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
