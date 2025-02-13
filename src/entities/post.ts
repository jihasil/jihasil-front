import { dynamoClient } from "@/shared/lib/dynamo-db";
import { Post } from "@/shared/types/post-types";
import { QueryCommand } from "@aws-sdk/lib-dynamodb";

export const getPost = async (postId: string) => {
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

    // @ts-expect-error it works
    const postContent = await dynamoClient.send(getContentQuery);

    // @ts-expect-error it works
    const postMetadata = await dynamoClient.send(getMetadataQuery);

    console.log(postId);
    console.log(postContent);
    console.log(postMetadata);

    // @ts-expect-error 기본값 설정해서 undefined 될 일 없음
    if (postContent.Items.length !== 1 || postMetadata.Items.length !== 1) {
      return null;
    } else {
      const post: Post = {
        // @ts-expect-error 기본값 설정해서 undefined 될 일 없음
        ...postContent.Items[0],
        // @ts-expect-error 기본값 설정해서 undefined 될 일 없음
        postMetadata: { ...postMetadata.Items[0] },
      };
      return post;
    }
  } catch (error) {
    console.error(error);
    return null;
  }
};
