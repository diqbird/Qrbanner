'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useLanguage } from '@/components/i18n/language-provider';
import { buildLandingFromTemplate } from '@/lib/industry-templates';
import { CategoryFields } from '@/components/qr/category-fields';
import { IndustryTemplateGuide } from '@/components/qr/industry-template-guide';
import { TemplateSectionFields } from '@/components/qr/template-section-fields';
import { LinkHubEditor, firstHubUrl } from '@/components/qr/link-hub-editor';
import type { QrCreateFormState } from '@/hooks/use-qr-create-form';

export function QrCreateStepFormCard({ form }: { form: QrCreateFormState }) {
  const { t } = useLanguage();
  const {
    category,
    name,
    setName,
    qrData,
    setQrData,
    activeTemplate,
    templateGuideDismissed,
    setTemplateGuideDismissed,
    landingPage,
    setLandingPage,
  } = form;

  const syncLandingFromTemplate = (next: Record<string, string>) => {
    setQrData(next);
    if (activeTemplate?.landingPage?.enabled) {
      const built = buildLandingFromTemplate(activeTemplate, next);
      setLandingPage((prev) => ({
        ...prev,
        title: built.title ?? prev.title,
        subtitle: built.subtitle ?? prev.subtitle,
      }));
    }
  };

  return (
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
                onChange={syncLandingFromTemplate}
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
            onChange={syncLandingFromTemplate}
          />
        ) : (
          <CategoryFields category={category} data={qrData} onChange={setQrData} />
        )}
      </CardContent>
    </Card>
  );
}
