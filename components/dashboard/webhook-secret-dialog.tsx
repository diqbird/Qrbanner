'use client';

import { Button } from '@/components/ui/button';
import {
  Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle,
} from '@/components/ui/dialog';
import { Copy } from 'lucide-react';
import type { WebhookSettingsState } from '@/hooks/use-webhook-settings';

export function WebhookSecretDialog({ settings }: { settings: WebhookSettingsState }) {
  const { t, newSecret, showSecretDialog, setShowSecretDialog, copySecret } = settings;

  return (
    <Dialog open={showSecretDialog} onOpenChange={setShowSecretDialog}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t('settings.webhooks.secretTitle')}</DialogTitle>
          <DialogDescription>{t('settings.webhooks.secretDesc')}</DialogDescription>
        </DialogHeader>
        <div className="rounded-lg bg-muted p-3 font-mono text-xs break-all">{newSecret}</div>
        <DialogFooter>
          <Button variant="outline" onClick={copySecret} className="gap-2">
            <Copy className="h-4 w-4" /> {t('settings.webhooks.copySecret')}
          </Button>
          <Button onClick={() => setShowSecretDialog(false)}>{t('settings.webhooks.done')}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
