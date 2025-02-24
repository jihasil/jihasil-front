import { forbidden, redirect, unauthorized } from "next/navigation";

import { getPost } from "@/entities/post";
import { getSession } from "@/features/request-sign-in";
import { Session } from "@/shared/types/auth-types";
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

  const session: Session | null = await getSession();

  if (!session) {
    forbidden();
  }

  if (!post) {
    console.log("no post");
    redirect("/post/new");
  } else {
    return <EditPost post={post} session={session} />;
  }
}
