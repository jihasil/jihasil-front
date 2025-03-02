import { z } from "zod";

import { UserRepository } from "@/app/(back)/(adapter)/out/user-repository";
import { authorizeUser } from "@/app/(back)/application/model/auth";
import { saltAndHashPassword } from "@/app/(back)/application/model/crypto";
import { getSession } from "@/app/(back)/application/model/request-sign-in";
import { Post } from "@/app/(back)/domain/post";
import { changeUserInfo } from "@/app/(back)/domain/user";
import { UserEntity } from "@/app/(back)/domain/userEntity";
import { INVALIDATED } from "@/app/(back)/shared/const/auth";
import {
  dynamoClient,
  generateUpdateExpression,
} from "@/app/(back)/shared/lib/dynamo-db";
import { Page, PageRequest } from "@/app/global/types/page-types";
import {
  ChangePasswordRequestDTO,
  UserEditRequestDTO,
  UserEntry,
  UserKey,
  UserSignUpRequestDTO,
  changePasswordSchema,
} from "@/app/global/types/user-types";
import { UpdateCommand } from "@aws-sdk/lib-dynamodb";

class UserService {
  private userRepository: UserRepository;

  constructor({ userRepository }: { userRepository: UserRepository }) {
    this.userRepository = userRepository;
  }

  getUserEntryList = async (pageRequest: PageRequest<UserKey>) => {
    const postList = await this.userRepository.getUserList(pageRequest);

    if (postList) {
      const { data, ...pageData } = postList;

      const userEntries = data.map((user: UserEntity) => {
        return user.toUserEntry();
      });

      const userEntryList: Page<UserEntry, UserKey> = {
        data: userEntries,
        ...pageData,
      };

      return userEntryList;
    } else {
      return null;
    }
  };

  getUserById = async (id: string) => {
    return await this.userRepository.getUserById(id);
  };

  userSignUp = async (userSignUpRequestDTO: UserSignUpRequestDTO) => {
    userSignUpRequestDTO.password = await saltAndHashPassword(
      userSignUpRequestDTO.password,
    );

    const userEntity = UserEntity.fromJSON(userSignUpRequestDTO);

    return await this.userRepository.createUser(userEntity);
  };

  editUserById = async (userEditRequest: UserEditRequestDTO) => {
    // jwt token 에 포함되는 정보가 수정될 경우 refresh token 을 무효화 함.
    if (userEditRequest.role) {
      userEditRequest.refreshToken = INVALIDATED;
    }

    return this.userRepository.editUserById(userEditRequest);
  };

  deleteUserById = async (userKey: UserKey) => {
    return this.userRepository.deleteUserById(userKey);
  };

  changePassword = async (changePasswordRequest: ChangePasswordRequestDTO) => {
    const userExists = await authorizeUser({
      id: changePasswordRequest.id,
      password: changePasswordRequest.oldPassword,
    });

    if (!userExists) {
      return false;
    }

    const newPasswordHash = await saltAndHashPassword(
      changePasswordRequest.newPassword,
    );

    return this.userRepository.editUserById({
      id: changePasswordRequest.id,
      password: newPasswordHash,
    });
  };
}

export const userService = new UserService({
  userRepository: new UserRepository(),
});
