'use client';

import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select';
import { Plus, Trash2 } from 'lucide-react';
import type { SocialPlatform } from '@/lib/landing-page';
import { MAX_LINKS_PER_BLOCK } from '@/lib/landing-blocks';
import { LANDING_SOCIAL_PLATFORMS } from '@/lib/landing-block-factory';
import type { LandingBlockFieldProps } from './landing-block-field-types';

export function LandingBlockSocialLayout({ block, patch, t }: LandingBlockFieldProps) {
  if (block.type !== 'social') return null;
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
              <SelectValue>{t(`landingBuilder.social.${link.platform}`)}</SelectValue>
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
            aria-label={t('common.removeAria')}
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
