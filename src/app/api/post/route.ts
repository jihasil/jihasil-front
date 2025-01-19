import { NextRequest } from "next/server";

import { dynamoClient } from "@/lib/dynamo-db";
import { QueryCommand } from "@aws-sdk/lib-dynamodb";

type Post = {
  title: string | null;
  issue_id: string;
  imageUrl: string;
  "created_at#issue_id": string;
};

type LastPostKey = {
  "created_at#issue_id": string;
  partition_key: string;
};

type PostResponseDTO = {
  posts: Post[];
  isLast: boolean;
  LastEvaluatedKey: LastPostKey;
};

export const GET = async (req: NextRequest) => {
  console.log(req.nextUrl.searchParams);

  const lastPostKeyJson = req.nextUrl.searchParams.get("lastPostKey");
  const lastPostKey = lastPostKeyJson ? JSON.parse(lastPostKeyJson) : null;

  const issueId = req.nextUrl.searchParams.get("issueId") ?? null;
  const pageSize = Number(req.nextUrl.searchParams.get("pageSize") ?? 10);

  const param = {
    TableName: "post",
    Limit: pageSize,
    ...(issueId !== null
      ? {
          IndexName: "issue_id_index",
          KeyConditionExpression: "issue_id = :issue_id",
          ExpressionAttributeValues: {
            ":issue_id": issueId,
          },
        }
      : {
          KeyConditionExpression: "partition_key = :partition_key",
          ExpressionAttributeValues: {
            ":partition_key": "all_posts",
          },
        }),
    ScanIndexForward: false,
    ...(lastPostKey !== null && { ExclusiveStartKey: lastPostKey }),
  };

  console.log(param);

  const command = new QueryCommand(param);

  try {
    // @ts-expect-error 타입을 일일히 지정할 수 없음
    const { Items, LastEvaluatedKey } = await dynamoClient.send(command);
    console.log(Items);

    const data = {
      posts: Items, // 포스트 목록
      isLast: !LastEvaluatedKey, // 더 이상 데이터가 없는지 여부
      LastEvaluatedKey,
    };

    return new Response(JSON.stringify(data), {
      status: 200,
    });
  } catch (error) {
    console.error("Error fetching posts:", error);
    return new Response(JSON.stringify("error!"), {
      status: 500,
    });
  }
};

export type { Post, PostResponseDTO, LastPostKey };
