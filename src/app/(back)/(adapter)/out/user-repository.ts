import { User } from "@/app/(back)/domain/user";
import {
  dynamoClient,
  generateUpdateExpression,
} from "@/app/(back)/shared/lib/dynamo-db";
import { Page, PageRequest } from "@/app/global/types/page-types";
import { UserEditRequestDTO, UserKey } from "@/app/global/types/user-types";
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

    const { Items, LastEvaluatedKey } = await dynamoClient.send(query);

    // @ts-expect-error 오류 유발
    const userList = Items.map((item) => {
      return User.fromJSON(item);
    });

    const data: Page<User, UserKey> = {
      data: userList, // 포스트 목록
      isLast: !LastEvaluatedKey, // 더 이상 데이터가 없는지 여부
      lastKey: LastEvaluatedKey as UserKey,
    };

    return data;
  };

  getUserById = async (id: string): Promise<User | null> => {
    const param = {
      TableName: "user",
      KeyConditionExpression: "id = :id",
      ExpressionAttributeValues: {
        ":id": id,
      },
    };

    const getMetadataQuery = new QueryCommand(param);

    console.log(getMetadataQuery);

    const userList = (await dynamoClient.send(getMetadataQuery))
      ?.Items as User[];

    console.log(id);
    console.log(userList);

    if (userList.length !== 1) {
      return null;
    } else {
      return User.fromJSON(userList[0]);
    }
  };

  createUser = async (user: User) => {
    const param: PutCommandInput = {
      TableName: "user",
      Item: user.toJSON(),
      ConditionExpression: "attribute_not_exists(id)",
      ReturnValuesOnConditionCheckFailure: "ALL_OLD",
    };

    const userPutCommand = new PutCommand(param);

    await dynamoClient.send(userPutCommand);
    return { id: user.id };
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

    await dynamoClient.send(query);
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

    const query = new DeleteCommand(param);
    await dynamoClient.send(query);
  };
}
