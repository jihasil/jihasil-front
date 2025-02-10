import { nanoid } from "nanoid";
import { NextRequest } from "next/server";

import { PostInput, PostResponseDTO, getPost } from "@/app/utils/post";
import { dynamoClient } from "@/lib/dynamo-db";
import { PutCommand, QueryCommand } from "@aws-sdk/lib-dynamodb";

export const GET = async (req: NextRequest) => {
  console.log(req.nextUrl.searchParams);

  // uuid 딸린 게시물 하나의 metadata
  if (
    req.nextUrl.searchParams.size === 1 &&
    req.nextUrl.searchParams.has("post_id")
  ) {
    const postId = req.nextUrl.searchParams.get("post_id") as string;
    const post = await getPost(postId);
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

  // 전체 metadata
  const lastPostKeyJson = req.nextUrl.searchParams.get("lastKey");
  const lastPostKey = lastPostKeyJson ? JSON.parse(lastPostKeyJson) : null;

  const issueId = req.nextUrl.searchParams.get("issueId") ?? null;
  const pageSize = Number(req.nextUrl.searchParams.get("pageSize") ?? 10);

  const param = {
    TableName: "post_metadata",
    Limit: pageSize,
    ...(issueId !== null
      ? {
          IndexName: "index_issue_id",
          KeyConditionExpression: "issue_id = :issue_id",
          ExpressionAttributeValues: {
            ":issue_id": issueId,
          },
        }
      : {
          KeyConditionExpression: "board = :board",
          ExpressionAttributeValues: {
            ":board": "main",
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

    const data: PostResponseDTO = {
      postMetadataList: Items, // 포스트 목록
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
  const postInput: PostInput = await req.json();
  postInput.metadata["is_deleted"] = false;

  if (postInput.metadata.post_id === undefined) {
    // 새로 생성
    const created_at = new Date().toISOString();
    postInput.metadata.board = "main";
    postInput.metadata.created_at = created_at;
    postInput.metadata.post_id = nanoid(10);
  }

  delete postInput.metadata.thumbnail_file;
  const metadataPutParam = {
    TableName: "post_metadata",
    Item: postInput.metadata,
  };

  const metadataPutQuery = new PutCommand(metadataPutParam);

  const contentPutParam = {
    TableName: "post_content",
    Item: {
      post_id: postInput.metadata.post_id,
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
      JSON.stringify({ postId: postInput.metadata.post_id }),
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
