"use server";

import { z } from "zod";

import { authorizeUser } from "@/app/(back)/application/model/auth";
import { saltAndHashPassword } from "@/app/(back)/application/model/crypto";
import { getSession } from "@/app/(back)/application/model/request-sign-in";
import { changeUserInfo } from "@/app/(back)/domain/user";
import { changePasswordSchema } from "@/app/global/types/user-types";

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
