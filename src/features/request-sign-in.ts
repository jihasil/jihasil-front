import "server-only";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

import { decode } from "@auth/core/jwt";

declare module "@auth/core/jwt" {
  interface JWT {
    exp: number;
    sub: string;
    name: string;
    role?: string;
  }
}

export const getSession = async () => {
  const secret = process.env.TOKEN_SECRET;
  if (!secret) return null;

  const cookieStore = await cookies();
  const accessTokenHash = cookieStore.get("accessToken")?.value;

  try {
    if (accessTokenHash) {
      const [salt, encryptedAccessToken] = accessTokenHash.split("|");
      const accessToken = await decode({
        salt,
        secret,
        token: encryptedAccessToken,
      });

      if (accessToken) {
        if (accessToken.exp > Date.now() / 1000) {
          return {
            user: {
              id: accessToken.sub,
              name: accessToken.name,
              role: accessToken.role,
            },
          };
        }
      }
    }
  } catch (error) {
    console.error(error);
    return null;
  }

  return null;
};
