import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "./db/index";
import * as schema from "./db/schema/schema";
import { bearer, jwt } from "better-auth/plugins";

export const auth = betterAuth({
  emailAndPassword: {
    enabled: true,
  },
  user: {
    additionalFields: {
      name: { type: "string" },
      lastname: { type: "string" },
    },
  },
  database: drizzleAdapter(db, {
    provider: "pg", // or "mysql", "sqlite"
    schema,
  }),

  plugins: [
    bearer(),
    jwt({
      jwt:{
        expirationTime: '20s'
      }
    })
  ]
});
