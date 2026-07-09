'use client';

import dynamic from 'next/dynamic';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { useLanguage } from '@/components/i18n/language-provider';
import { resolveCategoryDisplayName } from '@/lib/i18n/resolve-qr-category-copy';
import { QRPreviewSkeleton } from '@/components/qr/qr-preview-skeleton';
import type { QrCreateFormState } from '@/hooks/use-qr-create-form';

const QRPreview = dynamic(
  () => import('./qr-preview').then((m) => ({ default: m.QRPreview })),
  { loading: () => <QRPreviewSkeleton /> },
);

type QrCreateStepReviewProps = {
  form: QrCreateFormState;
};

export function QrCreateStepReview({ form }: QrCreateStepReviewProps) {
  const { t } = useLanguage();
  const {
    name,
    category,
    style,
    logoFile,
    qrData,
    logoPreview,
    activeTemplate,
    landingPage,
    publishAsActive,
    setPublishAsActive,
  } = form;

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <Card className="order-2 lg:order-1">
        <CardHeader>
          <CardTitle className="font-display">{t('create.summary')}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">{t('create.reviewName')}</span>
            <span className="font-medium">{name}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">{t('create.reviewCategory')}</span>
            <Badge variant="outline">{resolveCategoryDisplayName(t, category)}</Badge>
          </div>
          {style.frameStyle !== 'none' && style.frameText?.trim() && (
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">{t('create.reviewFrameLabel')}</span>
              <span className="text-sm font-medium">{style.frameText}</span>
            </div>
          )}
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">{t('create.reviewLogo')}</span>
            <span className="text-sm">{logoFile ? logoFile.name : t('create.none')}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">{t('create.reviewForeground')}</span>
            <div className="flex items-center gap-2">
              <div className="h-4 w-4 rounded border" style={{ backgroundColor: style?.fgColor ?? '#000' }} />
              <span className="font-mono text-xs">{style?.fgColor ?? '#000'}</span>
            </div>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">{t('create.reviewBackground')}</span>
            <div className="flex items-center gap-2">
              <div className="h-4 w-4 rounded border" style={{ backgroundColor: style?.bgColor ?? '#FFF' }} />
              <span className="font-mono text-xs">{style?.bgColor ?? '#FFF'}</span>
            </div>
          </div>

          <div className="rounded-lg border border-border/60 bg-muted/20 p-3 space-y-2">
            <div className="flex items-center justify-between gap-3">
              <div>
                <Label htmlFor="publish-active">{t('create.publishActive')}</Label>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {publishAsActive ? t('create.publishActiveHint') : t('create.publishDraftHint')}
                </p>
              </div>
              <Switch
                id="publish-active"
                checked={publishAsActive}
                onCheckedChange={setPublishAsActive}
              />
            </div>
          </div>
        </CardContent>
      </Card>
      <div className="order-1 h-fit lg:order-2 lg:sticky lg:top-24">
        <QRPreview
          category={category}
          qrData={qrData}
          style={style}
          logoPreview={logoPreview}
          showExtras
          printLayout={activeTemplate?.printLayout}
          industryTemplateId={activeTemplate?.id}
          accentColor={landingPage.accentColor}
        />
      </div>
    </div>
  );
}
