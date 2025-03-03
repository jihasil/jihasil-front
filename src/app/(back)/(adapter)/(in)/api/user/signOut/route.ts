import { redirect, unauthorized } from "next/navigation";

import { authService } from "@/app/(back)/application/model/auth-service";
import { userService } from "@/app/(back)/application/model/user-service";

export const signOut = async () => {
  const session = await authService.getSession();

  if (!session) {
    unauthorized();
  }

  await userService.userSignOut(session.user.info.id);
  redirect("/");
};
