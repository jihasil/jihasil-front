import { AWS_ROLE_ARN } from "@/lib/dynamo-db";
import { S3Client } from "@aws-sdk/client-s3";
import { fromTemporaryCredentials } from "@aws-sdk/credential-providers";

export const bucket = process.env.BUCKET;
const region = process.env.REGION ?? "ap-northeast-2";
export const postMediaPrefix = process.env.POST_MEDIA_PREFIX;
export const cfUrl = process.env.CF_URL;

export const s3Client = new S3Client({
  region: region,
  credentials: fromTemporaryCredentials({
    params: {
      RoleArn: AWS_ROLE_ARN,
    },
  }),
});
