import { unauthorized } from "next/navigation";

import { getSession } from "@/app/(back)/application/model/request-sign-in";
import EditPost from "@/app/(front)/widgets/edit-post";

export default async function NewPostPage() {
  const session = await getSession();
  if (!session) {
    unauthorized();
  }
  return <EditPost session={session} />;
}
