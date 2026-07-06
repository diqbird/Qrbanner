'use client';

import { useEffect, useState } from 'react';
import { Loader2 } from 'lucide-react';
import { useLanguage } from '@/components/i18n/language-provider';
import { renderStyledQRDataUrl } from '@/lib/qr-render';
import { normalizeQRStyle, type QRStyleConfig } from '@/lib/qr-style';

const PREVIEW_CONTENT = 'https://qrbanner.com';

export function StyleTemplatePreview({
  style,
  logoPath,
  size = 120,
  className = '',
}: {
  style: Partial<QRStyleConfig> | Record<string, unknown>;
  logoPath?: string | null;
  size?: number;
  className?: string;
}) {
  const { locale } = useLanguage();
  const [src, setSrc] = useState<string | null>(null);
  const [failed, setFailed] = useState(false);
  const normalized = normalizeQRStyle(style);
  const styleKey = JSON.stringify(normalized);
  const logoKey = logoPath ?? '';

  useEffect(() => {
    let cancelled = false;
    setFailed(false);
    setSrc(null);

    renderStyledQRDataUrl(PREVIEW_CONTENT, normalized, {
      size,
      logoUrl: logoPath ?? undefined,
      withFrame: normalized.frameStyle !== 'none',
      locale,
    })
      .then((url) => {
        if (!cancelled) setSrc(url);
      })
      .catch(() => {
        if (!cancelled) setFailed(true);
      });

    return () => {
      cancelled = true;
    };
  }, [styleKey, logoKey, size, locale]);

  return (
    <div
      className={`flex items-center justify-center rounded-lg border border-border/50 bg-muted/30 ${className}`}
      style={{ width: size, height: size }}
    >
      {src ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={src} alt="" className="h-full w-full rounded-lg object-contain p-1" />
      ) : failed ? (
        <div className="text-xs text-muted-foreground">QR</div>
      ) : (
        <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
      )}
    </div>
  );
}
