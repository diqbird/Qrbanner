'use client';

import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Plus, Trash2 } from 'lucide-react';
import type { HubLink } from '@/lib/landing-page';
import { MAX_LINKS_PER_BLOCK } from '@/lib/landing-blocks';
import { useLanguage } from '@/components/i18n/language-provider';
import { formatLocaleNumber } from '@/lib/i18n/format-locale';
import type { LandingBlockFieldProps } from './landing-block-field-types';

export function LandingBlockHubLinksLayout({ block, patch }: LandingBlockFieldProps) {
  const { t, locale } = useLanguage();
  if (block.type !== 'hubLinks') return null;
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
            aria-label={t('common.removeAria')}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      ))}
      <p className="text-xs text-muted-foreground">
        {t('landingBuilder.linkQuota', {
          count: formatLocaleNumber(links.length, locale),
          max: formatLocaleNumber(MAX_LINKS_PER_BLOCK, locale),
        })}
      </p>
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
