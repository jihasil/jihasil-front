import { authService } from "@/app/(back)/application/model/auth-service";
import { PostGrid } from "@/app/(front)/widgets/post-grid";

export default async function Home() {
  const session = await authService.getSession();
  const info = session?.user?.toClientSession();
  return <PostGrid session={info} />;
}
