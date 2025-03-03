import { forbidden, unauthorized } from "next/navigation";
import { NextRequest, NextResponse } from "next/server";

import { authService } from "@/app/(back)/application/model/auth-service";
import { postService } from "@/app/(back)/application/model/post-service";
import { IssueUnion } from "@/app/global/enum/issue";
import {
  CreatePostRequestDTO,
  metadataSchema,
} from "@/app/global/types/post-types";

export const GET = async (req: NextRequest) => {
  console.log(req.nextUrl.searchParams);

  const lastKeyJson = req.nextUrl.searchParams.get("lastKey");
  const lastKey = lastKeyJson ? JSON.parse(lastKeyJson) : null;

  const issueId = req.nextUrl.searchParams.get("issueId");
  const pageSize = Number(req.nextUrl.searchParams.get("pageSize") ?? 10);

  let filter;

  try {
    filter = {
      ...(issueId && {
        issue_id: issueId as IssueUnion,
      }),
    };
  } catch (e) {
    console.error(e);
    return new NextResponse(JSON.stringify({ message: "잘못된 필터입니다." }), {
      status: 400,
    });
  }

  const postEntryList = await postService.getPostEntryListByFilter(
    {
      pageSize,
      lastKey,
    },
    filter,
  );

  if (postEntryList) {
    return new Response(JSON.stringify(postEntryList), {
      status: 200,
    });
  } else {
    return new Response(
      JSON.stringify({ message: "게시글을 불러오는데 실패했습니다." }),
      {
        status: 500,
      },
    );
  }
};

export const POST = async (req: NextRequest) => {
  const postInput = (await req.json()) as CreatePostRequestDTO;

  const validatedPostResult = metadataSchema(postInput.thumbnailUrl).safeParse(
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

  const session = await authService.getSession();
  if (!session) {
    unauthorized();
  }

  // 글쓴이 이름은 관리자 이상만 변경 가능
  // 다른 유저의 글 수정은 슈퍼유저만 가능
  if (
    (!session.user.hasEnoughRole("ROLE_ADMIN") &&
      validatedPost.author !== session.user.info.name) ||
    (!session.user.hasEnoughRole("ROLE_SUPERUSER") &&
      validatedPost.userId !== session.user.info.id)
  ) {
    forbidden();
  }

  try {
    const postId = await postService.createPost(validatedPost);
    return new Response(JSON.stringify(postId), {
      status: 200,
    });
  } catch (e) {
    console.error(e);
    return new Response(
      JSON.stringify({ message: "게시글을 저장하는데 실패했습니다." }),
      {
        status: 500,
      },
    );
  }
};
