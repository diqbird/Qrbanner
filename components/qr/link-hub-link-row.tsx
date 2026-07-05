'use client';

import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Trash2 } from 'lucide-react';
import type { HubLink } from '@/lib/landing-page';
import { useLanguage } from '@/components/i18n/language-provider';

type LinkHubLinkRowProps = {
  link: HubLink;
  index: number;
  canRemove: boolean;
  onUpdate: (index: number, patch: Partial<HubLink>) => void;
  onRemove: (index: number) => void;
};

export function LinkHubLinkRow({ link, index, canRemove, onUpdate, onRemove }: LinkHubLinkRowProps) {
  const { t } = useLanguage();

  return (
    <div className="flex flex-col gap-2 rounded-lg border border-border/60 bg-background p-3 sm:flex-row sm:items-end">
      <div className="flex-1 space-y-2">
        <Label className="text-xs">{t('linkHub.linkLabel')}</Label>
        <Input
          value={link.label}
          onChange={(e) => onUpdate(index, { label: e.target.value })}
          placeholder="Instagram"
        />
      </div>
      <div className="flex-[2] space-y-2">
        <Label className="text-xs">{t('linkHub.linkUrl')}</Label>
        <Input
          type="url"
          value={link.url}
          onChange={(e) => onUpdate(index, { url: e.target.value })}
          placeholder="https://"
        />
      </div>
      <Button
        type="button"
        variant="ghost"
        size="icon"
        className="shrink-0 text-muted-foreground hover:text-destructive"
        onClick={() => onRemove(index)}
        disabled={!canRemove}
        aria-label="Remove link"
      >
        <Trash2 className="h-4 w-4" />
      </Button>
    </div>
  );
}
