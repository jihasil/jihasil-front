import { NextRequest, NextResponse } from "next/server";

import { getUser } from "@/app/utils/user";
import { decode, encode } from "@auth/core/jwt";

export type RotateTokenResponseDTO = {
  accessToken: string;
  refreshToken: string;
};

export const POST = async (req: NextRequest) => {
  const { refreshToken } = (await req.json()) as { refreshToken: string };
  const secret = process.env.AUTH_SECRET;

  if (!secret) {
    console.error("Missing secret");
    return new NextResponse("Internal Server Error. Sorry!", { status: 500 });
  }

  // refresh token 이 DB에 있고, 일치하는지 확인
  const decodedJwt = await decode({
    salt: "RefreshToken",
    secret: secret,
    token: refreshToken,
  });

  const id = decodedJwt?.sub;

  if (!id) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const user = await getUser(id);
  if (!user || !user.refreshToken) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const newAccessToken = await encode({
    maxAge: 300,
    secret: secret,
    salt: "authjs.session-token",
    token: {
      role: user.role,
      name: user.name,
      sub: user.id,
    },
  });

  const newRefreshToken = await encode({
    maxAge: 60 * 60 * 24 * 7,
    secret: secret,
    salt: "RefreshToken",
    token: {
      role: user.role,
      sub: user.id,
      name: user.name,
    },
  });

  // TODO: user patch -> refreshtoken 추가

  const returnJson: RotateTokenResponseDTO = {
    accessToken: newAccessToken,
    refreshToken: newRefreshToken,
  };

  return new NextResponse(JSON.stringify(returnJson), {
    status: 200,
  });
};
