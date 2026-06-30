'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Nfc, Copy, ExternalLink } from 'lucide-react';
import { toast } from 'sonner';
import { useLanguage } from '@/components/i18n/language-provider';

export function NfcExportPanel({
  enabled,
  onEnabledChange,
  scanUrl,
  shortCode,
}: {
  enabled: boolean;
  onEnabledChange: (v: boolean) => void;
  scanUrl: string;
  shortCode: string;
}) {
  const { t } = useLanguage();
  const nfcUrl = `${scanUrl}${scanUrl.includes('?') ? '&' : '?'}src=nfc`;

  const copy = (text: string, labelKey: 'nfcUrl' | 'qrUrl') => {
    navigator.clipboard?.writeText(text);
    toast.success(t('settings.nfc.copied', { label: t(`settings.nfc.${labelKey}`) }));
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="font-display flex items-center gap-2">
            <Nfc className="h-5 w-5 text-primary" /> {t('settings.nfc.title')}
          </CardTitle>
          <Switch checked={enabled} onCheckedChange={onEnabledChange} />
        </div>
        <p className="text-sm text-muted-foreground">{t('settings.nfc.desc')}</p>
      </CardHeader>
      {enabled && (
        <CardContent className="space-y-4">
          <div className="rounded-lg bg-muted/50 p-3 font-mono text-xs break-all">{nfcUrl}</div>
          <div className="flex flex-wrap gap-2">
            <Button type="button" variant="outline" size="sm" className="gap-1" onClick={() => copy(nfcUrl, 'nfcUrl')}>
              <Copy className="h-4 w-4" /> {t('settings.nfc.copyNfc')}
            </Button>
            <Button type="button" variant="outline" size="sm" className="gap-1" onClick={() => copy(scanUrl, 'qrUrl')}>
              <Copy className="h-4 w-4" /> {t('settings.nfc.copyQr')}
            </Button>
          </div>
          <div className="text-xs text-muted-foreground space-y-1">
            <p className="font-medium text-foreground">{t('settings.nfc.howToTitle')}</p>
            <p>{t('settings.nfc.step1')}</p>
            <p>{t('settings.nfc.step2')}</p>
            <p>{t('settings.nfc.step3')}</p>
            <p className="flex items-center gap-1 pt-1">
              <ExternalLink className="h-3 w-3" /> {t('settings.nfc.shortCode')} <code>{shortCode}</code>
            </p>
          </div>
        </CardContent>
      )}
    </Card>
  );
}
