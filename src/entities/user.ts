"use server";

import crypto from "crypto";

import { dynamoClient, generateUpdateExpression } from "@/shared/lib/dynamo-db";
import { User, UserEditRequestDTO, UserKey } from "@/shared/types/user-types";
import { AdapterUser } from "@auth/core/adapters";
import { decode, encode } from "@auth/core/jwt";
import { QueryCommand, UpdateCommand } from "@aws-sdk/lib-dynamodb";

const keyLen = 32;
const digest: string = "sha256";
const iterations: number = 100000;

const accessTokenAge = 60 * 5; // 5 minutes
const refreshTokenAge = 60 * 60 * 12; // 12 hours

export const getUser = async (id: string): Promise<User | null> => {
  const param = {
    TableName: "user",
    KeyConditionExpression: "id = :id",
    ExpressionAttributeValues: {
      ":id": id,
    },
  };

  const command = new QueryCommand(param);
  console.log(`getting user ${id}`);

  try {
    // @ts-expect-error asdf
    const { Items } = await dynamoClient.send(command);
    console.log(Items);

    if (!Items || Items.length !== 1) {
      return null;
    } else {
      return Items[0];
    }
  } catch (error) {
    console.log(typeof error);
    console.error(error);
    console.log(`${id} error occurred`);
    console.log(error);
    return null;
  }
};

export const validatePassword = async (
  plainPassword: string,
  passwordFromDB: string,
): Promise<boolean> => {
  return new Promise<boolean>((resolve, reject) => {
    try {
      const combinedPassword = passwordFromDB.split("|");
      const salt = combinedPassword[0];
      const hashedPassword = combinedPassword[1];

      crypto.pbkdf2(
        plainPassword,
        salt,
        iterations,
        keyLen,
        digest,
        (err, result) => {
          if (err) reject(err);
          else {
            const hashedKey = result.toString("base64");
            resolve(hashedKey === hashedPassword);
          }
        },
      );
    } catch (error) {
      console.log(error);
      reject(false);
    }
  });
};

export const saltAndHashPassword = async (
  password: string,
): Promise<string> => {
  const salt = await getRandomSalt();

  return new Promise<string>((resolve, reject) => {
    crypto.pbkdf2(password, salt, iterations, keyLen, digest, (err, result) => {
      if (err) return reject(err);
      else {
        const hashedKey = result.toString("base64");
        const saltAndKey = `${salt}|${hashedKey}`;
        resolve(saltAndKey);
      }
    });
  });
};

export const changeUserInfo = async (userEditRequest: UserEditRequestDTO) => {
  const userKey: UserKey = {
    id: userEditRequest.id,
  };

  // jwt token 에 포함되는 정보가 수정될 경우 refresh token 을 무효화 함.
  if (userEditRequest.role || userEditRequest.password) {
    userEditRequest.refreshToken = "invalidated";
  }

  const exp = generateUpdateExpression(userKey, userEditRequest);

  const param = {
    TableName: "user",
    Key: userKey,
    ...exp,
  };

  console.log(param);
  const query = new UpdateCommand(param);

  console.log(query);

  try {
    // @ts-expect-error it works
    await dynamoClient.send(query);
    return true;
  } catch (error: any) {
    console.log(error);
    return false;
  }
};

export const getRefreshToken = async (
  authorization: User | AdapterUser | string,
) => {
  const secret = process.env.TOKEN_SECRET;

  if (!secret) {
    throw new Error("No secret");
  }

  try {
    let id: string;
    if (typeof authorization === "string") {
      id = await validateRefreshToken(authorization, secret);
    } else {
      id = authorization.id;
    }

    const salt = await getRandomSalt();

    const newRefreshToken = await encode({
      maxAge: refreshTokenAge,
      secret,
      salt,
      token: {
        sub: id,
      },
    });

    const saltAndRefreshToken = `${salt}|${newRefreshToken}`;
    console.log("new refresh token");
    console.log(saltAndRefreshToken);

    const succeed = await changeUserInfo({
      id,
      refreshToken: saltAndRefreshToken,
    });

    if (succeed) {
      return {
        refreshToken: saltAndRefreshToken,
        expiresAt: Date.now() / 1000 + accessTokenAge,
      };
    } else {
      return null;
    }
  } catch (err) {
    console.log(err);
    return null;
  }
};

export const invalidateUser = async (userKey: UserKey) => {
  return await changeUserInfo({
    id: userKey.id,
    refreshToken: "invalidated",
  });
};

const getRandomSalt = () => {
  return new Promise<string>((resolve, reject) => {
    crypto.randomBytes(16, async (err, buf) => {
      if (err) return reject(err);
      else resolve(buf.toString("base64"));
    });
  });
};

const validateRefreshToken = async (refreshToken: string, secret: string) => {
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

  return user.id;
};
