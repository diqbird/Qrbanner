import { heroVideoEmbed } from '@/lib/marketing-config';
import { HeroProductPreview } from '@/components/landing/hero-product-preview';
import { HeroVideoEmbed } from '@/components/landing/hero-video-embed';
import Link from 'next/link';
import type { Locale } from '@/lib/i18n';

export function HeroMedia({
  t,
  locale,
  label,
  demoHref,
  demoLabel,
}: {
  t: (key: string, vars?: Record<string, string | number>) => string;
  locale: Locale;
  label: string;
  demoHref?: string;
  demoLabel?: string;
}) {
  const embed = heroVideoEmbed();

  if (embed) {
    return <HeroVideoEmbed embed={embed} label={label} />;
  }

  return (
    <div>
      <HeroProductPreview t={t} locale={locale} />
      {demoHref && demoLabel ? (
        <p className="mt-3 text-center text-sm text-muted-foreground lg:text-left">
          <Link href={demoHref} className="font-medium text-primary hover:underline">
            {demoLabel} →
          </Link>
        </p>
      ) : null}
    </div>
  );
}
