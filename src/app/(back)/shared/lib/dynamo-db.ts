import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { fromTemporaryCredentials } from "@aws-sdk/credential-providers";
import { DynamoDBDocumentClient } from "@aws-sdk/lib-dynamodb";

export const AWS_ROLE_ARN = process.env.AWS_ROLE_ARN;

export const db = new DynamoDBClient({
  credentials: fromTemporaryCredentials({
    params: {
      RoleArn: AWS_ROLE_ARN,
      DurationSeconds: 900, // 15 minutes
    },
  }),
});

export const dynamoClient = DynamoDBDocumentClient.from(db);

export const generateUpdateExpression = (
  itemKey: object,
  updatingItem: object,
) => {
  const updatedEntries = Object.entries(updatingItem).filter(
    ([key]) => !Object.keys(itemKey).includes(key),
  );

  const exp: {
    UpdateExpression: string;
    ExpressionAttributeNames: Record<string, string>;
    ExpressionAttributeValues: Record<string, string | number | boolean>;
  } = {
    UpdateExpression: "SET",
    ExpressionAttributeNames: {},
    ExpressionAttributeValues: {},
  };

  for (const [key, value] of updatedEntries) {
    exp.UpdateExpression += ` #${key} = :${key},`;
    exp.ExpressionAttributeNames[`#${key}`] = key;
    exp.ExpressionAttributeValues[`:${key}`] = value;
  }

  // remove trailing comma
  exp.UpdateExpression = exp.UpdateExpression.slice(0, -1);
  return exp;
};
