'use client';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import type { QRStyleConfig } from '@/lib/qr-style';
import { StyleEditorColorsTab } from './style-editor-colors-tab';
import { StyleEditorPatternsTab } from './style-editor-patterns-tab';
import { StyleEditorFrameTab } from './style-editor-frame-tab';
import { StyleEditorLogoTab } from './style-editor-logo-tab';
import { useLanguage } from '@/components/i18n/language-provider';

export function QrStyleEditorTabs({
  style,
  update,
  activeVisualPreset,
  onStyleChange,
  logoPreview,
  onLogoChange,
}: {
  style: QRStyleConfig;
  update: (patch: Partial<QRStyleConfig>) => void;
  activeVisualPreset: string | undefined;
  onStyleChange: (style: QRStyleConfig) => void;
  logoPreview: string | null;
  onLogoChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}) {
  const { t } = useLanguage();

  return (
    <Tabs defaultValue="colors" className="space-y-4">
      <TabsList className="grid w-full grid-cols-4">
        <TabsTrigger value="colors">{t('style.tabColors')}</TabsTrigger>
        <TabsTrigger value="patterns">{t('style.tabPatterns')}</TabsTrigger>
        <TabsTrigger value="frame">{t('style.tabFrame')}</TabsTrigger>
        <TabsTrigger value="logo">{t('style.tabLogo')}</TabsTrigger>
      </TabsList>

      <TabsContent value="colors">
        <StyleEditorColorsTab
          style={style}
          update={update}
          activeVisualPreset={activeVisualPreset}
          onStyleChange={onStyleChange}
        />
      </TabsContent>

      <TabsContent value="patterns">
        <StyleEditorPatternsTab style={style} update={update} />
      </TabsContent>

      <TabsContent value="frame">
        <StyleEditorFrameTab style={style} update={update} />
      </TabsContent>

      <TabsContent value="logo">
        <StyleEditorLogoTab
          style={style}
          update={update}
          logoPreview={logoPreview}
          onLogoChange={onLogoChange}
        />
      </TabsContent>
    </Tabs>
  );
}
