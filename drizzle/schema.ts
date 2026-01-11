import { int, mysqlEnum, mysqlTable, text, timestamp, varchar, decimal } from "drizzle-orm/mysql-core";

/**
 * Core user table backing auth flow.
 * Extend this file with additional tables as your product grows.
 * Columns use camelCase to match both database fields and generated types.
 */
export const users = mysqlTable("users", {
  /**
   * Surrogate primary key. Auto-incremented numeric value managed by the database.
   * Use this for relations between tables.
   */
  id: int("id").autoincrement().primaryKey(),
  /** Manus OAuth identifier (openId) returned from the OAuth callback. Unique per user. */
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

// 粮食价格数据表
export const grainPrices = mysqlTable('grain_prices', {
  id: int('id').autoincrement().primaryKey(),
  region: varchar('region', { length: 64 }).notNull(),
  grainType: varchar('grain_type', { length: 32 }).notNull(),
  price: int('price').notNull(),
  change: decimal('change', { precision: 5, scale: 2 }).notNull(),
  dataSource: varchar('data_source', { length: 128 }).notNull(),
  scrapedAt: timestamp('scraped_at').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export type GrainPrice = typeof grainPrices.$inferSelect;
export type InsertGrainPrice = typeof grainPrices.$inferInsert;

// 企业价格数据表
export const enterprisePrices = mysqlTable('enterprise_prices', {
  id: int('id').autoincrement().primaryKey(),
  enterpriseId: varchar('enterprise_id', { length: 64 }).notNull(),
  enterpriseName: varchar('enterprise_name', { length: 128 }).notNull(),
  region: varchar('region', { length: 64 }).notNull(),
  grainType: varchar('grain_type', { length: 32 }).notNull(),
  price: int('price').notNull(),
  change: decimal('change', { precision: 5, scale: 2 }).notNull(),
  monthlyVolume: decimal('monthly_volume', { precision: 10, scale: 2 }),
  yearlyVolume: decimal('yearly_volume', { precision: 10, scale: 2 }),
  dataSource: varchar('data_source', { length: 128 }).notNull(),
  scrapedAt: timestamp('scraped_at').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export type EnterprisePrice = typeof enterprisePrices.$inferSelect;
export type InsertEnterprisePrice = typeof enterprisePrices.$inferInsert;

// 爬虫配置表
export const scraperConfigs = mysqlTable('scraper_configs', {
  id: int('id').autoincrement().primaryKey(),
  enterpriseName: varchar('enterprise_name', { length: 128 }).notNull(),
  region: varchar('region', { length: 64 }).notNull(),
  grainType: varchar('grain_type', { length: 32 }).notNull(),
  officialWebsite: varchar('official_website', { length: 255 }).notNull(),
  monitoringUrl: varchar('monitoring_url', { length: 255 }).notNull(),
  updateFrequency: mysqlEnum('update_frequency', ['daily', 'weekly']).default('daily').notNull(),
  enabled: int('enabled').default(1).notNull(),
  lastScrapedAt: timestamp('last_scraped_at'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().onUpdateNow().notNull(),
});

export type ScraperConfig = typeof scraperConfigs.$inferSelect;
export type InsertScraperConfig = typeof scraperConfigs.$inferInsert;

// TODO: Add your tables here