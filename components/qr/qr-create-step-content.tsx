'use client';

import dynamic from 'next/dynamic';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useLanguage } from '@/components/i18n/language-provider';
import { buildLandingFromTemplate } from '@/lib/industry-templates';
import { CategoryFields } from '@/components/qr/category-fields';
import { IndustryTemplateGuide } from '@/components/qr/industry-template-guide';
import { TemplateSectionFields } from '@/components/qr/template-section-fields';
import { LinkHubEditor, firstHubUrl } from '@/components/qr/link-hub-editor';
import { QRPreviewSkeleton } from '@/components/qr/qr-preview-skeleton';
import type { QrCreateFormState } from '@/hooks/use-qr-create-form';

const QRPreview = dynamic(
  () => import('./qr-preview').then((m) => ({ default: m.QRPreview })),
  { loading: () => <QRPreviewSkeleton /> },
);

type QrCreateStepContentProps = {
  form: QrCreateFormState;
};

export function QrCreateStepContent({ form }: QrCreateStepContentProps) {
  const { t } = useLanguage();
  const {
    category,
    name,
    setName,
    qrData,
    setQrData,
    style,
    logoPreview,
    activeTemplate,
    templateGuideDismissed,
    setTemplateGuideDismissed,
    landingPage,
    setLandingPage,
  } = form;

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <Card className="order-2 lg:order-1">
        <CardHeader>
          <CardTitle className="font-display">{t('create.yourContent')}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {activeTemplate && !templateGuideDismissed && (
            <IndustryTemplateGuide
              template={activeTemplate}
              onDismiss={() => setTemplateGuideDismissed(true)}
            />
          )}
          <div className="space-y-2">
            <Label>{t('create.qrNameLabel')}</Label>
            <Input
              placeholder={t('create.qrNamePlaceholder')}
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          {category === 'link_hub' ? (
            <div className="space-y-4">
              {activeTemplate ? (
                <TemplateSectionFields
                  template={activeTemplate}
                  data={qrData}
                  onChange={(next) => {
                    setQrData(next);
                    if (activeTemplate.landingPage?.enabled) {
                      const built = buildLandingFromTemplate(activeTemplate, next);
                      setLandingPage((prev) => ({
                        ...prev,
                        title: built.title ?? prev.title,
                        subtitle: built.subtitle ?? prev.subtitle,
                      }));
                    }
                  }}
                />
              ) : null}
              <LinkHubEditor
                landing={landingPage}
                qrName={name}
                onChange={(next) => {
                  setLandingPage(next);
                  const url = firstHubUrl(next.hubLinks);
                  if (url) setQrData((prev) => ({ ...prev, url }));
                }}
              />
            </div>
          ) : activeTemplate ? (
            <TemplateSectionFields
              template={activeTemplate}
              data={qrData}
              onChange={(next) => {
                setQrData(next);
                if (activeTemplate.landingPage?.enabled) {
                  const built = buildLandingFromTemplate(activeTemplate, next);
                  setLandingPage((prev) => ({
                    ...prev,
                    title: built.title ?? prev.title,
                    subtitle: built.subtitle ?? prev.subtitle,
                  }));
                }
              }}
            />
          ) : (
            <CategoryFields category={category} data={qrData} onChange={setQrData} />
          )}
        </CardContent>
      </Card>
      <div className="order-1 h-fit lg:order-2 lg:sticky lg:top-24">
        <QRPreview
          category={category}
          qrData={qrData}
          style={style}
          logoPreview={logoPreview}
          printLayout={activeTemplate?.printLayout}
          industryTemplateId={activeTemplate?.id}
          accentColor={landingPage.accentColor}
        />
      </div>
    </div>
  );
}
