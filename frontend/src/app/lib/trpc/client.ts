// lib/trpc/client.ts
'use client';

import { createTRPCReact } from '@trpc/react-query';
import type { AppRouter } from '#/backend/src/lib/trpc';

export const trpc = createTRPCReact<AppRouter>({});