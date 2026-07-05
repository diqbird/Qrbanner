'use client';

import { useCallback } from 'react';
import { toast } from 'sonner';
import { DEFAULT_QR_STYLE, normalizeQRStyle } from '@/components/qr/qr-style-editor';
import type { QRStyleConfig } from '@/lib/qr-style';

type Translate = (key: string, vars?: Record<string, string>) => string;

export function useQrCreateStyleTemplate({
  category,
  resetStyleHistory,
  setCategory,
  setQrData,
  setStep,
  setStoredLogoPath,
  setLogoPreview,
  setLogoFile,
  t,
}: {
  category: string;
  resetStyleHistory: (style: QRStyleConfig) => void;
  setCategory: (category: string) => void;
  setQrData: (data: Record<string, string>) => void;
  setStep: (step: number | ((s: number) => number)) => void;
  setStoredLogoPath: (path: string | null) => void;
  setLogoPreview: (preview: string | null) => void;
  setLogoFile: (file: File | null) => void;
  t: Translate;
}) {
  const applyStyleTemplate = useCallback(
    (tpl: { style: Record<string, unknown>; logoPath: string | null; name?: string }) => {
      resetStyleHistory(normalizeQRStyle(tpl.style));
      if (tpl.logoPath) {
        setStoredLogoPath(tpl.logoPath);
        setLogoPreview(tpl.logoPath);
        setLogoFile(null);
      }
      if (!category) {
        setCategory('url');
        setQrData({ url: 'https://' });
      }
      setStep((s) => Math.max(s, 1));
    },
    [resetStyleHistory, category, setCategory, setQrData, setStep, setStoredLogoPath, setLogoPreview, setLogoFile],
  );

  const applyStyleTemplateFromApi = useCallback(
    async (styleTemplateId: string) => {
      try {
        const res = await fetch('/api/templates');
        if (!res.ok) return;
        const data = await res.json();
        const tpl = (data?.templates ?? []).find(
          (row: { id: string }) => row.id === styleTemplateId,
        );
        if (tpl) {
          applyStyleTemplate(tpl);
          toast.success(t('settings.brandKit.applied', { name: tpl.name }));
        }
      } catch {
        /* ignore */
      }
    },
    [applyStyleTemplate, t],
  );

  return { applyStyleTemplate, applyStyleTemplateFromApi };
}
