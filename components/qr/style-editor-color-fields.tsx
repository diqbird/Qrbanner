'use client';

import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { useLanguage } from '@/components/i18n/language-provider';
import type { QRStyleConfig } from '@/lib/qr-style';

export function StyleEditorFgBgFields({
  style,
  update,
}: {
  style: QRStyleConfig;
  update: (patch: Partial<QRStyleConfig>) => void;
}) {
  const { t } = useLanguage();

  return (
    <>
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label>{t('style.foreground')}</Label>
          <div className="flex items-center gap-2">
            <input
              type="color"
              value={style.fgColor}
              onChange={(e) => update({ fgColor: e.target.value })}
              className="h-10 w-10 cursor-pointer rounded border-0"
            />
            <Input
              value={style.fgColor}
              onChange={(e) => update({ fgColor: e.target.value })}
              className="font-mono text-xs"
            />
          </div>
        </div>
        <div className="space-y-2">
          <Label>{t('style.background')}</Label>
          <div className="flex items-center gap-2">
            <input
              type="color"
              value={style.bgColor}
              onChange={(e) => update({ bgColor: e.target.value })}
              className="h-10 w-10 cursor-pointer rounded border-0"
            />
            <Input
              value={style.bgColor}
              onChange={(e) => update({ bgColor: e.target.value })}
              className="font-mono text-xs"
            />
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between rounded-lg border p-4">
        <Label>{t('style.transparentBackground')}</Label>
        <Switch checked={style.transparentBg} onCheckedChange={(v) => update({ transparentBg: v })} />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label className="text-xs">{t('style.cornerSquareColor')}</Label>
          <Input
            value={style.cornerColor}
            onChange={(e) => update({ cornerColor: e.target.value })}
            placeholder={style.fgColor}
            className="font-mono text-xs"
          />
        </div>
        <div className="space-y-2">
          <Label className="text-xs">{t('style.cornerDotColor')}</Label>
          <Input
            value={style.cornerDotColor}
            onChange={(e) => update({ cornerDotColor: e.target.value })}
            placeholder={t('style.cornerDotPlaceholder')}
            className="font-mono text-xs"
          />
        </div>
      </div>
    </>
  );
}
