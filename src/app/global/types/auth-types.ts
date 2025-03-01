import { RoleUnion } from "@/app/global/enum/roles";

type User = {
  id: string;
  name: string;
  role: RoleUnion;
};

export type Session = {
  user: User;
};
