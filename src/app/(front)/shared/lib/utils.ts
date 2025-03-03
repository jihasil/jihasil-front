import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

import { RoleUnion, roleOrdinal } from "@/app/global/enum/roles";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const hasEnoughRole = (
  minimumRole: RoleUnion,
  role: RoleUnion = "ROLE_USER",
) => {
  return roleOrdinal[minimumRole] <= roleOrdinal[role];
};
