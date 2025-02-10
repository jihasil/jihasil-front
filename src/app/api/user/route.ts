import { NextRequest, NextResponse } from "next/server";

import { saltAndHashPassword } from "@/app/utils/user";
import { dynamoClient } from "@/lib/dynamo-db";
import { PutCommand, ScanCommand } from "@aws-sdk/lib-dynamodb";

type UserSignUpRequest = {
  id: string;
  name: string;
  password: string;
  role?: string;
};

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
  const body: UserSignUpRequest = await req.json();
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

export const PUT = async (req: NextRequest) => {
  const body: UserSignUpRequest = await req.json();

  const param = {
    TableName: "user",
    Item: body,
  };

  const query = new PutCommand(param);

  console.log(query);

  try {
    // @ts-expect-error it works
    await dynamoClient.send(query);
    return new Response(JSON.stringify(`${body.id} 정보가 수정됨`), {
      status: 200,
    });
  } catch (error: any) {
    console.log(error);
    return new Response(JSON.stringify(`Unknown Error: ${error.name}`), {
      status: 500,
    });
  }
};
