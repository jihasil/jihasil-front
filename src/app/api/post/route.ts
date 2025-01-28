import { NextRequest } from "next/server";
import { v4 } from "uuid";

import { PostInput, getPost } from "@/app/utils/post";
import { auth } from "@/auth";
import { dynamoClient } from "@/lib/dynamo-db";
import { PutCommand, QueryCommand } from "@aws-sdk/lib-dynamodb";

export const GET = async (req: NextRequest) => {
  console.log(req.nextUrl.searchParams);

  // uuid 딸린 게시물 하나
  if (
    req.nextUrl.searchParams.size === 1 &&
    req.nextUrl.searchParams.has("postUuid")
  ) {
    const postUuid = req.nextUrl.searchParams.get("postUuid") as string;
    const post = await getPost(postUuid);
    if (!post) {
      return new Response(null, {
        status: 404,
      });
    } else {
      return new Response(JSON.stringify(post), {
        status: 200,
      });
    }
  }

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

export const POST = async (req: NextRequest) => {
  const session = await auth();
  if (!session?.user) {
    return new Response("로그인하시거나 개발자에게 연락하세요", {
      status: 403,
    });
  }

  const postInput: PostInput = await req.json();
  postInput.metadata["is_deleted"] = false;

  if (postInput.metadata.post_uuid === undefined) {
    // 새로 생성
    const created_at = new Date().toISOString();
    const issue_id = postInput.metadata.issue_id;
    postInput.metadata["partition_key"] = "all_posts";
    postInput.metadata["created_at#issue_id"] = `${created_at}#${issue_id}`;
    postInput.metadata.post_uuid = v4();
  }

  delete postInput.metadata.thumbnail_file;
  const metadataPutParam = {
    TableName: "post",
    Item: postInput.metadata,
  };

  const metadataPutQuery = new PutCommand(metadataPutParam);

  const contentPutParam = {
    TableName: "post-content",
    Item: {
      post_uuid: postInput.metadata.post_uuid,
      html: postInput.html,
    },
  };

  const contentPutQuery = new PutCommand(contentPutParam);

  try {
    // @ts-expect-error it works
    await dynamoClient.send(metadataPutQuery);

    // @ts-expect-error it works
    await dynamoClient.send(contentPutQuery);

    return new Response(
      JSON.stringify({ uuid: postInput.metadata.post_uuid }),
      {
        status: 200,
      },
    );
  } catch (error: any) {
    console.log(error);

    return new Response(JSON.stringify(`Unknown Error: ${error.name}`), {
      status: 500,
    });
  }
};
