import { NextRequest, NextResponse } from "next/server";

import { changeUserInfo } from "@/entities/user";
import { getSession } from "@/features/request-sign-in";
import { saltAndHashPassword } from "@/shared/lib/crypto";
import { dynamoClient } from "@/shared/lib/dynamo-db";
import {
  UserEditRequestDTO,
  UserKey,
  UserSignUpRequestDTO,
} from "@/shared/types/user-types";
import { ConditionalCheckFailedException } from "@aws-sdk/client-dynamodb";
import { DeleteCommand, PutCommand } from "@aws-sdk/lib-dynamodb";

export const POST = async (req: NextRequest) => {
  const body: UserSignUpRequestDTO = await req.json();
  body.password = await saltAndHashPassword(body.password);
  body.role = "ROLE_USER";

  const param = {
    TableName: "user",
    Item: body,
    ConditionExpression: "attribute_not_exists(id)",
    ReturnValuesOnConditionCheckFailure: "ALL_OLD",
  };

  // @ts-expect-error it works
  const query = new PutCommand(param);

  console.log(query);

  try {
    // @ts-expect-error it works
    await dynamoClient.send(query);
    return new NextResponse(JSON.stringify(`환영합니다, ${body.name} 님!`), {
      status: 200,
    });
  } catch (error: any) {
    console.log(error);

    if (error.name === "ConditionalCheckFailedException") {
      return new NextResponse(JSON.stringify(`이미 있는 아이디입니다.`), {
        status: 400,
      });
    } else {
      return new NextResponse(JSON.stringify(`Unknown Error: ${error.name}`), {
        status: 500,
      });
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
    return new NextResponse("권한이 없습니다.", {
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
    // @ts-expect-error it works
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
