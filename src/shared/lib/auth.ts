import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";

import { RotateTokenResponseDTO } from "@/app/api/user/refresh/route";
import { getUser, validatePassword } from "@/entities/user";

declare module "next-auth" {
  interface User {
    role: string;
    refreshToken: string;
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
    maxAge: 300,
  },
  trustHost: true,

  callbacks: {
    async jwt({ token, user, account }) {
      if (user) {
        return {
          ...token,
          role: user.role,
          refreshToken: user.refreshToken,
        };
      } else if (Date.now() < token.exp * 1000) {
        console.log(token);
        return token;
      } else {
        if (!token.refreshToken) throw new TypeError("missing refreshToken");

        try {
          const response = await fetch("/api/user/refresh", {
            method: "POST",
            body: JSON.stringify({ refreshToken: token.refreshToken }),
          });

          const tokensOrError = await response.json();
          if (!response.ok) throw tokensOrError;

          const newTokens = tokensOrError as RotateTokenResponseDTO;

          return {
            token: newTokens.accessToken,
            refreshToken: newTokens.refreshToken,
          };
        } catch (error) {
          console.error(error);
          token.error = "RefreshTokenError";
          return token;
        }
      }
    },

    async session({ session, token }) {
      if (session.user) {
        session.user.role = token.role;
      }
      session.error = token.error;
      return session;
    },
  },
});

declare module "next-auth" {
  interface Session {
    error?: "RefreshTokenError";
  }
}

declare module "@auth/core/jwt" {
  interface JWT {
    accessToken: string;
    refreshToken?: string;
    error?: "RefreshTokenError";
  }
}
