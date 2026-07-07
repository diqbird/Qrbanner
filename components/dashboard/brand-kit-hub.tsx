'use client';

import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Bookmark, Loader2, Plus } from 'lucide-react';
import { useLanguage } from '@/components/i18n/language-provider';
import { formatLocaleNumber } from '@/lib/i18n/format-locale';
import { useBrandKitTemplates } from '@/hooks/use-brand-kit-templates';
import { BrandKitTemplateCard } from './brand-kit-template-card';

export function BrandKitHub() {
  const { locale } = useLanguage();
  const brandKit = useBrandKitTemplates();
  const { t, templates, limit, loading } = brandKit;

  if (loading) {
    return (
      <Card>
        <CardContent className="flex justify-center py-10">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <CardTitle className="font-display flex items-center gap-2">
              <Bookmark className="h-5 w-5 text-primary" />
              {t('settings.brandKit.title')}
            </CardTitle>
            <CardDescription className="mt-1">{t('settings.brandKit.description')}</CardDescription>
          </div>
          <Badge variant="secondary" className="shrink-0">
            {formatLocaleNumber(templates.length, locale)} / {formatLocaleNumber(limit, locale)}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {templates.length === 0 ? (
          <div className="rounded-lg border border-dashed border-border/60 bg-muted/20 px-6 py-10 text-center">
            <p className="text-sm text-muted-foreground">{t('settings.brandKit.empty')}</p>
            <Link href="/qr/create" className="mt-4 inline-block">
              <Button type="button" className="gap-2">
                <Plus className="h-4 w-4" />
                {t('settings.brandKit.createFirst')}
              </Button>
            </Link>
          </div>
        ) : (
          <>
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {templates.map((tpl) => (
                <BrandKitTemplateCard key={tpl.id} template={tpl} brandKit={brandKit} />
              ))}
            </div>
            <p className="text-xs text-muted-foreground">{t('settings.brandKit.manageInEditor')}</p>
            <Link href="/qr/create">
              <Button type="button" variant="outline" size="sm" className="gap-2">
                <Plus className="h-4 w-4" />
                {t('settings.brandKit.createFirst')}
              </Button>
            </Link>
          </>
        )}
      </CardContent>
    </Card>
  );
}
