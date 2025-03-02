import { NextRequest, NextResponse } from "next/server";

import { postService } from "@/app/(back)/application/model/post-service";

export const GET = async (
  req: NextRequest,
  params: Promise<{ postId: string }>,
) => {
  const postId = (await params).postId;
  const post = await postService.getPostById(postId);

  if (!post) {
    return new NextResponse(null, {
      status: 404,
    });
  } else {
    return new NextResponse(JSON.stringify(post.toPostResponseDTO()), {
      status: 200,
    });
  }
};
