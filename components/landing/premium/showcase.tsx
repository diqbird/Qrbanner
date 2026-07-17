'use client';

import Link from 'next/link';
import { motion, useReducedMotion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';
import { useLanguage } from '@/components/i18n/language-provider';
import { useLocalePath } from '@/components/i18n/use-locale-path';
import { Reveal } from './primitives';

const ITEMS = [
  { key: 'premiumHome.showcase.airports', href: '/solutions/tourist-attractions', tone: 'from-sky-500/30' },
  { key: 'premiumHome.showcase.stadiums', href: '/solutions/stadium-events', tone: 'from-indigo-500/30' },
  { key: 'premiumHome.showcase.retail', href: '/solutions/retail-stores', tone: 'from-cyan-500/30' },
  { key: 'premiumHome.showcase.conferences', href: '/solutions/trade-shows-expos', tone: 'from-blue-500/30' },
  { key: 'premiumHome.showcase.malls', href: '/solutions/supermarket-grocery', tone: 'from-teal-500/30' },
  { key: 'premiumHome.showcase.hotels', href: '/solutions/hotels-hospitality', tone: 'from-violet-500/20' },
] as const;

export function PremiumShowcase() {
  const { t } = useLanguage();
  const localePath = useLocalePath();
  const ref = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });
  const y = useTransform(scrollYProgress, [0, 1], reduce ? [0, 0] : [40, -40]);

  return (
    <section ref={ref} className="ph-dark-band relative overflow-hidden py-16 text-white sm:py-24" aria-labelledby="premium-showcase-heading">
      <motion.div style={{ y }} className="pointer-events-none absolute -left-20 top-10 h-64 w-64 rounded-full bg-[#2563EB]/40 blur-[80px]" aria-hidden />
      <motion.div style={{ y }} className="pointer-events-none absolute -right-10 bottom-0 h-72 w-72 rounded-full bg-[#06B6D4]/30 blur-[90px]" aria-hidden />

      <div className="ph-container relative">
        <Reveal className="mx-auto max-w-2xl text-center">
          <h2 id="premium-showcase-heading" className="font-display text-3xl font-bold tracking-tight sm:text-4xl">
            {t('premiumHome.showcase.title')}
          </h2>
          <p className="mt-4 text-slate-300">{t('premiumHome.showcase.subtitle')}</p>
        </Reveal>

        <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {ITEMS.map((item, i) => (
            <Reveal key={item.key} delay={i * 0.05}>
              <Link
                href={localePath(item.href)}
                className={`group relative flex min-h-[140px] items-end overflow-hidden rounded-[1.5rem] border border-white/10 bg-gradient-to-br ${item.tone} to-white/5 p-6 transition hover:border-white/25`}
              >
                <span className="font-display text-xl font-semibold tracking-tight">{t(item.key)}</span>
              </Link>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
