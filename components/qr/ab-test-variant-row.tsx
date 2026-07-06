'use client';

import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Trash2 } from 'lucide-react';
import { useLanguage } from '@/components/i18n/language-provider';
import type { AbTestData, AbVariant } from '@/lib/ab-routing';

type AbTestVariantRowProps = {
  variant: AbVariant;
  index: number;
  defaultUrl?: string;
  canRemove: boolean;
  onUpdate: (index: number, patch: Partial<AbVariant>) => void;
  onRemove: (index: number) => void;
};

export function AbTestVariantRow({
  variant,
  index,
  defaultUrl,
  canRemove,
  onUpdate,
  onRemove,
}: AbTestVariantRowProps) {
  const { t } = useLanguage();

  return (
    <div className="grid gap-3 rounded-lg border border-border/50 p-3 sm:grid-cols-[1fr_2fr_80px_36px]">
      <div className="space-y-1">
        <Label className="text-xs">{t('qrFeatures.abLabel')}</Label>
        <Input value={variant.label} onChange={(e) => onUpdate(index, { label: e.target.value })} />
      </div>
      <div className="space-y-1">
        <Label className="text-xs">{t('qrFeatures.abUrl')}</Label>
        <Input
          placeholder={defaultUrl || t('qrFeatures.abUrlPlaceholder')}
          value={variant.url}
          onChange={(e) => onUpdate(index, { url: e.target.value })}
        />
      </div>
      <div className="space-y-1">
        <Label className="text-xs">{t('qrFeatures.abWeight')}</Label>
        <Input
          type="number"
          min={1}
          max={100}
          value={variant.weight}
          onChange={(e) => onUpdate(index, { weight: Number(e.target.value) })}
        />
      </div>
      <div className="flex items-end">
        <Button type="button" variant="ghost" size="icon-sm" disabled={!canRemove} onClick={() => onRemove(index)}>
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}

export type { AbTestData };
