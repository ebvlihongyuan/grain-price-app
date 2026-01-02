/**
 * RegionCard Component
 * 地区价格卡片 - 展示单个地区的玉米收购价格
 */

import { ArrowDown, ArrowUp } from 'lucide-react';

interface RegionCardProps {
  name: string;
  code: string;
  price: number;
  change: number;
  onClick?: () => void;
  isSelected?: boolean;
}

export function RegionCard({
  name,
  code,
  price,
  change,
  onClick,
  isSelected = false,
}: RegionCardProps) {
  const isPositive = change >= 0;

  return (
    <div
      onClick={onClick}
      className={`
        rounded-2xl p-4 cursor-pointer transition-all duration-300
        ${
          isSelected
            ? 'bg-primary text-primary-foreground shadow-lg scale-105'
            : 'bg-card text-card-foreground border border-border hover:shadow-md hover:scale-102'
        }
      `}
    >
      {/* 地区名称和代码 */}
      <div className="flex justify-between items-start mb-3">
        <div>
          <h3 className="text-lg font-semibold">{name}</h3>
          <p className="text-xs opacity-70">{code}</p>
        </div>
      </div>

      {/* 价格 */}
      <div className="mb-3">
        <p className="text-3xl font-bold font-mono">{price}</p>
        <p className="text-xs opacity-70">元/吨</p>
      </div>

      {/* 涨跌幅 */}
      <div className="flex items-center gap-1">
        {isPositive ? (
          <>
            <ArrowUp className="w-4 h-4 text-green-500" />
            <span className="text-sm font-semibold text-green-500">
              +{change.toFixed(1)}%
            </span>
          </>
        ) : (
          <>
            <ArrowDown className="w-4 h-4 text-red-500" />
            <span className="text-sm font-semibold text-red-500">
              {change.toFixed(1)}%
            </span>
          </>
        )}
      </div>
    </div>
  );
}
