"use server";

import { signIn } from "@/auth";

export async function requestSignIn(signInData: {
  id: string;
  password: string;
}) {
  await signIn("credentials", {
    ...signInData,
    redirectTo: "/",
  });
}
