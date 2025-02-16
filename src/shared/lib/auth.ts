import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";

import { getRefreshToken, getUser, validatePassword } from "@/entities/user";
import { User } from "@/shared/types/user-types";

declare module "next-auth" {
  interface User {
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
    async jwt({ token, user }) {
      if (user) {
        const tokenAndExpiry = await getRefreshToken(user as User);
        if (!tokenAndExpiry) {
          throw new TypeError("Failed to get refresh token");
        }
        const { refreshToken, expiresAt } = tokenAndExpiry;

        console.log("New Refresh token", refreshToken);
        return {
          ...token,
          role: user.role,
          refreshToken,
          expiresAt,
        };
      } else if (Date.now() >= token.expiresAt * 1000) {
        console.log("Previous Refresh token", token.refreshToken);

        try {
          if (!token.refreshToken) throw new TypeError("missing refreshToken");

          const tokenAndExpiry = await getRefreshToken(
            token.refreshToken as string,
          );

          if (!tokenAndExpiry)
            throw new TypeError("Failed to get refresh token");
          const { refreshToken, expiresAt } = tokenAndExpiry;

          return {
            ...token,
            refreshToken,
            expiresAt,
          };
        } catch (error) {
          console.error(error);
          console.log("에러를 던지면..");
          token.error = "RefreshTokenError";
          return null;
        }
      } else {
        console.log("reusing token!");
        console.log(token);
        return token;
      }
    },

    async session({ session, token }) {
      if (session.error) {
        session.error = token.error;
      } else {
        session.user.role = token.role;
        session.user.id = token.sub;
      }
      return session;
    },
  },
});

declare module "next-auth" {
  interface Session {
    id: string;
    error?: "RefreshTokenError";
  }
}

declare module "@auth/core/jwt" {
  interface JWT {
    refreshToken?: string;
    expiresAt?: number;
    error?: "RefreshTokenError";
  }
}
