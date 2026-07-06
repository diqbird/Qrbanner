'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Upload } from 'lucide-react';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { useLanguage } from '@/components/i18n/language-provider';
import { useMockupPreviewState } from '@/hooks/use-mockup-preview';
import { MockupPresetPicker } from './mockup-preset-picker';
import { MockupCanvas } from './mockup-canvas';
import { MockupSizeToolbar } from './mockup-size-toolbar';
import { MockupPlacementControls } from './mockup-placement-controls';

export function MockupPreview({ qrDataUrl }: { qrDataUrl: string | null }) {
  const { t } = useLanguage();
  const mockup = useMockupPreviewState();
  const { open, setOpen, isCustom, customImage, fileInputRef, handleCustomUpload, backgroundImage } = mockup;

  return (
    <Collapsible open={open} onOpenChange={setOpen}>
      <Card>
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between gap-2">
            <CardTitle className="font-display text-base">{t('mockup.title')}</CardTitle>
            <CollapsibleTrigger asChild>
              <Button type="button" variant="ghost" size="sm" className="h-7 text-xs">
                {open ? t('mockup.hide') : t('mockup.show')}
              </Button>
            </CollapsibleTrigger>
          </div>
          <p className="text-xs text-muted-foreground">{t('mockup.subtitle')}</p>
        </CardHeader>
        <CollapsibleContent>
          <CardContent className="space-y-4 pt-0">
            <MockupPresetPicker
              active={mockup.active}
              isCustom={isCustom}
              onSelectPreset={mockup.selectPreset}
              onSelectCustom={mockup.selectCustom}
            />

            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/png,image/webp,image/gif"
              className="hidden"
              onChange={handleCustomUpload}
            />

            {isCustom && (
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="gap-1.5 text-xs"
                onClick={() => fileInputRef.current?.click()}
              >
                <Upload className="h-3.5 w-3.5" />
                {customImage ? t('mockup.changePhoto') : t('mockup.uploadPhotoBtn')}
              </Button>
            )}

            <MockupCanvas mockup={mockup} qrDataUrl={qrDataUrl} />

            {qrDataUrl && backgroundImage && <MockupSizeToolbar mockup={mockup} />}

            {qrDataUrl && backgroundImage && (
              <MockupPlacementControls
                placement={mockup.placement}
                onUpdate={mockup.updatePlacement}
                onReset={mockup.resetPlacement}
              />
            )}
          </CardContent>
        </CollapsibleContent>
      </Card>
    </Collapsible>
  );
}
