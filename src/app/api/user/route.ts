import { NextRequest, NextResponse } from "next/server";

import { changeUserInfo } from "@/entities/user";
import { saltAndHashPassword } from "@/shared/lib/crypto";
import { dynamoClient } from "@/shared/lib/dynamo-db";
import {
  UserEditRequestDTO,
  UserKey,
  UserSignUpRequestDTO,
} from "@/shared/types/user-types";
import { ConditionalCheckFailedException } from "@aws-sdk/client-dynamodb";
import { DeleteCommand, PutCommand, ScanCommand } from "@aws-sdk/lib-dynamodb";

export const GET = async (nextRequest: NextRequest) => {
  const pageSize = Number(
    nextRequest.nextUrl.searchParams.get("pageSize") ?? 10,
  );

  const lastKeyJson = nextRequest.nextUrl.searchParams.get("lastKey");
  const lastKey = lastKeyJson ? JSON.parse(lastKeyJson) : null;

  const param = {
    TableName: "user",
    Limit: pageSize,
    ProjectionExpression: "id, #username, #role",
    ExpressionAttributeNames: {
      "#username": "name",
      "#role": "role",
    },
    ...(lastKey !== null && { ExclusiveStartKey: lastKey }),
  };

  console.log(param);

  const query = new ScanCommand(param);

  try {
    // @ts-expect-error dynamo db
    const { Items, LastEvaluatedKey } = await dynamoClient.send(query);

    return new NextResponse(
      JSON.stringify({
        users: Items,
        isLast: !LastEvaluatedKey,
        LastEvaluatedKey,
      }),
      {
        status: 200,
      },
    );
  } catch (error) {
    console.log(error);
    return new NextResponse(JSON.stringify("오류가 발생했습니다."), {
      status: 500,
    });
  }
};

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
    return new Response(JSON.stringify(`환영합니다, ${body.name} 님!`), {
      status: 200,
    });
  } catch (error: any) {
    console.log(error);

    if (error.name === "ConditionalCheckFailedException") {
      return new Response(JSON.stringify(`이미 있는 아이디입니다.`), {
        status: 400,
      });
    } else {
      return new Response(JSON.stringify(`Unknown Error: ${error.name}`), {
        status: 500,
      });
    }
  }
};

export const PATCH = async (req: NextRequest) => {
  const userEditRequest: UserEditRequestDTO = await req.json();

  try {
    const succeed = await changeUserInfo(userEditRequest);
    if (succeed) {
      return new Response(
        JSON.stringify({
          message: `사용자 ${userEditRequest.id}의 정보가 수정됐습니다.`,
        }),
        {
          status: 200,
        },
      );
    } else {
      return new Response(
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
    return new Response(
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
    return new Response(
      JSON.stringify({ message: `${userKey.id} 사용자를 삭제했습니다.` }),
      {
        status: 200,
      },
    );
  } catch (error: any) {
    console.error(error);
    if (error instanceof ConditionalCheckFailedException) {
      return new Response(
        JSON.stringify({ message: "슈퍼유저는 삭제할 수 없습니다." }),
        {
          status: 400,
        },
      );
    }

    return new Response(
      JSON.stringify({
        message: `${userKey.id} 사용자를 삭제하는 데 실패했습니다.`,
      }),
      {
        status: 500,
      },
    );
  }
};
