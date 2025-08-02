import { createTRPCRouter } from "./config";
import { testRouter } from "@/routes/router";

export const appRouter = createTRPCRouter({
  test: testRouter,
});

export type AppRouter = typeof appRouter;
