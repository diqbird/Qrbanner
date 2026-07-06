'use client';

import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { resolveCategoryDisplayName } from '@/lib/i18n/resolve-qr-category-copy';
import { campaignPrimaryFieldKey, campaignPrimaryFieldLabel } from '@/lib/campaign-wizard-utils';
import type { CampaignWizardState } from '@/hooks/use-campaign-wizard';
import type { CampaignQrItem } from '@/lib/campaign-types';

type CampaignWizardReviewItemProps = {
  item: CampaignQrItem;
  t: CampaignWizardState['t'];
  updateItem: CampaignWizardState['updateItem'];
  updateItemData: CampaignWizardState['updateItemData'];
};

export function CampaignWizardReviewItem({
  item,
  t,
  updateItem,
  updateItemData,
}: CampaignWizardReviewItemProps) {
  const fieldKey = campaignPrimaryFieldKey(item.category);

  return (
    <Card className={!item.enabled ? 'opacity-50' : undefined}>
      <CardContent className="space-y-3 py-4">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0 flex-1 space-y-2">
            <Input
              value={item.name}
              onChange={(e) => updateItem(item.key, { name: e.target.value })}
              className="font-medium"
              disabled={!item.enabled}
            />
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant="outline">{resolveCategoryDisplayName(t, item.category)}</Badge>
              <span className="text-xs text-muted-foreground">{item.purpose}</span>
            </div>
          </div>
          <div className="flex shrink-0 items-center gap-2">
            <Label htmlFor={`en-${item.key}`} className="text-xs text-muted-foreground">
              {t('campaign.enabled')}
            </Label>
            <Switch
              id={`en-${item.key}`}
              checked={item.enabled}
              onCheckedChange={(checked) => updateItem(item.key, { enabled: checked })}
            />
          </div>
        </div>
        {fieldKey && item.enabled && (
          <div className="space-y-1">
            <Label className="text-xs">{campaignPrimaryFieldLabel(item.category, t)}</Label>
            <Input
              value={item.qrData[fieldKey] ?? ''}
              onChange={(e) => updateItemData(item.key, fieldKey, e.target.value)}
            />
          </div>
        )}
      </CardContent>
    </Card>
  );
}
