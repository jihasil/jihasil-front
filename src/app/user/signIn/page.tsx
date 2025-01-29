"use client";

import { Suspense } from "react";

import SignIn from "@/app/user/signIn/SignIn";

export default function SignInPage() {
  return (
    <Suspense>
      <SignIn />
    </Suspense>
  );
}
