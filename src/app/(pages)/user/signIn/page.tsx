import { Suspense } from "react";

import SignIn from "@/features/sign-in";

export default function SignInPage() {
  return (
    <Suspense>
      <SignIn />
    </Suspense>
  );
}
