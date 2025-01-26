import { auth } from "@/auth";

export default async function PageViewer() {
  const session = await auth();

  return <p>안녕하세요, {session?.user?.name} 님</p>;
}
