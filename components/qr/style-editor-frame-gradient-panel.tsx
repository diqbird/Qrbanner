'use client';

import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Sparkles } from 'lucide-react';
import { useLanguage } from '@/components/i18n/language-provider';
import type { QRStyleConfig } from '@/lib/qr-style';

export function StyleEditorFrameGradientPanel({
  style,
  update,
}: {
  style: QRStyleConfig;
  update: (patch: Partial<QRStyleConfig>) => void;
}) {
  const { t } = useLanguage();

  if (style.frameStyle === 'none') return null;

  return (
    <div className="space-y-3 rounded-lg border p-4">
      <div className="flex items-center justify-between">
        <div>
          <Label className="flex items-center gap-2">
            <Sparkles className="h-4 w-4" /> {t('style.frameBackgroundGradient')}
          </Label>
          <p className="mt-1 text-xs text-muted-foreground">{t('style.frameBackgroundGradientHint')}</p>
        </div>
        <Switch
          checked={!!style.backgroundGradientEnabled}
          onCheckedChange={(v) => update({ backgroundGradientEnabled: v })}
        />
      </div>
      {style.backgroundGradientEnabled && (
        <div className="flex items-center gap-2">
          <input
            type="color"
            value={style.backgroundGradientColor2 ?? '#f5f5f7'}
            onChange={(e) => update({ backgroundGradientColor2: e.target.value })}
            className="h-9 w-9 cursor-pointer rounded border-0"
          />
          <Input
            value={style.backgroundGradientColor2 ?? '#f5f5f7'}
            onChange={(e) => update({ backgroundGradientColor2: e.target.value })}
            className="font-mono text-xs"
          />
        </div>
      )}
    </div>
  );
}
