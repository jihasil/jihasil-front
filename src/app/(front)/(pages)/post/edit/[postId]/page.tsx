import { forbidden, redirect, unauthorized } from "next/navigation";

import { postService } from "@/app/(back)/application/model/post-service";
import { getSession } from "@/app/(back)/application/model/request-sign-in";
import { Post } from "@/app/(back)/domain/post";
import { hasEnoughRole } from "@/app/(back)/domain/user";
import EditPost from "@/app/(front)/widgets/edit-post";
import { Session } from "@/app/global/types/auth-types";

export default async function EditPostPage({
  params,
}: {
  params: Promise<{ postId: string | undefined }>;
}) {
  const postId = (await params).postId;
  let post: Post | null = null;
  if (postId) {
    post = await postService.getPostById(postId);
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
      session.user.id !== post.userId
    ) {
      forbidden();
    }

    return <EditPost post={post.toPostResponseDTO()} session={session} />;
  }
}
