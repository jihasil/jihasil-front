import { forbidden, unauthorized } from "next/navigation";
import { NextRequest, NextResponse } from "next/server";

import { changeUserInfo, hasEnoughRole } from "@/entities/user";
import { getSession } from "@/features/request-sign-in";
import { saltAndHashPassword } from "@/shared/lib/crypto";
import { dynamoClient } from "@/shared/lib/dynamo-db";
import {
  UserEditRequestDTO,
  UserKey,
  UserSignUpRequestDTO,
  signUpSchema,
} from "@/shared/types/user-types";
import { ConditionalCheckFailedException } from "@aws-sdk/client-dynamodb";
import { DeleteCommand, PutCommand } from "@aws-sdk/lib-dynamodb";

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

  const { id, name, password, role } = signUpValidation.data;

  const passwordHash = await saltAndHashPassword(password);

  const param = {
    TableName: "user",
    Item: {
      id,
      name,
      password: passwordHash,
      role,
    },
    ConditionExpression: "attribute_not_exists(id)",
    ReturnValuesOnConditionCheckFailure: "ALL_OLD",
  };

  // @ts-expect-error it works
  const query = new PutCommand(param);

  console.log(query);

  try {
    await dynamoClient.send(query);
    return new NextResponse(
      JSON.stringify({ message: `${body.name} 사용자를 추가했습니다.` }),
      {
        status: 200,
      },
    );
  } catch (error: any) {
    console.log(error);

    if (error.name === "ConditionalCheckFailedException") {
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

  try {
    const succeed = await changeUserInfo(userEditRequest);
    if (succeed) {
      return new NextResponse(
        JSON.stringify({
          message: `사용자 ${userEditRequest.id}의 정보가 수정됐습니다.`,
        }),
        {
          status: 200,
        },
      );
    } else {
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

  const param = {
    TableName: "user",
    Key: userKey,
    ConditionExpression: "#role <> :role",
    ExpressionAttributeNames: {
      "#role": "role",
    },
    ExpressionAttributeValues: {
      ":role": "ROLE_SUPERUSER",
    },
  };

  const query = new DeleteCommand(param);

  try {
    await dynamoClient.send(query);
    return new NextResponse(
      JSON.stringify({ message: `${userKey.id} 사용자를 삭제했습니다.` }),
      {
        status: 200,
      },
    );
  } catch (error: any) {
    console.error(error);
    if (error instanceof ConditionalCheckFailedException) {
      return new NextResponse(
        JSON.stringify({ message: "슈퍼유저는 삭제할 수 없습니다." }),
        {
          status: 400,
        },
      );
    }

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
