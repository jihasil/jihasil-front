import { dynamoClient } from "@/app/(back)/shared/lib/dynamo-db";
import { PageRequest } from "@/app/global/types/page-types";
import {
  Post,
  PostFilter,
  PostKey,
  PostMetadata,
  PostResponseDTO,
} from "@/app/global/types/post-types";
import { QueryCommand } from "@aws-sdk/lib-dynamodb";

export class PostRepository {
  getPostMetadataListByFilter = async (
    pageRequest: PageRequest<PostKey>,
    filter: PostFilter,
  ) => {
    const param = {
      TableName: "post_metadata",
      Limit: pageRequest.pageSize,
      ...(filter.issue_id
        ? {
            IndexName: "index_issue_id",
            KeyConditionExpression: "issue_id = :issue_id",
            ExpressionAttributeValues: {
              ":issue_id": filter.issue_id,
            },
          }
        : {
            KeyConditionExpression: "board = :board",
            ExpressionAttributeValues: {
              ":board": "main",
            },
          }),
      ScanIndexForward: false,
      ...(pageRequest.lastKey && {
        ExclusiveStartKey: pageRequest.lastKey,
      }),
    };

    console.log(param);

    const command = new QueryCommand(param);

    try {
      const { Items, LastEvaluatedKey } = await dynamoClient.send(command);
      console.log(Items);

      const data: PostResponseDTO = {
        postMetadataList: Items as PostMetadata[], // 포스트 목록
        isLast: !LastEvaluatedKey, // 더 이상 데이터가 없는지 여부
        lastPostKey: LastEvaluatedKey as PostKey,
      };

      return data;
    } catch (error) {
      console.error("Error fetching posts:", error);
      return null;
    }
  };

  getPostById = async (postId: string) => {
    const getContentParam = {
      TableName: "post_content",
      KeyConditionExpression: "post_id = :post_id",
      ExpressionAttributeValues: {
        ":post_id": postId,
      },
    };

    const getMetadataParam = {
      TableName: "post_metadata",
      IndexName: "index_post_id",
      KeyConditionExpression: "post_id = :post_id",
      ExpressionAttributeValues: {
        ":post_id": postId,
      },
    };

    const getContentQuery = new QueryCommand(getContentParam);
    const getMetadataQuery = new QueryCommand(getMetadataParam);

    try {
      console.log(getContentQuery);
      console.log(getMetadataQuery);

      const postContent = (await dynamoClient.send(getContentQuery))
        ?.Items as Post[];
      const postMetadata = (await dynamoClient.send(getMetadataQuery))
        ?.Items as PostMetadata[];

      console.log(postId);
      console.log(postContent);
      console.log(postMetadata);

      if (postContent.length !== 1 || postMetadata.length !== 1) {
        return null;
      } else {
        const post: Post = {
          ...postContent[0],
          postMetadata: { ...postMetadata[0] },
        };
        return post;
      }
    } catch (error) {
      console.error(error);
      return null;
    }
  };
}
