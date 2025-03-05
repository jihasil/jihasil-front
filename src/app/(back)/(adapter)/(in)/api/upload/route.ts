import { NextRequest } from "next/server";

import { postService } from "@/app/(back)/application/model/post-service";

export const POST = async (req: NextRequest): Promise<Response> => {
  const { filename, contentType } = await req.json();
  const body = await postService.uploadThumbnail(filename, contentType);
  if (body) {
    return new Response(JSON.stringify(body), {
      status: 200,
    });
  } else {
    return new Response(
      JSON.stringify({ message: "썸네일 업로드에 실패했습니다." }),
      {
        status: 500,
      },
    );
  }
};
