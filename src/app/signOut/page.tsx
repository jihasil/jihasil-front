import { signOut } from "@/auth";
import { Button } from "@/components/ui/button";

export default async function signOutPage() {
  return (
    <div className="flex justify-center">
      <form
        action={async () => {
          "use server";
          await signOut({
            redirectTo: "/",
          });
        }}
      >
        <Button type="submit">로그아웃</Button>
      </form>
    </div>
  );
}
