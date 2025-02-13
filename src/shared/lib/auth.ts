import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";

import { getUser, validatePassword } from "@/entities/user";

declare module "next-auth" {
  interface User {
    id?: string;
    email?: string | null;
    role: string;
  }
}

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
        console.log(user);

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
  callbacks: {
    jwt({ token, user }) {
      if (user) token.role = user.role;
      return token;
    },
    session({ session, token }) {
      if (session.user) {
        session.user.role = token.role;
      }
      return session;
    },
  },
});
