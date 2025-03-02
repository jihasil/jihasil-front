import {
  Serializable,
  SnakeCaseNamingStrategy,
  jsonObject,
  jsonProperty,
} from "ts-serializable";

import { RoleUnion } from "@/app/global/enum/roles";
import { UserEntry } from "@/app/global/types/user-types";

@jsonObject({ namingStrategy: new SnakeCaseNamingStrategy() })
export class UserEntity extends Serializable {
  @jsonProperty(String)
  id: string = "";

  @jsonProperty(String)
  name: string = "";

  @jsonProperty(String)
  password: string = "";

  @jsonProperty(String)
  role: RoleUnion = "ROLE_USER";

  @jsonProperty(String, null)
  refreshToken: string | null = null;

  toUserEntry = () => {
    const userEntry: UserEntry = {
      id: this.id,
      name: this.name,
      role: this.role,
    };
    return userEntry;
  };
}
