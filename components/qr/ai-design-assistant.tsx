'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Sparkles, Wand2, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { useLanguage } from '@/components/i18n/language-provider';
import { applyBrandGenerator, generateBrandPalette, getSmartQrSuggestions } from '@/lib/qr-ai';
import type { QRStyleConfig } from '@/lib/qr-style';

export function AiDesignAssistant({
  category,
  qrName,
  style,
  onApplyStyle,
  onLogoSize,
}: {
  category: string;
  qrName?: string;
  style: Partial<QRStyleConfig>;
  onApplyStyle: (patch: Partial<QRStyleConfig>) => void;
  onLogoSize?: (size: number) => void;
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
          locale: locale === 'tr' ? 'tr' : 'en',
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

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="font-display text-base flex items-center gap-2">
          <Sparkles className="h-4 w-4 text-primary" /> {t('aiDesign.title')}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label className="text-xs">{t('aiDesign.brandLabel')}</Label>
          <div className="flex gap-2">
            <Input
              value={brandSeed}
              onChange={(e) => setBrandSeed(e.target.value)}
              placeholder={t('aiDesign.brandPlaceholder')}
              className="text-sm"
            />
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => onApplyStyle(applyBrandGenerator(brandSeed || category))}
            >
              <Wand2 className="h-3.5 w-3.5" />
            </Button>
          </div>
        </div>

        <Button
          type="button"
          className="w-full gap-2"
          loading={restyling}
          onClick={handleAiRestyle}
        >
          {restyling ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Sparkles className="h-4 w-4" />
          )}
          {t('aiDesign.restyle')}
        </Button>

        <div className="flex gap-2">
          {[palette.primary, palette.secondary, palette.accent].map((c) => (
            <button
              key={c}
              type="button"
              className="h-8 w-8 rounded-full border-2 border-background shadow"
              style={{ backgroundColor: c }}
              title={c}
              onClick={() =>
                onApplyStyle({ fgColor: c, gradientEnabled: true, gradientColor2: palette.secondary })
              }
            />
          ))}
          <span className="text-xs text-muted-foreground self-center">{t('aiDesign.palette')}</span>
        </div>

        <div className="space-y-2">
          {suggestions.map((s) => (
            <button
              key={s.id}
              type="button"
              onClick={() => {
                if (s.stylePatch) onApplyStyle(s.stylePatch);
                if (s.logoSize && onLogoSize) onLogoSize(s.logoSize);
              }}
              className="w-full rounded-lg border p-3 text-left hover:border-primary/50 hover:bg-primary/5 transition-colors"
            >
              <p className="text-sm font-medium">{s.title}</p>
              <p className="text-xs text-muted-foreground">{s.description}</p>
            </button>
          ))}
        </div>

        <p className="text-[10px] text-muted-foreground">{t('aiDesign.hint')}</p>
      </CardContent>
    </Card>
  );
}
