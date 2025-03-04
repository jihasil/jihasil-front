import { Metadata } from "next";
import { notFound } from "next/navigation";

import { authService } from "@/app/(back)/application/model/auth-service";
import { postService } from "@/app/(back)/application/model/post-service";
import { Post } from "@/app/(back)/domain/post";
import { EditPostTrigger } from "@/app/(front)/widgets/edit-post-trigger";
import { PostThumbnail } from "@/app/(front)/widgets/post-thumbnail";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ postId: string }>;
}): Promise<Metadata> {
  const postId = (await params).postId;
  const post = await postService.getPostById(postId);

  if (!post) {
    notFound();
  }

  return {
    title: post.title,
    openGraph: {
      title: post.title,
      description: post.subtitle,
      url: `/${post.postId}`,
      images: [post.thumbnailUrl],
    },
  };
}

export default async function PageViewer({
  params,
}: {
  params: Promise<{ postId: string }>;
}) {
  const session = await authService.getSession();
  const postId = (await params).postId;

  const post = await postService.getPostById(postId);
  if (!post) {
    notFound();
  }

  const postEntity = Post.fromJSON(post);
  const postEntry = postEntity.toPostEntry();

  console.log(postId);
  console.log(post);

  return (
    <div className="subgrid my-gap">
      <div className="lg:col-span-3 md:col-span-2 col-span-4 flex flex-col my-gap h-fit md:sticky top-[89px]">
        <PostThumbnail postEntry={postEntry} />
        {session &&
        (session.user.hasEnoughRole("ROLE_SUPERUSER") ||
          session.user.info.id === post.userId) ? (
          <EditPostTrigger postId={post.postId} />
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
