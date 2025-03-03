import {
  Serializable,
  SnakeCaseNamingStrategy,
  jsonObject,
  jsonProperty,
} from "ts-serializable";

import { User } from "@/app/(back)/domain/user";
import { RoleUnion, roleOrdinal } from "@/app/global/enum/roles";
import { ClientSession } from "@/app/global/types/auth-types";
import "reflect-metadata";

@jsonObject({ namingStrategy: new SnakeCaseNamingStrategy() })
export class UserDetails extends Serializable {
  @jsonProperty(User)
  info: User = User.fromJSON({});

  hasEnoughRole(minimumRole: RoleUnion = "ROLE_USER"): boolean {
    return roleOrdinal[minimumRole] <= roleOrdinal[this.info.role];
  }

  toClientSession(): ClientSession {
    return {
      user: {
        id: this.info.id,
        name: this.info.name,
        role: this.info.role,
      },
    };
  }
}
