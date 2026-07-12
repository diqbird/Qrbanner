'use client';

import { useState } from 'react';
import { toast } from 'sonner';
import { useLanguage } from '@/components/i18n/language-provider';
import { applyBrandGenerator, generateBrandPalette, getSmartQrSuggestions } from '@/lib/qr-ai';
import type { QRStyleConfig } from '@/lib/qr-style';

export function useAiDesignAssistant({
  category,
  qrName,
  style,
  onApplyStyle,
}: {
  category: string;
  qrName?: string;
  style: Partial<QRStyleConfig>;
  onApplyStyle: (patch: Partial<QRStyleConfig>) => void;
}) {
  const { t, locale } = useLanguage();
  const [brandSeed, setBrandSeed] = useState(qrName ?? '');
  const [restyling, setRestyling] = useState(false);
  const suggestions = getSmartQrSuggestions(category, brandSeed || qrName);
  const palette = generateBrandPalette(brandSeed || category);

  const handleAiRestyle = async () => {
    setRestyling(true);
    try {
      const res = await fetch('/api/qr/ai-restyle', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          category,
          qrName: brandSeed || qrName,
          locale,
          currentStyle: style,
        }),
      });
      const payload = await res.json();
      if (!res.ok) {
        toast.error(t('aiDesign.restyleFailed'));
        return;
      }
      if (payload.style) onApplyStyle(payload.style);
      if (payload.source === 'llm') {
        toast.success(t('aiDesign.restyleSuccess'));
      } else {
        toast.message(t('aiDesign.restyleFallback'));
      }
    } catch {
      toast.error(t('aiDesign.restyleFailed'));
    } finally {
      setRestyling(false);
    }
  };

  const applyBrand = () => onApplyStyle(applyBrandGenerator(brandSeed || category));

  const applyPaletteColor = (color: string) => {
    onApplyStyle({ fgColor: color, gradientEnabled: true, gradientColor2: palette.secondary });
  };

  return {
    t,
    brandSeed,
    setBrandSeed,
    restyling,
    suggestions,
    palette,
    handleAiRestyle,
    applyBrand,
    applyPaletteColor,
  };
}

export type AiDesignAssistantState = ReturnType<typeof useAiDesignAssistant>;
