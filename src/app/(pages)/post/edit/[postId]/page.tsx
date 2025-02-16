import { redirect } from "next/navigation";

import { getPost } from "@/entities/post";
import { Post } from "@/shared/types/post-types";
import EditPost from "@/widgets/edit-post";

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
