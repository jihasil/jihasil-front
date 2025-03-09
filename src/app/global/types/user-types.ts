import { z } from "zod";

import { RoleUnion } from "@/app/global/enum/roles";
import { Filter, Key } from "@/app/global/types/page-types";

export interface UserKey extends Key {
  id: string;
}

export type UserEntry = {
  id: string;
  name: string;
  role: RoleUnion;
};

export type UserEditRequestDTO = {
  id: string;
  role?: RoleUnion;
  name?: string;
  password?: string;
  refresh_token?: string;
  is_deleted?: boolean;
};

export type ChangePasswordRequestDTO = {
  id: string;
  oldPassword: string;
  newPassword: string;
};

const idZod = z
  .string({ required_error: "ID를 입력해주세요." })
  .min(5, "ID는 5자~12자 이내로 입력해주세요.")
  .max(12, "ID는 5자~12자 이내로 입력해주세요.");

const passwordZod = z
  .string({ required_error: "비밀번호를 입력해주세요." })
  .min(8, "비밀번호는 8자 ~ 25자 이내로 입력해주세요.")
  .max(25, "비밀번호는 8자 ~ 25자 이내로 입력해주세요.");

export const signInSchema = z.object({
  id: idZod,
  password: passwordZod,
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
  id: idZod,
  name: z.string().min(1, "이름을 입력해주세요."),
  password: passwordZod,
  role: z.union([z.literal("ROLE_USER"), z.literal("ROLE_ADMIN")]),
});

export const changePasswordSchema = z.object({
  id: idZod,
  oldPassword: passwordZod,
  newPassword: passwordZod,
});
