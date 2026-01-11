/**
 * 爬虫执行引擎初始化
 * 在应用启动时自动启动定时爬虫任务
 */

import { startAllScraperTasks } from './scheduler';

let initialized = false;

/**
 * 初始化爬虫系统
 * 在应用启动时调用一次
 */
export function initializeScraperSystem(): void {
  if (initialized) {
    console.log('[Scraper] System already initialized');
    return;
  }

  try {
    console.log('[Scraper] Initializing scraper system...');
    
    // 启动所有定时爬虫任务
    startAllScraperTasks();
    
    initialized = true;
    console.log('[Scraper] Scraper system initialized successfully');
  } catch (error) {
    console.error('[Scraper] Failed to initialize scraper system:', error);
  }
}

/**
 * 获取初始化状态
 */
export function isScraperSystemInitialized(): boolean {
  return initialized;
}
