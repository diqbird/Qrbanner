'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useLanguage } from '@/components/i18n/language-provider';
import { CategoryFields } from '@/components/qr/category-fields';
import { LinkHubEditor, firstHubUrl } from '@/components/qr/link-hub-editor';
import type { QrEditFormColumnProps } from '@/lib/qr-edit-form-column-types';

export function QrEditContentCard({ form }: QrEditFormColumnProps) {
  const { t } = useLanguage();
  const { qr, name, qrData, setQrData, landingPage, setLandingPage } = form;

  if (!qr) return null;

  const category = qr.category ?? 'url';

  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-display text-base">{t('editQr.qrContent')}</CardTitle>
      </CardHeader>
      <CardContent>
        {category === 'link_hub' ? (
          <LinkHubEditor
            landing={landingPage}
            qrName={name}
            onChange={(next) => {
              setLandingPage(next);
              const url = firstHubUrl(next.hubLinks);
              if (url) setQrData({ url });
            }}
          />
        ) : (
          <CategoryFields category={category} data={qrData} onChange={setQrData} />
        )}
      </CardContent>
    </Card>
  );
}
