import "server-only";
import { cookies } from "next/headers";
import { cache } from "react";

import { decode } from "@auth/core/jwt";

declare module "@auth/core/jwt" {
  interface JWT {
    exp: number;
    sub: string;
    name: string;
    role?: string;
  }
}

export const getSession = cache(async () => {
  const cookieStore = await cookies();
  const accessTokenHash = cookieStore.get("accessToken")?.value;

  const secret = process.env.TOKEN_SECRET;

  if (accessTokenHash && secret) {
    const [salt, encryptedAccessToken] = accessTokenHash.split("|");
    const accessToken = await decode({
      salt,
      secret,
      token: encryptedAccessToken,
    });

    if (accessToken && accessToken.exp > Date.now() / 1000) {
      return {
        user: {
          id: accessToken.sub,
          name: accessToken.name,
          role: accessToken.role,
        },
      };
    }

    return null;
  }
});
