'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Trash2 } from 'lucide-react';
import { StyleTemplatePreview } from '@/components/qr/style-template-preview';
import { formatLocaleDate } from '@/lib/i18n/format-locale';
import { useLanguage } from '@/components/i18n/language-provider';
import type { BrandKitTemplate } from '@/lib/brand-kit-types';
import type { BrandKitTemplatesState } from '@/hooks/use-brand-kit-templates';

type BrandKitTemplateCardProps = {
  template: BrandKitTemplate;
  brandKit: BrandKitTemplatesState;
};

export function BrandKitTemplateCard({ template, brandKit }: BrandKitTemplateCardProps) {
  const { t, locale } = useLanguage();
  const { deleteTemplate } = brandKit;

  return (
    <div className="flex flex-col gap-3 rounded-xl border border-border/50 bg-card p-4 shadow-sm">
      <div className="flex items-start gap-3">
        <StyleTemplatePreview style={template.style} logoPath={template.logoPath} size={88} />
        <div className="min-w-0 flex-1">
          <p className="truncate font-medium">{template.name}</p>
          <p className="mt-0.5 text-xs text-muted-foreground">
            {t('settings.brandKit.updated')}{' '}
            {formatLocaleDate(template.updatedAt, locale, {
              month: 'short',
              day: 'numeric',
              year: 'numeric',
            })}
          </p>
        </div>
      </div>
      <div className="flex flex-wrap gap-2">
        <Link href={`/qr/create?styleTemplate=${encodeURIComponent(template.id)}`} className="flex-1">
          <Button type="button" variant="default" size="sm" className="w-full">
            {t('settings.brandKit.useInNewQr')}
          </Button>
        </Link>
        <Button
          type="button"
          variant="outline"
          size="icon-sm"
          onClick={() => deleteTemplate(template.id)}
          aria-label={t('settings.templates.confirmDelete')}
        >
          <Trash2 className="h-4 w-4 text-muted-foreground" />
        </Button>
      </div>
    </div>
  );
}
