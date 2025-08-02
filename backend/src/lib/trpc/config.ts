import { db } from '@/lib/db';
import { JwtPayload } from '@/types/auth/jwt-payload';
import { initTRPC } from '@trpc/server';
import { CreateExpressContextOptions } from '@trpc/server/adapters/express';
import { jwtVerify } from 'jose';
import superjson from 'superjson';
import { ZodError } from 'zod';
import { JWKS } from '../jwks';

// Create the tRPC context, which includes the database client and the potentially authenticated user. This will provide convenient access to both within our tRPC procedures.
export const createTRPCContext = async (opts: CreateExpressContextOptions) => {

  let user = null;

  try{

    const token = opts.req.headers['authorization']?.split(' ')[1] ?? opts.req.cookies['bearer_token']
    const {payload} = await jwtVerify<JwtPayload>(token, JWKS)
    user = payload;
  } catch (error) {
    // console.error(error)
  }

  const source = opts.req.headers['x-trpc-source'] ?? 'unknown'
  console.log('>>> tRPC Request from', source, 'by', user?.email)

  return {
    db,
    user
  }
}
type Context = Awaited<ReturnType<typeof createTRPCContext>>


// Initialize tRPC with the context we just created and the SuperJSON transformer.
export const t = initTRPC.context<Context>().create({
  transformer: superjson,
  errorFormatter: ({ shape, error }) => ({
    ...shape,
    data: {
      ...shape.data,
      zodError: error.cause instanceof ZodError ? error.cause.flatten() : null
    }
  })
})

// Create a caller factory for making server-side tRPC calls from loaders or actions.
export const createCallerFactory = t.createCallerFactory

// Utility for creating a tRPC router
export const createTRPCRouter = t.router

// Utility for a public procedure (doesn't require an autheticated user)
export const publicProcedure = t.procedure


