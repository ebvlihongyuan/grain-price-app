/**
 * Grain Price App - Data Models and Mock Data
 * 粮食收购价格应用 - 数据模型和模拟数据
 * 
 * 重点监测企业包括：中储粮、中粮等大型企业
 * 企业分类：粮食贸易商、淀粉加工、饲料加工、乙醇加工
 * 企业选择优先级：首选当地中储粮企业，其次粮食深加工企业（饲料、乙醇、淀粉、食品类）
 */

export type EnterpriseType = 'trader' | 'starch' | 'feed' | 'ethanol';

export interface Enterprise {
  id: string;
  name: string;
  type: EnterpriseType;
  region: string;
  price: number;
  change: number; // percentage
  monthlyVolume: number; // 月收购量 (万吨)
  yearlyVolume: number; // 年收购量 (万吨)
  lastUpdate: string;
  isKeyMonitored: boolean; // 是否为重点监测企业
  parentCompany?: string; // 母公司（如中储粮、中粮）
  address?: string; // 企业地址
  phone?: string; // 企业电话
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
export const REGIONS: Array<{ id: string; name: string; code: string }> = [
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
      price: 2075,
      change: 0.2,
      monthlyVolume: 18.5,
      yearlyVolume: 185,
      lastUpdate: new Date().toISOString().split('T')[0],
      isKeyMonitored: true,
      parentCompany: '中储粮',
      address: '哈尔滨市南岗区长江路209号浦发大厦15层',
      phone: '0451-87117610',
    },
    {
      id: 'hlj-2',
      name: '北大荒',
      type: 'trader',
      region: 'heilongjiang',
      price: 2070,
      change: -0.1,
      monthlyVolume: 16.2,
      yearlyVolume: 162,
      lastUpdate: new Date().toISOString().split('T')[0],
      isKeyMonitored: true,
      parentCompany: '北大荒',
      address: '哈尔滨市香坊区红旗大街175号',
      phone: '0451-55198114',
    },
    {
      id: 'hlj-3',
      name: '象屿',
      type: 'trader',
      region: 'heilongjiang',
      price: 2068,
      change: 0.3,
      monthlyVolume: 14.8,
      yearlyVolume: 148,
      lastUpdate: new Date().toISOString().split('T')[0],
      isKeyMonitored: true,
      address: '哈尔滨市道里区第五大道2816号汇智金融企业总部C座15楼',
      phone: '0451-51016886',
    },
    {
      id: 'hlj-4',
      name: '中粮生化肇东工厂',
      type: 'ethanol',
      region: 'heilongjiang',
      price: 2065,
      change: 0.1,
      monthlyVolume: 12.3,
      yearlyVolume: 123,
      lastUpdate: new Date().toISOString().split('T')[0],
      isKeyMonitored: true,
      parentCompany: '中粮',
      address: '绥化市肇东市东升区东直街77号',
      phone: '0455-6619689',
    },
    {
      id: 'hlj-5',
      name: '中粮生化龙江工厂',
      type: 'ethanol',
      region: 'heilongjiang',
      price: 2062,
      change: -0.2,
      monthlyVolume: 11.5,
      yearlyVolume: 115,
      lastUpdate: new Date().toISOString().split('T')[0],
      isKeyMonitored: true,
      parentCompany: '中粮',
      address: '齐齐哈尔市龙江县白山工业园区',
      phone: '0452-5976244',
    },
    {
      id: 'hlj-6',
      name: '梅花生物',
      type: 'feed',
      region: 'heilongjiang',
      price: 2072,
      change: 0.4,
      monthlyVolume: 9.7,
      yearlyVolume: 97,
      lastUpdate: new Date().toISOString().split('T')[0],
      isKeyMonitored: true,
      address: '哈尔滨市道外区南十道街1号',
      phone: '0451-82352526',
    },
    {
      id: 'hlj-7',
      name: '黑龙江粮食集团',
      type: 'trader',
      region: 'heilongjiang',
      price: 2070,
      change: 0.0,
      monthlyVolume: 8.4,
      yearlyVolume: 84,
      lastUpdate: new Date().toISOString().split('T')[0],
      isKeyMonitored: true,
      address: '哈尔滨市南岗区长江路209号',
      phone: '0451-82352500',
    },
  ],
  jilin: [
    {
      id: 'jl-1',
      name: '中储粮吉林分公司',
      type: 'trader',
      region: 'jilin',
      price: 2160,
      change: 0.5,
      monthlyVolume: 15.2,
      yearlyVolume: 152,
      lastUpdate: new Date().toISOString().split('T')[0],
      isKeyMonitored: true,
      parentCompany: '中储粮',
      address: '长春市建设街2650号',
      phone: '0431-82526126',
    },
    {
      id: 'jl-2',
      name: '中粮生化吉林',
      type: 'ethanol',
      region: 'jilin',
      price: 2155,
      change: 0.3,
      monthlyVolume: 12.5,
      yearlyVolume: 125,
      lastUpdate: new Date().toISOString().split('T')[0],
      isKeyMonitored: true,
      parentCompany: '中粮',
      address: '长春市经济技术开发区仙台大街1717号',
      phone: '0431-81891277',
    },
    {
      id: 'jl-3',
      name: '吉林粮食集团',
      type: 'trader',
      region: 'jilin',
      price: 2158,
      change: -0.2,
      monthlyVolume: 12.8,
      yearlyVolume: 128,
      lastUpdate: new Date().toISOString().split('T')[0],
      isKeyMonitored: true,
      address: '长春市朝阳区同志街1号',
      phone: '0431-85607600',
    },
    {
      id: 'jl-4',
      name: '吉林淀粉加工',
      type: 'starch',
      region: 'jilin',
      price: 2150,
      change: -0.4,
      monthlyVolume: 8.6,
      yearlyVolume: 86,
      lastUpdate: new Date().toISOString().split('T')[0],
      isKeyMonitored: true,
      address: '吉林市丰满区滨河路1号',
      phone: '0432-62405406',
    },
    {
      id: 'jl-5',
      name: '吉林饲料企业',
      type: 'feed',
      region: 'jilin',
      price: 2165,
      change: 0.2,
      monthlyVolume: 7.4,
      yearlyVolume: 74,
      lastUpdate: new Date().toISOString().split('T')[0],
      isKeyMonitored: true,
      address: '长春市绿园区青年路1号',
      phone: '0431-87626666',
    },
    {
      id: 'jl-6',
      name: '松原粮食贸易',
      type: 'trader',
      region: 'jilin',
      price: 2152,
      change: 0.0,
      monthlyVolume: 6.8,
      yearlyVolume: 68,
      lastUpdate: new Date().toISOString().split('T')[0],
      isKeyMonitored: true,
      address: '松原市宁江区朝阳街1号',
      phone: '0438-6666666',
    },
    {
      id: 'jl-7',
      name: '长春粮食贸易',
      type: 'trader',
      region: 'jilin',
      price: 2162,
      change: 0.1,
      monthlyVolume: 10.3,
      yearlyVolume: 103,
      lastUpdate: new Date().toISOString().split('T')[0],
      isKeyMonitored: true,
      address: '长春市南关区南湖大路1号',
      phone: '0431-85607700',
    },
  ],
  liaoning: [
    {
      id: 'ln-1',
      name: '中储粮辽宁分公司',
      type: 'trader',
      region: 'liaoning',
      price: 2205,
      change: 0.3,
      monthlyVolume: 14.5,
      yearlyVolume: 145,
      lastUpdate: new Date().toISOString().split('T')[0],
      isKeyMonitored: true,
      parentCompany: '中储粮',
      address: '沈阳市皇姑区黄河北大街56-40号',
      phone: '024-86282222',
    },
    {
      id: 'ln-2',
      name: '中粮生化辽宁',
      type: 'ethanol',
      region: 'liaoning',
      price: 2198,
      change: 0.2,
      monthlyVolume: 10.8,
      yearlyVolume: 108,
      lastUpdate: new Date().toISOString().split('T')[0],
      isKeyMonitored: true,
      parentCompany: '中粮',
      address: '沈阳市浑南区浑南中路1号',
      phone: '024-31688888',
    },
    {
      id: 'ln-3',
      name: '辽宁粮食集团',
      type: 'trader',
      region: 'liaoning',
      price: 2200,
      change: -0.1,
      monthlyVolume: 12.2,
      yearlyVolume: 122,
      lastUpdate: new Date().toISOString().split('T')[0],
      isKeyMonitored: true,
      address: '沈阳市和平区中山路1号',
      phone: '024-22835555',
    },
    {
      id: 'ln-4',
      name: '沈阳粮食贸易',
      type: 'trader',
      region: 'liaoning',
      price: 2208,
      change: 0.4,
      monthlyVolume: 9.5,
      yearlyVolume: 95,
      lastUpdate: new Date().toISOString().split('T')[0],
      isKeyMonitored: true,
      address: '沈阳市大东区小北街1号',
      phone: '024-88686666',
    },
    {
      id: 'ln-5',
      name: '辽宁饲料加工',
      type: 'feed',
      region: 'liaoning',
      price: 2210,
      change: 0.1,
      monthlyVolume: 8.3,
      yearlyVolume: 83,
      lastUpdate: new Date().toISOString().split('T')[0],
      isKeyMonitored: true,
      address: '大连市中山区港湾街1号',
      phone: '0411-83688888',
    },
    {
      id: 'ln-6',
      name: '锦州粮食贸易',
      type: 'trader',
      region: 'liaoning',
      price: 2202,
      change: -0.2,
      monthlyVolume: 7.1,
      yearlyVolume: 71,
      lastUpdate: new Date().toISOString().split('T')[0],
      isKeyMonitored: true,
      address: '锦州市古塔区解放路1号',
      phone: '0416-3666666',
    },
    {
      id: 'ln-7',
      name: '辽宁淀粉加工',
      type: 'starch',
      region: 'liaoning',
      price: 2195,
      change: 0.1,
      monthlyVolume: 6.5,
      yearlyVolume: 65,
      lastUpdate: new Date().toISOString().split('T')[0],
      isKeyMonitored: true,
      address: '营口市西市区渤海大街1号',
      phone: '0417-3666666',
    },
  ],
  hebei: [
    {
      id: 'hb-1',
      name: '中储粮河北分公司',
      type: 'trader',
      region: 'hebei',
      price: 2225,
      change: 0.2,
      monthlyVolume: 16.8,
      yearlyVolume: 168,
      lastUpdate: new Date().toISOString().split('T')[0],
      isKeyMonitored: true,
      parentCompany: '中储粮',
      address: '石家庄市长安区中山东路1号',
      phone: '0311-85108888',
    },
    {
      id: 'hb-2',
      name: '中粮生化河北',
      type: 'ethanol',
      region: 'hebei',
      price: 2218,
      change: 0.3,
      monthlyVolume: 12.5,
      yearlyVolume: 125,
      lastUpdate: new Date().toISOString().split('T')[0],
      isKeyMonitored: true,
      parentCompany: '中粮',
      address: '衡水市桃城区和平路1号',
      phone: '0318-2888888',
    },
    {
      id: 'hb-3',
      name: '河北粮食集团',
      type: 'trader',
      region: 'hebei',
      price: 2220,
      change: 0.0,
      monthlyVolume: 14.2,
      yearlyVolume: 142,
      lastUpdate: new Date().toISOString().split('T')[0],
      isKeyMonitored: true,
      address: '石家庄市裕华区中山东路1号',
      phone: '0311-85108000',
    },
    {
      id: 'hb-4',
      name: '石家庄粮食贸易',
      type: 'trader',
      region: 'hebei',
      price: 2228,
      change: 0.4,
      monthlyVolume: 11.3,
      yearlyVolume: 113,
      lastUpdate: new Date().toISOString().split('T')[0],
      isKeyMonitored: true,
      address: '石家庄市新华区中华北大街1号',
      phone: '0311-86688888',
    },
    {
      id: 'hb-5',
      name: '河北饲料加工',
      type: 'feed',
      region: 'hebei',
      price: 2230,
      change: 0.1,
      monthlyVolume: 9.8,
      yearlyVolume: 98,
      lastUpdate: new Date().toISOString().split('T')[0],
      isKeyMonitored: true,
      address: '邯郸市丛台区中华大街1号',
      phone: '0310-8688888',
    },
    {
      id: 'hb-6',
      name: '邯郸粮食贸易',
      type: 'trader',
      region: 'hebei',
      price: 2222,
      change: -0.1,
      monthlyVolume: 8.4,
      yearlyVolume: 84,
      lastUpdate: new Date().toISOString().split('T')[0],
      isKeyMonitored: true,
      address: '邯郸市邯山区光明南大街1号',
      phone: '0310-3666666',
    },
    {
      id: 'hb-7',
      name: '河北淀粉加工',
      type: 'starch',
      region: 'hebei',
      price: 2215,
      change: 0.2,
      monthlyVolume: 7.2,
      yearlyVolume: 72,
      lastUpdate: new Date().toISOString().split('T')[0],
      isKeyMonitored: true,
      address: '保定市竞秀区朝阳大街1号',
      phone: '0312-5888888',
    },
    {
      id: 'hb-8',
      name: '张家口粮食贸易',
      type: 'trader',
      region: 'hebei',
      price: 2218,
      change: 0.1,
      monthlyVolume: 6.5,
      yearlyVolume: 65,
      lastUpdate: new Date().toISOString().split('T')[0],
      isKeyMonitored: true,
      address: '张家口市桥东区中华大街1号',
      phone: '0313-2888888',
    },
  ],
  shandong: [
    {
      id: 'sd-1',
      name: '中储粮山东分公司',
      type: 'trader',
      region: 'shandong',
      price: 2355,
      change: 0.3,
      monthlyVolume: 18.2,
      yearlyVolume: 182,
      lastUpdate: new Date().toISOString().split('T')[0],
      isKeyMonitored: true,
      parentCompany: '中储粮',
      address: '济南市商河县文化东路29号',
      phone: '0531-85598939',
    },
    {
      id: 'sd-2',
      name: '中粮生化山东',
      type: 'ethanol',
      region: 'shandong',
      price: 2348,
      change: 0.4,
      monthlyVolume: 13.5,
      yearlyVolume: 135,
      lastUpdate: new Date().toISOString().split('T')[0],
      isKeyMonitored: true,
      parentCompany: '中粮',
      address: '日照市学苑路677号',
      phone: '0633-7983983',
    },
    {
      id: 'sd-3',
      name: '山东粮食集团',
      type: 'trader',
      region: 'shandong',
      price: 2350,
      change: 0.1,
      monthlyVolume: 15.8,
      yearlyVolume: 158,
      lastUpdate: new Date().toISOString().split('T')[0],
      isKeyMonitored: true,
      address: '济南市历下区解放路1号',
      phone: '0531-86688888',
    },
    {
      id: 'sd-4',
      name: '济南粮食贸易',
      type: 'trader',
      region: 'shandong',
      price: 2358,
      change: 0.2,
      monthlyVolume: 12.2,
      yearlyVolume: 122,
      lastUpdate: new Date().toISOString().split('T')[0],
      isKeyMonitored: true,
      address: '济南市市中区经十路1号',
      phone: '0531-88888888',
    },
    {
      id: 'sd-5',
      name: '山东饲料加工',
      type: 'feed',
      region: 'shandong',
      price: 2360,
      change: 0.0,
      monthlyVolume: 10.5,
      yearlyVolume: 105,
      lastUpdate: new Date().toISOString().split('T')[0],
      isKeyMonitored: true,
      address: '青岛市黄岛区长江路1号',
      phone: '0532-86888888',
    },
    {
      id: 'sd-6',
      name: '潍坊粮食贸易',
      type: 'trader',
      region: 'shandong',
      price: 2352,
      change: -0.1,
      monthlyVolume: 9.3,
      yearlyVolume: 93,
      lastUpdate: new Date().toISOString().split('T')[0],
      isKeyMonitored: true,
      address: '潍坊市奎文区东风东街1号',
      phone: '0536-8888888',
    },
    {
      id: 'sd-7',
      name: '山东淀粉加工',
      type: 'starch',
      region: 'shandong',
      price: 2345,
      change: 0.3,
      monthlyVolume: 8.1,
      yearlyVolume: 81,
      lastUpdate: new Date().toISOString().split('T')[0],
      isKeyMonitored: true,
      address: '聊城市东昌府区中华路1号',
      phone: '0635-8888888',
    },
    {
      id: 'sd-8',
      name: '青岛粮食贸易',
      type: 'trader',
      region: 'shandong',
      price: 2356,
      change: 0.2,
      monthlyVolume: 7.4,
      yearlyVolume: 74,
      lastUpdate: new Date().toISOString().split('T')[0],
      isKeyMonitored: true,
      address: '青岛市市南区香港中路1号',
      phone: '0532-85888888',
    },
  ],
  henan: [
    {
      id: 'hn-1',
      name: '中储粮河南分公司',
      type: 'trader',
      region: 'henan',
      price: 2205,
      change: 0.2,
      monthlyVolume: 17.5,
      yearlyVolume: 175,
      lastUpdate: new Date().toISOString().split('T')[0],
      isKeyMonitored: true,
      parentCompany: '中储粮',
      address: '郑州市郑东新区商务内环路28号',
      phone: '0371-67758178',
    },
    {
      id: 'hn-2',
      name: '中粮生化河南',
      type: 'ethanol',
      region: 'henan',
      price: 2198,
      change: 0.3,
      monthlyVolume: 12.2,
      yearlyVolume: 122,
      lastUpdate: new Date().toISOString().split('T')[0],
      isKeyMonitored: true,
      parentCompany: '中粮',
      address: '开封市龙亭区西环路1号',
      phone: '0378-2888888',
    },
    {
      id: 'hn-3',
      name: '河南粮食集团',
      type: 'trader',
      region: 'henan',
      price: 2200,
      change: 0.0,
      monthlyVolume: 14.8,
      yearlyVolume: 148,
      lastUpdate: new Date().toISOString().split('T')[0],
      isKeyMonitored: true,
      address: '郑州市中原区中原中路1号',
      phone: '0371-86688888',
    },
    {
      id: 'hn-4',
      name: '郑州粮食贸易',
      type: 'trader',
      region: 'henan',
      price: 2208,
      change: 0.4,
      monthlyVolume: 10.5,
      yearlyVolume: 105,
      lastUpdate: new Date().toISOString().split('T')[0],
      isKeyMonitored: true,
      address: '郑州市金水区经三路1号',
      phone: '0371-88888888',
    },
    {
      id: 'hn-5',
      name: '河南饲料加工',
      type: 'feed',
      region: 'henan',
      price: 2210,
      change: 0.1,
      monthlyVolume: 9.2,
      yearlyVolume: 92,
      lastUpdate: new Date().toISOString().split('T')[0],
      isKeyMonitored: true,
      address: '洛阳市西工区中州中路1号',
      phone: '0379-6888888',
    },
    {
      id: 'hn-6',
      name: '开封粮食贸易',
      type: 'trader',
      region: 'henan',
      price: 2202,
      change: -0.2,
      monthlyVolume: 7.8,
      yearlyVolume: 78,
      lastUpdate: new Date().toISOString().split('T')[0],
      isKeyMonitored: true,
      address: '开封市顺河区中山路1号',
      phone: '0378-3666666',
    },
    {
      id: 'hn-7',
      name: '河南淀粉加工',
      type: 'starch',
      region: 'henan',
      price: 2195,
      change: 0.2,
      monthlyVolume: 6.8,
      yearlyVolume: 68,
      lastUpdate: new Date().toISOString().split('T')[0],
      isKeyMonitored: true,
      address: '新乡市红旗区中心路1号',
      phone: '0373-5888888',
    },
  ],
  anhui: [
    {
      id: 'ah-1',
      name: '中储粮安徽分公司',
      type: 'trader',
      region: 'anhui',
      price: 2215,
      change: 0.1,
      monthlyVolume: 15.2,
      yearlyVolume: 152,
      lastUpdate: new Date().toISOString().split('T')[0],
      isKeyMonitored: true,
      parentCompany: '中储粮',
      address: '合肥市庐阳区北一环路278号财富广场',
      phone: '0551-65536460',
    },
    {
      id: 'ah-2',
      name: '中粮生化安徽',
      type: 'ethanol',
      region: 'anhui',
      price: 2208,
      change: 0.2,
      monthlyVolume: 11.3,
      yearlyVolume: 113,
      lastUpdate: new Date().toISOString().split('T')[0],
      isKeyMonitored: true,
      parentCompany: '中粮',
      address: '蚌埠市开源大道99号',
      phone: '0552-2568857',
    },
    {
      id: 'ah-3',
      name: '安徽粮食集团',
      type: 'trader',
      region: 'anhui',
      price: 2210,
      change: -0.1,
      monthlyVolume: 12.8,
      yearlyVolume: 128,
      lastUpdate: new Date().toISOString().split('T')[0],
      isKeyMonitored: true,
      address: '合肥市蜀山区长江西路1号',
      phone: '0551-65681013',
    },
    {
      id: 'ah-4',
      name: '合肥粮食贸易',
      type: 'trader',
      region: 'anhui',
      price: 2218,
      change: 0.3,
      monthlyVolume: 10.1,
      yearlyVolume: 101,
      lastUpdate: new Date().toISOString().split('T')[0],
      isKeyMonitored: true,
      address: '合肥市包河区中山路1号',
      phone: '0551-66888888',
    },
    {
      id: 'ah-5',
      name: '安徽饲料加工',
      type: 'feed',
      region: 'anhui',
      price: 2220,
      change: 0.0,
      monthlyVolume: 8.7,
      yearlyVolume: 87,
      lastUpdate: new Date().toISOString().split('T')[0],
      isKeyMonitored: true,
      address: '阜阳市颍州区中山路1号',
      phone: '0558-2888888',
    },
    {
      id: 'ah-6',
      name: '阜阳粮食贸易',
      type: 'trader',
      region: 'anhui',
      price: 2212,
      change: -0.2,
      monthlyVolume: 7.4,
      yearlyVolume: 74,
      lastUpdate: new Date().toISOString().split('T')[0],
      isKeyMonitored: true,
      address: '阜阳市颍东区中山路1号',
      phone: '0558-3666666',
    },
    {
      id: 'ah-7',
      name: '安徽淀粉加工',
      type: 'starch',
      region: 'anhui',
      price: 2205,
      change: 0.1,
      monthlyVolume: 6.5,
      yearlyVolume: 65,
      lastUpdate: new Date().toISOString().split('T')[0],
      isKeyMonitored: true,
      address: '滁州市琅琊区中山路1号',
      phone: '0550-3888888',
    },
  ],
};

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
    grainType === 'wheat'
      ? WHEAT_BASE_PRICES
      : grainType === 'soybean'
        ? SOYBEAN_BASE_PRICES
        : CORN_BASE_PRICES;

  return REGIONS.map((region) => {
    const enterprises = KEY_MONITORED_ENTERPRISES[region.id] || [];
    const basePrice = basePrices[region.id];
    const change = generateMockChange();

    return {
      id: region.id,
      name: region.name,
      code: region.code,
      price: Math.round(basePrice + change),
      change,
      lastUpdate: new Date().toISOString().split('T')[0],
      enterprises: enterprises.map((e) => ({
        ...e,
        price: Math.round(e.price + change),
        change,
      })),
    };
  });
}

// 获取企业详情（包括历史数据）
export function getEnterpriseDetail(
  regionId: string,
  enterpriseId: string
): (Enterprise & { history: PriceHistory[] }) | null {
  const enterprises = KEY_MONITORED_ENTERPRISES[regionId];
  const enterprise = enterprises?.find((e) => e.id === enterpriseId);

  if (!enterprise) return null;

  // 生成 30 天的历史价格数据
  const history: PriceHistory[] = [];
  const today = new Date();

  for (let i = 29; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    const dateStr = date.toISOString().split('T')[0];
    const priceVariation = (Math.random() - 0.5) * 40; // ±20 元/吨
    const price = Math.round(enterprise.price + priceVariation);

    history.push({
      date: dateStr,
      price,
      volume: Math.round(enterprise.monthlyVolume * (0.8 + Math.random() * 0.4)),
    });
  }

  return {
    ...enterprise,
    history,
  };
}

// 获取企业详情（简化版，用于列表展示）
export function getFactoryDetail(
  regionId: string,
  enterpriseId: string
): (Enterprise & { history: PriceHistory[] }) | null {
  return getEnterpriseDetail(regionId, enterpriseId);
}
