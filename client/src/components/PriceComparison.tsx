import { FuturesPrice, calculatePriceDifference } from '@/lib/data';
import { ArrowDown, ArrowUp } from 'lucide-react';

interface PriceComparisonProps {
  purchasePrice: number;
  futures: FuturesPrice;
  regionName: string;
}

export default function PriceComparison({
  purchasePrice,
  futures,
  regionName,
}: PriceComparisonProps) {
  const { difference, percentage } = calculatePriceDifference(
    purchasePrice,
    futures.price
  );
  const isPremium = difference > 0;

  return (
    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-200 p-4">
      <h3 className="font-semibold text-foreground mb-3">
        {regionName} 收购价 vs 期货价对比
      </h3>

      <div className="grid grid-cols-3 gap-3">
        {/* 收购价 */}
        <div className="bg-white rounded p-3">
          <p className="text-xs text-muted-foreground mb-1">收购价</p>
          <p className="text-lg font-bold text-foreground">{purchasePrice}</p>
          <p className="text-xs text-muted-foreground mt-1">元/吨</p>
        </div>

        {/* 期货价 */}
        <div className="bg-white rounded p-3">
          <p className="text-xs text-muted-foreground mb-1">期货价({futures.symbol})</p>
          <p className="text-lg font-bold text-foreground">{futures.price}</p>
          <p className="text-xs text-muted-foreground mt-1">元/吨</p>
        </div>

        {/* 价差 */}
        <div
          className={`rounded p-3 ${
            isPremium
              ? 'bg-green-50 border border-green-200'
              : 'bg-red-50 border border-red-200'
          }`}
        >
          <p className="text-xs text-muted-foreground mb-1">价差</p>
          <div className="flex items-center gap-1">
            {isPremium ? (
              <ArrowUp className="w-4 h-4 text-green-600" />
            ) : (
              <ArrowDown className="w-4 h-4 text-red-600" />
            )}
            <p
              className={`text-lg font-bold ${
                isPremium ? 'text-green-600' : 'text-red-600'
              }`}
            >
              {isPremium ? '+' : ''}{difference}
            </p>
          </div>
          <p
            className={`text-xs mt-1 ${
              isPremium ? 'text-green-600' : 'text-red-600'
            }`}
          >
            {isPremium ? '+' : ''}{percentage.toFixed(2)}%
          </p>
        </div>
      </div>

      <div className="mt-3 p-2 bg-white rounded text-xs text-muted-foreground">
        {isPremium ? (
          <p>
            💡 收购价高于期货价{difference}元/吨，说明当地收购价格相对坚挺。
          </p>
        ) : (
          <p>
            💡 收购价低于期货价{Math.abs(difference)}元/吨，说明当地收购价格相对偏低。
          </p>
        )}
      </div>
    </div>
  );
}
