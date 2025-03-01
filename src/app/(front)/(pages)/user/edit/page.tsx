import { unauthorized } from "next/navigation";
import { Suspense } from "react";

import { getSession } from "@/app/(back)/application/model/request-sign-in";
import EditUser from "@/app/(front)/widgets/edit-user";

export default async function EditUserPage() {
  const session = await getSession();
  if (!session) {
    unauthorized();
  }

  return (
    <Suspense>
      <EditUser session={session} />
    </Suspense>
  );
}
