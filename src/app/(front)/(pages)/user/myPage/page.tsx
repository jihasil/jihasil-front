import { cookies } from "next/headers";
import Link from "next/link";
import { redirect, unauthorized } from "next/navigation";

import { getSession } from "@/app/(back)/application/model/request-sign-in";
import { signOut } from "@/app/(back)/application/model/sign-out";
import { hasEnoughRole, invalidateUser } from "@/app/(back)/domain/user";
import {
  ACCESS_TOKEN,
  INVALIDATED,
  REFRESH_TOKEN,
} from "@/app/(back)/shared/const/auth";
import { Button } from "@/app/(front)/components/ui/button";
import { roleValue } from "@/app/global/enum/roles";

export default async function PageViewer() {
  const session = await getSession();

  if (!session) {
    unauthorized();
  }

  console.log("session");
  console.log(session);

  return (
    <div className="subgrid my-gap">
      <p className="col-span-full text-2xl font-bold">
        안녕하세요, {session?.user.name} 님
      </p>
      <p className="col-span-full">권한: {roleValue[session.user.role]}</p>
      <div className="col-span-1 flex flex-col grow my-gap">
        <Button className="grow" asChild>
          <Link href={"/user/edit"}>비밀번호 변경</Link>
        </Button>
        {hasEnoughRole("ROLE_SUPERUSER", session.user.role) ? (
          <Button asChild>
            <Link href="/manage/user">사용자 관리</Link>
          </Button>
        ) : null}
        <form
          action={async () => {
            "use server";
            await signOut(session);
          }}
        >
          <Button className="w-full" type="submit">
            로그아웃
          </Button>
        </form>
      </div>
    </div>
  );
}
