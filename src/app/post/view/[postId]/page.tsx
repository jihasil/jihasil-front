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
  params: Promise<{ postId: string }>;
}): Promise<Metadata> {
  const postId = (await params).postId;
  const post = await getPost(postId);

  return {
    title: post?.postMetadata.title,
    openGraph: {
      title: post?.postMetadata.title,
      description: post?.postMetadata.subtitle,
      url: `/${post?.postMetadata.post_id}`,
      images: [new URL(post?.postMetadata.thumbnail_url ?? defaultImageUrl)],
    },
  };
}

export default async function PageViewer({
  params,
}: {
  params: Promise<{ postId: string }>;
}) {
  const postId = (await params).postId;
  const session = await auth();

  const post = await getPost(postId);
  if (!post) {
    notFound();
  }

  console.log(postId);
  console.log(post);

  return (
    <div className="grid my-col my-gap w-full">
      <div className="lg:col-span-3 md:col-span-2 col-span-4 flex flex-col my-gap h-fit md:sticky md:top-[84px] lg:top-[92px]">
        <PostThumbnail postMetadata={post.postMetadata} />
        {session?.user ? (
          <Link
            href={{
              pathname: `/post/edit/${postId}`,
            }}
          >
            <Button className="w-full">수정</Button>
          </Link>
        ) : null}
      </div>
      <div className="lg:col-span-9 md:col-span-6 col-span-4 z-0">
        <div
          id="post_content"
          dangerouslySetInnerHTML={{
            __html: post.html,
          }}
        />
      </div>
    </div>
  );
}
