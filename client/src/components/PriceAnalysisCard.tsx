import { PriceAnalysisReport } from '@/lib/priceAnalysis';
import { TrendingDown, TrendingUp } from 'lucide-react';

interface PriceAnalysisCardProps {
  report: PriceAnalysisReport;
}

export default function PriceAnalysisCard({ report }: PriceAnalysisCardProps) {
  const forecast1Week = report.forecast.forecast1Week;
  const forecast1Month = report.forecast.forecast1Month;

  return (
    <div className="bg-white rounded-lg border border-border p-6 space-y-4">
      {/* 标题 */}
      <div className="border-b border-border pb-4">
        <h2 className="text-2xl font-bold text-foreground mb-2">
          {report.region} - 价格分析与预测
        </h2>
        <p className="text-sm text-muted-foreground">
          数据日期：{report.date}
        </p>
      </div>

      {/* 当前价格 */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-4">
        <p className="text-sm text-muted-foreground mb-2">当前收购价</p>
        <p className="text-3xl font-bold text-foreground">
          {report.forecast.currentPrice} 元/吨
        </p>
      </div>

      {/* 预测卡片 */}
      <div className="grid grid-cols-2 gap-4">
        {/* 后一周预测 */}
        <div className="border border-border rounded-lg p-4">
          <p className="text-sm font-semibold text-foreground mb-3">后一周预测</p>
          <div className="space-y-2">
            <div>
              <p className="text-xs text-muted-foreground mb-1">预测价格</p>
              <div className="flex items-center gap-2">
                {forecast1Week.trend === 'up' ? (
                  <TrendingUp className="w-4 h-4 text-green-600" />
                ) : forecast1Week.trend === 'down' ? (
                  <TrendingDown className="w-4 h-4 text-red-600" />
                ) : null}
                <p className={`text-xl font-bold ${
                  forecast1Week.trend === 'up' ? 'text-green-600' :
                  forecast1Week.trend === 'down' ? 'text-red-600' :
                  'text-foreground'
                }`}>
                  {forecast1Week.price}
                </p>
              </div>
            </div>
            <div>
              <p className="text-xs text-muted-foreground mb-1">价格范围</p>
              <p className="text-sm font-semibold text-foreground">
                {forecast1Week.range[0]} - {forecast1Week.range[1]}
              </p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground mb-1">置信度</p>
              <div className="flex items-center gap-2">
                <div className="flex-1 bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-blue-600 h-2 rounded-full"
                    style={{ width: `${forecast1Week.confidence * 100}%` }}
                  />
                </div>
                <p className="text-xs font-semibold text-foreground">
                  {(forecast1Week.confidence * 100).toFixed(0)}%
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* 后一月预测 */}
        <div className="border border-border rounded-lg p-4">
          <p className="text-sm font-semibold text-foreground mb-3">后一月预测</p>
          <div className="space-y-2">
            <div>
              <p className="text-xs text-muted-foreground mb-1">预测价格</p>
              <div className="flex items-center gap-2">
                {forecast1Month.trend === 'up' ? (
                  <TrendingUp className="w-4 h-4 text-green-600" />
                ) : forecast1Month.trend === 'down' ? (
                  <TrendingDown className="w-4 h-4 text-red-600" />
                ) : null}
                <p className={`text-xl font-bold ${
                  forecast1Month.trend === 'up' ? 'text-green-600' :
                  forecast1Month.trend === 'down' ? 'text-red-600' :
                  'text-foreground'
                }`}>
                  {forecast1Month.price}
                </p>
              </div>
            </div>
            <div>
              <p className="text-xs text-muted-foreground mb-1">价格范围</p>
              <p className="text-sm font-semibold text-foreground">
                {forecast1Month.range[0]} - {forecast1Month.range[1]}
              </p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground mb-1">置信度</p>
              <div className="flex items-center gap-2">
                <div className="flex-1 bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-blue-600 h-2 rounded-full"
                    style={{ width: `${forecast1Month.confidence * 100}%` }}
                  />
                </div>
                <p className="text-xs font-semibold text-foreground">
                  {(forecast1Month.confidence * 100).toFixed(0)}%
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 分析内容 */}
      <div className="border-t border-border pt-4 space-y-3">
        <div>
          <p className="text-sm font-semibold text-foreground mb-1">历史趋势</p>
          <p className="text-sm text-muted-foreground">{report.analysis.historicalTrend}</p>
        </div>
        <div>
          <p className="text-sm font-semibold text-foreground mb-1">季节分析</p>
          <p className="text-sm text-muted-foreground">{report.analysis.seasonalAnalysis}</p>
        </div>
        <div>
          <p className="text-sm font-semibold text-foreground mb-1">全球供应影响</p>
          <p className="text-sm text-muted-foreground">{report.analysis.globalImpact}</p>
        </div>
        <div>
          <p className="text-sm font-semibold text-foreground mb-1">国内因素</p>
          <p className="text-sm text-muted-foreground">{report.analysis.domesticFactors}</p>
        </div>
      </div>

      {/* 影响因素权重 */}
      <div className="border-t border-border pt-4">
        <p className="text-sm font-semibold text-foreground mb-3">影响因素权重分析</p>
        <div className="space-y-2">
          {report.forecast.factors.map((factor) => (
            <div key={factor.name}>
              <div className="flex items-center justify-between mb-1">
                <p className="text-sm font-semibold text-foreground">{factor.name}</p>
                <span className={`text-xs font-bold px-2 py-1 rounded ${
                  factor.impact === 'positive' ? 'bg-green-100 text-green-700' :
                  factor.impact === 'negative' ? 'bg-red-100 text-red-700' :
                  'bg-gray-100 text-gray-700'
                }`}>
                  {factor.impact === 'positive' ? '利多' : factor.impact === 'negative' ? '利空' : '中性'}
                </span>
              </div>
              <div className="flex items-center gap-2 mb-1">
                <div className="flex-1 bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-blue-600 h-2 rounded-full"
                    style={{ width: `${factor.weight * 100}%` }}
                  />
                </div>
                <p className="text-xs font-semibold text-foreground">
                  {(factor.weight * 100).toFixed(0)}%
                </p>
              </div>
              <p className="text-xs text-muted-foreground">{factor.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
