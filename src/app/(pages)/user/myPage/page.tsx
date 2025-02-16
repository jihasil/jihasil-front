import { Button } from "@/components/ui/button";
import { invalidateUser } from "@/entities/user";
import { auth, signOut } from "@/shared/lib/auth";

export default async function PageViewer() {
  const session = await auth();

  return (
    <div className="col-span-full flex justify-center">
      <div className="flex flex-col items-center my-gap">
        <p>안녕하세요, {session?.user?.name} 님</p>
        <p>권한: {session?.user?.role}</p>
        <form
          action={async () => {
            "use server";
            console.log(`user logging out: ${session?.user?.id}`);

            await invalidateUser({
              id: session?.user?.id as string,
            });

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
