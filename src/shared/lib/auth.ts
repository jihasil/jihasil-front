import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { cookies } from "next/headers";

import { getRefreshToken, getUser, validatePassword } from "@/entities/user";
import { User } from "@/shared/types/user-types";
import { Mutex } from "async-mutex";
import { decode } from "@auth/core/jwt";

declare module "next-auth" {
  interface User {
    role: string;
  }
}

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

const mutex = new Mutex();
let nextRefreshAt: number = 0;

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
        // console.log("refresh trying");
        const release = await mutex.acquire();
        console.log("refresh start");
        console.log(token);
        //
        try {
          if (Date.now() / 1000 < nextRefreshAt) {
            const cookieName = "authjs.session-token";
            const cookieStore = await cookies();
            const refreshedToken = cookieStore.get(cookieName);
            const secret = process.env.AUTH_SECRET;

            if (!secret) {
              return null;
            }
            console.log("Refreshed token before. using cookie");
            console.log(refreshedToken.value);

            return decode({
              secret,
              salt: cookieName,
              token: refreshedToken?.value,
            });
          }
          console.log("Previous Refresh token", token.refreshToken);

          if (!token.refreshToken) return null;

          const tokenAndExpiry = await getRefreshToken(
            token.refreshToken as string,
          );

          if (!tokenAndExpiry) return null;

          const { refreshToken, expiresAt } = tokenAndExpiry;

          nextRefreshAt = expiresAt;

          console.log({
            ...token,
            refreshToken,
            expiresAt,
          });

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
        } finally {
          release();
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
