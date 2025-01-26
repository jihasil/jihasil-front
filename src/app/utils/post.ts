import { CategoryUnion } from "@/const/category";
import { IssueUnion } from "@/const/issue";
import { dynamoClient } from "@/lib/dynamo-db";
import { QueryCommand } from "@aws-sdk/lib-dynamodb";

export type Metadata = {
  thumbnail?: string | undefined; // legacy
  "created_at#issue_id"?: string; // legacy
  imageUrl?: string; // legacy
  uuid?: string; // legacy
  post_uuid?: string;
  partition_key?: string;
  thumbnail_url?: string;
  thumbnail_file?: FileList;
  title: string;
  subtitle: string;
  category: CategoryUnion;
  author: string;
  issue_id: IssueUnion;
  is_approved: boolean;
  is_deleted?: boolean;
};

export type PostInput = {
  html: string;
  metadata: Metadata;
};

export type Post = {
  "created_at#issue_id": string; // legacy
  imageUrl?: string; // legacy
  metadata?: Metadata;
  html: string;
};

export type LastPostKey = {
  "created_at#issue_id": string;
  partition_key: string;
};

export type PostResponseDTO = {
  posts: Metadata[];
  isLast: boolean;
  LastEvaluatedKey: LastPostKey;
};

export const getPost = async (postUuid: string) => {
  const getContentParam = {
    TableName: "post-content",
    KeyConditionExpression: "post_uuid = :post_uuid",
    ExpressionAttributeValues: {
      ":post_uuid": postUuid,
    },
  };

  const getMetadataParam = {
    TableName: "post",
    IndexName: "post_uuid_index",
    KeyConditionExpression: "post_uuid = :post_uuid",
    ExpressionAttributeValues: {
      ":post_uuid": postUuid,
    },
  };

  const getContentQuery = new QueryCommand(getContentParam);
  const getMetadataQuery = new QueryCommand(getMetadataParam);

  try {
    // @ts-expect-error it works
    const content = await dynamoClient.send(getContentQuery);

    // @ts-expect-error it works
    const metadata = await dynamoClient.send(getMetadataQuery);

    console.log(postUuid);
    console.log(content);
    console.log(metadata);

    if (content.Items.length !== 1 || metadata.Items.length !== 1) {
      return null;
    } else {
      const post: Post = {
        ...content.Items[0],
        metadata: { ...metadata.Items[0] },
      };
      return post;
    }
  } catch (error) {
    console.error(error);
    return null;
  }
};
