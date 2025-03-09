import { UserRepository } from "@/app/(back)/(adapter)/out/user-repository";
import { authService } from "@/app/(back)/application/model/auth-service";
import { User } from "@/app/(back)/domain/user";
import { INVALIDATED } from "@/app/(back)/shared/const/auth";
import { saltAndHashPassword } from "@/app/(back)/shared/lib/crypto";
import { Page, PageRequest } from "@/app/global/types/page-types";
import {
  ChangePasswordRequestDTO,
  UserEditRequestDTO,
  UserEntry,
  UserKey,
  UserSignInRequestDTO,
  UserSignUpRequestDTO,
} from "@/app/global/types/user-types";

class UserService {
  private userRepository: UserRepository;

  constructor({ userRepository }: { userRepository: UserRepository }) {
    this.userRepository = userRepository;
  }

  /**
   * 이미 있는 ID 일 시 ConditionalCheckFailedException
   * @param userSignUpRequestDTO
   * @return Promise<{ id: string }>
   */
  userSignUp = async (userSignUpRequestDTO: UserSignUpRequestDTO) => {
    userSignUpRequestDTO.password = await saltAndHashPassword(
      userSignUpRequestDTO.password,
    );

    const userEntity = User.fromJSON(userSignUpRequestDTO);

    return await this.userRepository.createUser(userEntity);
  };

  userSignIn = async (userSignInRequestDTO: UserSignInRequestDTO) => {
    return await authService.authenticate(userSignInRequestDTO, true);
  };

  userSignOut = async (id: string) => {
    Promise.all([
      authService.invalidateAccessToken(),
      this.invalidateUser(id),
    ]).then();
  };

  getUserEntryList = async (pageRequest: PageRequest<UserKey>) => {
    const userList = await this.userRepository.getUserList(pageRequest);

    const { data, ...pageData } = userList;

    const userEntries = data.map((user: User) => {
      return user.toUserEntry();
    });

    const userEntryList: Page<UserEntry, UserKey> = {
      data: userEntries,
      ...pageData,
    };

    return userEntryList;
  };

  getUserById = async (id: string): Promise<User | null> => {
    return await this.userRepository.getUserById(id);
  };

  editUserById = async (userEditRequest: UserEditRequestDTO) => {
    // jwt token 에 포함되는 정보가 수정될 경우 refresh token 을 무효화 함.
    if (userEditRequest.role) {
      userEditRequest.refresh_token = INVALIDATED;
    }

    await this.userRepository.editUserById(userEditRequest);
  };

  deleteUserById = async (userKey: UserKey) => {
    const user = await this.getUserById(userKey.id);
    if (user && user.role !== "ROLE_SUPERUSER") {
      await this.userRepository.editUserById({
        id: userKey.id,
        is_deleted: true,
      });
      return true;
    } else {
      return false;
    }
  };

  changePassword = async (changePasswordRequest: ChangePasswordRequestDTO) => {
    await authService.authenticate({
      id: changePasswordRequest.id,
      password: changePasswordRequest.oldPassword,
    });

    const newPasswordHash = await saltAndHashPassword(
      changePasswordRequest.newPassword,
    );

    await this.userRepository.editUserById({
      id: changePasswordRequest.id,
      password: newPasswordHash,
    });
  };

  invalidateUser = async (id: string) => {
    await this.editUserById({ id, refresh_token: INVALIDATED });
  };
}

export const userService = new UserService({
  userRepository: new UserRepository(),
});
