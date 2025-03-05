import { forbidden, unauthorized } from "next/navigation";
import { NextRequest, NextResponse } from "next/server";

import { authService } from "@/app/(back)/application/model/auth-service";
import { userService } from "@/app/(back)/application/model/user-service";
import {
  UserEditRequestDTO,
  UserKey,
  UserSignUpRequestDTO,
  signUpSchema,
} from "@/app/global/types/user-types";
import { ConditionalCheckFailedException } from "@aws-sdk/client-dynamodb";

export const POST = async (req: NextRequest) => {
  const session = await authService.getSession();
  if (!session) {
    unauthorized();
  } else if (!session.user.hasEnoughRole("ROLE_SUPERUSER")) {
    forbidden();
  }

  const body: UserSignUpRequestDTO = await req.json();

  const signUpValidation = signUpSchema.safeParse(body);
  if (signUpValidation.error) {
    return new NextResponse(
      JSON.stringify({ message: signUpValidation.error }),
      {
        status: 400,
      },
    );
  }

  try {
    await userService.userSignUp(signUpValidation.data);

    return new NextResponse(
      JSON.stringify({ message: `${body.name} 사용자를 추가했습니다.` }),
      {
        status: 200,
      },
    );
  } catch (e: any) {
    if (e instanceof ConditionalCheckFailedException) {
      return new NextResponse(
        JSON.stringify({ message: "이미 있는 ID입니다." }),
        {
          status: 400,
        },
      );
    } else {
      return new NextResponse(
        JSON.stringify({ message: `사용자 추가에 실패했습니다.` }),
        {
          status: 500,
        },
      );
    }
  }
};

export const PATCH = async (req: NextRequest) => {
  const userEditRequest: UserEditRequestDTO = await req.json();
  const session = await authService.getSession();

  if (!session) {
    return new NextResponse(JSON.stringify({ message: "권한이 없습니다." }), {
      status: 401,
    });
  }

  // 슈퍼유저만 다른 사용자 정보 수정 가능
  if (
    session.user.info.role !== "ROLE_SUPERUSER" &&
    session.user.info.id !== userEditRequest.id
  ) {
    return new NextResponse(JSON.stringify({ message: "권한이 없습니다." }), {
      status: 403,
    });
  }

  if (userEditRequest.password) {
    return new NextResponse(
      JSON.stringify({
        message: "비밀번호 변경은 POST /user/password 를 사용하세요.",
      }),
      {
        status: 400,
      },
    );
  }

  try {
    await userService.editUserById(userEditRequest);
    return new NextResponse(
      JSON.stringify({
        message: `사용자 ${userEditRequest.id}의 정보가 수정됐습니다.`,
      }),
      {
        status: 200,
      },
    );
  } catch (e) {
    console.error(e);
    return new NextResponse(
      JSON.stringify({
        message: `사용자 ${userEditRequest.id}의 정보를 수정할 수 없습니다.`,
      }),
      {
        status: 500,
      },
    );
  }
};

export const DELETE = async (req: NextRequest) => {
  const userKey: UserKey = await req.json();

  const result = await userService.deleteUserById(userKey);

  try {
    if (result) {
      return new NextResponse(
        JSON.stringify({ message: `${userKey.id} 사용자를 삭제했습니다.` }),
        {
          status: 200,
        },
      );
    } else {
      return new NextResponse(
        JSON.stringify({ message: "삭제할 수 없는 사용자입니다." }),
        {
          status: 400,
        },
      );
    }
  } catch (e) {
    console.error(e);

    return new NextResponse(
      JSON.stringify({
        message: `${userKey.id} 사용자를 삭제하는 데 실패했습니다.`,
      }),
      {
        status: 500,
      },
    );
  }
};
