'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { toast } from 'sonner';
import { DEFAULT_QR_STYLE } from '@/components/qr/qr-style-editor';
import { normalizeQRStyle } from '@/lib/qr-style';
import { useLanguage } from '@/components/i18n/language-provider';
import { onboardingQrUrl } from '@/lib/onboarding';
import { normalizeQuickCreateUrl } from '@/lib/qr-quick-create-utils';
import type { QRStyleConfig } from '@/lib/qr-style';

export function useQrQuickCreate(onboarding = false) {
  const { t } = useLanguage();
  const router = useRouter();
  const { data: session } = useSession();
  const [url, setUrl] = useState('');
  const [name, setName] = useState('');
  const [style, setStyle] = useState<QRStyleConfig>(DEFAULT_QR_STYLE);
  const [saving, setSaving] = useState(false);

  const normalizedUrl = normalizeQuickCreateUrl(url);
  const isValid = normalizedUrl.length > 10 && normalizedUrl.includes('.');

  useEffect(() => {
    if (!onboarding) return;
    document.getElementById('quick-url')?.focus();
  }, [onboarding]);

  const handleSave = async () => {
    if (!isValid) {
      toast.error(t('quick.invalidUrl'));
      return;
    }
    if (!session?.user) {
      router.push(`/signup?callbackUrl=${encodeURIComponent('/qr/create?quick=1')}`);
      return;
    }
    setSaving(true);
    try {
      const res = await fetch('/api/qr', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: name.trim() || t('quick.namePlaceholder'),
          category: 'url',
          qrData: { url: normalizedUrl },
          style: normalizeQRStyle(style),
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        toast.error(data?.error ?? t('create.createFailed'));
        return;
      }
      toast.success(t('quick.saved'));
      router.push(onboarding ? onboardingQrUrl(data.qrCode.id) : `/qr/${data.qrCode.id}`);
    } catch {
      toast.error(t('auth.somethingWrong'));
    } finally {
      setSaving(false);
    }
  };

  const goAdvanced = (onAdvanced: (data: { url: string; name: string; style: QRStyleConfig }) => void) => {
    if (isValid) {
      onAdvanced({ url: normalizedUrl, name, style: normalizeQRStyle(style) });
    } else {
      onAdvanced({ url: '', name: '', style: normalizeQRStyle(style) });
    }
  };

  return {
    t,
    session,
    url,
    setUrl,
    name,
    setName,
    style,
    setStyle,
    saving,
    normalizedUrl,
    isValid,
    handleSave,
    goAdvanced,
  };
}

export type QrQuickCreateState = ReturnType<typeof useQrQuickCreate>;
