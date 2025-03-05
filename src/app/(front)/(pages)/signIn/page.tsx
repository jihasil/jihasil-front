import { Suspense } from "react";

import SignIn from "@/app/(front)/widgets/sign-in";

export default function SignInPage() {
  return (
    <Suspense>
      <SignIn />
    </Suspense>
  );
}
