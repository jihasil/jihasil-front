"use server";

import { AuthError } from "next-auth";

import { signIn } from "@/auth";

export async function requestSignIn(
  signInData: {
    id: string;
    password: string;
  },
  redirectTo: string,
) {
  try {
    await signIn("credentials", {
      ...signInData,
      redirectTo,
    });
    return true;
  } catch (error) {
    if (error instanceof AuthError) {
      return false;
    } else {
      throw error;
    }
  }
}
