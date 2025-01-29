import { redirect } from "next/navigation";

import EditPost from "@/app/post/edit-post";
import { Post, getPost } from "@/app/utils/post";

export default async function EditPostPage({
  params,
}: {
  params: Promise<{ postUuid: string | undefined }>;
}) {
  const postUuid = (await params).postUuid;
  let post: Post | null = null;
  if (postUuid) {
    post = await getPost(postUuid);
  }

  if (!post) {
    console.log("no post");
    redirect("/post/new");
  } else {
    return <EditPost post={post} />;
  }
}
