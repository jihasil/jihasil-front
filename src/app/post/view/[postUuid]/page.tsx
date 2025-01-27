import Link from "next/link";
import { notFound } from "next/navigation";
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

  const post = await getPost(postUuid);
  if (!post) {
    notFound();
  }

  console.log(postUuid);
  console.log(post);

  return (
    <div className="grid lg:grid-cols-12 md:grid-cols-8 grid-cols-4 gap-3 w-full">
      <div className="lg:col-span-3 md:col-span-2 col-span-4 flex flex-col gap-5">
        <PostThumbnail metadata={post.metadata} />
        {session?.user ? (
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
        ) : null}
      </div>
      <div className="lg:col-span-9 md:col-span-6 col-span-4">
        <div
          id="post-content"
          dangerouslySetInnerHTML={{
            __html: post.html,
          }}
        />
      </div>
    </div>
  );
}
