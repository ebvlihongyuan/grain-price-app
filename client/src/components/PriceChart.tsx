/**
 * PriceChart Component
 * 价格趋势图表 - 使用 Recharts 展示价格走势
 */

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Area,
  AreaChart,
} from 'recharts';
import { PriceHistory } from '@/lib/data';

interface PriceChartProps {
  data: PriceHistory[];
  title?: string;
  height?: number;
}

export function PriceChart({
  data,
  title = '价格趋势',
  height = 300,
}: PriceChartProps) {
  // 格式化数据用于图表
  const chartData = data.map((item) => ({
    date: new Date(item.date).toLocaleDateString('zh-CN', {
      month: '2-digit',
      day: '2-digit',
    }),
    price: item.price,
    fullDate: item.date,
  }));

  // 计算价格范围
  const prices = data.map((d) => d.price);
  const minPrice = Math.min(...prices);
  const maxPrice = Math.max(...prices);
  const avgPrice = Math.round(prices.reduce((a, b) => a + b) / prices.length);

  return (
    <div className="bg-card border border-border rounded-lg p-4">
      {title && (
        <div className="mb-4">
          <h3 className="text-lg font-semibold text-card-foreground">
            {title}
          </h3>
          <div className="flex gap-6 mt-2 text-sm">
            <div>
              <p className="text-muted-foreground">最高</p>
              <p className="font-semibold text-card-foreground">{maxPrice}</p>
            </div>
            <div>
              <p className="text-muted-foreground">平均</p>
              <p className="font-semibold text-card-foreground">{avgPrice}</p>
            </div>
            <div>
              <p className="text-muted-foreground">最低</p>
              <p className="font-semibold text-card-foreground">{minPrice}</p>
            </div>
          </div>
        </div>
      )}

      {/* 图表 */}
      <ResponsiveContainer width="100%" height={height}>
        <AreaChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#10B981" stopOpacity={0.3} />
              <stop offset="95%" stopColor="#10B981" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
          <XAxis
            dataKey="date"
            stroke="#6B7280"
            style={{ fontSize: '12px' }}
            tick={{ fill: '#6B7280' }}
          />
          <YAxis
            stroke="#6B7280"
            style={{ fontSize: '12px' }}
            tick={{ fill: '#6B7280' }}
            domain={['dataMin - 50', 'dataMax + 50']}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: '#FFFFFF',
              border: '1px solid #E5E7EB',
              borderRadius: '8px',
            }}
            formatter={(value) => [
              `${value} 元/吨`,
              '价格',
            ]}
            labelFormatter={(label) => `日期: ${label}`}
          />
          <Area
            type="monotone"
            dataKey="price"
            stroke="#10B981"
            strokeWidth={2}
            fillOpacity={1}
            fill="url(#colorPrice)"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
