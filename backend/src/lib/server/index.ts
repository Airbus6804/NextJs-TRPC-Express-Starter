import { createTRPCContext } from '@/lib/trpc/config';
import { appRouter } from '@/lib/trpc/index';
import * as trpcExpress from '@trpc/server/adapters/express';
import { toNodeHandler } from 'better-auth/node';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import express from 'express';
import { auth } from '../auth';

const app = express();
app.use(cookieParser());

app.use(
    cors({
      origin: process.env.BETTER_AUTH_URL, // Replace with your frontend's origin
      methods: ["GET", "POST", "PUT", "DELETE"], // Specify allowed HTTP methods
      credentials: true, // Allow credentials (cookies, authorization headers, etc.)
    })
  );


app.all('/api/auth/*splat', toNodeHandler(auth));

app.use(express.json());
app.use(
  '/trpc',
  trpcExpress.createExpressMiddleware({
    router: appRouter,
    createContext: createTRPCContext,
  }),
);

app.listen(4000, () => {
  console.log('🚀 tRPC server listening at http://localhost:4000/trpc');
});
