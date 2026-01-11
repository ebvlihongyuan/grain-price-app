/**
 * 爬虫执行管理 tRPC 路由
 * 提供爬虫执行、调度和监控的 API
 */

import { protectedProcedure, router } from '../_core/trpc';
import { TRPCError } from '@trpc/server';
import { z } from 'zod';
import { executeScraperConfig, executeAllScrapers, executeScrapersByFrequency } from '../scraper/engine';
import { 
  startAllScraperTasks, 
  stopAllScraperTasks, 
  getTaskStatus, 
  manualExecuteScrapers 
} from '../scraper/scheduler';
import { 
  getRecentLogs, 
  getLogsForEnterprise, 
  getFailedLogs, 
  getLogStatistics 
} from '../scraper/logger';

export const scraperExecutionRouter = router({
  /**
   * 手动执行单个爬虫配置
   */
  executeConfig: protectedProcedure
    .input(z.object({ configId: z.number() }))
    .mutation(async ({ input, ctx }) => {
      if (ctx.user?.role !== 'admin') {
        throw new TRPCError({ code: 'FORBIDDEN' });
      }

      try {
        const result = await executeScraperConfig(input.configId);
        return result;
      } catch (error) {
        console.error('[API] Error executing scraper config:', error);
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to execute scraper config',
        });
      }
    }),

  /**
   * 手动执行所有爬虫
   */
  executeAll: protectedProcedure.mutation(async ({ ctx }) => {
    if (ctx.user?.role !== 'admin') {
      throw new TRPCError({ code: 'FORBIDDEN' });
    }

    try {
      const results = await executeAllScrapers();
      const successCount = results.filter((r) => r.success).length;
      return {
        total: results.length,
        successful: successCount,
        failed: results.length - successCount,
        results,
      };
    } catch (error) {
      console.error('[API] Error executing all scrapers:', error);
      throw new TRPCError({
        code: 'INTERNAL_SERVER_ERROR',
        message: 'Failed to execute all scrapers',
      });
    }
  }),

  /**
   * 执行特定频率的爬虫
   */
  executeByFrequency: protectedProcedure
    .input(z.object({ frequency: z.enum(['daily', 'weekly']) }))
    .mutation(async ({ input, ctx }) => {
      if (ctx.user?.role !== 'admin') {
        throw new TRPCError({ code: 'FORBIDDEN' });
      }

      try {
        const results = await executeScrapersByFrequency(input.frequency);
        const successCount = results.filter((r) => r.success).length;
        return {
          frequency: input.frequency,
          total: results.length,
          successful: successCount,
          failed: results.length - successCount,
          results,
        };
      } catch (error) {
        console.error('[API] Error executing scrapers by frequency:', error);
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to execute scrapers by frequency',
        });
      }
    }),

  /**
   * 启动定时爬虫任务
   */
  startScheduler: protectedProcedure.mutation(async ({ ctx }) => {
    if (ctx.user?.role !== 'admin') {
      throw new TRPCError({ code: 'FORBIDDEN' });
    }

    try {
      startAllScraperTasks();
      const tasks = getTaskStatus();
      return {
        success: true,
        tasks,
      };
    } catch (error) {
      console.error('[API] Error starting scheduler:', error);
      throw new TRPCError({
        code: 'INTERNAL_SERVER_ERROR',
        message: 'Failed to start scheduler',
      });
    }
  }),

  /**
   * 停止定时爬虫任务
   */
  stopScheduler: protectedProcedure.mutation(async ({ ctx }) => {
    if (ctx.user?.role !== 'admin') {
      throw new TRPCError({ code: 'FORBIDDEN' });
    }

    try {
      stopAllScraperTasks();
      return {
        success: true,
        message: 'All scheduler tasks stopped',
      };
    } catch (error) {
      console.error('[API] Error stopping scheduler:', error);
      throw new TRPCError({
        code: 'INTERNAL_SERVER_ERROR',
        message: 'Failed to stop scheduler',
      });
    }
  }),

  /**
   * 获取调度器任务状态
   */
  getSchedulerStatus: protectedProcedure.query(async ({ ctx }) => {
    if (ctx.user?.role !== 'admin') {
      throw new TRPCError({ code: 'FORBIDDEN' });
    }

    try {
      const tasks = getTaskStatus();
      return {
        tasks,
        running: tasks.some((t) => t.running),
      };
    } catch (error) {
      console.error('[API] Error getting scheduler status:', error);
      throw new TRPCError({
        code: 'INTERNAL_SERVER_ERROR',
        message: 'Failed to get scheduler status',
      });
    }
  }),

  /**
   * 获取最近的爬虫日志
   */
  getRecentLogs: protectedProcedure
    .input(z.object({ limit: z.number().default(50) }))
    .query(async ({ input, ctx }) => {
      if (ctx.user?.role !== 'admin') {
        throw new TRPCError({ code: 'FORBIDDEN' });
      }

      try {
        const logs = getRecentLogs(input.limit);
        return logs;
      } catch (error) {
        console.error('[API] Error getting recent logs:', error);
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to get recent logs',
        });
      }
    }),

  /**
   * 获取特定企业的日志
   */
  getEnterpriseLogs: protectedProcedure
    .input(z.object({ configId: z.number(), limit: z.number().default(10) }))
    .query(async ({ input, ctx }) => {
      if (ctx.user?.role !== 'admin') {
        throw new TRPCError({ code: 'FORBIDDEN' });
      }

      try {
        const logs = getLogsForEnterprise(input.configId, input.limit);
        return logs;
      } catch (error) {
        console.error('[API] Error getting enterprise logs:', error);
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to get enterprise logs',
        });
      }
    }),

  /**
   * 获取失败的日志
   */
  getFailedLogs: protectedProcedure
    .input(z.object({ limit: z.number().default(20) }))
    .query(async ({ input, ctx }) => {
      if (ctx.user?.role !== 'admin') {
        throw new TRPCError({ code: 'FORBIDDEN' });
      }

      try {
        const logs = getFailedLogs(input.limit);
        return logs;
      } catch (error) {
        console.error('[API] Error getting failed logs:', error);
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to get failed logs',
        });
      }
    }),

  /**
   * 获取日志统计信息
   */
  getLogStatistics: protectedProcedure.query(async ({ ctx }) => {
    if (ctx.user?.role !== 'admin') {
      throw new TRPCError({ code: 'FORBIDDEN' });
    }

    try {
      const stats = getLogStatistics();
      return stats;
    } catch (error) {
      console.error('[API] Error getting log statistics:', error);
      throw new TRPCError({
        code: 'INTERNAL_SERVER_ERROR',
        message: 'Failed to get log statistics',
      });
    }
  }),
});
