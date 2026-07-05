'use client';

import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { useShowQrDescription } from '@/components/site-settings-provider';
import {
  FRAME_STYLES,
  FRAME_TEXT_PRESETS,
  clearFrameLabel,
  patchFrameText,
  type QRStyleConfig,
} from '@/lib/qr-style';
import { useLanguage } from '@/components/i18n/language-provider';
import { FrameLabelInput, FrameStylePicker } from './frame-label-settings-panels';

export function FrameLabelSettings({
  style,
  onChange,
  compact = false,
  inlineEdit = false,
}: {
  style: QRStyleConfig;
  onChange: (patch: Partial<QRStyleConfig>) => void;
  compact?: boolean;
  inlineEdit?: boolean;
}) {
  const showQrDescription = useShowQrDescription();
  const hasFrame = style.frameStyle !== 'none';

  if (!showQrDescription) return null;

  return (
    <div
      className={`w-full rounded-lg border border-primary/20 bg-primary/5 ${
        compact ? 'space-y-2 p-3' : 'space-y-4 p-4'
      }`}
    >
      <FrameLabelInput style={style} onChange={onChange} hasFrame={hasFrame} inlineEdit={inlineEdit} />
      <FrameStylePicker style={style} onChange={onChange} hasFrame={hasFrame} compact={compact} />
    </div>
  );
}
