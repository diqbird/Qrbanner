'use client';

import { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Bookmark, Loader2, Plus, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { useLanguage } from '@/components/i18n/language-provider';
import { StyleTemplatePreview } from '@/components/qr/style-template-preview';
import type { QRStyleConfig } from '@/lib/qr-style';

interface TemplateRow {
  id: string;
  name: string;
  style: QRStyleConfig;
  logoPath: string | null;
  updatedAt: string;
}

export function BrandKitHub() {
  const { t } = useLanguage();
  const [templates, setTemplates] = useState<TemplateRow[]>([]);
  const [limit, setLimit] = useState(3);
  const [loading, setLoading] = useState(true);

  const fetchTemplates = useCallback(async () => {
    try {
      const res = await fetch('/api/templates');
      if (res.ok) {
        const data = await res.json();
        setTemplates(data.templates ?? []);
        setLimit(data.limit ?? 3);
      }
    } catch {
      /* ignore */
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTemplates();
  }, [fetchTemplates]);

  const deleteTemplate = async (id: string) => {
    if (!confirm(t('settings.templates.confirmDelete'))) return;
    const res = await fetch(`/api/templates/${id}`, { method: 'DELETE' });
    if (res.ok) {
      toast.success(t('settings.templates.deleted'));
      fetchTemplates();
    }
  };

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
            {templates.length} / {limit}
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
                <div
                  key={tpl.id}
                  className="flex flex-col gap-3 rounded-xl border border-border/50 bg-card p-4 shadow-sm"
                >
                  <div className="flex items-start gap-3">
                    <StyleTemplatePreview style={tpl.style} logoPath={tpl.logoPath} size={88} />
                    <div className="min-w-0 flex-1">
                      <p className="truncate font-medium">{tpl.name}</p>
                      <p className="mt-0.5 text-xs text-muted-foreground">
                        {t('settings.brandKit.updated')}{' '}
                        {new Date(tpl.updatedAt).toLocaleDateString(undefined, {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric',
                        })}
                      </p>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <Link href={`/qr/create?styleTemplate=${encodeURIComponent(tpl.id)}`} className="flex-1">
                      <Button type="button" variant="default" size="sm" className="w-full">
                        {t('settings.brandKit.useInNewQr')}
                      </Button>
                    </Link>
                    <Button
                      type="button"
                      variant="outline"
                      size="icon-sm"
                      onClick={() => deleteTemplate(tpl.id)}
                      aria-label={t('settings.templates.confirmDelete')}
                    >
                      <Trash2 className="h-4 w-4 text-muted-foreground" />
                    </Button>
                  </div>
                </div>
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
