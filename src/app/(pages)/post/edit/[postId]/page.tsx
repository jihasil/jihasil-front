import { redirect } from "next/navigation";

import { getPost } from "@/entities/post";
import EditPost from "@/features/edit-post";
import { Post } from "@/shared/types/post-types";

export default async function EditPostPage({
  params,
}: {
  params: Promise<{ postId: string | undefined }>;
}) {
  const postId = (await params).postId;
  let post: Post | null = null;
  if (postId) {
    post = await getPost(postId);
  }

  if (!post) {
    console.log("no post");
    redirect("/post/new");
  } else {
    return <EditPost post={post} />;
  }
}
