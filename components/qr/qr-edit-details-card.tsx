'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Copy, ExternalLink } from 'lucide-react';
import { toast } from 'sonner';
import { useLanguage } from '@/components/i18n/language-provider';
import { buildScanLink } from '@/lib/use-scan-base-url';
import type { QrEditFormColumnProps } from '@/lib/qr-edit-form-column-types';

export function QrEditDetailsCard({ form }: QrEditFormColumnProps) {
  const { t } = useLanguage();
  const { qr, name, setName, isActive, setIsActive, scanBaseUrl } = form;

  if (!qr) return null;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-display text-base">{t('editQr.details')}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label>{t('common.name')}</Label>
          <Input value={name} onChange={(e) => setName(e.target.value)} />
        </div>
        <div className="space-y-2">
          <Label>{t('editQr.shortLink')}</Label>
          <div className="flex items-center gap-2">
            <Input value={`/s/${qr.shortCode}`} disabled className="font-mono text-xs" />
            <Button
              variant="outline"
              size="icon-sm"
              onClick={() => {
                navigator.clipboard?.writeText?.(buildScanLink(qr.shortCode, scanBaseUrl));
                toast.success(t('editQr.linkCopied'));
              }}
            >
              <Copy className="h-3.5 w-3.5" />
            </Button>
            <Button
              variant="outline"
              size="icon-sm"
              onClick={() => window.open(`/s/${qr.shortCode}`, '_blank')}
            >
              <ExternalLink className="h-3.5 w-3.5" />
            </Button>
          </div>
        </div>
        <div className="flex items-center justify-between">
          <div>
            <Label>{t('editQr.activeStatus')}</Label>
            <p className="text-xs text-muted-foreground">{t('editQr.inactiveHint')}</p>
          </div>
          <Switch checked={isActive} onCheckedChange={setIsActive} />
        </div>
      </CardContent>
    </Card>
  );
}
