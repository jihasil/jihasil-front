import { NextRequest, NextResponse } from "next/server";

import { getSession } from "@/app/(back)/application/model/request-sign-in";
import { userService } from "@/app/(back)/application/model/user-service";
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

  const session = await getSession();
  if (!session) {
    return new NextResponse(JSON.stringify({ message: "" }), {
      status: 401,
    });
  }

  const validatedChangePasswordRequest = changePasswordRequestValidation.data;

  if (
    session.user.role !== "ROLE_SUPERUSER" &&
    session.user.id !== validatedChangePasswordRequest.id
  ) {
    return new NextResponse(JSON.stringify({ message: "권한이 부족합니다." }), {
      status: 403,
    });
  }

  try {
    const succeedOrError = await userService.changePassword(
      validatedChangePasswordRequest,
    );

    const { id } = validatedChangePasswordRequest;

    if (succeedOrError === true) {
      if (session.user.id === id) {
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
    } else {
      return new NextResponse(
        JSON.stringify({ message: "비밀번호를 변경할 수 없습니다." }),
        {
          status: 400,
        },
      );
    }
  } catch (error) {
    console.error(error);
    return new NextResponse(
      JSON.stringify({ message: "비밀번호를 변경할 수 없습니다." }),
      {
        status: 500,
      },
    );
  }
};
