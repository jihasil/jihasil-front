import { UserDetails } from "@/app/(back)/domain/user-details";
import { RoleUnion } from "@/app/global/enum/roles";

export type UserDetailsInterface = {
  id: string;
  name: string;
  role: RoleUnion;
};

export type Session = {
  user: UserDetails;
};

export type ClientSession = {
  user: UserDetailsInterface;
};

export type TokenPair = {
  accessToken: string;
  refreshToken: string;
  accessTokenAge: number;
  refreshTokenAge: number;
};

declare module "@auth/core/jwt" {
  interface JWT {
    exp: number;
    sub: string;
    name: string;
    role: RoleUnion;
  }
}
