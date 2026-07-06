'use client';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Plus, Link2 } from 'lucide-react';
import type { HubLink, LandingPageData } from '@/lib/landing-page';
import { DEFAULT_HUB_LINKS } from '@/lib/link-hub-utils';
import { useLanguage } from '@/components/i18n/language-provider';
import { LinkHubLinkRow } from './link-hub-link-row';

export { hubLinksValid, firstHubUrl } from '@/lib/link-hub-utils';

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
  const links = landing.hubLinks?.length ? landing.hubLinks : DEFAULT_HUB_LINKS;

  const setLinks = (hubLinks: HubLink[]) => onChange({ ...landing, hubLinks, hubMode: true });

  const updateLink = (index: number, patch: Partial<HubLink>) => {
    const next = links.map((l, i) => (i === index ? { ...l, ...patch } : l));
    setLinks(next);
  };

  const addLink = () => setLinks([...links, { label: t('linkHub.newLink'), url: '' }]);

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
            placeholder={qrName || t('linkHub.placeholderMyLinks')}
          />
        </div>
        <div className="space-y-2">
          <Label>{t('linkHub.pageSubtitle')}</Label>
          <Textarea
            rows={2}
            value={landing.subtitle}
            onChange={(e) => onChange({ ...landing, subtitle: e.target.value })}
            placeholder={t('linkHub.placeholderTapBelow')}
          />
        </div>

        <div className="space-y-3">
          {links.map((link, index) => (
            <LinkHubLinkRow
              key={index}
              link={link}
              index={index}
              canRemove={links.length > 1}
              onUpdate={updateLink}
              onRemove={removeLink}
            />
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
