import { forbidden, unauthorized } from "next/navigation";
import { Suspense } from "react";

import { getSession } from "@/app/(back)/application/model/request-sign-in";
import { hasEnoughRole } from "@/app/(back)/domain/user";
import SignUp from "@/app/(front)/widgets/sign-up";

export default async function SignUpPage() {
  const session = await getSession();
  if (!session) {
    unauthorized();
  }
  if (!hasEnoughRole("ROLE_SUPERUSER", session.user.role)) {
    forbidden();
  }

  return (
    <Suspense>
      <SignUp />
    </Suspense>
  );
}
