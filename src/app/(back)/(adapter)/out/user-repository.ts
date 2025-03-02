import { Post } from "@/app/(back)/domain/post";
import { UserEntity } from "@/app/(back)/domain/userEntity";
import { INVALIDATED } from "@/app/(back)/shared/const/auth";
import {
  dynamoClient,
  generateUpdateExpression,
} from "@/app/(back)/shared/lib/dynamo-db";
import { Page, PageRequest } from "@/app/global/types/page-types";
import { PostFilter, PostKey } from "@/app/global/types/post-types";
import {
  UserEditRequestDTO,
  UserFilter,
  UserKey,
} from "@/app/global/types/user-types";
import {
  DeleteCommand,
  PutCommand,
  PutCommandInput,
  QueryCommand,
  ScanCommand,
  UpdateCommand,
} from "@aws-sdk/lib-dynamodb";

export class UserRepository {
  getUserList = async (pageRequest: PageRequest<UserKey>) => {
    const param = {
      TableName: "user",
      Limit: pageRequest.pageSize,
      ...(pageRequest.lastKey && {
        ExclusiveStartKey: pageRequest.lastKey,
      }),
    };

    console.log(param);

    const query = new ScanCommand(param);

    try {
      const { Items, LastEvaluatedKey } = await dynamoClient.send(query);
      console.log(Items);

      // @ts-expect-error 오류 유발
      const userList = Items.map((item) => {
        return UserEntity.fromJSON(item);
      });

      const data: Page<UserEntity, UserKey> = {
        data: userList, // 포스트 목록
        isLast: !LastEvaluatedKey, // 더 이상 데이터가 없는지 여부
        lastKey: LastEvaluatedKey as UserKey,
      };

      return data;
    } catch (error) {
      console.error("Error fetching posts:", error);
      return null;
    }
  };

  getUserById = async (id: string) => {
    const param = {
      TableName: "user",
      KeyConditionExpression: "id = :id",
      ExpressionAttributeValues: {
        ":id": id,
      },
    };

    const getMetadataQuery = new QueryCommand(param);

    try {
      console.log(getMetadataQuery);

      const userList = (await dynamoClient.send(getMetadataQuery))
        ?.Items as UserEntity[];

      console.log(id);
      console.log(userList);

      if (userList.length !== 1) {
        return null;
      } else {
        return UserEntity.fromJSON(userList[0]);
      }
    } catch (error) {
      console.error(error);
      return null;
    }
  };

  createUser = async (user: UserEntity) => {
    const param: PutCommandInput = {
      TableName: "user",
      Item: user.toJSON(),
      ConditionExpression: "attribute_not_exists(id)",
      ReturnValuesOnConditionCheckFailure: "ALL_OLD",
    };

    const userPutCommand = new PutCommand(param);

    try {
      await dynamoClient.send(userPutCommand);
      return { id: user.id };
    } catch (error: any) {
      console.log(error);
      return error;
    }
  };

  editUserById = async (userEditRequest: UserEditRequestDTO) => {
    const userKey: UserKey = {
      id: userEditRequest.id,
    };

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
      return error;
    }
  };

  deleteUserById = async (userKey: UserKey) => {
    const param = {
      TableName: "user",
      Key: userKey,
      ConditionExpression: "#role <> :role",
      ExpressionAttributeNames: {
        "#role": "role",
      },
      ExpressionAttributeValues: {
        ":role": "ROLE_SUPERUSER",
      },
    };

    try {
      const query = new DeleteCommand(param);
      await dynamoClient.send(query);

      return true;
    } catch (error) {
      console.error(error);
      return error;
    }
  };
}
