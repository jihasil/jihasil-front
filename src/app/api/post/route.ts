import { nanoid } from "nanoid";
import { forbidden, unauthorized } from "next/navigation";
import { NextRequest, NextResponse } from "next/server";

import { getPost } from "@/entities/post";
import { hasEnoughRole } from "@/entities/user";
import { getSession } from "@/features/request-sign-in";
import { dynamoClient } from "@/shared/lib/dynamo-db";
import { PostResponseDTO, metadataSchema } from "@/shared/types/post-types";
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
  const postInput = await req.json();

  const validatedPostResult = metadataSchema(postInput.thumbnail_url).safeParse(
    postInput,
  );

  if (validatedPostResult.error) {
    return new NextResponse(
      JSON.stringify({ message: validatedPostResult.error.message }),
      {
        status: 400,
      },
    );
  }

  const validatedPost = validatedPostResult.data;
  const { html, ...postMetadata } = validatedPost;

  const session = await getSession();
  if (!session) {
    forbidden();
  }

  // 글쓴이 이름은 관리자 이상만 변경 가능
  if (
    !hasEnoughRole("ROLE_ADMIN", session.user.role) &&
    postMetadata.author !== session.user.name
  ) {
    unauthorized();
  }

  postMetadata["is_deleted"] = false;

  if (postMetadata.post_id === undefined) {
    // 새로 생성
    const created_at = new Date().toISOString();
    postMetadata.board = "main";
    postMetadata.created_at = created_at;
    postMetadata.post_id = nanoid(10);
  }

  delete postMetadata.thumbnail_file;
  const metadataPutParam = {
    TableName: "post_metadata",
    Item: postMetadata,
  };

  const metadataPutQuery = new PutCommand(metadataPutParam);

  const contentPutParam = {
    TableName: "post_content",
    Item: {
      post_id: postMetadata.post_id,
      html: html,
    },
  };

  const contentPutQuery = new PutCommand(contentPutParam);

  try {
    // @ts-expect-error it works
    await dynamoClient.send(metadataPutQuery);

    // @ts-expect-error it works
    await dynamoClient.send(contentPutQuery);

    return new Response(JSON.stringify({ postId: postMetadata.post_id }), {
      status: 200,
    });
  } catch (error: any) {
    console.log(error);

    return new Response(JSON.stringify(`Unknown Error: ${error.name}`), {
      status: 500,
    });
  }
};
