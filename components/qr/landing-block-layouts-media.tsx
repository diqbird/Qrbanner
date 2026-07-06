'use client';

import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select';
import type { LandingBlockFieldProps } from './landing-block-field-types';

export function LandingBlockImageLayout({ block, patch, t }: LandingBlockFieldProps) {
  if (block.type !== 'image') return null;
  return (
    <div className="space-y-3">
      <Input
        placeholder={t('landingBuilder.imageUrlPlaceholder')}
        value={block.url}
        onChange={(e) => patch({ url: e.target.value })}
      />
      <Input
        placeholder={t('landingBuilder.altPlaceholder')}
        value={block.alt ?? ''}
        onChange={(e) => patch({ alt: e.target.value })}
      />
      <label className="flex items-center gap-2 text-sm">
        <Switch checked={Boolean(block.rounded)} onCheckedChange={(v) => patch({ rounded: v })} />
        {t('landingBuilder.rounded')}
      </label>
    </div>
  );
}

export function LandingBlockVideoLayout({ block, patch, t }: LandingBlockFieldProps) {
  if (block.type !== 'video') return null;
  return (
    <div className="space-y-1.5">
      <Input
        placeholder={t('landingBuilder.videoPlaceholder')}
        value={block.url}
        onChange={(e) => patch({ url: e.target.value })}
      />
      <p className="text-xs text-muted-foreground">{t('landingBuilder.videoHint')}</p>
    </div>
  );
}

export function LandingBlockButtonLayout({ block, patch, t }: LandingBlockFieldProps) {
  if (block.type !== 'button') return null;
  return (
    <div className="space-y-3">
      <Input
        placeholder={t('landingBuilder.buttonLabelPlaceholder')}
        value={block.label}
        onChange={(e) => patch({ label: e.target.value })}
      />
      <Input
        placeholder={t('landingBuilder.urlPlaceholder')}
        value={block.url}
        onChange={(e) => patch({ url: e.target.value })}
      />
      <div className="space-y-1.5">
        <Label className="text-xs">{t('landingBuilder.style')}</Label>
        <Select
          value={block.variant ?? 'solid'}
          onValueChange={(v) => patch({ variant: v as 'solid' | 'outline' })}
        >
          <SelectTrigger className="h-9">
            <SelectValue>
              {(block.variant ?? 'solid') === 'outline'
                ? t('landingBuilder.styleOutline')
                : t('landingBuilder.styleSolid')}
            </SelectValue>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="solid">{t('landingBuilder.styleSolid')}</SelectItem>
            <SelectItem value="outline">{t('landingBuilder.styleOutline')}</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
