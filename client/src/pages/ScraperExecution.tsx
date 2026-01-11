/**
 * 爬虫执行管理页面
 * 允许管理员手动执行爬虫、启动/停止定时任务、查看执行日志
 */

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Loader2, Play, Pause, RefreshCw, AlertCircle, CheckCircle, XCircle } from 'lucide-react';
import { trpc } from '@/lib/trpc';
import { toast } from 'sonner';

interface LogEntry {
  configId: number;
  enterpriseName: string;
  status: 'success' | 'failed' | 'skipped';
  price?: number;
  change?: string;
  error?: string;
  executedAt: Date;
}

export default function ScraperExecution() {
  const [selectedFrequency, setSelectedFrequency] = useState<'daily' | 'weekly'>('daily');
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [stats, setStats] = useState<{
    total: number;
    successful: number;
    failed: number;
    skipped: number;
    successRate: number;
  } | null>(null);

  // tRPC 调用
  const executeAllMutation = trpc.scraper.execution.executeAll.useMutation();
  const executeByFrequencyMutation = trpc.scraper.execution.executeByFrequency.useMutation();
  const startSchedulerMutation = trpc.scraper.execution.startScheduler.useMutation();
  const stopSchedulerMutation = trpc.scraper.execution.stopScheduler.useMutation();
  const getSchedulerStatusQuery = trpc.scraper.execution.getSchedulerStatus.useQuery();
  const getRecentLogsQuery = trpc.scraper.execution.getRecentLogs.useQuery({ limit: 50 });
  const getLogStatisticsQuery = trpc.scraper.execution.getLogStatistics.useQuery();

  // 更新日志和统计信息
  useEffect(() => {
    if (getRecentLogsQuery.data) {
      setLogs(getRecentLogsQuery.data.map((log) => ({
        ...log,
        executedAt: new Date(log.executedAt),
      })));
    }
  }, [getRecentLogsQuery.data]);

  useEffect(() => {
    if (getLogStatisticsQuery.data) {
      setStats(getLogStatisticsQuery.data);
    }
  }, [getLogStatisticsQuery.data]);

  // 执行所有爬虫
  const handleExecuteAll = async () => {
    try {
      const result = await executeAllMutation.mutateAsync();
      toast.success(`执行完成: ${result.successful}/${result.total} 成功`);
      getRecentLogsQuery.refetch();
      getLogStatisticsQuery.refetch();
    } catch (error) {
      toast.error('执行失败');
    }
  };

  // 执行特定频率的爬虫
  const handleExecuteByFrequency = async () => {
    try {
      const result = await executeByFrequencyMutation.mutateAsync({ frequency: selectedFrequency });
      toast.success(`执行 ${selectedFrequency === 'daily' ? '每日' : '每周'} 爬虫: ${result.successful}/${result.total} 成功`);
      getRecentLogsQuery.refetch();
      getLogStatisticsQuery.refetch();
    } catch (error) {
      toast.error('执行失败');
    }
  };

  // 启动定时任务
  const handleStartScheduler = async () => {
    try {
      await startSchedulerMutation.mutateAsync();
      toast.success('定时任务已启动');
      getSchedulerStatusQuery.refetch();
    } catch (error) {
      toast.error('启动失败');
    }
  };

  // 停止定时任务
  const handleStopScheduler = async () => {
    try {
      await stopSchedulerMutation.mutateAsync();
      toast.success('定时任务已停止');
      getSchedulerStatusQuery.refetch();
    } catch (error) {
      toast.error('停止失败');
    }
  };

  const isSchedulerRunning = getSchedulerStatusQuery.data?.running ?? false;

  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* 页面标题 */}
        <div>
          <h1 className="text-3xl font-bold text-card-foreground mb-2">爬虫执行管理</h1>
          <p className="text-muted-foreground">
            手动执行爬虫任务、管理定时调度、查看执行日志和统计信息
          </p>
        </div>

        {/* 定时任务控制 */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>定时任务管理</span>
              <Badge variant={isSchedulerRunning ? 'default' : 'secondary'}>
                {isSchedulerRunning ? '运行中' : '已停止'}
              </Badge>
            </CardTitle>
            <CardDescription>
              启动或停止自动爬虫任务（每日早上 8:00，每周一 9:00）
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-4">
              <Button
                onClick={handleStartScheduler}
                disabled={isSchedulerRunning || startSchedulerMutation.isPending}
                className="gap-2"
              >
                {startSchedulerMutation.isPending ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Play className="w-4 h-4" />
                )}
                启动定时任务
              </Button>
              <Button
                onClick={handleStopScheduler}
                disabled={!isSchedulerRunning || stopSchedulerMutation.isPending}
                variant="destructive"
                className="gap-2"
              >
                {stopSchedulerMutation.isPending ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Pause className="w-4 h-4" />
                )}
                停止定时任务
              </Button>
            </div>

            {/* 任务状态 */}
            {getSchedulerStatusQuery.data?.tasks && (
              <div className="bg-secondary rounded-lg p-4 space-y-2">
                {getSchedulerStatusQuery.data.tasks.map((task) => (
                  <div key={task.name} className="flex items-center justify-between">
                    <span className="text-sm font-medium">{task.name}</span>
                    <Badge variant={task.running ? 'default' : 'secondary'}>
                      {task.running ? '运行中' : '已停止'}
                    </Badge>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* 手动执行爬虫 */}
        <Card>
          <CardHeader>
            <CardTitle>手动执行爬虫</CardTitle>
            <CardDescription>
              立即执行爬虫任务，无需等待定时触发
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* 执行所有爬虫 */}
              <Button
                onClick={handleExecuteAll}
                disabled={executeAllMutation.isPending}
                className="gap-2 h-auto py-4"
              >
                {executeAllMutation.isPending ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <RefreshCw className="w-4 h-4" />
                )}
                <div className="text-left">
                  <div className="font-semibold">执行所有爬虫</div>
                  <div className="text-xs opacity-75">运行所有启用的爬虫配置</div>
                </div>
              </Button>

              {/* 执行特定频率的爬虫 */}
              <div className="space-y-2">
                <div className="flex gap-2">
                  <select
                    value={selectedFrequency}
                    onChange={(e) => setSelectedFrequency(e.target.value as 'daily' | 'weekly')}
                    className="flex-1 px-3 py-2 border border-border rounded-lg bg-background text-foreground"
                  >
                    <option value="daily">每日爬虫</option>
                    <option value="weekly">每周爬虫</option>
                  </select>
                  <Button
                    onClick={handleExecuteByFrequency}
                    disabled={executeByFrequencyMutation.isPending}
                    className="gap-2"
                  >
                    {executeByFrequencyMutation.isPending ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <RefreshCw className="w-4 h-4" />
                    )}
                    执行
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 统计信息 */}
        {stats && (
          <Card>
            <CardHeader>
              <CardTitle>执行统计</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                <div className="bg-secondary rounded-lg p-4 text-center">
                  <div className="text-2xl font-bold text-primary">{stats.total}</div>
                  <div className="text-xs text-muted-foreground mt-1">总执行次数</div>
                </div>
                <div className="bg-green-500/10 rounded-lg p-4 text-center border border-green-500/20">
                  <div className="text-2xl font-bold text-green-600">{stats.successful}</div>
                  <div className="text-xs text-green-600 mt-1">成功</div>
                </div>
                <div className="bg-red-500/10 rounded-lg p-4 text-center border border-red-500/20">
                  <div className="text-2xl font-bold text-red-600">{stats.failed}</div>
                  <div className="text-xs text-red-600 mt-1">失败</div>
                </div>
                <div className="bg-yellow-500/10 rounded-lg p-4 text-center border border-yellow-500/20">
                  <div className="text-2xl font-bold text-yellow-600">{stats.skipped}</div>
                  <div className="text-xs text-yellow-600 mt-1">跳过</div>
                </div>
                <div className="bg-blue-500/10 rounded-lg p-4 text-center border border-blue-500/20">
                  <div className="text-2xl font-bold text-blue-600">{stats.successRate}%</div>
                  <div className="text-xs text-blue-600 mt-1">成功率</div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* 执行日志 */}
        <Card>
          <CardHeader>
            <CardTitle>执行日志</CardTitle>
            <CardDescription>
              最近 50 条爬虫执行记录
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {logs.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  暂无执行日志
                </div>
              ) : (
                logs.map((log, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-3 bg-secondary rounded-lg hover:bg-secondary/80 transition-colors"
                  >
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      {log.status === 'success' && (
                        <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                      )}
                      {log.status === 'failed' && (
                        <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
                      )}
                      {log.status === 'skipped' && (
                        <XCircle className="w-5 h-5 text-yellow-500 flex-shrink-0" />
                      )}
                      <div className="min-w-0 flex-1">
                        <div className="font-medium text-sm truncate">
                          {log.enterpriseName}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {log.executedAt.toLocaleString('zh-CN')}
                        </div>
                      </div>
                    </div>
                    <div className="text-right ml-4 flex-shrink-0">
                      {log.status === 'success' && (
                        <div className="text-sm font-semibold text-green-600">
                          ¥{log.price} {log.change && `(${log.change}%)`}
                        </div>
                      )}
                      {log.status === 'failed' && (
                        <div className="text-sm text-red-600 truncate max-w-xs">
                          {log.error}
                        </div>
                      )}
                      {log.status === 'skipped' && (
                        <div className="text-sm text-yellow-600">已跳过</div>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
