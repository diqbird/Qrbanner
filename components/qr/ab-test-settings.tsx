'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { Split, Plus } from 'lucide-react';
import { useLanguage } from '@/components/i18n/language-provider';
import { type AbTestData } from '@/lib/ab-routing';
import {
  addAbTestVariant,
  getAbTestVariants,
  patchAbTestVariant,
  removeAbTestVariant,
} from '@/lib/ab-test-variant-mutations';
import { AbTestVariantRow } from './ab-test-variant-row';

export function AbTestSettings({
  enabled,
  onEnabledChange,
  data,
  onChange,
  defaultUrl,
}: {
  enabled: boolean;
  onEnabledChange: (v: boolean) => void;
  data: AbTestData;
  onChange: (v: AbTestData) => void;
  defaultUrl?: string;
}) {
  const { t } = useLanguage();
  const variants = getAbTestVariants(data);

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="font-display flex items-center gap-2">
            <Split className="h-5 w-5 text-primary" /> {t('qrFeatures.abTitle')}
          </CardTitle>
          <Switch checked={enabled} onCheckedChange={onEnabledChange} />
        </div>
        <p className="text-sm text-muted-foreground">{t('qrFeatures.abSubtitle')}</p>
      </CardHeader>
      {enabled && (
        <CardContent className="space-y-4">
          <label className="flex items-center justify-between text-sm">
            <span>{t('qrFeatures.abSticky')}</span>
            <Switch
              checked={data.sticky !== false}
              onCheckedChange={(v) => onChange({ ...data, sticky: v })}
            />
          </label>
          {variants.map((v, i) => (
            <AbTestVariantRow
              key={v.id}
              variant={v}
              index={i}
              defaultUrl={defaultUrl}
              canRemove={variants.length > 2}
              onUpdate={(index, patch) => onChange(patchAbTestVariant(data, index, patch))}
              onRemove={(index) => onChange(removeAbTestVariant(data, index))}
            />
          ))}
          {variants.length < 5 && (
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => onChange(addAbTestVariant(data))}
              className="gap-1"
            >
              <Plus className="h-4 w-4" /> {t('qrFeatures.abAddVariant')}
            </Button>
          )}
        </CardContent>
      )}
    </Card>
  );
}

export { emptyAbTestData } from '@/lib/ab-routing';
