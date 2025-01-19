import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";

import { validatePassword } from "@/app/utils/password";
import { db } from "@/lib/dynamo-db";
import { DynamoDBAdapter } from "@auth/dynamodb-adapter";
import { DynamoDBDocument } from "@aws-sdk/lib-dynamodb";

const docClient = DynamoDBDocument.from(db);

type User = {
  id: string;
  name: string;
  password: string;
};

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Credentials({
      // You can specify which fields should be submitted, by adding keys to the `credentials` object.
      // e.g. domain, username, password, 2FA token, etc.
      credentials: {
        id: {},
        password: {},
      },
      authorize: async (credentials) => {
        console.log(credentials);

        const response = await fetch(
          `${process.env.URL}/api/user/?id=${credentials.id}`,
          {
            method: "GET",
          },
        );

        if (response.status === 200) {
          const user: User = await response.json();
          const isValid = await validatePassword(
            credentials.password as string,
            user.password,
          );
          if (isValid) {
            return user;
          } else {
            return null;
          }
        } else {
          return null;
        }
      },
    }),
  ],
  adapter: DynamoDBAdapter(docClient),
  session: {
    strategy: "jwt",
  },
});
