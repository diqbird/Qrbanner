'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Save, BarChart3 } from 'lucide-react';
import { useLanguage } from '@/components/i18n/language-provider';
import { resolveCategoryDisplayName } from '@/lib/i18n/resolve-qr-category-copy';

type QrEditHeaderProps = {
  qrId: string;
  category: string;
  isActive: boolean;
  saving: boolean;
  onSave: () => void;
};

export function QrEditHeader({ qrId, category, isActive, saving, onSave }: QrEditHeaderProps) {
  const { t } = useLanguage();

  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-3">
        <Link href="/dashboard">
          <Button variant="ghost" size="icon-sm">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div>
          <h1 className="font-display text-2xl font-bold tracking-tight">{t('editQr.title')}</h1>
          <div className="mt-1 flex items-center gap-2">
            <Badge variant="outline" className="text-xs">
              {resolveCategoryDisplayName(t, category)}
            </Badge>
            <Badge variant={isActive ? 'default' : 'secondary'}>
              {isActive ? t('editQr.active') : t('editQr.inactive')}
            </Badge>
          </div>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <Link href={`/qr/${qrId}/analytics`}>
          <Button variant="outline" size="sm" className="gap-2">
            <BarChart3 className="h-4 w-4" /> {t('editQr.analytics')}
          </Button>
        </Link>
        <Button onClick={onSave} loading={saving} size="sm" className="gap-2">
          <Save className="h-4 w-4" /> {t('common.save')}
        </Button>
      </div>
    </div>
  );
}
