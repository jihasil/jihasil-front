import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { NextRequest } from "next/server";

import { invalidateUser } from "@/entities/user";

export const POST = async (req: NextRequest) => {
  const { id } = await req.json();

  await invalidateUser({ id });

  const cookieStore = await cookies();
  cookieStore.delete("accessToken");
  cookieStore.delete("refreshToken");

  redirect("/");
};
