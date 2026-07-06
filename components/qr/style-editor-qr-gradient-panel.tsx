'use client';

import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Sparkles } from 'lucide-react';
import { useLanguage } from '@/components/i18n/language-provider';
import type { QRStyleConfig } from '@/lib/qr-style';

export function StyleEditorQrGradientPanel({
  style,
  update,
}: {
  style: QRStyleConfig;
  update: (patch: Partial<QRStyleConfig>) => void;
}) {
  const { t } = useLanguage();

  return (
    <div className="space-y-3 rounded-lg border p-4">
      <div className="flex items-center justify-between">
        <Label className="flex items-center gap-2">
          <Sparkles className="h-4 w-4" /> {t('style.gradient')}
        </Label>
        <Switch checked={style.gradientEnabled} onCheckedChange={(v) => update({ gradientEnabled: v })} />
      </div>
      {style.gradientEnabled && (
        <div className="grid gap-3 sm:grid-cols-2">
          <div className="space-y-2">
            <Label className="text-xs">{t('style.gradientSecondColor')}</Label>
            <div className="flex items-center gap-2">
              <input
                type="color"
                value={style.gradientColor2}
                onChange={(e) => update({ gradientColor2: e.target.value })}
                className="h-9 w-9 cursor-pointer rounded border-0"
              />
              <Input
                value={style.gradientColor2}
                onChange={(e) => update({ gradientColor2: e.target.value })}
                className="font-mono text-xs"
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label className="text-xs">{t('style.gradientType')}</Label>
            <div className="flex gap-2">
              {(['linear', 'radial'] as const).map((gradType) => (
                <button
                  key={gradType}
                  type="button"
                  onClick={() => update({ gradientType: gradType })}
                  className={`flex-1 rounded-lg border px-2 py-1.5 text-xs capitalize ${
                    style.gradientType === gradType ? 'border-primary bg-primary/10 text-primary' : 'border-border'
                  }`}
                >
                  {gradType === 'linear' ? t('style.gradientLinear') : t('style.gradientRadial')}
                </button>
              ))}
            </div>
          </div>
          <div className="space-y-2 sm:col-span-2">
            <Label className="text-xs">
              {t('style.gradientRotation', { degrees: String(style.gradientRotation) })}
            </Label>
            <input
              type="range"
              min={0}
              max={360}
              value={style.gradientRotation}
              onChange={(e) => update({ gradientRotation: parseInt(e.target.value, 10) })}
              className="w-full"
            />
          </div>
        </div>
      )}
    </div>
  );
}
