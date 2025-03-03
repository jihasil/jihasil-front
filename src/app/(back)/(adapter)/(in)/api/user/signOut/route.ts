import { NextResponse } from "next/server";

import { authService } from "@/app/(back)/application/model/auth-service";
import { userService } from "@/app/(back)/application/model/user-service";

export const GET = async () => {
  const session = await authService.getSession();

  if (!session) {
    return new NextResponse(null, {
      status: 401,
    });
  }

  await userService.userSignOut(session.user.info.id);
  return new NextResponse(null, {
    status: 307,
    headers: {
      Location: "/",
    },
  });
};
