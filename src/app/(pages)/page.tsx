import React from "react";

import { auth } from "@/shared/lib/auth";
import { PostGrid } from "@/widgets/post-grid";

export default async function Home() {
  const session = await auth();
  return <PostGrid session={session} />;
}
