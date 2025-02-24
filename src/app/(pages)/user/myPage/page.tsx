import { cookies } from "next/headers";
import Link from "next/link";
import { forbidden, redirect } from "next/navigation";

import { Button } from "@/components/ui/button";
import { hasEnoughRole, invalidateUser } from "@/entities/user";
import { getSession } from "@/features/request-sign-in";
import { ACCESS_TOKEN, INVALIDATED, REFRESH_TOKEN } from "@/shared/const/auth";
import { RoleValue } from "@/shared/enum/roles";

export default async function PageViewer() {
  const session = await getSession();

  if (!session) {
    forbidden();
  }

  console.log("session");
  console.log(session);

  return (
    <div className="subgrid my-gap">
      <p className="col-span-full text-2xl font-bold">
        안녕하세요, {session?.user.name} 님
      </p>
      <p className="col-span-full">권한: {RoleValue[session.user.role]}</p>
      <div className="col-span-1 flex flex-col flex-grow my-gap">
        <Button className="flex-grow" asChild>
          <Link
            href={`/user/edit/?userId=${session.user.id}&from=${encodeURIComponent("/user/myPage")}`}
          >
            정보 수정
          </Link>
        </Button>
        {hasEnoughRole("ROLE_SUPERUSER", session.user.role) ? (
          <Button asChild>
            <Link href="/manage/user">사용자 관리</Link>
          </Button>
        ) : null}
        <form
          className="hidden"
          action={async () => {
            "use server";
            console.log(`user logging out: ${session?.user.id}`);

            await invalidateUser({
              id: session?.user.id as string,
            });

            const cookieStore = await cookies();
            cookieStore.set(ACCESS_TOKEN, INVALIDATED);
            cookieStore.delete(REFRESH_TOKEN);

            redirect("/");
          }}
        />
        <Button type="submit">로그아웃</Button>
      </div>
    </div>
  );
}
