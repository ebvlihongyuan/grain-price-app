/**
 * 价格分析与预测模块
 * 为东北三省（黑龙江、吉林、辽宁）提供综合价格分析和预测
 * 考虑因素：全球粮食供应、季节因素、期货价格、库存水平
 */

export interface PriceAnalysisFactors {
  // 全球粮食供应因素
  globalSupply: {
    usProduction: number; // 美国产量指数 (0-100)
    brazilProduction: number; // 巴西产量指数
    globalInventory: number; // 全球库存水平 (0-100)
    exportPrice: number; // 国际出口价格 (美元/吨)
  };

  // 季节因素
  seasonalFactor: {
    phase: 'harvest' | 'storage' | 'spring'; // 收获期、储备期、春耕期
    phaseWeight: number; // 季节因素权重 (0-1)
    description: string;
  };

  // 国内库存
  domesticInventory: {
    governmentStock: number; // 国家粮食库存 (万吨)
    farmerStock: number; // 农民库存 (万吨)
    enterpriseStock: number; // 企业库存 (万吨)
  };

  // 期货市场
  futuresMarket: {
    futuresPrice: number; // 期货价格 (元/吨)
    futuresChange: number; // 期货涨跌幅 (%)
    openInterest: number; // 持仓量
  };
}

export interface PriceForecast {
  region: string;
  currentPrice: number;
  forecast1Week: {
    price: number;
    range: [number, number]; // [低, 高]
    confidence: number; // 置信度 (0-1)
    trend: 'up' | 'down' | 'stable';
  };
  forecast1Month: {
    price: number;
    range: [number, number];
    confidence: number;
    trend: 'up' | 'down' | 'stable';
  };
  factors: {
    name: string;
    weight: number; // 权重 (0-1)
    impact: 'positive' | 'negative' | 'neutral';
    description: string;
  }[];
}

export interface PriceAnalysisReport {
  region: string;
  date: string;
  analysis: {
    historicalTrend: string; // 历史趋势描述
    seasonalAnalysis: string; // 季节分析
    globalImpact: string; // 全球供应影响
    domesticFactors: string; // 国内因素
  };
  forecast: PriceForecast;
}

// 东北三省的分析数据
export const NORTHEAST_ANALYSIS_DATA = {
  heilongjiang: {
    region: '黑龙江',
    currentPrice: 2071,
    factors: {
      globalSupply: {
        usProduction: 75, // 美国产量指数
        brazilProduction: 68,
        globalInventory: 62,
        exportPrice: 280, // 美元/吨
      },
      seasonalFactor: {
        phase: 'storage' as const,
        phaseWeight: 0.6,
        description: '储备期，农民售粮基本结束，市场供应主要来自库存',
      },
      domesticInventory: {
        governmentStock: 450,
        farmerStock: 280,
        enterpriseStock: 320,
      },
      futuresMarket: {
        futuresPrice: 2192,
        futuresChange: -0.09,
        openInterest: 997444,
      },
    },
    historicalData: [
      { date: '2025-12-01', price: 2050 },
      { date: '2025-12-08', price: 2055 },
      { date: '2025-12-15', price: 2065 },
      { date: '2025-12-22', price: 2068 },
      { date: '2025-12-29', price: 2071 },
    ],
  },
  jilin: {
    region: '吉林',
    currentPrice: 1959,
    factors: {
      globalSupply: {
        usProduction: 75,
        brazilProduction: 68,
        globalInventory: 62,
        exportPrice: 280,
      },
      seasonalFactor: {
        phase: 'storage' as const,
        phaseWeight: 0.6,
        description: '储备期，供应相对充足',
      },
      domesticInventory: {
        governmentStock: 380,
        farmerStock: 250,
        enterpriseStock: 280,
      },
      futuresMarket: {
        futuresPrice: 2192,
        futuresChange: -0.09,
        openInterest: 997444,
      },
    },
    historicalData: [
      { date: '2025-12-01', price: 1920 },
      { date: '2025-12-08', price: 1935 },
      { date: '2025-12-15', price: 1945 },
      { date: '2025-12-22', price: 1952 },
      { date: '2025-12-29', price: 1959 },
    ],
  },
  liaoning: {
    region: '辽宁',
    currentPrice: 2101,
    factors: {
      globalSupply: {
        usProduction: 75,
        brazilProduction: 68,
        globalInventory: 62,
        exportPrice: 280,
      },
      seasonalFactor: {
        phase: 'storage' as const,
        phaseWeight: 0.6,
        description: '储备期，价格相对坚挺',
      },
      domesticInventory: {
        governmentStock: 320,
        farmerStock: 200,
        enterpriseStock: 250,
      },
      futuresMarket: {
        futuresPrice: 2192,
        futuresChange: -0.09,
        openInterest: 997444,
      },
    },
    historicalData: [
      { date: '2025-12-01', price: 2070 },
      { date: '2025-12-08', price: 2080 },
      { date: '2025-12-15', price: 2090 },
      { date: '2025-12-22', price: 2095 },
      { date: '2025-12-29', price: 2101 },
    ],
  },
};

/**
 * 计算价格预测
 * 基于历史数据、季节因素、全球供应等多种因素
 */
export function calculatePriceForecast(
  regionKey: 'heilongjiang' | 'jilin' | 'liaoning'
): PriceForecast {
  const data = NORTHEAST_ANALYSIS_DATA[regionKey];
  const currentPrice = data.currentPrice;
  const futuresPrice = data.factors.futuresMarket.futuresPrice;
  const globalInventory = data.factors.globalSupply.globalInventory;
  const seasonalWeight = data.factors.seasonalFactor.phaseWeight;

  // 计算价差影响
  const priceDifference = currentPrice - futuresPrice;
  const priceDifferenceImpact = priceDifference / futuresPrice;

  // 全球库存影响（库存越低，价格越高）
  const inventoryImpact = (100 - globalInventory) / 100 * 0.1;

  // 季节因素影响
  const seasonalImpact = seasonalWeight * 0.05;

  // 后一周预测
  const forecast1WeekPrice = Math.round(
    currentPrice * (1 + priceDifferenceImpact * 0.3 + inventoryImpact + seasonalImpact)
  );
  const forecast1WeekRange: [number, number] = [
    forecast1WeekPrice - 50,
    forecast1WeekPrice + 50,
  ];

  // 后一月预测
  const forecast1MonthPrice = Math.round(
    currentPrice * (1 + priceDifferenceImpact * 0.5 + inventoryImpact * 1.5 + seasonalImpact * 1.5)
  );
  const forecast1MonthRange: [number, number] = [
    forecast1MonthPrice - 100,
    forecast1MonthPrice + 100,
  ];

  // 确定趋势
  const trend1Week = forecast1WeekPrice > currentPrice ? 'up' : forecast1WeekPrice < currentPrice ? 'down' : 'stable';
  const trend1Month = forecast1MonthPrice > currentPrice ? 'up' : forecast1MonthPrice < currentPrice ? 'down' : 'stable';

  // 影响因素权重分析
  const factors: Array<{ name: string; weight: number; impact: 'positive' | 'negative' | 'neutral'; description: string }> = [
    {
      name: '期货价格',
      weight: 0.35,
      impact: (priceDifferenceImpact > 0 ? 'positive' : 'negative') as 'positive' | 'negative',
      description: `收购价${priceDifferenceImpact > 0 ? '高于' : '低于'}期货价${Math.abs(Math.round(priceDifferenceImpact * 100))}%`,
    },
    {
      name: '全球库存',
      weight: 0.25,
      impact: (globalInventory < 60 ? 'positive' : 'negative') as 'positive' | 'negative',
      description: `全球库存水平为${globalInventory}%，${globalInventory < 60 ? '偏低' : '充足'}`,
    },
    {
      name: '季节因素',
      weight: 0.20,
      // @ts-ignore
      impact: (data.factors.seasonalFactor.phase !== ('harvest' as const) ? 'positive' : 'negative') as 'positive' | 'negative',
      description: data.factors.seasonalFactor.description,
    },
    {
      name: '国内库存',
      weight: 0.15,
      impact: ((data.factors.domesticInventory.governmentStock + data.factors.domesticInventory.farmerStock) < 500 ? 'positive' : 'negative') as 'positive' | 'negative',
      description: `国内库存相对${(data.factors.domesticInventory.governmentStock + data.factors.domesticInventory.farmerStock) < 500 ? '紧张' : '充足'}`,
    },
  ];

  return {
    region: data.region,
    currentPrice,
    forecast1Week: {
      price: forecast1WeekPrice,
      range: forecast1WeekRange,
      confidence: 0.75,
      trend: trend1Week as 'up' | 'down' | 'stable',
    },
    forecast1Month: {
      price: forecast1MonthPrice,
      range: forecast1MonthRange,
      confidence: 0.65,
      trend: trend1Month as 'up' | 'down' | 'stable',
    },
    factors,
  };
}

/**
 * 生成完整的价格分析报告
 */
export function generatePriceAnalysisReport(
  regionKey: 'heilongjiang' | 'jilin' | 'liaoning'
): PriceAnalysisReport {
  const data = NORTHEAST_ANALYSIS_DATA[regionKey];
  const forecast = calculatePriceForecast(regionKey);
  const historicalData = data.historicalData;

  // 计算历史趋势
  const priceChange = historicalData[historicalData.length - 1].price - historicalData[0].price;
  const priceChangePercent = (priceChange / historicalData[0].price) * 100;

  return {
    region: data.region,
    date: new Date().toISOString().split('T')[0],
    analysis: {
      historicalTrend: `近一月价格${priceChange > 0 ? '上升' : '下降'}${Math.abs(Math.round(priceChangePercent))}%，从${historicalData[0].price}元/吨升至${historicalData[historicalData.length - 1].price}元/吨`,
      // @ts-ignore
      seasonalAnalysis: `当前处于${data.factors.seasonalFactor.phase === ('harvest' as const) ? '收获期' : data.factors.seasonalFactor.phase !== ('storage' as const) ? '春耕期' : '储备期'}，${data.factors.seasonalFactor.description}`,
      globalImpact: `美国产量指数${data.factors.globalSupply.usProduction}，全球库存水平${data.factors.globalSupply.globalInventory}%，国际出口价格${data.factors.globalSupply.exportPrice}美元/吨`,
      domesticFactors: `国家粮食库存${data.factors.domesticInventory.governmentStock}万吨，农民库存${data.factors.domesticInventory.farmerStock}万吨，企业库存${data.factors.domesticInventory.enterpriseStock}万吨`,
    },
    forecast,
  };
}

/**
 * 获取东北三省的对比分析
 */
export function getNortheastComparison() {
  const heilongjiang = generatePriceAnalysisReport('heilongjiang');
  const jilin = generatePriceAnalysisReport('jilin');
  const liaoning = generatePriceAnalysisReport('liaoning');

  return {
    heilongjiang,
    jilin,
    liaoning,
  };
}
