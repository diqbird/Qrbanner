'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Sparkles, Wand2, Loader2 } from 'lucide-react';
import type { AiDesignAssistantState } from '@/hooks/use-ai-design-assistant';
import type { QRStyleConfig } from '@/lib/qr-style';

type AiDesignBrandControlsProps = {
  ai: AiDesignAssistantState;
};

export function AiDesignBrandControls({ ai }: AiDesignBrandControlsProps) {
  const { t, brandSeed, setBrandSeed, restyling, handleAiRestyle, applyBrand } = ai;

  return (
    <>
      <div className="space-y-2">
        <Label className="text-xs">{t('aiDesign.brandLabel')}</Label>
        <div className="flex gap-2">
          <Input
            value={brandSeed}
            onChange={(e) => setBrandSeed(e.target.value)}
            placeholder={t('aiDesign.brandPlaceholder')}
            className="text-sm"
          />
          <Button type="button" variant="outline" size="sm" onClick={applyBrand}>
            <Wand2 className="h-3.5 w-3.5" />
          </Button>
        </div>
      </div>

      <Button type="button" className="w-full gap-2" loading={restyling} onClick={handleAiRestyle}>
        {restyling ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <Sparkles className="h-4 w-4" />
        )}
        {t('aiDesign.restyle')}
      </Button>
    </>
  );
}

type AiDesignSuggestionsPanelProps = {
  ai: AiDesignAssistantState;
  onApplyStyle: (patch: Partial<QRStyleConfig>) => void;
  onLogoSize?: (size: number) => void;
};

export function AiDesignSuggestionsPanel({ ai, onApplyStyle, onLogoSize }: AiDesignSuggestionsPanelProps) {
  const { t, suggestions, palette, applyPaletteColor } = ai;

  return (
    <>
      <div className="flex gap-2">
        {[palette.primary, palette.secondary, palette.accent].map((c) => (
          <button
            key={c}
            type="button"
            className="h-8 w-8 rounded-full border-2 border-background shadow"
            style={{ backgroundColor: c }}
            title={c}
            onClick={() => applyPaletteColor(c)}
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
    </>
  );
}
