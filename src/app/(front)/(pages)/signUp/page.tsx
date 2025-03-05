import { forbidden, unauthorized } from "next/navigation";
import { Suspense } from "react";

import { authService } from "@/app/(back)/application/model/auth-service";
import { hasEnoughRole } from "@/app/(front)/shared/lib/utils";
import SignUp from "@/app/(front)/widgets/sign-up";

export default async function SignUpPage() {
  const session = await authService.getSession();
  if (!session) {
    unauthorized();
  }
  if (!session.user.hasEnoughRole("ROLE_SUPERUSER")) {
    forbidden();
  }

  return (
    <Suspense>
      <SignUp />
    </Suspense>
  );
}
