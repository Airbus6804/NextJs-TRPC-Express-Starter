import { createTRPCRouter, publicProcedure } from '@/lib/trpc/config'
import { protectedProcedure } from '@/lib/trpc/procedures/protectedProcedure'

export const testRouter = createTRPCRouter({
  hello: publicProcedure.query(() => {
    return 'hello world'
  }),
  user: protectedProcedure.query(async ({ ctx }) => {
    return ctx.user
  })
})
