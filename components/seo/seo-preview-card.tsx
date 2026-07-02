'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { SITE_NAME } from '@/lib/seo';
import { useLanguage } from '@/components/i18n/language-provider';

function truncate(text: string, max: number): string {
  if (text.length <= max) return text;
  return `${text.slice(0, max - 1).trim()}…`;
}

function charHint(len: number, ideal: number, warn: number, label: string): string {
  if (len > warn) return `${label}: ${len}/${ideal} — too long`;
  if (len > ideal) return `${label}: ${len}/${ideal}`;
  return `${label}: ${len}/${ideal}`;
}

export function SeoPreviewCard({
  title,
  description,
  url,
  image = '/opengraph-image',
}: {
  title: string;
  description: string;
  url: string;
  image?: string;
}) {
  const { t } = useLanguage();
  const displayTitle = title.trim() || SITE_NAME;
  const displayDesc = description.trim() || t('seoPreview.defaultDescription');
  const displayUrl = url.startsWith('http') ? url : `qrbanner.com${url.startsWith('/') ? url : `/${url}`}`;
  const serpTitle = truncate(`${displayTitle} | ${SITE_NAME}`, 60);
  const serpDesc = truncate(displayDesc, 160);

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap gap-3 text-xs text-muted-foreground">
        <span>{charHint(displayTitle.length, 55, 65, t('seoPreview.titleChars'))}</span>
        <span>{charHint(displayDesc.length, 150, 170, t('seoPreview.descChars'))}</span>
      </div>

      <div className="grid gap-3 lg:grid-cols-2">
        <Card className="border-border/60">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">{t('seoPreview.googleTitle')}</CardTitle>
            <CardDescription className="text-xs">{t('seoPreview.googleDesc')}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-1 rounded-lg bg-white p-4 text-[#202124] dark:bg-muted/30 dark:text-foreground">
            <p className="text-xs text-[#4d5156] dark:text-muted-foreground truncate">{displayUrl}</p>
            <p className="text-lg text-[#1a0dab] dark:text-primary leading-snug">{serpTitle}</p>
            <p className="text-sm text-[#4d5156] dark:text-muted-foreground leading-relaxed">{serpDesc}</p>
          </CardContent>
        </Card>

        <Card className="border-border/60">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">{t('seoPreview.socialTitle')}</CardTitle>
            <CardDescription className="text-xs">{t('seoPreview.socialDesc')}</CardDescription>
          </CardHeader>
          <CardContent className="overflow-hidden rounded-lg border border-border/60 bg-muted/20">
            <div
              className="aspect-[1.91/1] bg-muted bg-cover bg-center"
              style={{ backgroundImage: `url(${image})` }}
            />
            <div className="space-y-0.5 border-t border-border/60 bg-card p-3">
              <p className="text-[10px] uppercase tracking-wide text-muted-foreground truncate">
                {displayUrl.replace(/^https?:\/\//, '')}
              </p>
              <p className="text-sm font-semibold line-clamp-2">{truncate(displayTitle, 70)}</p>
              <p className="text-xs text-muted-foreground line-clamp-2">{truncate(displayDesc, 120)}</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
