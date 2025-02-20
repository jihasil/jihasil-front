import { CookieSerializeOptions } from "cookie";
import {
  TokenPair,
  User,
  UserSignInRequestDTO,
} from "@/shared/types/user-types";
import { decode, encode } from "@auth/core/jwt";
import { changeUserInfo, getUser } from "@/entities/user";
import { cookies } from "next/headers";
import { getRandomSalt, validatePassword } from "@/shared/lib/crypto";
import { ACCESS_TOKEN, INVALIDATED, REFRESH_TOKEN } from "@/shared/const/auth";

export const defaultCookieOptions: CookieSerializeOptions = {
  httpOnly: process.env.NODE_ENV === "production",
  path: "/",
  secure: process.env.NODE_ENV === "production",
  sameSite: "strict",
};

const accessTokenAge = 60 * 5; // 5 minutes
const refreshTokenAge = 60 * 60 * 12; // 12 hours

export const authorizeUser = async (
  credentials: UserSignInRequestDTO,
): Promise<User | null> => {
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
};

export const generateTokenPair = async (
  user: User,
): Promise<TokenPair | null> => {
  const secret = process.env.TOKEN_SECRET;

  if (!secret) {
    throw new Error("No secret");
  }

  try {
    const refreshTokenSalt = await getRandomSalt();

    const newRefreshToken = await encode({
      maxAge: refreshTokenAge,
      secret,
      salt: refreshTokenSalt,
      token: {
        sub: user.id,
      },
    });

    const accessTokenSalt = await getRandomSalt();

    const newAccessToken = await encode({
      maxAge: accessTokenAge,
      secret,
      salt: accessTokenSalt,
      token: {
        sub: user.id,
        name: user.name,
        role: user.role,
      },
    });

    const saltAndRefreshToken = `${refreshTokenSalt}|${newRefreshToken}`;
    const saltAndAccessToken = `${accessTokenSalt}|${newAccessToken}`;

    const succeed = await changeUserInfo({
      id: user.id,
      refreshToken: saltAndRefreshToken,
    });

    if (succeed) {
      return {
        refreshToken: saltAndRefreshToken,
        refreshTokenAge,
        accessTokenAge,
        accessToken: saltAndAccessToken,
      };
    } else {
      return null;
    }
  } catch (err) {
    console.log(err);
    return null;
  }
};

export const getUserFromRefreshToken = async (refreshToken: string) => {
  const secret = process.env.TOKEN_SECRET;

  if (!secret) {
    throw new Error("No secret");
  }

  const [salt, token] = refreshToken.split("|");

  // refresh token 이 DB에 있고, 일치하는지 확인
  const decodedJwt = await decode({
    salt: salt,
    secret: secret,
    token: token,
  });

  const id = decodedJwt?.sub;

  if (!id) {
    throw new Error("No valid token");
  }

  if (Date.now() >= (decodedJwt.exp ?? 0) * 1000) {
    throw new Error("Refresh token expired");
  }

  const user = await getUser(id);
  if (!user) {
    throw new Error("No valid token");
  }
  if (!user.refreshToken) {
    throw new Error("No refresh token");
  }
  console.log(user.refreshToken);
  console.log(refreshToken);
  if (user.refreshToken !== refreshToken) {
    throw new Error("No valid token");
  }

  return user;
};

export const setCookiesWithToken = async (tokenPair: TokenPair) => {
  const cookieStore = await cookies();

  cookieStore.set(ACCESS_TOKEN, tokenPair.accessToken, {
    ...defaultCookieOptions,
    maxAge: tokenPair.accessTokenAge,
  });

  cookieStore.set(REFRESH_TOKEN, tokenPair.refreshToken, {
    ...defaultCookieOptions,
    path: "/api/refresh",
    maxAge: tokenPair.refreshTokenAge,
  });
};
