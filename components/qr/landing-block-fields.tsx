'use client';

import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select';
import { Plus, Trash2 } from 'lucide-react';
import type { LandingBlock, HubLink, SocialPlatform } from '@/lib/landing-page';
import { MAX_LINKS_PER_BLOCK } from '@/lib/landing-blocks';
import { LANDING_SOCIAL_PLATFORMS } from '@/lib/landing-block-factory';

type T = (key: string) => string;

function AlignField({
  value,
  onChange,
  t,
}: {
  value: string | undefined;
  onChange: (v: 'left' | 'center' | 'right') => void;
  t: T;
}) {
  return (
    <div className="space-y-1.5">
      <Label className="text-xs">{t('landingBuilder.align')}</Label>
      <Select value={value ?? 'center'} onValueChange={(v) => onChange(v as 'left' | 'center' | 'right')}>
        <SelectTrigger className="h-9">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="left">{t('landingBuilder.alignLeft')}</SelectItem>
          <SelectItem value="center">{t('landingBuilder.alignCenter')}</SelectItem>
          <SelectItem value="right">{t('landingBuilder.alignRight')}</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}

export function LandingBlockFields({
  block,
  patch,
  t,
}: {
  block: LandingBlock;
  patch: (p: Partial<LandingBlock>) => void;
  t: T;
}) {
  switch (block.type) {
    case 'heading':
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
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">{t('landingBuilder.levelLarge')}</SelectItem>
                  <SelectItem value="2">{t('landingBuilder.levelMedium')}</SelectItem>
                  <SelectItem value="3">{t('landingBuilder.levelSmall')}</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <AlignField value={block.align} onChange={(v) => patch({ align: v })} t={t} />
          </div>
        </div>
      );
    case 'text':
      return (
        <div className="space-y-3">
          <Textarea
            placeholder={t('landingBuilder.textPlaceholder')}
            value={block.text}
            rows={3}
            onChange={(e) => patch({ text: e.target.value })}
          />
          <AlignField value={block.align} onChange={(v) => patch({ align: v })} t={t} />
        </div>
      );
    case 'image':
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
    case 'button':
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
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="solid">{t('landingBuilder.styleSolid')}</SelectItem>
                <SelectItem value="outline">{t('landingBuilder.styleOutline')}</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      );
    case 'hubLinks': {
      const links = block.links ?? [];
      const setLink = (i: number, p: Partial<HubLink>) =>
        patch({ links: links.map((l, idx) => (idx === i ? { ...l, ...p } : l)) });
      return (
        <div className="space-y-2">
          {links.map((link, i) => (
            <div key={i} className="flex gap-2">
              <Input
                className="flex-1"
                placeholder={t('landingBuilder.linkLabel')}
                value={link.label}
                onChange={(e) => setLink(i, { label: e.target.value })}
              />
              <Input
                className="flex-1"
                placeholder={t('landingBuilder.urlPlaceholder')}
                value={link.url}
                onChange={(e) => setLink(i, { url: e.target.value })}
              />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="shrink-0"
                onClick={() => patch({ links: links.filter((_, idx) => idx !== i) })}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          ))}
          {links.length < MAX_LINKS_PER_BLOCK && (
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="gap-1.5"
              onClick={() => patch({ links: [...links, { label: '', url: '' }] })}
            >
              <Plus className="h-3.5 w-3.5" />
              {t('landingBuilder.addLink')}
            </Button>
          )}
        </div>
      );
    }
    case 'social': {
      const links = block.links ?? [];
      const setLink = (i: number, p: Partial<{ platform: SocialPlatform; url: string }>) =>
        patch({ links: links.map((l, idx) => (idx === i ? { ...l, ...p } : l)) });
      return (
        <div className="space-y-2">
          {links.map((link, i) => (
            <div key={i} className="flex gap-2">
              <Select
                value={link.platform}
                onValueChange={(v) => setLink(i, { platform: v as SocialPlatform })}
              >
                <SelectTrigger className="h-9 w-36 shrink-0">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {LANDING_SOCIAL_PLATFORMS.map((p) => (
                    <SelectItem key={p} value={p}>
                      {t(`landingBuilder.social.${p}`)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Input
                className="flex-1"
                placeholder={t('landingBuilder.urlPlaceholder')}
                value={link.url}
                onChange={(e) => setLink(i, { url: e.target.value })}
              />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="shrink-0"
                onClick={() => patch({ links: links.filter((_, idx) => idx !== i) })}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          ))}
          {links.length < MAX_LINKS_PER_BLOCK && (
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="gap-1.5"
              onClick={() => patch({ links: [...links, { platform: 'instagram', url: '' }] })}
            >
              <Plus className="h-3.5 w-3.5" />
              {t('landingBuilder.addLink')}
            </Button>
          )}
        </div>
      );
    }
    case 'video':
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
    case 'leadForm': {
      const cfg = block.config;
      const setCfg = (p: Partial<typeof cfg>) => patch({ config: { ...cfg, ...p } });
      const rows: [keyof typeof cfg, string][] = [
        ['collectName', 'landingEditor.fieldName'],
        ['collectEmail', 'landingEditor.fieldEmail'],
        ['collectPhone', 'landingEditor.fieldPhone'],
        ['collectMessage', 'landingEditor.fieldMessage'],
      ];
      return (
        <div className="space-y-3">
          <Input
            placeholder={t('landingBuilder.submitLabelPlaceholder')}
            value={block.submitLabel ?? ''}
            onChange={(e) => patch({ submitLabel: e.target.value })}
          />
          <div className="grid grid-cols-2 gap-2">
            {rows.map(([key, labelKey]) => (
              <label key={String(key)} className="flex items-center gap-2 text-sm">
                <Switch
                  checked={Boolean(cfg[key])}
                  onCheckedChange={(v) => setCfg({ [key]: v } as Partial<typeof cfg>)}
                />
                {t(labelKey)}
              </label>
            ))}
            <label className="col-span-2 flex items-center gap-2 text-sm">
              <Switch
                checked={Boolean(cfg.requiredEmail)}
                onCheckedChange={(v) => setCfg({ requiredEmail: v })}
              />
              {t('landingEditor.requireEmail')}
            </label>
          </div>
        </div>
      );
    }
    case 'spacer':
      return (
        <div className="space-y-1.5">
          <Label className="text-xs">{t('landingBuilder.spacerSize')}</Label>
          <Select value={block.size ?? 'md'} onValueChange={(v) => patch({ size: v as 'sm' | 'md' | 'lg' })}>
            <SelectTrigger className="h-9">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="sm">{t('landingBuilder.spacerSmall')}</SelectItem>
              <SelectItem value="md">{t('landingBuilder.spacerMedium')}</SelectItem>
              <SelectItem value="lg">{t('landingBuilder.spacerLarge')}</SelectItem>
            </SelectContent>
          </Select>
        </div>
      );
    case 'divider':
      return <p className="text-xs text-muted-foreground">{t('landingBuilder.dividerHint')}</p>;
  }
}
