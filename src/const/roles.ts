export const RoleKey = {
  사용자: "ROLE_USER",
  관리자: "ROLE_ADMIN",
  슈퍼유저: "ROLE_SUPERUSER",
} as const;

export type RoleUnion = (typeof RoleKey)[keyof typeof RoleKey];

let cashedRoleSelection;

function createIssueSelection(roleKey: typeof RoleKey) {
  if (!cashedRoleSelection) {
    return Object.entries(roleKey).map(([display, value]) => ({
      value,
      display,
    }));
  }
  return cashedRoleSelection;
}

export const roleSelection = createIssueSelection(RoleKey);
