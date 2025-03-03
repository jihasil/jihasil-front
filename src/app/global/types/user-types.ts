import { z } from "zod";

import { RoleUnion } from "@/app/global/enum/roles";
import { Filter, Key } from "@/app/global/types/page-types";

export interface UserKey extends Key {
  id: string;
}

export interface UserFilter extends Filter {
  id: string;
}

export type UserEntry = {
  id: string;
  name: string;
  role: RoleUnion;
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

export type ChangePasswordRequestDTO = {
  id: string;
  oldPassword: string;
  newPassword: string;
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
  role: RoleUnion;
};

export const signUpSchema = z.object({
  id: z.string().min(1, "ID를 입력해주세요."),
  name: z.string().min(1, "이름을 입력해주세요."),
  password: z.string().min(1, "비밀번호를 입력해주세요."),
  role: z.union([z.literal("ROLE_USER"), z.literal("ROLE_ADMIN")]),
});

export const changePasswordSchema = z.object({
  id: z.string(),
  oldPassword: z.string().min(1, "기존 비밀번호를 입력해주세요."),
  newPassword: z.string().min(1, "새 비밀번호를 입력해주세요."),
});
