/**
 * Grain Price App - Data Models and Mock Data
 * 粮食收购价格应用 - 数据模型和模拟数据
 */

export interface Factory {
  id: string;
  name: string;
  region: string;
  price: number;
  change: number; // percentage
  lastUpdate: string;
  volume?: number; // 收购量 (万吨)
  quality?: string; // 品质等级
}

export interface RegionData {
  id: string;
  name: string;
  code: string;
  price: number;
  change: number;
  lastUpdate: string;
  factories: Factory[];
}

export interface PriceHistory {
  date: string;
  price: number;
  volume?: number;
}

export interface GrainType {
  id: string;
  name: string;
  unit: string; // 元/吨
  icon: string;
}

// 粮食品类
export const GRAIN_TYPES: GrainType[] = [
  { id: 'corn', name: '玉米', unit: '元/吨', icon: '🌽' },
  { id: 'wheat', name: '小麦', unit: '元/吨', icon: '🌾' },
  { id: 'soybean', name: '大豆', unit: '元/吨', icon: '🫘' },
];

// 地区列表
export const REGIONS = [
  { id: 'heilongjiang', name: '黑龙江', code: 'HLJ' },
  { id: 'jilin', name: '吉林', code: 'JL' },
  { id: 'liaoning', name: '辽宁', code: 'LN' },
  { id: 'hebei', name: '河北', code: 'HB' },
  { id: 'shandong', name: '山东', code: 'SD' },
  { id: 'henan', name: '河南', code: 'HN' },
  { id: 'anhui', name: '安徽', code: 'AH' },
];

// 工厂名称库
const FACTORY_NAMES = {
  heilongjiang: [
    '梅花生物',
    '九台粮食',
    '长春粮食',
    '黑龙江粮食集团',
    '哈尔滨粮油',
  ],
  jilin: [
    '吉林粮食集团',
    '长春饲料',
    '吉林农业',
    '松原粮食',
    '四平粮油',
  ],
  liaoning: [
    '锦州港',
    '辽宁粮食',
    '丹东粮食',
    '沈阳粮油',
    '营口粮食',
  ],
  hebei: [
    '河北粮食集团',
    '秦皇岛粮食',
    '邯郸粮油',
    '保定粮食',
    '邢台农业',
  ],
  shandong: [
    '寿光粮食',
    '山东粮食集团',
    '青岛粮油',
    '济南粮食',
    '烟台粮食',
  ],
  henan: [
    '河南粮食集团',
    '郑州粮油',
    '焦作粮食',
    '洛阳粮食',
    '开封粮油',
  ],
  anhui: [
    '安徽粮食集团',
    '合肥粮食',
    '芜湖粮油',
    '蚌埠粮食',
    '阜阳粮油',
  ],
};

// 生成模拟价格数据
function generateMockPrice(basePrice: number, variance: number = 50): number {
  const randomVariance = (Math.random() - 0.5) * variance;
  return Math.round(basePrice + randomVariance);
}

// 生成模拟涨跌幅
function generateMockChange(): number {
  return Math.round((Math.random() - 0.5) * 4 * 10) / 10; // -2% to +2%
}

// 生成工厂数据
function generateFactories(region: string, basePrice: number): Factory[] {
  const factoryNames = FACTORY_NAMES[region as keyof typeof FACTORY_NAMES] || [];
  return factoryNames.map((name, index) => ({
    id: `${region}-factory-${index}`,
    name,
    region,
    price: generateMockPrice(basePrice, 30),
    change: generateMockChange(),
    lastUpdate: new Date().toISOString().split('T')[0],
    volume: Math.round(Math.random() * 50 + 10) / 10,
    quality: ['一级', '二级', '三级'][Math.floor(Math.random() * 3)],
  }));
}

// 玉米价格基准（元/吨）
const CORN_BASE_PRICES: Record<string, number> = {
  heilongjiang: 2180,
  jilin: 2220,
  liaoning: 2200,
  hebei: 2280,
  shandong: 2350,
  henan: 2300,
  anhui: 2250,
};

// 小麦价格基准（元/吨）
const WHEAT_BASE_PRICES: Record<string, number> = {
  heilongjiang: 2650,
  jilin: 2680,
  liaoning: 2670,
  hebei: 2720,
  shandong: 2750,
  henan: 2800,
  anhui: 2720,
};

// 大豆价格基准（元/吨）
const SOYBEAN_BASE_PRICES: Record<string, number> = {
  heilongjiang: 3850,
  jilin: 3900,
  liaoning: 3880,
  hebei: 3950,
  shandong: 4000,
  henan: 3980,
  anhui: 3920,
};

// 获取地区数据
export function getRegionData(grainType: string = 'corn'): RegionData[] {
  const basePrices =
    grainType === 'corn'
      ? CORN_BASE_PRICES
      : grainType === 'wheat'
        ? WHEAT_BASE_PRICES
        : SOYBEAN_BASE_PRICES;

  return REGIONS.map((region) => {
    const basePrice = basePrices[region.id];
    const factories = generateFactories(region.id, basePrice);
    const avgPrice = Math.round(
      factories.reduce((sum, f) => sum + f.price, 0) / factories.length
    );

    return {
      id: region.id,
      name: region.name,
      code: region.code,
      price: avgPrice,
      change: generateMockChange(),
      lastUpdate: new Date().toISOString().split('T')[0],
      factories,
    };
  });
}

// 生成30天历史数据
export function generatePriceHistory(
  basePrice: number,
  days: number = 30
): PriceHistory[] {
  const history: PriceHistory[] = [];
  const today = new Date();

  for (let i = days - 1; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    const dateStr = date.toISOString().split('T')[0];

    // 生成价格波动（使用正弦波 + 随机噪声）
    const trend = Math.sin((i / days) * Math.PI) * 100;
    const noise = (Math.random() - 0.5) * 50;
    const price = Math.round(basePrice + trend + noise);

    history.push({
      date: dateStr,
      price,
      volume: Math.round(Math.random() * 100 + 50),
    });
  }

  return history;
}

// 获取工厂详情
export function getFactoryDetail(regionId: string, factoryId: string) {
  const regions = getRegionData();
  const region = regions.find((r) => r.id === regionId);
  if (!region) return null;

  const factory = region.factories.find((f) => f.id === factoryId);
  if (!factory) return null;

  return {
    ...factory,
    history: generatePriceHistory(factory.price),
  };
}
