import { unauthorized } from "next/navigation";

import { authService } from "@/app/(back)/application/model/auth-service";
import EditPost from "@/app/(front)/widgets/edit-post";

export default async function NewPostPage() {
  const session = await authService.getSession();
  if (!session) {
    unauthorized();
  }
  const clientSession = session.user.toClientSession();
  return <EditPost session={clientSession} />;
}
