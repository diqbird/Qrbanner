'use client';

import type { QRStyleConfig } from '@/lib/qr-style';
import { useStyleTemplateLibrary } from '@/hooks/use-style-template-library';
import { StyleTemplateList } from './style-template-list';

export function StyleTemplateLibrary({
  currentStyle,
  logoPath,
  onApply,
}: {
  currentStyle: Partial<QRStyleConfig>;
  logoPath: string | null;
  onApply: (style: QRStyleConfig, logoPath: string | null) => void;
}) {
  const library = useStyleTemplateLibrary(currentStyle, logoPath);
  if (library.loading) return null;
  return <StyleTemplateList library={library} onApply={onApply} />;
}
