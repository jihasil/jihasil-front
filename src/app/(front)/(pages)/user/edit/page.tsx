import { unauthorized } from "next/navigation";
import { Suspense } from "react";

import { authService } from "@/app/(back)/application/model/auth-service";
import EditUser from "@/app/(front)/widgets/edit-user";

export default async function EditUserPage() {
  const session = await authService.getSession();
  if (!session) {
    unauthorized();
  }

  return (
    <Suspense>
      <EditUser session={session} />
    </Suspense>
  );
}
