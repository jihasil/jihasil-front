import { forbidden, unauthorized } from "next/navigation";
import { Suspense } from "react";

import { hasEnoughRole } from "@/entities/user";
import { getSession } from "@/features/request-sign-in";
import SignUp from "@/widgets/sign-up";

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
