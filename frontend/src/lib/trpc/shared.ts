// lib/trpc/shared.ts
import type { AppRouter } from "#/backend/src/lib/trpc";
import { createTRPCProxyClient, httpBatchLink, TRPCClient } from "@trpc/client";
import superjson from "superjson";

export function getBaseUrl() {
  return process.env.NEXT_PUBLIC_BACKEND_URL ?? "http://localhost:4000";
}

export function createTRPCClient(headers?: HeadersInit): TRPCClient<AppRouter> {
  return createTRPCProxyClient<AppRouter>({
    links: [
      httpBatchLink({
        url: `${getBaseUrl()}/trpc`,
        transformer: superjson, // ✅ moved inside httpBatchLink
        headers: () => headers ?? {},
        fetch: async (url, opts) => {
          const response = await fetch(url, {
            ...opts,
            // credentials: 'include', // 🔐 for cookie-based auth
            headers: {
              ...opts?.headers,
            },
          });
          if (response.status === 401) {
            try {
              const stream = await fetch(`${getBaseUrl()}/api/auth/token`, {
                method: 'GET',
                headers: {
                  ...headers,                  
                },
              })
              const data = await stream.json()
              
              if(!data.token) {
                return new Response(null, { status: 401 })
              }
              
              return await fetch(url, {...opts, headers: {
                ...opts?.headers,
                Authorization: `Bearer ${data.token}`
              }})


            } catch (error) {
              return new Response(null, { status: 401 })
            }
          }
          return response;
        },
      }),
    ],
  });
}
