import { NextRequest, NextResponse } from "next/server";
import { ZodError } from "zod";

import {
  authorizeUser,
  generateTokenPair,
  setCookiesWithToken,
} from "@/shared/lib/auth";
import { UserSignInRequestDTO, signInSchema } from "@/shared/types/user-types";

export const POST = async (nextRequest: NextRequest) => {
  const credentials: UserSignInRequestDTO = await nextRequest.json();

  try {
    const validationResult = signInSchema.safeParse(credentials);
    if (!validationResult.success) {
      throw validationResult.error;
    }

    const validCredentials = validationResult.data;

    const user = await authorizeUser(validCredentials);

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
    } else if (e instanceof ZodError) {
      return new NextResponse(JSON.stringify({ message: e.message }), {
        status: 400,
      });
    }
    return new NextResponse(
      JSON.stringify({ message: "로그인에 실패하였습니다." }),
      {
        status: 500,
      },
    );
  }
};
