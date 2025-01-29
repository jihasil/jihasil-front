import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";

import { getUser, validatePassword } from "@/app/utils/user";

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Credentials({
      // You can specify which fields should be submitted, by adding keys to the `credentials` object.
      // e.g. domain, username, password, 2FA token, etc.
      credentials: {
        id: {},
        password: {},
      },
      authorize: async (credentials) => {
        const user = await getUser(credentials.id as string);

        if (user !== null) {
          const isValid = await validatePassword(
            credentials.password as string,
            user.password,
          );
          if (isValid) {
            return user;
          } else {
            return null;
          }
        } else {
          return null;
        }
      },
    }),
  ],
  session: {
    strategy: "jwt",
  },
  trustHost: true,
});
