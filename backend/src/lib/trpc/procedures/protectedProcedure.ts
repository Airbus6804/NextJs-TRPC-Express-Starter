import { TRPCError } from "@trpc/server"
import { t } from "../config"


// Create a utility function for protected tRPC procedures that require an authenticated user.
export const protectedProcedure = t.procedure.use(({ ctx, next }) => {
      if (!ctx.user?.id) {
        throw new TRPCError({ code: 'UNAUTHORIZED' })
      }
    return next({
      ctx: {
        user: ctx.user
      }
    })
  })