/**
 * Home Page
 * 粮食价格实时监控应用 - 首页
 * 
 * 设计理念：农业数据驾驶舱
 * - 地区优先：首屏展示七个主要地区的玉米收购价格对比
 * - 企业追踪：支持按企业查看详细收购价格和历史数据
 * - 重点监测：每个地区 5-8 家重点粮食加工企业（包括中储粮、中粮等）
 * - 企业分类：粮食贸易商、淀粉加工、饲料加工、乙醇加工
 */

import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { RegionCard } from '@/components/RegionCard';
import { FactoryList } from '@/components/FactoryList';
import { PriceChart } from '@/components/PriceChart';
import {
  getRegionData,
  getEnterpriseDetail,
  GRAIN_TYPES,
  RegionData,
  Enterprise,
  ENTERPRISE_TYPES,
} from '@/lib/data';

export default function Home() {
  const [selectedGrain, setSelectedGrain] = useState('corn');
  const [selectedRegion, setSelectedRegion] = useState<string | null>(null);
  const [selectedEnterprise, setSelectedEnterprise] = useState<Enterprise | null>(null);

  // 获取当前粮食品类的地区数据
  const regionsData = getRegionData(selectedGrain);
  const currentRegion = selectedRegion
    ? regionsData.find((r) => r.id === selectedRegion)
    : null;

  // 获取企业详情（包括历史数据）
  const enterpriseDetail =
    selectedEnterprise && selectedRegion
      ? getEnterpriseDetail(selectedRegion, selectedEnterprise.id)
      : null;

  const currentGrainType = GRAIN_TYPES.find((g) => g.id === selectedGrain);

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Banner */}
      <div
        className="relative h-48 bg-cover bg-center"
        style={{
          backgroundImage: 'url(/images/hero-banner.png)',
        }}
      >
        <div className="absolute inset-0 bg-black/30" />
        <div className="relative h-full flex flex-col justify-center px-4 text-white">
          <h1 className="text-3xl font-bold mb-2">粮食收购价格监控</h1>
          <p className="text-sm opacity-90">
            实时掌握全国主要地区粮食重点企业收购价格信息
          </p>
        </div>
      </div>

      {/* 主容器 */}
      <div className="max-w-6xl mx-auto px-4 py-6 space-y-6">
        {/* 顶部控制栏 */}
        <div className="flex items-center justify-between gap-4 flex-wrap">
          {/* 粮食品类选择 */}
          <div className="flex gap-2">
            {GRAIN_TYPES.map((grain) => (
              <button
                key={grain.id}
                onClick={() => {
                  setSelectedGrain(grain.id);
                  setSelectedRegion(null);
                  setSelectedEnterprise(null);
                }}
                className={`
                  px-4 py-2 rounded-lg font-semibold transition-all
                  ${
                    selectedGrain === grain.id
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-card text-card-foreground border border-border hover:bg-secondary'
                  }
                `}
              >
                {grain.icon} {grain.name}
              </button>
            ))}
          </div>

          {/* 更新时间 */}
          <div className="text-sm text-muted-foreground">
            更新时间：{new Date().toLocaleDateString('zh-CN')} 08:00
          </div>
        </div>

        {/* 地区价格概览 */}
        <div>
          <h2 className="text-xl font-bold text-card-foreground mb-4">
            地区价格对比
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {regionsData.map((region) => (
              <RegionCard
                key={region.id}
                name={region.name}
                code={region.code}
                price={region.price}
                change={region.change}
                isSelected={selectedRegion === region.id}
                onClick={() => {
                  setSelectedRegion(
                    selectedRegion === region.id ? null : region.id
                  );
                  setSelectedEnterprise(null);
                }}
              />
            ))}
          </div>
        </div>

        {/* 地区详情面板 */}
        {currentRegion && (
          <div className="bg-card border border-border rounded-lg p-6 space-y-6">
            {/* 地区标题 */}
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-card-foreground">
                  {currentRegion.name} - {currentGrainType?.name}
                </h2>
                <p className="text-sm text-muted-foreground mt-1">
                  共 {currentRegion.enterprises.length} 家重点监测企业
                </p>
              </div>
              <button
                onClick={() => setSelectedRegion(null)}
                className="px-4 py-2 bg-secondary text-card-foreground rounded-lg hover:bg-muted transition-all"
              >
                关闭
              </button>
            </div>

            {/* 企业列表 */}
            <div>
              <h3 className="text-lg font-semibold text-card-foreground mb-3">
                重点监测企业
              </h3>
              <FactoryList
                factories={currentRegion.enterprises}
                onFactoryClick={(factory) => setSelectedEnterprise(factory)}
              />
            </div>

            {/* 企业详情和趋势图 */}
            {enterpriseDetail && (
              <div className="border-t border-border pt-6 space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-semibold text-card-foreground">
                      {enterpriseDetail.name} - 价格趋势
                    </h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      最近 30 天价格走势
                    </p>
                  </div>
                  <button
                    onClick={() => setSelectedEnterprise(null)}
                    className="px-4 py-2 bg-secondary text-card-foreground rounded-lg hover:bg-muted transition-all"
                  >
                    关闭
                  </button>
                </div>

                {/* 企业信息卡片 */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="bg-secondary rounded-lg p-4">
                    <p className="text-xs text-muted-foreground mb-1">
                      企业类型
                    </p>
                    <p className={`text-sm font-bold px-2 py-1 rounded w-fit ${
                      ENTERPRISE_TYPES[enterpriseDetail.type].color
                    }`}>
                      {ENTERPRISE_TYPES[enterpriseDetail.type].label}
                    </p>
                  </div>
                  <div className="bg-secondary rounded-lg p-4">
                    <p className="text-xs text-muted-foreground mb-1">
                      当前价格
                    </p>
                    <p className="text-2xl font-bold text-primary">
                      {enterpriseDetail.price}
                    </p>
                    <p className="text-xs text-muted-foreground">元/吨</p>
                  </div>
                  <div className="bg-secondary rounded-lg p-4">
                    <p className="text-xs text-muted-foreground mb-1">
                      涨跌幅
                    </p>
                    <p
                      className={`text-2xl font-bold ${
                        enterpriseDetail.change >= 0
                          ? 'text-green-500'
                          : 'text-red-500'
                      }`}
                    >
                      {enterpriseDetail.change >= 0 ? '+' : ''}
                      {enterpriseDetail.change.toFixed(1)}%
                    </p>
                  </div>
                  <div className="bg-secondary rounded-lg p-4">
                    <p className="text-xs text-muted-foreground mb-1">
                      收购量
                    </p>
                    <p className="text-2xl font-bold text-primary">
                      {enterpriseDetail.volume}
                    </p>
                    <p className="text-xs text-muted-foreground">万吨</p>
                  </div>
                </div>

                {/* 母公司信息 */}
                {enterpriseDetail.parentCompany && (
                  <div className="bg-accent/10 border border-accent rounded-lg p-4">
                    <p className="text-sm">
                      <span className="font-semibold text-card-foreground">
                        母公司：
                      </span>
                      <span className="text-muted-foreground ml-2">
                        {enterpriseDetail.parentCompany}
                      </span>
                    </p>
                  </div>
                )}

                {/* 价格趋势图 */}
                <PriceChart
                  data={enterpriseDetail.history}
                  title={`${enterpriseDetail.name} - 30日价格趋势`}
                  height={300}
                />
              </div>
            )}
          </div>
        )}

        {/* 使用提示 */}
        {!selectedRegion && (
          <div className="bg-accent/10 border border-accent rounded-lg p-4 text-center text-sm text-muted-foreground">
            💡 点击上方地区卡片查看该地区的重点监测企业收购价格详情
          </div>
        )}
      </div>
    </div>
  );
}
