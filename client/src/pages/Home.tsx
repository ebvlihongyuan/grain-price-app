/**
 * Home Page
 * 粮食价格实时监控应用 - 首页
 * 
 * 设计理念：农业数据驾驶舱
 * - 地区优先：首屏展示七个主要地区的玉米收购价格对比
 * - 工厂追踪：支持按工厂查看详细收购价格和历史数据
 * - 实时更新：每日更新价格，显示涨跌幅和变化趋势
 */

import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { RegionCard } from '@/components/RegionCard';
import { FactoryList } from '@/components/FactoryList';
import { PriceChart } from '@/components/PriceChart';
import {
  getRegionData,
  getFactoryDetail,
  GRAIN_TYPES,
  RegionData,
  Factory,
} from '@/lib/data';

export default function Home() {
  const [selectedGrain, setSelectedGrain] = useState('corn');
  const [selectedRegion, setSelectedRegion] = useState<string | null>(null);
  const [selectedFactory, setSelectedFactory] = useState<Factory | null>(null);

  // 获取当前粮食品类的地区数据
  const regionsData = getRegionData(selectedGrain);
  const currentRegion = selectedRegion
    ? regionsData.find((r) => r.id === selectedRegion)
    : null;

  // 获取工厂详情（包括历史数据）
  const factoryDetail =
    selectedFactory && selectedRegion
      ? getFactoryDetail(selectedRegion, selectedFactory.id)
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
            实时掌握全国主要地区粮食收购价格信息
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
                  setSelectedFactory(null);
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
                  setSelectedFactory(null);
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
                  共 {currentRegion.factories.length} 家收购工厂
                </p>
              </div>
              <button
                onClick={() => setSelectedRegion(null)}
                className="px-4 py-2 bg-secondary text-card-foreground rounded-lg hover:bg-muted transition-all"
              >
                关闭
              </button>
            </div>

            {/* 工厂列表 */}
            <div>
              <h3 className="text-lg font-semibold text-card-foreground mb-3">
                工厂收购价格
              </h3>
              <FactoryList
                factories={currentRegion.factories}
                onFactoryClick={(factory) => setSelectedFactory(factory)}
              />
            </div>

            {/* 工厂详情和趋势图 */}
            {factoryDetail && (
              <div className="border-t border-border pt-6 space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-semibold text-card-foreground">
                      {factoryDetail.name} - 价格趋势
                    </h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      最近 30 天价格走势
                    </p>
                  </div>
                  <button
                    onClick={() => setSelectedFactory(null)}
                    className="px-4 py-2 bg-secondary text-card-foreground rounded-lg hover:bg-muted transition-all"
                  >
                    关闭
                  </button>
                </div>

                {/* 工厂信息卡片 */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="bg-secondary rounded-lg p-4">
                    <p className="text-xs text-muted-foreground mb-1">
                      当前价格
                    </p>
                    <p className="text-2xl font-bold text-primary">
                      {factoryDetail.price}
                    </p>
                    <p className="text-xs text-muted-foreground">元/吨</p>
                  </div>
                  <div className="bg-secondary rounded-lg p-4">
                    <p className="text-xs text-muted-foreground mb-1">
                      涨跌幅
                    </p>
                    <p
                      className={`text-2xl font-bold ${
                        factoryDetail.change >= 0
                          ? 'text-green-500'
                          : 'text-red-500'
                      }`}
                    >
                      {factoryDetail.change >= 0 ? '+' : ''}
                      {factoryDetail.change.toFixed(1)}%
                    </p>
                  </div>
                  {factoryDetail.volume && (
                    <div className="bg-secondary rounded-lg p-4">
                      <p className="text-xs text-muted-foreground mb-1">
                        收购量
                      </p>
                      <p className="text-2xl font-bold text-primary">
                        {factoryDetail.volume}
                      </p>
                      <p className="text-xs text-muted-foreground">万吨</p>
                    </div>
                  )}
                  {factoryDetail.quality && (
                    <div className="bg-secondary rounded-lg p-4">
                      <p className="text-xs text-muted-foreground mb-1">
                        品质等级
                      </p>
                      <p className="text-2xl font-bold text-primary">
                        {factoryDetail.quality}
                      </p>
                    </div>
                  )}
                </div>

                {/* 价格趋势图 */}
                <PriceChart
                  data={factoryDetail.history}
                  title={`${factoryDetail.name} - 30日价格趋势`}
                  height={300}
                />
              </div>
            )}
          </div>
        )}

        {/* 使用提示 */}
        {!selectedRegion && (
          <div className="bg-accent/10 border border-accent rounded-lg p-4 text-center text-sm text-muted-foreground">
            💡 点击上方地区卡片查看该地区的工厂收购价格详情
          </div>
        )}
      </div>
    </div>
  );
}
