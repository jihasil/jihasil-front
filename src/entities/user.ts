import { INVALIDATED } from "@/shared/const/auth";
import { RoleUnion, roleOrdinal } from "@/shared/enum/roles";
import { dynamoClient, generateUpdateExpression } from "@/shared/lib/dynamo-db";
import { User, UserEditRequestDTO, UserKey } from "@/shared/types/user-types";
import { QueryCommand, UpdateCommand } from "@aws-sdk/lib-dynamodb";

export const getUser = async (id: string): Promise<User | null> => {
  const param = {
    TableName: "user",
    KeyConditionExpression: "id = :id",
    ExpressionAttributeValues: {
      ":id": id,
    },
  };

  const command = new QueryCommand(param);
  console.log(`getting user ${id}`);

  try {
    const { Items } = await dynamoClient.send(command);
    console.log(Items);

    if (!Items || Items.length !== 1) {
      return null;
    } else {
      return Items[0] as User;
    }
  } catch (error) {
    console.log(typeof error);
    console.error(error);
    console.log(`${id} error occurred`);
    console.log(error);
    return null;
  }
};

export const changeUserInfo = async (userEditRequest: UserEditRequestDTO) => {
  const userKey: UserKey = {
    id: userEditRequest.id,
  };

  // jwt token 에 포함되는 정보가 수정될 경우 refresh token 을 무효화 함.
  if (userEditRequest.role || userEditRequest.password) {
    userEditRequest.refreshToken = INVALIDATED;
  }

  const exp = generateUpdateExpression(userKey, userEditRequest);

  const param = {
    TableName: "user",
    Key: userKey,
    ...exp,
  };

  console.log(param);
  const query = new UpdateCommand(param);

  console.log(query);

  try {
    await dynamoClient.send(query);
    return true;
  } catch (error: any) {
    console.log(error);
    return false;
  }
};

export const invalidateUser = async (userKey: UserKey) => {
  return await changeUserInfo({
    id: userKey.id,
    refreshToken: INVALIDATED,
  });
};

export const hasEnoughRole = (
  minimumRole: RoleUnion,
  role: RoleUnion = "ROLE_USER",
) => {
  return roleOrdinal[minimumRole] <= roleOrdinal[role];
};
