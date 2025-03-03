import { forbidden, redirect, unauthorized } from "next/navigation";

import { authService } from "@/app/(back)/application/model/auth-service";
import { postService } from "@/app/(back)/application/model/post-service";
import { Post } from "@/app/(back)/domain/post";
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

  const session: Session | null = await authService.getSession();

  if (!session) {
    unauthorized();
  }

  if (!post) {
    console.log("no post");
    redirect("/post/new");
  } else {
    if (
      !session.user.hasEnoughRole("ROLE_SUPERUSER") &&
      session.user.info.id !== post.userId
    ) {
      forbidden();
    }
    const clientSession = session.user.toClientSession();
    return <EditPost post={post.toPostResponseDTO()} session={clientSession} />;
  }
}
