import { createAuthClient } from "better-auth/react";
import { inferAdditionalFields } from "better-auth/client/plugins";
import Cookies from "js-cookie";

export const authClient = createAuthClient({
  baseURL: process.env.NEXT_PUBLIC_BACKEND_URL,
  plugins: [
    inferAdditionalFields({
      user: {
        name: { type: "string" },
        lastname: { type: "string" },
      },
    }),
  ],
  fetchOptions: {
    onSuccess: async (ctx) => {
      if (typeof window !== "undefined") {
        const authToken = ctx.response.headers.get("set-auth-jwt"); // get the token from the response headers

        if (authToken) {
          Cookies.set("bearer_token", authToken);
        }
        // else {
        //   const cookies = await import('next/headers').then(mod => mod.cookies)
        //   const resolvedCookies = await cookies()
        //   resolvedCookies.set("bearer_token", authToken);
        // }
      }
    },
  },
});
