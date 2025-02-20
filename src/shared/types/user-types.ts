import { z } from "zod";

import { RoleUnion } from "@/shared/enum/roles";

export type User = {
  id: string;
  name: string;
  password: string;
  role: RoleUnion;
  refreshToken?: string;
};

export type UserKey = {
  id: string;
};

export type UserResponseDTO = {
  id: string;
  name: string;
  role: RoleUnion;
};

export type UserEditRequestDTO = {
  id: string;
  role?: RoleUnion;
  name?: string;
  password?: string;
  refreshToken?: string;
};

export const signInSchema = z.object({
  id: z
    .string({ required_error: "A unique ID is required" })
    .min(1, "A unique ID is required."),
  password: z
    .string({ required_error: "Password is required" })
    .min(1, "Password is required."),
});

export type UserSignInRequestDTO = {
  id: string;
  password: string;
};

export type UserSignUpRequestDTO = {
  id: string;
  name: string;
  password: string;
  role?: RoleUnion;
};

export type TokenPair = {
  accessToken: string;
  refreshToken: string;
  accessTokenAge: number;
  refreshTokenAge: number;
};
