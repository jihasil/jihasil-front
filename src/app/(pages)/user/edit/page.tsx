import { forbidden } from "next/navigation";
import { Suspense } from "react";

import { getSession } from "@/features/request-sign-in";
import EditUser from "@/widgets/edit-user";

export default async function EditUserPage() {
  const session = await getSession();
  if (!session) {
    forbidden();
  }

  return (
    <Suspense>
      <EditUser session={session} />
    </Suspense>
  );
}
