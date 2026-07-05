'use client';

import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import type { QRStyleConfig } from '@/lib/qr-style';

export function StyleEditorFgBgFields({
  style,
  update,
}: {
  style: QRStyleConfig;
  update: (patch: Partial<QRStyleConfig>) => void;
}) {
  return (
    <>
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label>Foreground</Label>
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
          <Label>Background</Label>
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
        <Label>Transparent background (PNG export)</Label>
        <Switch checked={style.transparentBg} onCheckedChange={(v) => update({ transparentBg: v })} />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label className="text-xs">Corner Square Color (optional)</Label>
          <Input
            value={style.cornerColor}
            onChange={(e) => update({ cornerColor: e.target.value })}
            placeholder={style.fgColor}
            className="font-mono text-xs"
          />
        </div>
        <div className="space-y-2">
          <Label className="text-xs">Corner Dot Color (optional)</Label>
          <Input
            value={style.cornerDotColor}
            onChange={(e) => update({ cornerDotColor: e.target.value })}
            placeholder="Same as corners"
            className="font-mono text-xs"
          />
        </div>
      </div>
    </>
  );
}
