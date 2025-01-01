import NextAuth from "next-auth";
import Google from "next-auth/providers/google";

import { db } from "@/app/lib/dynamo-db";
import { DynamoDBAdapter } from "@auth/dynamodb-adapter";
import { DynamoDBDocument } from "@aws-sdk/lib-dynamodb";

const docClient = DynamoDBDocument.from(db);

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [Google],
  adapter: DynamoDBAdapter(docClient),
  debug: true,
  session: {
    strategy: "jwt",
  },
});
