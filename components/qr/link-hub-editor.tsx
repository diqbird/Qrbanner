'use client';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Plus, Trash2, Link2 } from 'lucide-react';
import type { HubLink, LandingPageData } from '@/lib/landing-page';
import { useLanguage } from '@/components/i18n/language-provider';

const DEFAULT_LINKS: HubLink[] = [
  { label: 'Website', url: '' },
  { label: 'Instagram', url: '' },
];

export function LinkHubEditor({
  landing,
  onChange,
  qrName,
}: {
  landing: LandingPageData;
  onChange: (data: LandingPageData) => void;
  qrName?: string;
}) {
  const { t } = useLanguage();
  const links = landing.hubLinks?.length ? landing.hubLinks : DEFAULT_LINKS;

  const setLinks = (hubLinks: HubLink[]) => onChange({ ...landing, hubLinks, hubMode: true });

  const updateLink = (index: number, patch: Partial<HubLink>) => {
    const next = links.map((l, i) => (i === index ? { ...l, ...patch } : l));
    setLinks(next);
  };

  const addLink = () => setLinks([...links, { label: 'New link', url: '' }]);

  const removeLink = (index: number) => {
    if (links.length <= 1) return;
    setLinks(links.filter((_, i) => i !== index));
  };

  return (
    <Card className="border-primary/20 bg-primary/5">
      <CardHeader>
        <CardTitle className="font-display flex items-center gap-2">
          <Link2 className="h-5 w-5 text-primary" />
          {t('linkHub.title')}
        </CardTitle>
        <CardDescription>{t('linkHub.subtitle')}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label>{t('linkHub.pageTitle')}</Label>
          <Input
            value={landing.title}
            onChange={(e) => onChange({ ...landing, title: e.target.value })}
            placeholder={qrName || 'My links'}
          />
        </div>
        <div className="space-y-2">
          <Label>{t('linkHub.pageSubtitle')}</Label>
          <Textarea
            rows={2}
            value={landing.subtitle}
            onChange={(e) => onChange({ ...landing, subtitle: e.target.value })}
            placeholder="Tap a link below"
          />
        </div>

        <div className="space-y-3">
          {links.map((link, index) => (
            <div key={index} className="flex flex-col gap-2 rounded-lg border border-border/60 bg-background p-3 sm:flex-row sm:items-end">
              <div className="flex-1 space-y-2">
                <Label className="text-xs">{t('linkHub.linkLabel')}</Label>
                <Input
                  value={link.label}
                  onChange={(e) => updateLink(index, { label: e.target.value })}
                  placeholder="Instagram"
                />
              </div>
              <div className="flex-[2] space-y-2">
                <Label className="text-xs">{t('linkHub.linkUrl')}</Label>
                <Input
                  type="url"
                  value={link.url}
                  onChange={(e) => updateLink(index, { url: e.target.value })}
                  placeholder="https://"
                />
              </div>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="shrink-0 text-muted-foreground hover:text-destructive"
                onClick={() => removeLink(index)}
                disabled={links.length <= 1}
                aria-label="Remove link"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>

        <Button type="button" variant="outline" size="sm" className="gap-2" onClick={addLink}>
          <Plus className="h-4 w-4" />
          {t('linkHub.addLink')}
        </Button>
      </CardContent>
    </Card>
  );
}

export function hubLinksValid(links?: HubLink[]): boolean {
  return Boolean(
    links?.some((l) => {
      const label = l.label?.trim();
      const url = l.url?.trim();
      if (!label || !url) return false;
      const normalized = /^https?:\/\//i.test(url) ? url : `https://${url}`;
      try {
        const u = new URL(normalized);
        return u.hostname.includes('.');
      } catch {
        return false;
      }
    })
  );
}

export function firstHubUrl(links?: HubLink[]): string {
  const hit = links?.find((l) => l.url.trim());
  const raw = hit?.url.trim() ?? '';
  if (!raw) return '';
  return /^https?:\/\//i.test(raw) ? raw : `https://${raw}`;
}
