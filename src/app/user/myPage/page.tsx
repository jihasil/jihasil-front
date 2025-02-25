import { auth, signOut } from "@/auth";
import { Button } from "@/components/ui/button";

export default async function PageViewer() {
  const session = await auth();

  return (
    <div className="flex justify-center">
      <div className="flex flex-col items-center my-gap">
        <p>안녕하세요, {session?.user?.name} 님</p>
        <form
          action={async () => {
            "use server";
            await signOut({
              redirectTo: "/",
            });
          }}
        >
          <Button type="submit">로그아웃</Button>
        </form>
      </div>
    </div>
  );
}
