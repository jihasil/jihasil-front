import { createNavigationSelection, getOrdinal } from "@/shared/enum/enum-util";

export const RoleKey = {
  사용자: "ROLE_USER",
  관리자: "ROLE_ADMIN",
  슈퍼유저: "ROLE_SUPERUSER",
} as const;

export type RoleUnion = (typeof RoleKey)[keyof typeof RoleKey];

export const roleSelection = createNavigationSelection(RoleKey);

export const roleOrdinal = getOrdinal(RoleKey);
