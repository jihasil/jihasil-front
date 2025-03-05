"use client";

import { useRouter } from "next/navigation";

import { Button } from "@/app/(front)/components/ui/button";
import { fetchR } from "@/app/(front)/shared/lib/request";
import { cn } from "@/app/(front)/shared/lib/utils";

export default function SignOut(props: { className?: string }) {
  const router = useRouter();

  const signOut = () => {
    fetchR("/api/user/signOut", {
      method: "GET",
    }).then((response) => {
      if (response.redirected) {
        router.push(response.headers.get("Location") ?? "/");
        router.refresh();
      }
    });
  };

  return (
    <Button onClick={signOut} className={cn(props.className)}>
      로그아웃
    </Button>
  );
}
