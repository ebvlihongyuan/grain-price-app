/**
 * 爬虫执行引擎
 * 根据 scraper_configs 表中的配置自动爬取企业官网数据
 */

import axios from 'axios';
import * as cheerio from 'cheerio';
import { getDb } from '../db';
import { scraperConfigs, enterprisePrices } from '../../drizzle/schema';
import { eq } from 'drizzle-orm';

interface ScrapedPrice {
  price: number;
  change: number;
  volume?: number;
  timestamp: Date;
}

interface ScraperResult {
  configId: number;
  success: boolean;
  price?: number;
  change?: string;
  error?: string;
  timestamp: Date;
}

/**
 * 通用网页爬虫函数
 * 从给定 URL 提取价格信息
 */
export async function scrapeWebsite(url: string): Promise<ScrapedPrice | null> {
  try {
    const response = await axios.get(url, {
      timeout: 10000,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
      }
    });

    const $ = cheerio.load(response.data);

    // 通用价格提取逻辑
    // 尝试多种常见的 HTML 结构
    let price: number | null = null;
    let change: number = 0;

    // 策略 1: 查找包含"价格"、"收购价"等关键词的元素
    const pricePatterns = [
      /收购价.*?(\d+\.?\d*)/i,
      /价格.*?(\d+\.?\d*)/i,
      /报价.*?(\d+\.?\d*)/i,
      /(\d+\.?\d*)\s*元\/吨/i,
    ];

    const pageText = $.text();
    for (const pattern of pricePatterns) {
      const match = pageText.match(pattern);
      if (match) {
        price = parseFloat(match[1]);
        break;
      }
    }

    // 策略 2: 查找数据表格中的价格
    if (!price) {
      $('table tr').each((_, row) => {
        const cells = $(row).find('td');
        if (cells.length > 0) {
          const text = $(cells[0]).text();
          if (text.includes('价格') || text.includes('收购')) {
            const priceCell = $(cells[1]).text();
            const match = priceCell.match(/(\d+\.?\d*)/);
            if (match) {
              price = parseFloat(match[1]);
              return false; // break
            }
          }
        }
      });
    }

    // 策略 3: 查找 data-price 属性或 class 包含 price 的元素
    if (!price) {
      $('[data-price], [class*="price"], [id*="price"]').each((_, elem) => {
        const text = $(elem).text();
        const match = text.match(/(\d+\.?\d*)/);
        if (match) {
          price = parseFloat(match[1]);
          return false; // break
        }
      });
    }

    if (!price) {
      return null;
    }

    return {
      price: Math.round(price * 100), // 转换为整数（分）
      change,
      timestamp: new Date(),
    };
  } catch (error) {
    console.error(`[Scraper] Failed to scrape ${url}:`, error);
    return null;
  }
}

/**
 * 执行单个爬虫配置
 */
export async function executeScraperConfig(configId: number): Promise<ScraperResult> {
  const db = await getDb();
  if (!db) {
    return {
      configId,
      success: false,
      error: 'Database not available',
      timestamp: new Date(),
    };
  }

  try {
    // 获取爬虫配置
    const configs = await db
      .select()
      .from(scraperConfigs)
      .where(eq(scraperConfigs.id, configId))
      .limit(1);

    if (configs.length === 0) {
      return {
        configId,
        success: false,
        error: 'Config not found',
        timestamp: new Date(),
      };
    }

    const config = configs[0];

    // 检查是否启用
    if (!config.enabled) {
      return {
        configId,
        success: false,
        error: 'Config disabled',
        timestamp: new Date(),
      };
    }

    // 执行爬虫
    const scrapedData = await scrapeWebsite(config.monitoringUrl);

    if (!scrapedData) {
      // 更新最后爬虫时间
      await db
        .update(scraperConfigs)
        .set({ lastScrapedAt: new Date() })
        .where(eq(scraperConfigs.id, configId));

      return {
        configId,
        success: false,
        error: 'Failed to extract price from website',
        timestamp: new Date(),
      };
    }

    // 获取上一次的价格用于计算涨跌幅
    const lastPrices = await db
      .select()
      .from(enterprisePrices)
      .where(eq(enterprisePrices.enterpriseId, `config_${configId}`))
      .orderBy((t) => t.createdAt)
      .limit(1);

    let change: string = '0';
    if (lastPrices.length > 0) {
      const lastPrice = lastPrices[0].price;
      const changeValue = parseFloat(((scrapedData.price - lastPrice) / lastPrice * 100).toFixed(2));
      change = changeValue.toString();
    }

    // 保存到 enterprisePrices 表
    await db.insert(enterprisePrices).values({
      enterpriseId: `config_${configId}`,
      enterpriseName: config.enterpriseName,
      region: config.region,
      grainType: config.grainType,
      price: scrapedData.price,
      change: change.toString(),
      dataSource: config.monitoringUrl,
      scrapedAt: new Date(),
    });

    // 更新最后爬虫时间
    await db
      .update(scraperConfigs)
      .set({ lastScrapedAt: new Date() })
      .where(eq(scraperConfigs.id, configId));

    return {
      configId,
      success: true,
      price: scrapedData.price,
      change,
      timestamp: new Date(),
    };
  } catch (error) {
    console.error(`[Scraper] Error executing config ${configId}:`, error);
    return {
      configId,
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date(),
    };
  }
}

/**
 * 执行所有启用的爬虫配置
 */
export async function executeAllScrapers(): Promise<ScraperResult[]> {
  const db = await getDb();
  if (!db) {
    return [];
  }

  try {
    // 获取所有启用的配置
    const configs = await db
      .select()
      .from(scraperConfigs)
      .where(eq(scraperConfigs.enabled, 1));

    // 并行执行所有爬虫
    const results = await Promise.all(
      configs.map((config) => executeScraperConfig(config.id))
    );

    return results;
  } catch (error) {
    console.error('[Scraper] Error executing all scrapers:', error);
    return [];
  }
}

/**
 * 执行特定频率的爬虫
 */
export async function executeScrapersByFrequency(frequency: 'daily' | 'weekly'): Promise<ScraperResult[]> {
  const db = await getDb();
  if (!db) {
    return [];
  }

  try {
    // 获取指定频率的配置
    const configs = await db
      .select()
      .from(scraperConfigs)
      .where(eq(scraperConfigs.updateFrequency, frequency));

    // 并行执行爬虫
    const results = await Promise.all(
      configs.map((config) => executeScraperConfig(config.id))
    );

    return results;
  } catch (error) {
    console.error(`[Scraper] Error executing ${frequency} scrapers:`, error);
    return [];
  }
}
