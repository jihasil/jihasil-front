import { redirect } from "next/navigation";

import EditPost from "@/app/post/edit-post";
import { Post, getPost } from "@/app/utils/post";

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
