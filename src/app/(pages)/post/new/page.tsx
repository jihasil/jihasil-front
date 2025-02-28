import { unauthorized } from "next/navigation";

import { getSession } from "@/features/request-sign-in";
import EditPost from "@/widgets/edit-post";

export default async function NewPostPage() {
  const session = await getSession();
  if (!session) {
    unauthorized();
  }
  return <EditPost session={session} />;
}
