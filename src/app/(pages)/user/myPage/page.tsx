import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import { Button } from "@/components/ui/button";
import { invalidateUser } from "@/entities/user";
import { getSession } from "@/features/request-sign-in";

export default async function PageViewer() {
  const session = await getSession();

  console.log("session");
  console.log(session);

  return (
    <div className="col-span-full flex justify-center">
      <div className="flex flex-col items-center my-gap">
        <p>안녕하세요, {session?.user.name} 님</p>
        <p>권한: {session?.user.role}</p>
        <form
          action={async () => {
            "use server";
            console.log(`user logging out: ${session?.user.id}`);

            await invalidateUser({
              id: session?.user.id as string,
            });

            const cookieStore = await cookies();
            cookieStore.delete("accessToken");
            cookieStore.delete("refreshToken");

            redirect("/");
          }}
        >
          <Button type="submit">로그아웃</Button>
        </form>
      </div>
    </div>
  );
}
