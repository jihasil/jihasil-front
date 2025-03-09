import { CookieSerializeOptions } from "cookie";
import { ReadonlyRequestCookies } from "next/dist/server/web/spec-extension/adapters/request-cookies";
import { cookies } from "next/headers";
import { cache } from "react";

import { userService } from "@/app/(back)/application/model/user-service";
import { User } from "@/app/(back)/domain/user";
import { UserDetails } from "@/app/(back)/domain/user-details";
import {
  ACCESS_TOKEN,
  INVALIDATED,
  REFRESH_TOKEN,
} from "@/app/(back)/shared/const/auth";
import { AuthenticationException } from "@/app/(back)/shared/error/exception";
import {
  getRandomSalt,
  validatePassword,
} from "@/app/(back)/shared/lib/crypto";
import { Session, TokenPair } from "@/app/global/types/auth-types";
import { UserSignInRequestDTO } from "@/app/global/types/user-types";
import { decode, encode } from "@auth/core/jwt";

class AuthService {
  private accessTokenAge = 60 * 5; // 5 minutes
  private refreshTokenAge = 60 * 60 * 12; // 12 hours
  private secret = process.env.TOKEN_SECRET as string;

  private defaultCookieOptions: CookieSerializeOptions = {
    httpOnly: process.env.NODE_ENV === "production",
    path: "/",
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
  };

  constructor() {
    if (this.secret === "undefined") {
      throw new Error("No secret provided");
    }
  }

  getSession = cache(async (): Promise<Session | null> => {
    const cookieStore = await cookies();
    const accessTokenHash = cookieStore.get(ACCESS_TOKEN)?.value;

    try {
      if (accessTokenHash) {
        const [salt, encryptedAccessToken] = accessTokenHash.split("|");
        const accessToken = await decode({
          salt,
          secret: this.secret,
          token: encryptedAccessToken,
        });

        if (accessToken && accessToken.exp > Date.now() / 1000) {
          return {
            user: UserDetails.fromJSON({
              info: {
                id: accessToken.sub,
                name: accessToken.name,
                role: accessToken.role,
              },
            }),
          };
        }
      }
    } catch (error) {
      // 조작된 것으로 판단. 추후 refresh token rotate 방지
      console.error(error);
      await this.invalidateAccessToken(cookieStore);
      return null;
    }

    return null;
  });

  authenticate = async (
    credentials: UserSignInRequestDTO,
    rememberMe: boolean = false,
  ): Promise<User> => {
    const user = await userService.getUserById(credentials.id as string);

    if (user) {
      const isValid = await validatePassword(
        credentials.password as string,
        user.password,
      );

      if (isValid) {
        if (rememberMe) {
          await this.rememberUser(user);
        }

        return user;
      }
    }

    throw new AuthenticationException("invalid credentials");
  };

  rotateTokenPair = async (refreshToken: string) => {
    const user = await this.getUserFromRefreshToken(refreshToken);

    if (user) {
      await this.rememberUser(user);
      return true;
    }
    await this.invalidateAccessToken();
    return false;
  };

  getUserFromRefreshToken = async (refreshToken: string) => {
    const [salt, token] = refreshToken.split("|");

    // refresh token 이 DB에 있고, 일치하는지 확인
    const decodedJwt = await decode({
      salt: salt,
      secret: this.secret,
      token: token,
    });

    if (
      !decodedJwt ||
      !decodedJwt.sub ||
      Date.now() >= (decodedJwt.exp ?? 0) * 1000
    ) {
      return null;
    }

    const id = decodedJwt.sub;

    const user = await userService.getUserById(id);

    if (!user || !user.refreshToken || user.refreshToken !== refreshToken) {
      return null;
    }

    return user;
  };

  rememberUser = async (user: User) => {
    const tokenPair = await this.generateTokenPair(user);
    if (tokenPair) {
      await this.setCookiesWithToken(tokenPair);
    }
  };

  invalidateAccessToken = async (cookieStore?: ReadonlyRequestCookies) => {
    if (!cookieStore) {
      cookieStore = await cookies();
    }
    cookieStore.set(ACCESS_TOKEN, INVALIDATED);
  };

  setCookiesWithToken = async (tokenPair: TokenPair) => {
    const cookieStore = await cookies();

    cookieStore.set(ACCESS_TOKEN, tokenPair.accessToken, {
      ...this.defaultCookieOptions,
      maxAge: tokenPair.accessTokenAge,
    });

    cookieStore.set(REFRESH_TOKEN, tokenPair.refreshToken, {
      ...this.defaultCookieOptions,
      path: "/api/refresh",
      maxAge: tokenPair.refreshTokenAge,
    });
  };

  generateTokenPair = async (user: User): Promise<TokenPair | null> => {
    try {
      return Promise.all([
        this.generateAccessToken(user),
        this.generateRefreshToken(user),
      ]).then(async ([saltAndAccessToken, saltAndRefreshToken]) => {
        await userService.editUserById({
          id: user.id,
          refresh_token: saltAndRefreshToken,
        });

        return {
          refreshToken: saltAndRefreshToken,
          refreshTokenAge: this.refreshTokenAge,
          accessTokenAge: this.accessTokenAge,
          accessToken: saltAndAccessToken,
        };
      });
    } catch (err) {
      console.log(err);
      return null;
    }
  };

  generateRefreshToken = async (user: User) => {
    const refreshTokenSalt = await getRandomSalt();
    const newRefreshToken = await encode({
      maxAge: this.refreshTokenAge,
      secret: this.secret,
      salt: refreshTokenSalt,
      token: {
        sub: user.id,
      },
    });
    return `${refreshTokenSalt}|${newRefreshToken}`;
  };

  generateAccessToken = async (user: User) => {
    const accessTokenSalt = await getRandomSalt();

    const newAccessToken = await encode({
      maxAge: this.accessTokenAge,
      secret: this.secret,
      salt: accessTokenSalt,
      token: {
        sub: user.id,
        name: user.name,
        role: user.role,
      },
    });

    return `${accessTokenSalt}|${newAccessToken}`;
  };
}

export const authService = new AuthService();
