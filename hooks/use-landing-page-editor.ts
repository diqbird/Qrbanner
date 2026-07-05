'use client';

import { useState } from 'react';
import { toast } from 'sonner';
import { useLanguage } from '@/components/i18n/language-provider';
import { resolveApiError } from '@/lib/i18n/resolve-api-error';
import { seedBuilderBlocksFromClassic } from '@/lib/landing-editor-utils';
import type { LandingPageData } from '@/lib/landing-page';

export function useLandingPageEditor({
  data,
  onChange,
  category = 'url',
  qrName,
  targetUrl,
}: {
  data: LandingPageData;
  onChange: (v: LandingPageData) => void;
  category?: string;
  qrName?: string;
  targetUrl?: string;
}) {
  const { t, locale } = useLanguage();
  const [aiLoading, setAiLoading] = useState(false);

  const set = (patch: Partial<LandingPageData>) => onChange({ ...data, ...patch });
  const builderMode = Boolean(data.builderMode);

  const enableBuilder = () => {
    if (data.blocks && data.blocks.length > 0) {
      set({ builderMode: true });
      return;
    }
    set({ builderMode: true, blocks: seedBuilderBlocksFromClassic(data) });
  };

  const handleAiGenerate = async () => {
    setAiLoading(true);
    try {
      const res = await fetch('/api/landing-page/generate-copy', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          category: category ?? 'url',
          qrName,
          targetUrl,
          locale: locale === 'tr' ? 'tr' : 'en',
        }),
      });
      const payload = await res.json();
      if (!res.ok) {
        toast.error(resolveApiError(t, payload.error, 'landingEditor.aiFailed'));
        return;
      }
      onChange({ ...data, ...(payload.copy ?? {}) });
      if (payload.source === 'llm') {
        toast.success(t('landingEditor.aiGenerated'));
      } else {
        toast.message(t('landingEditor.aiTemplateFallback'));
      }
    } catch {
      toast.error(t('landingEditor.aiFailed'));
    } finally {
      setAiLoading(false);
    }
  };

  return {
    t,
    data,
    set,
    builderMode,
    enableBuilder,
    aiLoading,
    handleAiGenerate,
    qrName,
  };
}

export type LandingPageEditorState = ReturnType<typeof useLandingPageEditor>;
