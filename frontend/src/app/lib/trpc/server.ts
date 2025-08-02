// lib/trpc/server.ts
import { cookies, headers } from 'next/headers';
import { createTRPCClient } from './shared';
import { TRPCClient } from '@trpc/client';
import { AppRouter } from '#/backend/src/lib/trpc';

export const serverClient = async (): Promise<TRPCClient<AppRouter>> => {
  const resolvedCookies = await cookies()
  const cookie = resolvedCookies.toString(); // all cookies
  const headerList = await headers();



  return createTRPCClient({
    cookie,
    'x-forwarded-host': headerList.get('x-forwarded-host') ?? '',
    'x-forwarded-proto': headerList.get('x-forwarded-proto') ?? '',
  });
};
