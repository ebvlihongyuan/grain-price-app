import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, protectedProcedure, router } from "./_core/trpc";
import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { scraperExecutionRouter } from "./routers/scraperExecution";

export const appRouter = router({
  system: systemRouter,
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return {
        success: true,
      } as const;
    }),
  }),

  scraper: router({
    listConfigs: publicProcedure.query(async () => {
      const { getAllScraperConfigs } = await import('./db');
      return getAllScraperConfigs();
    }),
    getConfig: publicProcedure.input(z.object({ id: z.number() })).query(async ({ input }) => {
      const { getScraperConfigById } = await import('./db');
      return getScraperConfigById(input.id);
    }),
    createConfig: protectedProcedure.input(z.object({
      enterpriseName: z.string(),
      region: z.string(),
      grainType: z.string(),
      officialWebsite: z.string().url(),
      monitoringUrl: z.string().url(),
      updateFrequency: z.enum(['daily', 'weekly']),
    })).mutation(async ({ input, ctx }) => {
      if (ctx.user?.role !== 'admin') throw new TRPCError({ code: 'FORBIDDEN' });
      const { createScraperConfig } = await import('./db');
      return createScraperConfig(input);
    }),
    updateConfig: protectedProcedure.input(z.object({
      id: z.number(),
      enterpriseName: z.string().optional(),
      officialWebsite: z.string().url().optional(),
      monitoringUrl: z.string().url().optional(),
      updateFrequency: z.enum(['daily', 'weekly']).optional(),
      enabled: z.number().optional(),
    })).mutation(async ({ input, ctx }) => {
      if (ctx.user?.role !== 'admin') throw new TRPCError({ code: 'FORBIDDEN' });
      const { updateScraperConfig } = await import('./db');
      const { id, ...rest } = input;
      return updateScraperConfig(id, rest);
    }),
    deleteConfig: protectedProcedure.input(z.object({ id: z.number() })).mutation(async ({ input, ctx }) => {
      if (ctx.user?.role !== 'admin') throw new TRPCError({ code: 'FORBIDDEN' });
      const { deleteScraperConfig } = await import('./db');
      return deleteScraperConfig(input.id);
    }),
    execution: scraperExecutionRouter,
  }),
});

export type AppRouter = typeof appRouter;
