/**
 * 爬虫调度器
 * 使用 node-cron 实现定时爬虫任务
 */

import * as cron from 'node-cron';
import { executeScrapersByFrequency, executeAllScrapers } from './engine';

interface ScheduledTask {
  name: string;
  task: ReturnType<typeof cron.schedule>;
  running: boolean;
}

const scheduledTasks: Map<string, ScheduledTask> = new Map();

/**
 * 启动每日爬虫任务
 * 每天早上 8:00 执行一次
 */
export function startDailyScraperTask(): void {
  if (scheduledTasks.has('daily')) {
    console.log('[Scheduler] Daily scraper task already running');
    return;
  }

  // 每天 8:00 执行
  const task = cron.schedule('0 8 * * *', async () => {
    console.log('[Scheduler] Starting daily scraper task...');
    try {
      const results = await executeScrapersByFrequency('daily');
      const successCount = results.filter((r) => r.success).length;
      console.log(`[Scheduler] Daily scraper completed: ${successCount}/${results.length} successful`);
    } catch (error) {
      console.error('[Scheduler] Daily scraper task failed:', error);
    }
  });

  scheduledTasks.set('daily', {
    name: 'Daily Scraper',
    task,
    running: true,
  });

  console.log('[Scheduler] Daily scraper task started (runs at 08:00 every day)');
}

/**
 * 启动每周爬虫任务
 * 每周一早上 9:00 执行一次
 */
export function startWeeklyScraperTask(): void {
  if (scheduledTasks.has('weekly')) {
    console.log('[Scheduler] Weekly scraper task already running');
    return;
  }

  // 每周一 9:00 执行
  const task = cron.schedule('0 9 * * 1', async () => {
    console.log('[Scheduler] Starting weekly scraper task...');
    try {
      const results = await executeScrapersByFrequency('weekly');
      const successCount = results.filter((r) => r.success).length;
      console.log(`[Scheduler] Weekly scraper completed: ${successCount}/${results.length} successful`);
    } catch (error) {
      console.error('[Scheduler] Weekly scraper task failed:', error);
    }
  });

  scheduledTasks.set('weekly', {
    name: 'Weekly Scraper',
    task,
    running: true,
  });

  console.log('[Scheduler] Weekly scraper task started (runs at 09:00 every Monday)');
}

/**
 * 启动所有定时爬虫任务
 */
export function startAllScraperTasks(): void {
  startDailyScraperTask();
  startWeeklyScraperTask();
  console.log('[Scheduler] All scraper tasks started');
}

/**
 * 停止指定的爬虫任务
 */
export function stopScraperTask(taskName: string): void {
  const task = scheduledTasks.get(taskName);
  if (!task) {
    console.warn(`[Scheduler] Task ${taskName} not found`);
    return;
  }

  task.task.stop();
  task.running = false;
  scheduledTasks.delete(taskName);
  console.log(`[Scheduler] Task ${taskName} stopped`);
}

/**
 * 停止所有爬虫任务
 */
export function stopAllScraperTasks(): void {
  scheduledTasks.forEach((task) => {
    task.task.stop();
    task.running = false;
  });
  scheduledTasks.clear();
  console.log('[Scheduler] All scraper tasks stopped');
}

/**
 * 获取所有任务状态
 */
export function getTaskStatus(): Array<{
  name: string;
  running: boolean;
}> {
  const tasks: Array<{ name: string; running: boolean }> = [];
  scheduledTasks.forEach((task) => {
    tasks.push({
      name: task.name,
      running: task.running,
    });
  });
  return tasks;
}

/**
 * 手动执行爬虫任务（用于测试或临时执行）
 */
export async function manualExecuteScrapers(): Promise<void> {
  console.log('[Scheduler] Manual execution of all scrapers...');
  try {
    const results = await executeAllScrapers();
    const successCount = results.filter((r) => r.success).length;
    console.log(`[Scheduler] Manual execution completed: ${successCount}/${results.length} successful`);
  } catch (error) {
    console.error('[Scheduler] Manual execution failed:', error);
  }
}
