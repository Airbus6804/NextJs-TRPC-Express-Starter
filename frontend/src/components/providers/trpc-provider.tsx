'use client';

import { authClient } from '@/lib/auth';
import { trpc } from '@/lib/trpc/client';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { httpBatchLink } from '@trpc/client';
import { useState } from 'react';
import superjson from 'superjson';

function getBaseUrl() {
  // if (typeof window !== 'undefined') return ''; // Client = relative
  return process.env.NEXT_PUBLIC_BACKEND_URL ?? 'http://localhost:4000'; // Server = absolute
}

export function TrpcProvider({ children }: { children: React.ReactNode }) {

  
  const [queryClient] = useState(() => new QueryClient());
  const [trpcClient] = useState(() =>
    trpc.createClient({
      links: [
        httpBatchLink({
          url: `${getBaseUrl()}/trpc`,
          transformer: superjson,
          fetch:  async (url, opts) => {
            const response = await fetch(url, {
              ...opts,
              headers: {
                ...opts?.headers,
              },
              credentials: 'include',
            });
            if (response.status === 401) {
              try {

                await authClient.getSession({ fetchOptions: { headers: opts?.headers} },);

                return await fetch(url, {...opts, headers: {
                  ...opts?.headers,
                }, credentials: 'include'})
  
  
              } catch (error) {
                return new Response(null, { status: 401 })
              }
            }
            return response;
          },
        }),
      ],
    })
  );

  return (
    <trpc.Provider client={trpcClient} queryClient={queryClient}>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </trpc.Provider>
  );
}
