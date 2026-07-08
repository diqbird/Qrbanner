import { getServerLocale } from '@/lib/i18n/server';
import { translate } from '@/lib/i18n';
import { CUSTOMER_LOGOS } from '@/lib/customer-logos';

export async function LandingCustomerLogos() {
  const locale = await getServerLocale();
  const t = (key: string) => translate(locale, key);

  return (
    <section className="py-8" aria-label={t('customerLogos.sectionLabel')}>
      <div className="mx-auto max-w-[1080px] px-4 sm:px-6">
        <p className="text-center text-xs font-medium uppercase tracking-wider text-muted-foreground">
          {t('customerLogos.title')}
        </p>
        <p className="mx-auto mt-2 max-w-xl text-center text-[11px] text-muted-foreground">
          {t('customerLogos.disclaimer')}
        </p>
        <div className="mt-5 flex flex-wrap items-center justify-center gap-3 sm:gap-4">
          {CUSTOMER_LOGOS.map((logo) => (
            <div
              key={logo.id}
              className="flex h-11 min-w-[7.5rem] items-center justify-center rounded-lg border border-dashed border-border/60 bg-muted/20 px-4"
            >
              {logo.imageSrc ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={logo.imageSrc}
                  alt={logo.label}
                  width={100}
                  height={28}
                  loading="lazy"
                  decoding="async"
                  className="h-7 w-auto max-w-[6.5rem] object-contain opacity-70 grayscale"
                />
              ) : (
                <span className="font-display text-sm font-semibold tracking-tight text-muted-foreground">
                  {logo.label}
                </span>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
