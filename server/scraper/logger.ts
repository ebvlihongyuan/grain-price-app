/**
 * 爬虫日志记录模块
 * 记录爬虫执行的状态、结果和错误
 */

import { getDb } from '../db';
import { scraperConfigs } from '../../drizzle/schema';
import { eq } from 'drizzle-orm';

export interface ScraperLog {
  configId: number;
  enterpriseName: string;
  status: 'success' | 'failed' | 'skipped';
  price?: number;
  change?: string;
  error?: string;
  executedAt: Date;
}

// 内存中存储最近的日志（用于快速查询）
const recentLogs: ScraperLog[] = [];
const MAX_LOGS = 1000;

/**
 * 记录爬虫执行日志
 */
export function logScraperExecution(log: ScraperLog): void {
  // 添加到内存日志
  recentLogs.unshift(log);
  if (recentLogs.length > MAX_LOGS) {
    recentLogs.pop();
  }

  // 打印日志
  const timestamp = log.executedAt.toISOString();
  const statusEmoji = log.status === 'success' ? '✓' : log.status === 'failed' ? '✗' : '⊘';
  
  if (log.status === 'success') {
    console.log(
      `${statusEmoji} [${timestamp}] ${log.enterpriseName}: ¥${log.price}/吨 (${log.change}%)`
    );
  } else {
    console.log(
      `${statusEmoji} [${timestamp}] ${log.enterpriseName}: ${log.error || 'Unknown error'}`
    );
  }
}

/**
 * 获取最近的日志
 */
export function getRecentLogs(limit: number = 50): ScraperLog[] {
  return recentLogs.slice(0, limit);
}

/**
 * 获取特定企业的日志
 */
export function getLogsForEnterprise(configId: number, limit: number = 10): ScraperLog[] {
  return recentLogs.filter((log) => log.configId === configId).slice(0, limit);
}

/**
 * 获取失败的日志
 */
export function getFailedLogs(limit: number = 20): ScraperLog[] {
  return recentLogs.filter((log) => log.status === 'failed').slice(0, limit);
}

/**
 * 清空日志
 */
export function clearLogs(): void {
  recentLogs.length = 0;
  console.log('[Logger] All logs cleared');
}

/**
 * 获取日志统计信息
 */
export function getLogStatistics(): {
  total: number;
  successful: number;
  failed: number;
  skipped: number;
  successRate: number;
} {
  const total = recentLogs.length;
  const successful = recentLogs.filter((log) => log.status === 'success').length;
  const failed = recentLogs.filter((log) => log.status === 'failed').length;
  const skipped = recentLogs.filter((log) => log.status === 'skipped').length;
  const successRate = total > 0 ? (successful / total) * 100 : 0;

  return {
    total,
    successful,
    failed,
    skipped,
    successRate: parseFloat(successRate.toFixed(2)),
  };
}
