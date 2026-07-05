'use client';

import { useEffect } from 'react';
import { signIn } from 'next-auth/react';
import { useSearchParams } from 'next/navigation';
import { toast } from 'sonner';
import { useLanguage } from '@/components/i18n/language-provider';
import { resolveApiError } from '@/lib/i18n/resolve-api-error';
import type { SamlInfo } from '@/lib/login-form-types';

export function useLoginSsoEffects({
  callbackUrl,
  workspaceSlug,
  setLoading,
  setSamlInfo,
}: {
  callbackUrl: string;
  workspaceSlug: string;
  setLoading: (v: boolean) => void;
  setSamlInfo: (info: SamlInfo | null) => void;
}) {
  const { t } = useLanguage();
  const searchParams = useSearchParams();

  useEffect(() => {
    const samlToken = searchParams.get('samlToken');
    const samlEmail = searchParams.get('email');
    if (!samlToken || !samlEmail) return;

    let cancelled = false;
    (async () => {
      setLoading(true);
      try {
        const result = await signIn('credentials', {
          email: samlEmail,
          verifyToken: samlToken,
          redirect: false,
          callbackUrl,
        });
        if (cancelled) return;
        if (result?.error) {
          toast.error(resolveApiError(t, result.error));
          return;
        }
        if (result?.ok) {
          toast.success(t('auth.signedInSuccess'));
          window.location.href = callbackUrl;
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [searchParams, callbackUrl, t, setLoading]);

  useEffect(() => {
    if (!workspaceSlug) {
      setSamlInfo(null);
      return;
    }
    let cancelled = false;
    fetch(`/api/auth/saml/info?workspace=${encodeURIComponent(workspaceSlug)}`)
      .then((res) => res.json())
      .then((data) => {
        if (!cancelled) setSamlInfo(data?.enabled ? data : { enabled: false });
      })
      .catch(() => {
        if (!cancelled) setSamlInfo({ enabled: false });
      });
    return () => {
      cancelled = true;
    };
  }, [workspaceSlug, setSamlInfo]);

  useEffect(() => {
    const error = searchParams.get('error');
    if (!error || error === 'Callback') return;
    const code = error === 'AccessDenied' ? 'sso_required' : error;
    toast.error(resolveApiError(t, code));
  }, [searchParams, t]);
}
