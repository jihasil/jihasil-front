import { getSession } from "@/features/request-sign-in";
import { PostGrid } from "@/widgets/post-grid";

export default async function Home() {
  const session = await getSession();
  return <PostGrid session={session} />;
}
