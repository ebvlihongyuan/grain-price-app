import { FuturesPrice } from '@/lib/data';
import { TrendingDown, TrendingUp } from 'lucide-react';

interface FuturesPriceCardProps {
  futures: FuturesPrice;
}

export default function FuturesPriceCard({ futures }: FuturesPriceCardProps) {
  const isPositive = futures.change >= 0;

  return (
    <div className="bg-white rounded-lg border border-border p-4 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-3">
        <div>
          <h3 className="font-semibold text-foreground">{futures.name}</h3>
          <p className="text-sm text-muted-foreground">{futures.exchange}</p>
        </div>
        {isPositive ? (
          <TrendingUp className="w-5 h-5 text-green-600" />
        ) : (
          <TrendingDown className="w-5 h-5 text-red-600" />
        )}
      </div>

      <div className="space-y-2">
        <div>
          <p className="text-2xl font-bold text-foreground">{futures.price}</p>
          <p className="text-xs text-muted-foreground">元/吨</p>
        </div>

        <div className="flex items-center gap-2">
          <span
            className={`text-sm font-semibold ${
              isPositive ? 'text-green-600' : 'text-red-600'
            }`}
          >
            {isPositive ? '↑' : '↓'} {Math.abs(futures.change).toFixed(2)}%
          </span>
          <span className="text-xs text-muted-foreground">
            {isPositive ? '+' : ''}{futures.changeAmount} 元/吨
          </span>
        </div>

        <div className="grid grid-cols-2 gap-2 text-xs mt-3 pt-3 border-t border-border">
          <div>
            <p className="text-muted-foreground">开盘</p>
            <p className="font-semibold text-foreground">{futures.openPrice}</p>
          </div>
          <div>
            <p className="text-muted-foreground">最高/最低</p>
            <p className="font-semibold text-foreground">
              {futures.highPrice}/{futures.lowPrice}
            </p>
          </div>
          <div>
            <p className="text-muted-foreground">成交量</p>
            <p className="font-semibold text-foreground">
              {(futures.volume / 10000).toFixed(1)}万手
            </p>
          </div>
          <div>
            <p className="text-muted-foreground">持仓量</p>
            <p className="font-semibold text-foreground">
              {(futures.openInterest / 10000).toFixed(1)}万手
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
