'use client';

import { useEffect, useRef, useState } from 'react';
import { renderStyledQR } from '@/lib/qr-render';
import { normalizeQRStyle, type QRStyleConfig } from '@/lib/qr-style';
import type { Locale } from '@/lib/i18n';

const PREVIEW_DEBOUNCE_MS = 160;

export function useQrPreviewRender({
  previewContent,
  normalized,
  logoPreview,
  onStyleChange,
  containerRef,
  renderErrorMessage,
  locale = 'en',
}: {
  previewContent: string;
  normalized: QRStyleConfig;
  logoPreview: string | null;
  onStyleChange?: (style: QRStyleConfig) => void;
  containerRef: React.RefObject<HTMLDivElement | null>;
  renderErrorMessage: string;
  locale?: Locale;
}) {
  const renderIdRef = useRef(0);
  const [qrDataUrl, setQrDataUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const styleKey = JSON.stringify(normalized);

  useEffect(() => {
    const renderId = ++renderIdRef.current;
    let cancelled = false;

    const generateQR = async () => {
      // Keep previous frame visible during debounce — only show spinner after delay starts render.
      setLoading(true);
      setError(null);

      try {
        const canvas = await renderStyledQR(previewContent, normalized, {
          size: 280,
          logoUrl: logoPreview,
          withFrame: true,
          skipFrameText: !!onStyleChange,
          locale,
        });

        if (cancelled || renderId !== renderIdRef.current) return;

        const dataUrl = canvas.toDataURL('image/png');
        setQrDataUrl(dataUrl);

        if (containerRef.current) {
          containerRef.current.innerHTML = '';
          canvas.style.maxWidth = '100%';
          canvas.style.height = 'auto';
          canvas.style.display = 'block';
          canvas.style.opacity = '0';
          canvas.style.transition = 'opacity 120ms ease-out';
          containerRef.current.appendChild(canvas);
          requestAnimationFrame(() => {
            canvas.style.opacity = '1';
          });
        }
      } catch (e) {
        console.error('QR generation error:', e);
        if (!cancelled && renderId === renderIdRef.current) {
          setError(renderErrorMessage);
          if (containerRef.current) containerRef.current.innerHTML = '';
        }
      } finally {
        if (!cancelled && renderId === renderIdRef.current) {
          setLoading(false);
        }
      }
    };

    const timer = window.setTimeout(() => {
      void generateQR();
    }, PREVIEW_DEBOUNCE_MS);

    return () => {
      cancelled = true;
      window.clearTimeout(timer);
    };
  }, [previewContent, styleKey, logoPreview, onStyleChange, containerRef, renderErrorMessage, locale]);

  return { qrDataUrl, loading, error };
}
