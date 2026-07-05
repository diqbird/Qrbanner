'use client';

import {
  StyleEditorFrameGradientPanel,
  StyleEditorQrGradientPanel,
} from './style-editor-gradient-panels';
import type { QRStyleConfig } from '@/lib/qr-style';

export function StyleEditorGradientPanel({
  style,
  update,
}: {
  style: QRStyleConfig;
  update: (patch: Partial<QRStyleConfig>) => void;
}) {
  return (
    <>
      <StyleEditorFrameGradientPanel style={style} update={update} />
      <StyleEditorQrGradientPanel style={style} update={update} />
    </>
  );
}
