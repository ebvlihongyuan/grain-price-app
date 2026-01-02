/**
 * FactoryList Component
 * 工厂列表 - 展示地区内所有工厂的收购价格
 */

import { ArrowDown, ArrowUp, ChevronRight } from 'lucide-react';
import { Factory } from '@/lib/data';

interface FactoryListProps {
  factories: Factory[];
  onFactoryClick?: (factory: Factory) => void;
}

export function FactoryList({ factories, onFactoryClick }: FactoryListProps) {
  return (
    <div className="space-y-2">
      {factories.map((factory) => {
        const isPositive = factory.change >= 0;

        return (
          <div
            key={factory.id}
            onClick={() => onFactoryClick?.(factory)}
            className="
              bg-card border border-border rounded-lg p-4
              hover:bg-secondary hover:shadow-md transition-all cursor-pointer
              flex items-center justify-between
            "
          >
            {/* 左侧：工厂名称和品质 */}
            <div className="flex-1">
              <h4 className="font-semibold text-card-foreground">
                {factory.name}
              </h4>
              {factory.quality && (
                <p className="text-xs text-muted-foreground">
                  品质：{factory.quality}
                </p>
              )}
            </div>

            {/* 中间：价格 */}
            <div className="text-right mx-4">
              <p className="text-lg font-bold font-mono text-primary">
                {factory.price}
              </p>
              <p className="text-xs text-muted-foreground">元/吨</p>
            </div>

            {/* 右侧：涨跌幅和箭头 */}
            <div className="flex items-center gap-2">
              <div className="text-right">
                {isPositive ? (
                  <>
                    <div className="flex items-center gap-1 justify-end">
                      <ArrowUp className="w-4 h-4 text-green-500" />
                      <span className="text-sm font-semibold text-green-500">
                        +{factory.change.toFixed(1)}%
                      </span>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="flex items-center gap-1 justify-end">
                      <ArrowDown className="w-4 h-4 text-red-500" />
                      <span className="text-sm font-semibold text-red-500">
                        {factory.change.toFixed(1)}%
                      </span>
                    </div>
                  </>
                )}
              </div>
              <ChevronRight className="w-5 h-5 text-muted-foreground" />
            </div>
          </div>
        );
      })}
    </div>
  );
}
