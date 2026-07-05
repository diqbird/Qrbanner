'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle,
} from '@/components/ui/dialog';
import { Copy } from 'lucide-react';
import type { ApiKeySettingsState } from '@/hooks/use-api-key-settings';

type ApiKeyRevealDialogProps = {
  apiKey: ApiKeySettingsState;
};

export function ApiKeyRevealDialog({ apiKey }: ApiKeyRevealDialogProps) {
  const { t, newKey, showKeyDialog, setShowKeyDialog, copyKey } = apiKey;

  return (
    <Dialog open={showKeyDialog} onOpenChange={setShowKeyDialog}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t('settings.apiKey.dialogTitle')}</DialogTitle>
          <DialogDescription>{t('settings.apiKey.dialogDesc')}</DialogDescription>
        </DialogHeader>
        <div className="flex gap-2">
          <Input value={newKey ?? ''} readOnly className="font-mono text-xs" />
          <Button variant="outline" size="icon" onClick={copyKey}>
            <Copy className="h-4 w-4" />
          </Button>
        </div>
        <DialogFooter>
          <Button onClick={() => setShowKeyDialog(false)}>{t('settings.apiKey.saved')}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
