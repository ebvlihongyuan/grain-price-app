/**
 * Grain Price App - Data Models and Mock Data
 * 粮食收购价格应用 - 数据模型和模拟数据
 * 
 * 重点监测企业包括：中储粮、中粮等大型企业
 * 企业分类：粮食贸易商、淀粉加工、饲料加工、乙醇加工
 */

export type EnterpriseType = 'trader' | 'starch' | 'feed' | 'ethanol';

export interface Enterprise {
  id: string;
  name: string;
  type: EnterpriseType;
  region: string;
  price: number;
  change: number; // percentage
  volume: number; // 收购量 (万吨)
  lastUpdate: string;
  isKeyMonitored: boolean; // 是否为重点监测企业
  parentCompany?: string; // 母公司（如中储粮、中粮）
}

export interface RegionData {
  id: string;
  name: string;
  code: string;
  price: number;
  change: number;
  lastUpdate: string;
  enterprises: Enterprise[];
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

// 企业类型标签
export const ENTERPRISE_TYPES: Record<EnterpriseType, { label: string; color: string }> = {
  trader: { label: '粮食贸易商', color: 'bg-blue-100 text-blue-700' },
  starch: { label: '淀粉加工', color: 'bg-purple-100 text-purple-700' },
  feed: { label: '饲料加工', color: 'bg-orange-100 text-orange-700' },
  ethanol: { label: '乙醇加工', color: 'bg-green-100 text-green-700' },
};

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

// 重点监测企业数据
const KEY_MONITORED_ENTERPRISES: Record<string, Enterprise[]> = {
  heilongjiang: [
    {
      id: 'hlj-1',
      name: '中储粮黑龙江分公司',
      type: 'trader',
      region: 'heilongjiang',
      price: 2185,
      change: 0.2,
      volume: 15.5,
      lastUpdate: new Date().toISOString().split('T')[0],
      isKeyMonitored: true,
      parentCompany: '中储粮',
    },
    {
      id: 'hlj-2',
      name: '中粮集团黑龙江',
      type: 'feed',
      region: 'heilongjiang',
      price: 2180,
      change: -0.1,
      volume: 12.3,
      lastUpdate: new Date().toISOString().split('T')[0],
      isKeyMonitored: true,
      parentCompany: '中粮',
    },
    {
      id: 'hlj-3',
      name: '梅花生物',
      type: 'feed',
      region: 'heilongjiang',
      price: 2175,
      change: 0.5,
      volume: 8.7,
      lastUpdate: new Date().toISOString().split('T')[0],
      isKeyMonitored: true,
    },
    {
      id: 'hlj-4',
      name: '哈尔滨粮油贸易',
      type: 'trader',
      region: 'heilongjiang',
      price: 2190,
      change: 0.3,
      volume: 6.2,
      lastUpdate: new Date().toISOString().split('T')[0],
      isKeyMonitored: true,
    },
    {
      id: 'hlj-5',
      name: '黑龙江淀粉加工厂',
      type: 'starch',
      region: 'heilongjiang',
      price: 2170,
      change: -0.2,
      volume: 5.1,
      lastUpdate: new Date().toISOString().split('T')[0],
      isKeyMonitored: true,
    },
    {
      id: 'hlj-6',
      name: '黑龙江乙醇集团',
      type: 'ethanol',
      region: 'heilongjiang',
      price: 2165,
      change: 0.1,
      volume: 4.8,
      lastUpdate: new Date().toISOString().split('T')[0],
      isKeyMonitored: true,
    },
  ],
  jilin: [
    {
      id: 'jl-1',
      name: '中储粮吉林分公司',
      type: 'trader',
      region: 'jilin',
      price: 2225,
      change: 0.4,
      volume: 14.2,
      lastUpdate: new Date().toISOString().split('T')[0],
      isKeyMonitored: true,
      parentCompany: '中储粮',
    },
    {
      id: 'jl-2',
      name: '中粮集团吉林',
      type: 'feed',
      region: 'jilin',
      price: 2220,
      change: 0.2,
      volume: 11.5,
      lastUpdate: new Date().toISOString().split('T')[0],
      isKeyMonitored: true,
      parentCompany: '中粮',
    },
    {
      id: 'jl-3',
      name: '吉林粮食集团',
      type: 'trader',
      region: 'jilin',
      price: 2215,
      change: -0.3,
      volume: 9.8,
      lastUpdate: new Date().toISOString().split('T')[0],
      isKeyMonitored: true,
    },
    {
      id: 'jl-4',
      name: '长春饲料有限公司',
      type: 'feed',
      region: 'jilin',
      price: 2210,
      change: 0.1,
      volume: 7.3,
      lastUpdate: new Date().toISOString().split('T')[0],
      isKeyMonitored: true,
    },
    {
      id: 'jl-5',
      name: '吉林淀粉工业',
      type: 'starch',
      region: 'jilin',
      price: 2205,
      change: -0.2,
      volume: 5.6,
      lastUpdate: new Date().toISOString().split('T')[0],
      isKeyMonitored: true,
    },
    {
      id: 'jl-6',
      name: '吉林乙醇燃料',
      type: 'ethanol',
      region: 'jilin',
      price: 2200,
      change: 0.3,
      volume: 4.2,
      lastUpdate: new Date().toISOString().split('T')[0],
      isKeyMonitored: true,
    },
    {
      id: 'jl-7',
      name: '松原粮食贸易',
      type: 'trader',
      region: 'jilin',
      price: 2218,
      change: 0.0,
      volume: 3.9,
      lastUpdate: new Date().toISOString().split('T')[0],
      isKeyMonitored: true,
    },
  ],
  liaoning: [
    {
      id: 'ln-1',
      name: '中储粮辽宁分公司',
      type: 'trader',
      region: 'liaoning',
      price: 2205,
      change: 0.1,
      volume: 13.1,
      lastUpdate: new Date().toISOString().split('T')[0],
      isKeyMonitored: true,
      parentCompany: '中储粮',
    },
    {
      id: 'ln-2',
      name: '中粮集团辽宁',
      type: 'feed',
      region: 'liaoning',
      price: 2200,
      change: -0.1,
      volume: 10.2,
      lastUpdate: new Date().toISOString().split('T')[0],
      isKeyMonitored: true,
      parentCompany: '中粮',
    },
    {
      id: 'ln-3',
      name: '锦州港粮食',
      type: 'trader',
      region: 'liaoning',
      price: 2195,
      change: 0.2,
      volume: 8.5,
      lastUpdate: new Date().toISOString().split('T')[0],
      isKeyMonitored: true,
    },
    {
      id: 'ln-4',
      name: '辽宁饲料加工',
      type: 'feed',
      region: 'liaoning',
      price: 2190,
      change: -0.3,
      volume: 6.7,
      lastUpdate: new Date().toISOString().split('T')[0],
      isKeyMonitored: true,
    },
    {
      id: 'ln-5',
      name: '丹东淀粉厂',
      type: 'starch',
      region: 'liaoning',
      price: 2185,
      change: 0.0,
      volume: 5.2,
      lastUpdate: new Date().toISOString().split('T')[0],
      isKeyMonitored: true,
    },
    {
      id: 'ln-6',
      name: '沈阳乙醇公司',
      type: 'ethanol',
      region: 'liaoning',
      price: 2180,
      change: 0.4,
      volume: 3.8,
      lastUpdate: new Date().toISOString().split('T')[0],
      isKeyMonitored: true,
    },
  ],
  hebei: [
    {
      id: 'hb-1',
      name: '中储粮河北分公司',
      type: 'trader',
      region: 'hebei',
      price: 2285,
      change: 0.3,
      volume: 16.2,
      lastUpdate: new Date().toISOString().split('T')[0],
      isKeyMonitored: true,
      parentCompany: '中储粮',
    },
    {
      id: 'hb-2',
      name: '中粮集团河北',
      type: 'feed',
      region: 'hebei',
      price: 2280,
      change: 0.1,
      volume: 12.8,
      lastUpdate: new Date().toISOString().split('T')[0],
      isKeyMonitored: true,
      parentCompany: '中粮',
    },
    {
      id: 'hb-3',
      name: '秦皇岛粮食',
      type: 'trader',
      region: 'hebei',
      price: 2275,
      change: -0.2,
      volume: 10.1,
      lastUpdate: new Date().toISOString().split('T')[0],
      isKeyMonitored: true,
    },
    {
      id: 'hb-4',
      name: '河北饲料集团',
      type: 'feed',
      region: 'hebei',
      price: 2270,
      change: 0.2,
      volume: 7.9,
      lastUpdate: new Date().toISOString().split('T')[0],
      isKeyMonitored: true,
    },
    {
      id: 'hb-5',
      name: '邯郸淀粉工业',
      type: 'starch',
      region: 'hebei',
      price: 2265,
      change: -0.1,
      volume: 6.3,
      lastUpdate: new Date().toISOString().split('T')[0],
      isKeyMonitored: true,
    },
    {
      id: 'hb-6',
      name: '保定乙醇燃料',
      type: 'ethanol',
      region: 'hebei',
      price: 2260,
      change: 0.3,
      volume: 4.5,
      lastUpdate: new Date().toISOString().split('T')[0],
      isKeyMonitored: true,
    },
    {
      id: 'hb-7',
      name: '邢台粮食贸易',
      type: 'trader',
      region: 'hebei',
      price: 2278,
      change: 0.0,
      volume: 5.2,
      lastUpdate: new Date().toISOString().split('T')[0],
      isKeyMonitored: true,
    },
  ],
  shandong: [
    {
      id: 'sd-1',
      name: '中储粮山东分公司',
      type: 'trader',
      region: 'shandong',
      price: 2355,
      change: 0.2,
      volume: 17.5,
      lastUpdate: new Date().toISOString().split('T')[0],
      isKeyMonitored: true,
      parentCompany: '中储粮',
    },
    {
      id: 'sd-2',
      name: '中粮集团山东',
      type: 'feed',
      region: 'shandong',
      price: 2350,
      change: 0.1,
      volume: 13.2,
      lastUpdate: new Date().toISOString().split('T')[0],
      isKeyMonitored: true,
      parentCompany: '中粮',
    },
    {
      id: 'sd-3',
      name: '寿光粮食集团',
      type: 'trader',
      region: 'shandong',
      price: 2345,
      change: -0.1,
      volume: 11.3,
      lastUpdate: new Date().toISOString().split('T')[0],
      isKeyMonitored: true,
    },
    {
      id: 'sd-4',
      name: '山东饲料加工',
      type: 'feed',
      region: 'shandong',
      price: 2340,
      change: 0.3,
      volume: 8.6,
      lastUpdate: new Date().toISOString().split('T')[0],
      isKeyMonitored: true,
    },
    {
      id: 'sd-5',
      name: '青岛淀粉厂',
      type: 'starch',
      region: 'shandong',
      price: 2335,
      change: -0.2,
      volume: 6.9,
      lastUpdate: new Date().toISOString().split('T')[0],
      isKeyMonitored: true,
    },
    {
      id: 'sd-6',
      name: '济南乙醇公司',
      type: 'ethanol',
      region: 'shandong',
      price: 2330,
      change: 0.4,
      volume: 5.1,
      lastUpdate: new Date().toISOString().split('T')[0],
      isKeyMonitored: true,
    },
    {
      id: 'sd-7',
      name: '烟台粮食贸易',
      type: 'trader',
      region: 'shandong',
      price: 2348,
      change: 0.1,
      volume: 4.7,
      lastUpdate: new Date().toISOString().split('T')[0],
      isKeyMonitored: true,
    },
    {
      id: 'sd-8',
      name: '潍坊饲料有限公司',
      type: 'feed',
      region: 'shandong',
      price: 2342,
      change: -0.1,
      volume: 3.5,
      lastUpdate: new Date().toISOString().split('T')[0],
      isKeyMonitored: true,
    },
  ],
  henan: [
    {
      id: 'hn-1',
      name: '中储粮河南分公司',
      type: 'trader',
      region: 'henan',
      price: 2305,
      change: 0.2,
      volume: 15.8,
      lastUpdate: new Date().toISOString().split('T')[0],
      isKeyMonitored: true,
      parentCompany: '中储粮',
    },
    {
      id: 'hn-2',
      name: '中粮集团河南',
      type: 'feed',
      region: 'henan',
      price: 2300,
      change: 0.0,
      volume: 12.1,
      lastUpdate: new Date().toISOString().split('T')[0],
      isKeyMonitored: true,
      parentCompany: '中粮',
    },
    {
      id: 'hn-3',
      name: '郑州粮食集团',
      type: 'trader',
      region: 'henan',
      price: 2295,
      change: -0.1,
      volume: 9.7,
      lastUpdate: new Date().toISOString().split('T')[0],
      isKeyMonitored: true,
    },
    {
      id: 'hn-4',
      name: '焦作饲料加工',
      type: 'feed',
      region: 'henan',
      price: 2290,
      change: 0.2,
      volume: 7.4,
      lastUpdate: new Date().toISOString().split('T')[0],
      isKeyMonitored: true,
    },
    {
      id: 'hn-5',
      name: '洛阳淀粉工业',
      type: 'starch',
      region: 'henan',
      price: 2285,
      change: -0.2,
      volume: 5.8,
      lastUpdate: new Date().toISOString().split('T')[0],
      isKeyMonitored: true,
    },
    {
      id: 'hn-6',
      name: '开封乙醇燃料',
      type: 'ethanol',
      region: 'henan',
      price: 2280,
      change: 0.3,
      volume: 4.3,
      lastUpdate: new Date().toISOString().split('T')[0],
      isKeyMonitored: true,
    },
  ],
  anhui: [
    {
      id: 'ah-1',
      name: '中储粮安徽分公司',
      type: 'trader',
      region: 'anhui',
      price: 2255,
      change: 0.1,
      volume: 14.2,
      lastUpdate: new Date().toISOString().split('T')[0],
      isKeyMonitored: true,
      parentCompany: '中储粮',
    },
    {
      id: 'ah-2',
      name: '中粮集团安徽',
      type: 'feed',
      region: 'anhui',
      price: 2250,
      change: -0.1,
      volume: 11.3,
      lastUpdate: new Date().toISOString().split('T')[0],
      isKeyMonitored: true,
      parentCompany: '中粮',
    },
    {
      id: 'ah-3',
      name: '合肥粮食集团',
      type: 'trader',
      region: 'anhui',
      price: 2245,
      change: 0.2,
      volume: 8.9,
      lastUpdate: new Date().toISOString().split('T')[0],
      isKeyMonitored: true,
    },
    {
      id: 'ah-4',
      name: '芜湖饲料有限公司',
      type: 'feed',
      region: 'anhui',
      price: 2240,
      change: -0.2,
      volume: 6.5,
      lastUpdate: new Date().toISOString().split('T')[0],
      isKeyMonitored: true,
    },
    {
      id: 'ah-5',
      name: '蚌埠淀粉厂',
      type: 'starch',
      region: 'anhui',
      price: 2235,
      change: 0.1,
      volume: 5.1,
      lastUpdate: new Date().toISOString().split('T')[0],
      isKeyMonitored: true,
    },
    {
      id: 'ah-6',
      name: '阜阳乙醇公司',
      type: 'ethanol',
      region: 'anhui',
      price: 2230,
      change: 0.3,
      volume: 3.7,
      lastUpdate: new Date().toISOString().split('T')[0],
      isKeyMonitored: true,
    },
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

// 玉米价格基准（元/吨）- 2026年1月最新市场行情
const CORN_BASE_PRICES: Record<string, number> = {
  heilongjiang: 2070,  // 黑龙江：2050-2090
  jilin: 2155,         // 吉林：2150-2160
  liaoning: 2200,      // 辽宁：2200
  hebei: 2220,         // 河北：2220
  shandong: 2350,      // 山东：2320-2380
  henan: 2200,         // 河南：2200
  anhui: 2210,         // 安徽：2200-2220
};

// 小麦价格基准（元/吨）- 2026年1月市场行情
const WHEAT_BASE_PRICES: Record<string, number> = {
  heilongjiang: 2600,
  jilin: 2630,
  liaoning: 2620,
  hebei: 2680,
  shandong: 2700,
  henan: 2750,
  anhui: 2680,
};

// 大豆价格基准（元/吨）- 2026年1月市场行情
const SOYBEAN_BASE_PRICES: Record<string, number> = {
  heilongjiang: 3800,
  jilin: 3850,
  liaoning: 3830,
  hebei: 3900,
  shandong: 3950,
  henan: 3930,
  anhui: 3870,
};

// 获取地区数据（包括重点监测企业）
export function getRegionData(grainType: string = 'corn'): RegionData[] {
  const basePrices =
    grainType === 'corn'
      ? CORN_BASE_PRICES
      : grainType === 'wheat'
        ? WHEAT_BASE_PRICES
        : SOYBEAN_BASE_PRICES;

  return REGIONS.map((region) => {
    const basePrice = basePrices[region.id];
    const enterprises = KEY_MONITORED_ENTERPRISES[region.id] || [];
    
    // 调整企业价格基于粮食品类
    const adjustedEnterprises = enterprises.map((e) => ({
      ...e,
      price: generateMockPrice(basePrice, 30),
      change: generateMockChange(),
      volume: Math.round((Math.random() * 10 + 3) * 10) / 10,
    }));

    const avgPrice = Math.round(
      adjustedEnterprises.reduce((sum, e) => sum + e.price, 0) / adjustedEnterprises.length
    );

    return {
      id: region.id,
      name: region.name,
      code: region.code,
      price: avgPrice,
      change: generateMockChange(),
      lastUpdate: new Date().toISOString().split('T')[0],
      enterprises: adjustedEnterprises,
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

// 获取企业详情
export function getEnterpriseDetail(regionId: string, enterpriseId: string) {
  const regions = getRegionData();
  const region = regions.find((r) => r.id === regionId);
  if (!region) return null;

  const enterprise = region.enterprises.find((e) => e.id === enterpriseId);
  if (!enterprise) return null;

  return {
    ...enterprise,
    history: generatePriceHistory(enterprise.price),
  };
}
