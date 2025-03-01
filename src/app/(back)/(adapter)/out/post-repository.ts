import { dynamoClient } from "@/app/(back)/shared/lib/dynamo-db";
import { Post, PostMetadata } from "@/app/global/types/post-types";
import { QueryCommand } from "@aws-sdk/lib-dynamodb";

export class PostRepository {
  getAllPost = () => {};

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
