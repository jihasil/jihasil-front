import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { fromTemporaryCredentials } from "@aws-sdk/credential-providers";

const AWS_ROLE_ARN = process.env.AWS_ROLE_ARN;

export const db = new DynamoDBClient({
  credentials: fromTemporaryCredentials({
    params: {
      RoleArn: AWS_ROLE_ARN,
    },
  }),
});
