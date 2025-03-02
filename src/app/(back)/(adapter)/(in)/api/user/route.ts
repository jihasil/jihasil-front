import { forbidden, unauthorized } from "next/navigation";
import { NextRequest, NextResponse } from "next/server";

import { getSession } from "@/app/(back)/application/model/request-sign-in";
import { userService } from "@/app/(back)/application/model/user-service";
import { hasEnoughRole } from "@/app/(back)/domain/user";
import {
  UserEditRequestDTO,
  UserKey,
  UserSignUpRequestDTO,
  signUpSchema,
} from "@/app/global/types/user-types";
import { ConditionalCheckFailedException } from "@aws-sdk/client-dynamodb";

export const POST = async (req: NextRequest) => {
  const session = await getSession();
  if (!session) {
    unauthorized();
  } else if (!hasEnoughRole("ROLE_SUPERUSER", session.user.role)) {
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

  const userIdOrError = await userService.userSignUp(signUpValidation.data);

  if (userIdOrError?.id) {
    return new NextResponse(
      JSON.stringify({ message: `${body.name} 사용자를 추가했습니다.` }),
      {
        status: 200,
      },
    );
  } else if (userIdOrError.name === "ConditionalCheckFailedException") {
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
};

export const PATCH = async (req: NextRequest) => {
  const userEditRequest: UserEditRequestDTO = await req.json();
  const session = await getSession();

  // 슈퍼유저만 다른 사용자 정보 수정 가능
  if (
    session?.user.role !== "ROLE_SUPERUSER" &&
    session?.user.id !== userEditRequest.id
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
    const succeedOrError = await userService.editUserById(userEditRequest);
    if (succeedOrError === true) {
      return new NextResponse(
        JSON.stringify({
          message: `사용자 ${userEditRequest.id}의 정보가 수정됐습니다.`,
        }),
        {
          status: 200,
        },
      );
    } else {
      console.error(succeedOrError);
      return new NextResponse(
        JSON.stringify({
          message: `사용자 ${userEditRequest.id}의 정보를 수정할 수 없습니다.`,
        }),
        {
          status: 400,
        },
      );
    }
  } catch (error: any) {
    console.log(error);
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

  try {
    const succeedOrError = await userService.deleteUserById(userKey);

    if (succeedOrError === true) {
      return new NextResponse(
        JSON.stringify({ message: `${userKey.id} 사용자를 삭제했습니다.` }),
        {
          status: 200,
        },
      );
    } else if (succeedOrError instanceof ConditionalCheckFailedException) {
      return new NextResponse(
        JSON.stringify({ message: "슈퍼유저는 삭제할 수 없습니다." }),
        {
          status: 400,
        },
      );
    }
  } catch (error: any) {
    console.error(error);

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
