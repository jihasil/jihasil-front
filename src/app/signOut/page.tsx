import { signOut } from "@/auth";

export default async function signOutPage() {
  return (
    <form
      action={async () => {
        "use server";
        await signOut({
          redirectTo: "/",
        });
      }}
    >
      <button type="submit">Sign Out</button>
    </form>
  );
}
