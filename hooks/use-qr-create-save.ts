'use client';

import { useCallback } from 'react';
import type { AppRouterInstance } from 'next/dist/shared/lib/app-router-context.shared-runtime';
import { toast } from 'sonner';
import { buildQrFeaturePayload } from '@/hooks/use-qr-feature-fields';
import type { QrFeatureFields } from '@/hooks/use-qr-feature-fields';
import type { AdvancedValues } from '@/lib/advanced-settings-types';
import type { QRStyleConfig } from '@/lib/qr-style';
import { clearQrCreateDraft } from '@/lib/qr-create-draft';
import { resolveQrCreateLogoPath } from '@/lib/qr-save-logo-upload';

type Translate = (key: string) => string;

export function useQrCreateSave({
  name,
  category,
  session,
  featureFields,
  advanced,
  payloadData,
  style,
  logoFile,
  logoPreview,
  storedLogoPath,
  uploadLogo,
  redirectGuestToSignup,
  router,
  t,
  setSaving,
}: {
  name: string;
  category: string;
  session: { user?: unknown } | null | undefined;
  featureFields: QrFeatureFields;
  advanced: AdvancedValues;
  payloadData: () => Record<string, string>;
  style: QRStyleConfig;
  logoFile: File | null;
  logoPreview: string | null;
  storedLogoPath: string | null;
  uploadLogo: (file: File) => Promise<{ cloud_storage_path?: string } | null | undefined>;
  redirectGuestToSignup: () => void;
  router: AppRouterInstance;
  t: Translate;
  setSaving: (v: boolean) => void;
}) {
  const handleSave = useCallback(async () => {
    if (!name.trim()) {
      toast.error(t('create.nameRequired'));
      return;
    }
    if (!session) {
      redirectGuestToSignup();
      return;
    }
    setSaving(true);
    try {
      const logoPath = await resolveQrCreateLogoPath({
        logoFile,
        logoPreview,
        storedLogoPath,
        uploadLogo,
        t,
      });

      const res = await fetch('/api/qr', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          category,
          qrData: payloadData(),
          style,
          logoPath,
          logoIsPublic: true,
          password: advanced.password || undefined,
          ...buildQrFeaturePayload({ name, mode: 'create', fields: featureFields }),
        }),
      });

      if (res.ok) {
        const data = await res.json();
        clearQrCreateDraft();
        router.replace(`/qr/${data?.qrCode?.id ?? ''}`);
      } else if (res.status === 401) {
        redirectGuestToSignup();
      } else {
        const err = await res.json();
        toast.error(err?.error ?? t('create.createFailed'));
      }
    } catch {
      toast.error(t('bulk.somethingWrong'));
    } finally {
      setSaving(false);
    }
  }, [
    name,
    session,
    redirectGuestToSignup,
    setSaving,
    storedLogoPath,
    logoFile,
    logoPreview,
    uploadLogo,
    category,
    payloadData,
    style,
    advanced.password,
    featureFields,
    router,
    t,
  ]);

  return { handleSave };
}
