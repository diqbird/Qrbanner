'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Palette } from 'lucide-react';
import {
  type QRStyleConfig,
  DEFAULT_QR_STYLE,
  normalizeQRStyle,
} from '@/lib/qr-style';
import { StyleTemplateLibrary } from './style-template-library';
import { FrameLabelSettings } from './frame-label-settings';
import { findMatchingVisualPresetId } from './visual-preset-picker';
import { StyleEditorColorsTab } from './style-editor-colors-tab';
import { StyleEditorPatternsTab } from './style-editor-patterns-tab';
import { StyleEditorFrameTab } from './style-editor-frame-tab';
import { StyleEditorLogoTab } from './style-editor-logo-tab';
import { useLanguage } from '@/components/i18n/language-provider';

export function QRStyleEditor({
  style,
  onStyleChange,
  onLogoChange,
  logoPreview,
  logoPath,
  onTemplateLogoApply,
  highlightVisualPresetId,
}: {
  style: Partial<QRStyleConfig>;
  onStyleChange: (style: QRStyleConfig) => void;
  onLogoChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  logoPreview: string | null;
  logoPath?: string | null;
  onTemplateLogoApply?: (path: string | null) => void;
  highlightVisualPresetId?: string;
}) {
  const { t } = useLanguage();
  const s = normalizeQRStyle(style);
  const activeVisualPreset = highlightVisualPresetId ?? findMatchingVisualPresetId(s);

  const update = (patch: Partial<QRStyleConfig>) => {
    onStyleChange({ ...s, ...patch });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-display flex items-center gap-2">
          <Palette className="h-5 w-5 text-primary" /> {t('style.customizeTitle')}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <FrameLabelSettings style={s} onChange={update} inlineEdit />

        <Tabs defaultValue="colors" className="space-y-4">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="colors">{t('style.tabColors')}</TabsTrigger>
            <TabsTrigger value="patterns">{t('style.tabPatterns')}</TabsTrigger>
            <TabsTrigger value="frame">{t('style.tabFrame')}</TabsTrigger>
            <TabsTrigger value="logo">{t('style.tabLogo')}</TabsTrigger>
          </TabsList>

          <TabsContent value="colors">
            <StyleEditorColorsTab
              style={s}
              update={update}
              activeVisualPreset={activeVisualPreset}
              onStyleChange={onStyleChange}
            />
          </TabsContent>

          <TabsContent value="patterns">
            <StyleEditorPatternsTab style={s} update={update} />
          </TabsContent>

          <TabsContent value="frame">
            <StyleEditorFrameTab style={s} update={update} />
          </TabsContent>

          <TabsContent value="logo">
            <StyleEditorLogoTab
              style={s}
              update={update}
              logoPreview={logoPreview}
              onLogoChange={onLogoChange}
            />
          </TabsContent>
        </Tabs>

        <StyleTemplateLibrary
          currentStyle={s}
          logoPath={logoPath ?? null}
          onApply={(appliedStyle, path) => {
            onStyleChange(appliedStyle);
            if (path && onTemplateLogoApply) onTemplateLogoApply(path);
          }}
        />
      </CardContent>
    </Card>
  );
}

export { DEFAULT_QR_STYLE, normalizeQRStyle };
export type { QRStyleConfig };
