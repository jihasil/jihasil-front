import { NextRequest, NextResponse } from "next/server";

import { postService } from "@/app/(back)/application/model/post-service";

export const GET = async (
  req: NextRequest,
  { params }: { params: Promise<{ postId: string }> },
) => {
  const { postId } = await params;

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

export const DELETE = async (
  req: NextRequest,
  { params }: { params: Promise<{ postId: string }> },
) => {
  const { postId } = await params;

  console.log(`${postId} 삭제`);

  const result = await postService.deletePostById(postId);

  if (result) {
    return new NextResponse(
      JSON.stringify({ message: `게시글이 삭제되었습니다.` }),
      {
        status: 200,
      },
    );
  } else {
    return new NextResponse(
      JSON.stringify({ message: `이미 삭제된 게시글입니다.` }),
      {
        status: 400,
      },
    );
  }
};
