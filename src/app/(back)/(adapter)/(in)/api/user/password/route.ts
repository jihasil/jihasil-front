import { NextRequest, NextResponse } from "next/server";

import { authService } from "@/app/(back)/application/model/auth-service";
import { userService } from "@/app/(back)/application/model/user-service";
import { AuthenticationException } from "@/app/(back)/shared/error/exception";
import { changePasswordSchema } from "@/app/global/types/user-types";

export const POST = async (req: NextRequest) => {
  const changePasswordRequest = await req.json();

  const changePasswordRequestValidation = changePasswordSchema.safeParse(
    changePasswordRequest,
  );

  if (changePasswordRequestValidation.error) {
    return new NextResponse(
      JSON.stringify({
        message: changePasswordRequestValidation.error.message,
      }),
      {
        status: 400,
      },
    );
  }

  const session = await authService.getSession();
  if (!session) {
    return new NextResponse(
      JSON.stringify({ message: "로그인 후 다시 시도해주세요." }),
      {
        status: 401,
      },
    );
  }

  const validatedChangePasswordRequest = changePasswordRequestValidation.data;

  if (
    session.user.info.role !== "ROLE_SUPERUSER" &&
    session.user.info.id !== validatedChangePasswordRequest.id
  ) {
    return new NextResponse(JSON.stringify({ message: "권한이 부족합니다." }), {
      status: 403,
    });
  }

  try {
    await userService.changePassword(validatedChangePasswordRequest);

    const { id } = validatedChangePasswordRequest;

    if (session.user.info.id === id) {
      return new NextResponse(
        JSON.stringify({
          message: "비밀번호를 변경했습니다. 다시 로그인해주세요.",
        }),
        {
          status: 200,
        },
      );
    } else {
      return new NextResponse(
        JSON.stringify({
          message: `${id} 사용자의 비밀번호를 변경했습니다.`,
        }),
        {
          status: 200,
        },
      );
    }
  } catch (error) {
    if (error instanceof AuthenticationException) {
      return new NextResponse(
        JSON.stringify({ message: "기존 비밀번호가 다릅니다." }),
        {
          status: 401,
        },
      );
    }
    console.error(error);
    return new NextResponse(
      JSON.stringify({ message: "비밀번호를 변경할 수 없습니다." }),
      {
        status: 500,
      },
    );
  }
};
