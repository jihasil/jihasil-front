import { NextRequest } from "next/server";

import { saltAndHashPassword } from "@/app/utils/password";
import { dynamoClient } from "@/lib/dynamo-db";
import { PutCommand, QueryCommand } from "@aws-sdk/lib-dynamodb";

type UserSignUpRequest = {
  id: string;
  name: string;
  password: string;
};

export const GET = async (req: NextRequest) => {
  const id = req.nextUrl.searchParams.get("id");

  const param = {
    TableName: "user",
    KeyConditionExpression: "id = :id",
    ExpressionAttributeValues: {
      ":id": id,
    },
  };

  const command = new QueryCommand(param);
  console.log(command);

  try {
    // @ts-expect-error asdf
    const { Items } = await dynamoClient.send(command);
    console.log(Items);

    if (!Items || Items.length !== 1) {
      return new Response(
        JSON.stringify(`Unique user for ID ${id} not found`),
        {
          status: 404,
        },
      );
    } else {
      return new Response(JSON.stringify(Items[0]), {
        status: 200,
      });
    }
  } catch (error) {
    console.log(error);
    return new Response(JSON.stringify(error), { status: 500 });
  }
};

export const POST = async (req: NextRequest) => {
  const body: UserSignUpRequest = await req.json();

  body.password = await saltAndHashPassword(body.password);

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
      return new Response(JSON.stringify(`${error.Item.id} already exists`), {
        status: 400,
      });
    } else {
      return new Response(JSON.stringify(`Unknown Error: ${error.name}`), {
        status: 500,
      });
    }
  }
};
