import { nanoid } from "nanoid";
import { forbidden, unauthorized } from "next/navigation";
import { NextRequest, NextResponse } from "next/server";

import { getSession } from "@/app/(back)/application/model/request-sign-in";
import { postService } from "@/app/(back)/domain/post-service";
import { hasEnoughRole } from "@/app/(back)/domain/user";
import { dynamoClient } from "@/app/(back)/shared/lib/dynamo-db";
import { IssueUnion } from "@/app/global/enum/issue";
import { metadataSchema } from "@/app/global/types/post-types";
import { PutCommand } from "@aws-sdk/lib-dynamodb";

export const GET = async (req: NextRequest) => {
  console.log(req.nextUrl.searchParams);

  const lastPostKeyJson = req.nextUrl.searchParams.get("lastKey");
  const lastPostKey = lastPostKeyJson ? JSON.parse(lastPostKeyJson) : null;

  const issueId = req.nextUrl.searchParams.get("issueId");
  const pageSize = Number(req.nextUrl.searchParams.get("pageSize") ?? 10);

  try {
    const postMetadataList = await postService.getPostMetadataListByFilter(
      {
        pageSize,
        lastKey: lastPostKey,
      },
      {
        ...(issueId && {
          issue_id: issueId as IssueUnion,
        }),
      },
    );

    return new Response(JSON.stringify(postMetadataList), {
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
    unauthorized();
  }

  // 글쓴이 이름은 관리자 이상만 변경 가능
  if (
    (!hasEnoughRole("ROLE_ADMIN", session.user.role) &&
      postMetadata.author !== session.user.name) ||
    (!hasEnoughRole("ROLE_SUPERUSER", session.user.role) &&
      postMetadata.user_id !== session.user.id)
  ) {
    forbidden();
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
    await dynamoClient.send(metadataPutQuery);
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
