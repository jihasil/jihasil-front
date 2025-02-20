import { NextRequest, NextResponse } from "next/server";

import { dynamoClient } from "@/shared/lib/dynamo-db";
import { ScanCommand } from "@aws-sdk/lib-dynamodb";

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
