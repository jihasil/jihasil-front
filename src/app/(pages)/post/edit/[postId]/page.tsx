import { forbidden, redirect, unauthorized } from "next/navigation";

import { getPost } from "@/entities/post";
import { hasEnoughRole } from "@/entities/user";
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
    unauthorized();
  }

  if (!post) {
    console.log("no post");
    redirect("/post/new");
  } else {
    if (
      !hasEnoughRole("ROLE_SUPERUSER", session.user.role) &&
      session.user.id !== post.postMetadata.user_id
    ) {
      forbidden();
    }

    return <EditPost post={post} session={session} />;
  }
}
