/**
 * 企业爬虫配置面板
 * 允许用户为企业设置爬虫监控 URL 和更新周期
 */

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Loader2, Plus, Edit2, Trash2, CheckCircle, AlertCircle } from 'lucide-react';
import { trpc } from '@/lib/trpc';
import { toast } from 'sonner';
import { Enterprise } from '@/lib/data';

interface EnterprisScraperConfigProps {
  enterprise: Enterprise;
  region: string;
  grainType: string;
}

interface ScraperConfigData {
  id?: number;
  enterpriseName: string;
  region: string;
  grainType: string;
  officialWebsite: string;
  monitoringUrl: string;
  updateFrequency: 'daily' | 'weekly';
  enabled: number;
  lastScrapedAt?: string;
}

export function EnterprisScraperConfig({
  enterprise,
  region,
  grainType,
}: EnterprisScraperConfigProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<ScraperConfigData>({
    enterpriseName: enterprise.name,
    region,
    grainType,
    officialWebsite: '',
    monitoringUrl: '',
    updateFrequency: 'daily',
    enabled: 1,
  });

  // tRPC 调用
  const listConfigsQuery = trpc.scraper.listConfigs.useQuery();
  const createConfigMutation = trpc.scraper.createConfig.useMutation();
  const updateConfigMutation = trpc.scraper.updateConfig.useMutation();
  const deleteConfigMutation = trpc.scraper.deleteConfig.useMutation();

  // 查找该企业的爬虫配置
  const enterpriseConfig = listConfigsQuery.data?.find(
    (config) => config.enterpriseName === enterprise.name && config.region === region
  );

  // 初始化表单数据
  useEffect(() => {
    if (enterpriseConfig) {
      setFormData({
        id: enterpriseConfig.id,
        enterpriseName: enterpriseConfig.enterpriseName,
        region: enterpriseConfig.region,
        grainType: enterpriseConfig.grainType,
        officialWebsite: enterpriseConfig.officialWebsite,
        monitoringUrl: enterpriseConfig.monitoringUrl,
        updateFrequency: enterpriseConfig.updateFrequency,
        enabled: enterpriseConfig.enabled,
        lastScrapedAt: enterpriseConfig.lastScrapedAt?.toString(),
      });
    }
  }, [enterpriseConfig]);

  // 处理保存配置
  const handleSaveConfig = async () => {
    try {
      // 验证 URL
      try {
        new URL(formData.officialWebsite);
        new URL(formData.monitoringUrl);
      } catch {
        toast.error('请输入有效的 URL');
        return;
      }

      if (enterpriseConfig?.id) {
        // 更新配置
        await updateConfigMutation.mutateAsync({
          id: enterpriseConfig.id,
          officialWebsite: formData.officialWebsite,
          monitoringUrl: formData.monitoringUrl,
          updateFrequency: formData.updateFrequency,
          enabled: formData.enabled,
        });
        toast.success('爬虫配置已更新');
      } else {
        // 创建新配置
        await createConfigMutation.mutateAsync({
          enterpriseName: formData.enterpriseName,
          region: formData.region,
          grainType: formData.grainType,
          officialWebsite: formData.officialWebsite,
          monitoringUrl: formData.monitoringUrl,
          updateFrequency: formData.updateFrequency,
        });
        toast.success('爬虫配置已创建');
      }

      setIsEditing(false);
      listConfigsQuery.refetch();
    } catch (error) {
      toast.error('保存配置失败');
    }
  };

  // 处理删除配置
  const handleDeleteConfig = async () => {
    if (!enterpriseConfig?.id) return;

    try {
      await deleteConfigMutation.mutateAsync({ id: enterpriseConfig.id });
      toast.success('爬虫配置已删除');
      listConfigsQuery.refetch();
    } catch (error) {
      toast.error('删除配置失败');
    }
  };

  return (
    <Card className="border-accent/50">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-lg">爬虫配置</CardTitle>
            <CardDescription>
              设置企业官网监控 URL 和更新周期
            </CardDescription>
          </div>
          {enterpriseConfig && (
            <Badge variant={enterpriseConfig.enabled ? 'default' : 'secondary'}>
              {enterpriseConfig.enabled ? '已启用' : '已禁用'}
            </Badge>
          )}
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {!isEditing && enterpriseConfig ? (
          // 显示配置信息
          <div className="space-y-3">
            <div>
              <label className="text-sm font-medium text-muted-foreground">
                企业官网
              </label>
              <p className="text-sm text-card-foreground break-all">
                {enterpriseConfig.officialWebsite}
              </p>
            </div>

            <div>
              <label className="text-sm font-medium text-muted-foreground">
                监控页面
              </label>
              <p className="text-sm text-card-foreground break-all">
                {enterpriseConfig.monitoringUrl}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-muted-foreground">
                  更新周期
                </label>
                <p className="text-sm text-card-foreground">
                  {enterpriseConfig.updateFrequency === 'daily' ? '每日' : '每周'}
                </p>
              </div>

              {enterpriseConfig.lastScrapedAt && (
                <div>
                  <label className="text-sm font-medium text-muted-foreground">
                    最后更新
                  </label>
                  <p className="text-sm text-card-foreground">
                    {new Date(enterpriseConfig.lastScrapedAt).toLocaleString('zh-CN')}
                  </p>
                </div>
              )}
            </div>

            <div className="flex gap-2 pt-2">
              <Button
                onClick={() => setIsEditing(true)}
                variant="outline"
                size="sm"
                className="gap-2"
              >
                <Edit2 className="w-4 h-4" />
                编辑
              </Button>
              <Button
                onClick={handleDeleteConfig}
                disabled={deleteConfigMutation.isPending}
                variant="destructive"
                size="sm"
                className="gap-2"
              >
                {deleteConfigMutation.isPending ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Trash2 className="w-4 h-4" />
                )}
                删除
              </Button>
            </div>
          </div>
        ) : !isEditing ? (
          // 未配置状态
          <div className="text-center py-6">
            <AlertCircle className="w-12 h-12 text-muted-foreground mx-auto mb-3 opacity-50" />
            <p className="text-sm text-muted-foreground mb-4">
              该企业尚未配置爬虫监控
            </p>
            <Button
              onClick={() => setIsEditing(true)}
              className="gap-2"
            >
              <Plus className="w-4 h-4" />
              添加爬虫配置
            </Button>
          </div>
        ) : (
          // 编辑表单
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-card-foreground mb-2 block">
                企业官网 *
              </label>
              <input
                type="url"
                value={formData.officialWebsite}
                onChange={(e) =>
                  setFormData({ ...formData, officialWebsite: e.target.value })
                }
                placeholder="https://example.com"
                className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground text-sm"
              />
              <p className="text-xs text-muted-foreground mt-1">
                企业官方网站地址
              </p>
            </div>

            <div>
              <label className="text-sm font-medium text-card-foreground mb-2 block">
                监控页面 *
              </label>
              <input
                type="url"
                value={formData.monitoringUrl}
                onChange={(e) =>
                  setFormData({ ...formData, monitoringUrl: e.target.value })
                }
                placeholder="https://example.com/price"
                className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground text-sm"
              />
              <p className="text-xs text-muted-foreground mt-1">
                包含价格信息的具体页面 URL
              </p>
            </div>

            <div>
              <label className="text-sm font-medium text-card-foreground mb-2 block">
                更新周期 *
              </label>
              <select
                value={formData.updateFrequency}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    updateFrequency: e.target.value as 'daily' | 'weekly',
                  })
                }
                className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground text-sm"
              >
                <option value="daily">每日（早上 8:00）</option>
                <option value="weekly">每周（周一 9:00）</option>
              </select>
            </div>

            <div className="flex gap-2 pt-4">
              <Button
                onClick={handleSaveConfig}
                disabled={
                  createConfigMutation.isPending ||
                  updateConfigMutation.isPending ||
                  !formData.officialWebsite ||
                  !formData.monitoringUrl
                }
                className="gap-2 flex-1"
              >
                {createConfigMutation.isPending || updateConfigMutation.isPending ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <CheckCircle className="w-4 h-4" />
                )}
                保存配置
              </Button>
              <Button
                onClick={() => setIsEditing(false)}
                variant="outline"
                className="flex-1"
              >
                取消
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
