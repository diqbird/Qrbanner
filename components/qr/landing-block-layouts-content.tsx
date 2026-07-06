'use client';

import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select';
import { LandingBlockAlignField } from './landing-block-field-primitives';
import type { LandingBlockFieldProps } from './landing-block-field-types';

export function LandingBlockHeadingLayout({ block, patch, t }: LandingBlockFieldProps) {
  if (block.type !== 'heading') return null;
  return (
    <div className="space-y-3">
      <Input
        placeholder={t('landingBuilder.headingPlaceholder')}
        value={block.text}
        onChange={(e) => patch({ text: e.target.value })}
      />
      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1.5">
          <Label className="text-xs">{t('landingBuilder.level')}</Label>
          <Select
            value={String(block.level ?? 1)}
            onValueChange={(v) => patch({ level: Number(v) as 1 | 2 | 3 })}
          >
            <SelectTrigger className="h-9">
              <SelectValue>
                {block.level === 3
                  ? t('landingBuilder.levelSmall')
                  : block.level === 2
                    ? t('landingBuilder.levelMedium')
                    : t('landingBuilder.levelLarge')}
              </SelectValue>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1">{t('landingBuilder.levelLarge')}</SelectItem>
              <SelectItem value="2">{t('landingBuilder.levelMedium')}</SelectItem>
              <SelectItem value="3">{t('landingBuilder.levelSmall')}</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <LandingBlockAlignField value={block.align} onChange={(v) => patch({ align: v })} t={t} />
      </div>
    </div>
  );
}

export function LandingBlockTextLayout({ block, patch, t }: LandingBlockFieldProps) {
  if (block.type !== 'text') return null;
  return (
    <div className="space-y-3">
      <Textarea
        placeholder={t('landingBuilder.textPlaceholder')}
        value={block.text}
        rows={3}
        onChange={(e) => patch({ text: e.target.value })}
      />
      <LandingBlockAlignField value={block.align} onChange={(v) => patch({ align: v })} t={t} />
    </div>
  );
}

export function LandingBlockSpacerLayout({ block, patch, t }: LandingBlockFieldProps) {
  if (block.type !== 'spacer') return null;
  return (
    <div className="space-y-1.5">
      <Label className="text-xs">{t('landingBuilder.spacerSize')}</Label>
      <Select value={block.size ?? 'md'} onValueChange={(v) => patch({ size: v as 'sm' | 'md' | 'lg' })}>
        <SelectTrigger className="h-9">
          <SelectValue>
            {(block.size ?? 'md') === 'lg'
              ? t('landingBuilder.spacerLarge')
              : (block.size ?? 'md') === 'sm'
                ? t('landingBuilder.spacerSmall')
                : t('landingBuilder.spacerMedium')}
          </SelectValue>
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="sm">{t('landingBuilder.spacerSmall')}</SelectItem>
          <SelectItem value="md">{t('landingBuilder.spacerMedium')}</SelectItem>
          <SelectItem value="lg">{t('landingBuilder.spacerLarge')}</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}

export function LandingBlockDividerLayout({ t }: LandingBlockFieldProps) {
  return <p className="text-xs text-muted-foreground">{t('landingBuilder.dividerHint')}</p>;
}
