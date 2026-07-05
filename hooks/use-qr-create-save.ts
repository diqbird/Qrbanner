'use client';

import { useCallback } from 'react';
import type { AppRouterInstance } from 'next/dist/shared/lib/app-router-context.shared-runtime';
import { toast } from 'sonner';
import { resolveQrCreateLogoPath } from '@/lib/qr-save-logo-upload';
import {
  postCreateQr,
  toastCreateQrError,
  toastCreateQrUnexpected,
} from '@/lib/qr-create-save-api';
import type { QrFeatureFields } from '@/hooks/use-qr-feature-fields';
import type { AdvancedValues } from '@/lib/advanced-settings-types';
import type { QRStyleConfig } from '@/lib/qr-style';

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

      const result = await postCreateQr({
        name,
        category,
        payloadData: payloadData(),
        style,
        logoPath,
        advanced,
        featureFields,
      });

      if (result.ok) {
        router.replace(`/qr/${result.id}`);
      } else if (result.status === 401) {
        redirectGuestToSignup();
      } else {
        toastCreateQrError(t, result.error);
      }
    } catch {
      toastCreateQrUnexpected(t);
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
    advanced,
    featureFields,
    router,
    t,
  ]);

  return { handleSave };
}
