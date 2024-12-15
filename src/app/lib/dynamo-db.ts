import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { awsCredentialsProvider } from '@vercel/functions/oidc';

const ENV = process.env.NODE_ENV || 'development';
const AWS_REGION = process.env.AWS_REGION;
const AWS_ROLE_ARN = process.env.AWS_ROLE_ARN;

const credentials = () => {
  if (ENV === 'development') {
    return {};
  } else {
    return {
      region: AWS_REGION,
      credentials: awsCredentialsProvider({
        roleArn: AWS_ROLE_ARN,
      }),
    };
  }
};

export const db = new DynamoDBClient(credentials());
