import { nanoid } from "nanoid";
import { forbidden, unauthorized } from "next/navigation";
import { NextRequest, NextResponse } from "next/server";

import { getSession } from "@/app/(back)/application/model/request-sign-in";
import { postService } from "@/app/(back)/domain/post-service";
import { hasEnoughRole } from "@/app/(back)/domain/user";
import { dynamoClient } from "@/app/(back)/shared/lib/dynamo-db";
import {
  PostKey,
  PostMetadata,
  PostResponseDTO,
  metadataSchema,
} from "@/app/global/types/post-types";
import { PutCommand, QueryCommand } from "@aws-sdk/lib-dynamodb";

export const GET = async (
  req: NextRequest,
  params: Promise<{ postId: string }>,
) => {
  const postId = (await params).postId;
  const post = await postService.getPostById(postId);
  if (!post) {
    return new Response(null, {
      status: 404,
    });
  } else {
    return new Response(JSON.stringify(post), {
      status: 200,
    });
  }
};
