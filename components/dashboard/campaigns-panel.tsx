'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Megaphone, Plus, Loader2 } from 'lucide-react';
import { useCampaignsPanel } from '@/hooks/use-campaigns-panel';
import { CampaignsPanelList } from './campaigns-panel-list';

export function CampaignsPanel() {
  const panel = useCampaignsPanel();
  const { t, loading, showForm, setShowForm } = panel;

  if (loading) {
    return (
      <Card>
        <CardContent className="flex justify-center py-8">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
        <CardTitle className="font-display flex items-center gap-2 text-base">
          <Megaphone className="h-5 w-5 text-primary" />
          {t('campaigns.title')}
        </CardTitle>
        <Button size="sm" variant="outline" className="gap-1" onClick={() => setShowForm(!showForm)}>
          <Plus className="h-3.5 w-3.5" />
          {t('campaigns.new')}
        </Button>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm text-muted-foreground">{t('campaigns.subtitle')}</p>
        <CampaignsPanelList panel={panel} />
      </CardContent>
    </Card>
  );
}
