'use client';

import { useEffect, useRef, useState } from 'react';
import { useLanguage } from '@/components/i18n/language-provider';
import { renderStyledQRDataUrl } from '@/lib/qr-render';
import type { IndustryTemplate } from '@/lib/industry-templates';
import { cn } from '@/lib/utils';

const SAMPLE_CONTENT = 'https://qrbanner.com/s/demo';

/**
 * Live QR preview rendered with the template's actual style.
 * Renders lazily when scrolled into view to keep the 32-card grid fast.
 */
export function TemplateQrPreview({
  template,
  size = 120,
  className,
}: {
  template: IndustryTemplate;
  size?: number;
  className?: string;
}) {
  const { locale } = useLanguage();
  const containerRef = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  const [dataUrl, setDataUrl] = useState<string | null>(null);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    if (typeof IntersectionObserver === 'undefined') {
      setVisible(true);
      return;
    }
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { rootMargin: '200px' },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!visible) return;
    let cancelled = false;
    renderStyledQRDataUrl(SAMPLE_CONTENT, template.style, { size, locale })
      .then((url) => {
        if (!cancelled) setDataUrl(url);
      })
      .catch(() => {
        /* keep placeholder */
      });
    return () => {
      cancelled = true;
    };
  }, [visible, template.style, size, locale]);

  return (
    <div
      ref={containerRef}
      className={cn('flex items-center justify-center overflow-hidden rounded-xl border bg-white', className)}
      style={{ width: size, height: size }}
      aria-hidden
    >
      {dataUrl ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={dataUrl} alt="" className="h-full w-full object-contain" draggable={false} />
      ) : (
        <div
          className="h-2/3 w-2/3 animate-pulse rounded-lg"
          style={{
            background: `linear-gradient(135deg, ${template.style.bgColor ?? '#fff'} 50%, ${template.style.fgColor ?? '#000'} 50%)`,
            opacity: 0.35,
          }}
        />
      )}
    </div>
  );
}
