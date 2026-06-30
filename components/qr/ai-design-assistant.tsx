'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Sparkles, Wand2 } from 'lucide-react';
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
  const [brandSeed, setBrandSeed] = useState(qrName ?? '');
  const suggestions = getSmartQrSuggestions(category, brandSeed || qrName);

  const palette = generateBrandPalette(brandSeed || category);

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="font-display text-base flex items-center gap-2">
          <Sparkles className="h-4 w-4 text-primary" /> AI Design Assistant
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label className="text-xs">Brand / company name</Label>
          <div className="flex gap-2">
            <Input value={brandSeed} onChange={(e) => setBrandSeed(e.target.value)} placeholder="Your brand" className="text-sm" />
            <Button type="button" variant="outline" size="sm" onClick={() => onApplyStyle(applyBrandGenerator(brandSeed || category))}>
              <Wand2 className="h-3.5 w-3.5" />
            </Button>
          </div>
        </div>
        <div className="flex gap-2">
          {[palette.primary, palette.secondary, palette.accent].map((c) => (
            <button key={c} type="button" className="h-8 w-8 rounded-full border-2 border-background shadow" style={{ backgroundColor: c }} title={c} onClick={() => onApplyStyle({ fgColor: c, gradientEnabled: true, gradientColor2: palette.secondary })} />
          ))}
          <span className="text-xs text-muted-foreground self-center">AI Color Palette</span>
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
        <p className="text-[10px] text-muted-foreground">
          Rule-based AI suggestions (no external API). Logo position: use 18–24% size with error correction H.
        </p>
      </CardContent>
    </Card>
  );
}
