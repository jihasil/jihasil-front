import { Suspense } from "react";

import SignIn from "@/widgets/sign-in";

export default function SignInPage() {
  return (
    <Suspense>
      <SignIn />
    </Suspense>
  );
}
