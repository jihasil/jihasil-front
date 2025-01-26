import Link from "next/link";
import Script from "next/script";

import { getPost } from "@/app/utils/post";
import { auth } from "@/auth";
import { Button } from "@/components/ui/button";
import { PostThumbnail } from "@/components/ui/post-thumbnail";

export default async function PageViewer({
  params,
}: {
  params: Promise<{ postUuid: string }>;
}) {
  const postUuid = (await params).postUuid;
  const session = await auth();

  // TODO: uuid 로 글 받아오기
  const post = await getPost(postUuid);
  console.log(postUuid);
  console.log(post);

  return (
    <div className="grid lg:grid-cols-12 md:grid-cols-8 grid-cols-4 gap-3 w-full">
      {session?.user ? (
        <div className="col-span-1 lg:col-start-12 md:col-start-8 col-start-4">
          <Link
            href={{
              pathname: "/post/edit",
              query: {
                postUuid: postUuid,
              },
            }}
          >
            <Button className="w-full">수정</Button>
          </Link>
        </div>
      ) : null}
      <div className="lg:col-span-3 md:col-span-2 col-span-4">
        <PostThumbnail metadata={post?.metadata} />
      </div>
      <div className="w-full lg:col-span-9 md:col-span-6 col-span-4">
        <div
          id="post-content"
          dangerouslySetInnerHTML={{
            __html: post?.html,
          }}
        />
      </div>
    </div>
  );
}
