import { useState } from 'react';
import { trpc } from '@/lib/trpc';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Trash2, Plus, Edit2 } from 'lucide-react';

export default function ScraperConfig() {
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState({
    enterpriseName: '',
    region: '',
    grainType: 'corn',
    officialWebsite: '',
    monitoringUrl: '',
    updateFrequency: 'daily' as const,
  });

  const { data: configs, refetch } = trpc.scraper.listConfigs.useQuery();
  const createMutation = trpc.scraper.createConfig.useMutation();
  const updateMutation = trpc.scraper.updateConfig.useMutation();
  const deleteMutation = trpc.scraper.deleteConfig.useMutation();

  const regions = ['heilongjiang', 'jilin', 'liaoning', 'hebei', 'shandong', 'henan', 'anhui'];
  const grainTypes = ['corn', 'wheat', 'soybean'];

  const handleSubmit = async () => {
    try {
      if (editingId) {
        await updateMutation.mutateAsync({
          id: editingId,
          ...formData,
        });
        setEditingId(null);
      } else {
        await createMutation.mutateAsync(formData);
      }
      setFormData({
        enterpriseName: '',
        region: '',
        grainType: 'corn',
        officialWebsite: '',
        monitoringUrl: '',
        updateFrequency: 'daily',
      });
      setIsAdding(false);
      refetch();
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await deleteMutation.mutateAsync({ id });
      refetch();
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleEdit = (config: any) => {
    setFormData({
      enterpriseName: config.enterpriseName,
      region: config.region,
      grainType: config.grainType,
      officialWebsite: config.officialWebsite,
      monitoringUrl: config.monitoringUrl,
      updateFrequency: config.updateFrequency,
    });
    setEditingId(config.id);
    setIsAdding(true);
  };

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-card-foreground">爬虫配置管理</h1>
          <Button
            onClick={() => {
              setIsAdding(!isAdding);
              setEditingId(null);
              setFormData({
                enterpriseName: '',
                region: '',
                grainType: 'corn',
                officialWebsite: '',
                monitoringUrl: '',
                updateFrequency: 'daily',
              });
            }}
            className="gap-2"
          >
            <Plus className="w-4 h-4" />
            添加配置
          </Button>
        </div>

        {isAdding && (
          <Card className="p-6 space-y-4">
            <h2 className="text-xl font-semibold text-card-foreground">
              {editingId ? '编辑配置' : '新增配置'}
            </h2>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-muted-foreground">企业名称</label>
                <Input
                  value={formData.enterpriseName}
                  onChange={(e) => setFormData({ ...formData, enterpriseName: e.target.value })}
                  placeholder="输入企业名称"
                />
              </div>

              <div>
                <label className="text-sm font-medium text-muted-foreground">地区</label>
                <Select value={formData.region} onValueChange={(value) => setFormData({ ...formData, region: value })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {regions.map((region) => (
                      <SelectItem key={region} value={region}>
                        {region}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-sm font-medium text-muted-foreground">粮食类型</label>
                <Select value={formData.grainType} onValueChange={(value) => setFormData({ ...formData, grainType: value })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {grainTypes.map((type) => (
                      <SelectItem key={type} value={type}>
                        {type}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-sm font-medium text-muted-foreground">更新周期</label>
                <Select value={formData.updateFrequency} onValueChange={(value: any) => setFormData({ ...formData, updateFrequency: value })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="daily">每日</SelectItem>
                    <SelectItem value="weekly">每周</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="col-span-2">
                <label className="text-sm font-medium text-muted-foreground">企业官网</label>
                <Input
                  value={formData.officialWebsite}
                  onChange={(e) => setFormData({ ...formData, officialWebsite: e.target.value })}
                  placeholder="https://example.com"
                  type="url"
                />
              </div>

              <div className="col-span-2">
                <label className="text-sm font-medium text-muted-foreground">监测网址</label>
                <Input
                  value={formData.monitoringUrl}
                  onChange={(e) => setFormData({ ...formData, monitoringUrl: e.target.value })}
                  placeholder="https://example.com/prices"
                  type="url"
                />
              </div>
            </div>

            <div className="flex gap-2 justify-end">
              <Button
                variant="outline"
                onClick={() => {
                  setIsAdding(false);
                  setEditingId(null);
                }}
              >
                取消
              </Button>
              <Button onClick={handleSubmit} disabled={createMutation.isPending || updateMutation.isPending}>
                {editingId ? '更新' : '创建'}
              </Button>
            </div>
          </Card>
        )}

        <div className="grid gap-4">
          {configs?.map((config) => (
            <Card key={config.id} className="p-4">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-card-foreground">{config.enterpriseName}</h3>
                  <div className="mt-2 space-y-1 text-sm text-muted-foreground">
                    <p>地区: {config.region} | 粮食: {config.grainType}</p>
                    <p>官网: <a href={config.officialWebsite} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">{config.officialWebsite}</a></p>
                    <p>监测: <a href={config.monitoringUrl} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">{config.monitoringUrl}</a></p>
                    <p>更新周期: {config.updateFrequency === 'daily' ? '每日' : '每周'} | 状态: {config.enabled ? '启用' : '禁用'}</p>
                    {config.lastScrapedAt && <p>最后爬取: {new Date(config.lastScrapedAt).toLocaleString('zh-CN')}</p>}
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleEdit(config)}
                  >
                    <Edit2 className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleDelete(config.id)}
                    disabled={deleteMutation.isPending}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {!configs || configs.length === 0 && !isAdding && (
          <div className="text-center py-12 text-muted-foreground">
            暂无爬虫配置，点击"添加配置"创建新的监测任务
          </div>
        )}
      </div>
    </div>
  );
}
