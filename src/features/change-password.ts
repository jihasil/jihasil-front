"use server";

import { z } from "zod";

import { changeUserInfo } from "@/entities/user";
import { getSession } from "@/features/request-sign-in";
import { authorizeUser } from "@/shared/lib/auth";
import { saltAndHashPassword } from "@/shared/lib/crypto";
import { changePasswordSchema } from "@/shared/types/user-types";

export const changePassword = async (
  changePasswordDTO: z.infer<typeof changePasswordSchema>,
) => {
  const changePasswordDTOValidation =
    changePasswordSchema.safeParse(changePasswordDTO);

  if (changePasswordDTOValidation.error) {
    return false;
  }

  const session = await getSession();
  if (session === null) {
    return false;
  }

  const { userId, oldPassword, newPassword } = changePasswordDTOValidation.data;
  if (session.user.role !== "ROLE_SUPERUSER" && session.user.id !== userId) {
    return false;
  }

  const userExists = await authorizeUser({
    id: userId,
    password: oldPassword,
  });

  if (!userExists) {
    return false;
  }

  const newPasswordHash = await saltAndHashPassword(newPassword);

  return changeUserInfo({
    id: userId,
    password: newPasswordHash,
  });
};
