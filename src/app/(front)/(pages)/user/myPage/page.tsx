import { revalidatePath } from "next/cache";
import Link from "next/link";
import { redirect, unauthorized } from "next/navigation";

import { authService } from "@/app/(back)/application/model/auth-service";
import { userService } from "@/app/(back)/application/model/user-service";
import { Button } from "@/app/(front)/components/ui/button";
import { roleValue } from "@/app/global/enum/roles";

export default async function PageViewer() {
  const session = await authService.getSession();

  if (!session) {
    unauthorized();
  }

  console.log("session");
  console.log(session);

  return (
    <div className="subgrid my-gap">
      <p className="col-span-full text-2xl font-bold">
        안녕하세요, {session.user.info.name} 님
      </p>
      <p className="col-span-full">권한: {roleValue[session.user.info.role]}</p>
      <div className="col-span-1 flex flex-col grow my-gap">
        <Button className="grow" asChild>
          <Link href={"/user/edit"}>비밀번호 변경</Link>
        </Button>
        {session.user.hasEnoughRole("ROLE_SUPERUSER") ? (
          <Button asChild>
            <Link href="/manage/user">사용자 관리</Link>
          </Button>
        ) : null}
        <form
          action={async () => {
            "use server";
            await userService.userSignOut(session?.user.info.id);
            revalidatePath("/", "page");
            redirect("/");
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
