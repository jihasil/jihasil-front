import { dynamoClient } from "@/app/(back)/shared/lib/dynamo-db";
import { Page, PageRequest } from "@/app/global/types/page-types";
import { PostFilter, PostKey } from "@/app/global/types/post-types";
import {
  PutCommand,
  PutCommandInput,
  QueryCommand,
} from "@aws-sdk/lib-dynamodb";

import { Post } from "../../domain/post";

export class PostRepository {
  getPostListByFilter = async (
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

    const { Items, LastEvaluatedKey } = await dynamoClient.send(command);
    console.log(Items);

    // @ts-expect-error 오류 유발
    const posts = Items.map((item) => {
      return Post.fromJSON(item);
    });

    const data: Page<Post, PostKey> = {
      data: posts, // 포스트 목록
      isLast: !LastEvaluatedKey, // 더 이상 데이터가 없는지 여부
      lastKey: LastEvaluatedKey as PostKey,
    };

    return data;
  };

  getPostById = async (postId: string) => {
    const getMetadataParam = {
      TableName: "post_metadata",
      IndexName: "index_post_id",
      KeyConditionExpression: "post_id = :post_id",
      ExpressionAttributeValues: {
        ":post_id": postId,
      },
    };

    const getMetadataQuery = new QueryCommand(getMetadataParam);

    console.log(getMetadataQuery);

    const posts = (await dynamoClient.send(getMetadataQuery))?.Items as Post[];

    console.log(postId);
    console.log(posts);

    if (posts.length !== 1) {
      return null;
    } else {
      return Post.fromJSON(posts[0]);
    }
  };

  createPost = async (post: Post) => {
    const metadataPutParam: PutCommandInput = {
      TableName: "post_metadata",
      Item: post.toJSON(),
    };

    const metadataPutQuery = new PutCommand(metadataPutParam);

    await dynamoClient.send(metadataPutQuery);
    return { postId: post.postId };
  };
}
