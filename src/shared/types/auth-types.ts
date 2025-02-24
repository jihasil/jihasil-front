import { RoleUnion } from "@/shared/enum/roles";

type User = {
  id: string;
  name: string;
  role: RoleUnion;
};

export type Session = {
  user: User;
};
