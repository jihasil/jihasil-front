import { NextRequest } from "next/server";

import { saltAndHashPassword } from "@/app/utils/user";
import { dynamoClient } from "@/lib/dynamo-db";
import { PutCommand } from "@aws-sdk/lib-dynamodb";

type UserSignUpRequest = {
  id: string;
  name: string;
  password: string;
  role?: string;
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
