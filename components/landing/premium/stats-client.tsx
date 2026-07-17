'use client';

import { useEffect, useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { useLanguage } from '@/components/i18n/language-provider';
import { formatLocaleNumber } from '@/lib/i18n/format-locale';
import type { Locale } from '@/lib/i18n';

function AnimatedCount({ value, locale }: { value: number; locale: Locale }) {
  const reduce = useReducedMotion();
  const [display, setDisplay] = useState(reduce ? value : 0);
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.4 });

  useEffect(() => {
    if (!inView || reduce) {
      setDisplay(value);
      return;
    }
    const duration = 900;
    const start = performance.now();
    let frame = 0;
    const tick = (now: number) => {
      const p = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - p, 3);
      setDisplay(Math.round(value * eased));
      if (p < 1) frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [inView, value, reduce]);

  return (
    <span ref={ref}>
      {formatLocaleNumber(display, locale)}
      {value >= 100 ? '+' : ''}
    </span>
  );
}

export function PremiumStatsClient({
  stats,
}: {
  stats: { qrCodes: number; scans: number; users: number };
}) {
  const { t, locale } = useLanguage();
  const items = [
    { value: stats.qrCodes, label: t('socialProof.statQrCodes') },
    { value: stats.scans, label: t('socialProof.statScans') },
    { value: stats.users, label: t('socialProof.statUsers') },
  ].filter((item) => item.value > 0);

  if (!items.length) return null;

  return (
    <section className="py-14 sm:py-16" aria-labelledby="premium-stats-heading">
      <div className="ph-container">
        <div className="mx-auto max-w-2xl text-center">
          <h2 id="premium-stats-heading" className="ph-title text-3xl sm:text-4xl">
            {t('premiumHome.stats.title')}
          </h2>
          <p className="mt-3 text-muted-foreground">{t('premiumHome.stats.subtitle')}</p>
        </div>
        <div className="mt-10 grid gap-4 sm:grid-cols-3">
          {items.map((item) => (
            <motion.div
              key={item.label}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="ph-card p-7 text-center hover:translate-y-0 hover:scale-100"
            >
              <p className="font-display text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
                <AnimatedCount value={item.value} locale={locale} />
              </p>
              <p className="mt-2 text-sm font-medium text-muted-foreground">{item.label}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
