'use client';

import { Button } from '@/components/ui/button';
import { Copy } from 'lucide-react';
import { toast } from 'sonner';
import type { MfaSettingsState } from '@/hooks/use-mfa-settings';

export function MfaRecoveryCodesPanel({ mfa }: { mfa: MfaSettingsState }) {
  const { t, recoveryCodes, setRecoveryCodes } = mfa;
  if (!recoveryCodes?.length) return null;

  const copyAll = async () => {
    await navigator.clipboard?.writeText(recoveryCodes.join('\n'));
    toast.success(t('settings.mfa.recoveryCopied'));
  };

  return (
    <div className="space-y-3 rounded-lg border border-amber-500/40 bg-amber-500/5 p-4">
      <p className="text-sm font-medium">{t('settings.mfa.recoveryTitle')}</p>
      <p className="text-sm text-muted-foreground">{t('settings.mfa.recoveryDesc')}</p>
      <ul className="grid grid-cols-1 gap-1 font-mono text-sm sm:grid-cols-2">
        {recoveryCodes.map((code) => (
          <li key={code} className="rounded bg-muted px-2 py-1">
            {code}
          </li>
        ))}
      </ul>
      <div className="flex flex-wrap gap-2">
        <Button type="button" variant="outline" size="sm" className="gap-1" onClick={copyAll}>
          <Copy className="h-3 w-3" /> {t('settings.mfa.recoveryCopy')}
        </Button>
        <Button type="button" variant="ghost" size="sm" onClick={() => setRecoveryCodes(null)}>
          {t('settings.mfa.recoveryDismiss')}
        </Button>
      </div>
    </div>
  );
}
