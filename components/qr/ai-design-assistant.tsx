'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Sparkles } from 'lucide-react';
import type { QRStyleConfig } from '@/lib/qr-style';
import { useAiDesignAssistant } from '@/hooks/use-ai-design-assistant';
import { AiDesignBrandControls, AiDesignSuggestionsPanel } from './ai-design-assistant-panels';

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
  const ai = useAiDesignAssistant({ category, qrName, style, onApplyStyle });

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="font-display text-base flex items-center gap-2">
          <Sparkles className="h-4 w-4 text-primary" /> {ai.t('aiDesign.title')}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <AiDesignBrandControls ai={ai} />
        <AiDesignSuggestionsPanel ai={ai} onApplyStyle={onApplyStyle} onLogoSize={onLogoSize} />
      </CardContent>
    </Card>
  );
}
