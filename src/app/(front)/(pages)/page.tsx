import { getSession } from "@/app/(back)/application/model/request-sign-in";
import { PostGrid } from "@/app/(front)/widgets/post-grid";

export default async function Home() {
  const session = await getSession();
  return <PostGrid session={session} />;
}
