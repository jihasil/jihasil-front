import { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { getPost } from "@/app/utils/post";
import { auth } from "@/auth";
import { Button } from "@/components/ui/button";
import { PostThumbnail } from "@/components/ui/post-thumbnail";
import { defaultImageUrl } from "@/const/image";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ postUuid: string }>;
}): Promise<Metadata> {
  const postUuid = (await params).postUuid;
  const post = await getPost(postUuid);

  return {
    title: post?.metadata.title,
    openGraph: {
      title: post?.metadata.title,
      description: post?.metadata.subtitle,
      url: `https://www.jihasil.com/post/view/${post?.metadata.post_uuid}`,
      images: [new URL(post?.metadata.thumbnail_url ?? defaultImageUrl)],
    },
  };
}

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
    <div className="grid my-col my-gap w-full">
      <div className="lg:col-span-3 md:col-span-2 col-span-4 flex flex-col my-gap h-fit md:sticky md:top-[88px] lg:top-[92px]">
        <PostThumbnail metadata={post.metadata} />
        {session?.user ? (
          <Link
            href={{
              pathname: `/post/edit/${postUuid}`,
            }}
          >
            <Button className="w-full">수정</Button>
          </Link>
        ) : null}
      </div>
      <div className="lg:col-span-9 md:col-span-6 col-span-4 z-0">
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
