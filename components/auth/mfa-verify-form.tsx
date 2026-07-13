'use client';

import { useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Shield } from 'lucide-react';
import { toast } from 'sonner';
import { useLanguage } from '@/components/i18n/language-provider';
import { resolveApiError } from '@/lib/i18n/resolve-api-error';
import { resolveCallbackUrl } from '@/lib/auth-providers';
import { AuthFormShell } from './auth-form-shell';
import { useInviteAuthBrand } from '@/hooks/use-invite-auth-brand';

function sanitizeMfaInput(value: string): string {
  return value.replace(/[^a-zA-Z0-9-]/g, '').toUpperCase().slice(0, 19);
}

export function MfaVerifyForm() {
  const { t } = useLanguage();
  const searchParams = useSearchParams();
  const { update } = useSession();
  const callbackUrl = resolveCallbackUrl(searchParams.get('callbackUrl'));
  const inviteBrand = useInviteAuthBrand(callbackUrl);
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!code.trim()) return;
    setLoading(true);
    try {
      const res = await fetch('/api/auth/mfa/verify-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: code.trim() }),
      });
      const data = await res.json();
      if (!res.ok) {
        toast.error(resolveApiError(t, data.error, 'auth.mfaVerifyFailed'));
        return;
      }
      await update({ mfaProofToken: data.mfaProofToken });
      toast.success(t('auth.signedInSuccess'));
      window.location.href = callbackUrl;
    } catch {
      toast.error(t('auth.somethingWrong'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthFormShell
      title={
        <span className="flex items-center justify-center gap-2">
          <Shield className="h-6 w-6 text-primary" />
          {t('settings.mfa.verifyTitle')}
        </span>
      }
      subtitle={t('settings.mfa.verifyDesc')}
      homeAria={t('common.homeAria')}
      showLanguageSwitcher={false}
      inviteBrand={inviteBrand}
    >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="mfa-code">{t('settings.mfa.codeOrRecoveryLabel')}</Label>
            <Input
              id="mfa-code"
              autoComplete="one-time-code"
              placeholder={t('settings.mfa.codeOrRecoveryPlaceholder')}
              value={code}
              onChange={(e) => setCode(sanitizeMfaInput(e.target.value))}
              className="text-center text-lg tracking-widest font-mono"
              required
            />
          </div>
          <Button type="submit" className="w-full" loading={loading}>
            {t('settings.mfa.verify')}
          </Button>
        </form>
    </AuthFormShell>
  );
}
