import { Star } from 'lucide-react';
import { getServerLocale } from '@/lib/i18n/server';
import { translate } from '@/lib/i18n';
import { Reveal } from './primitives';

const QUOTES = [
  { textKey: 'socialProof.testimonial1', roleKey: 'socialProof.testimonial1Role' },
  { textKey: 'socialProof.testimonial2', roleKey: 'socialProof.testimonial2Role' },
  { textKey: 'socialProof.testimonial3', roleKey: 'socialProof.testimonial3Role' },
] as const;

export async function PremiumTestimonials() {
  const locale = await getServerLocale();
  const t = (key: string) => translate(locale, key);

  return (
    <section className="py-16 sm:py-20" aria-labelledby="premium-testimonials-heading">
      <div className="ph-container">
        <Reveal className="mx-auto max-w-2xl text-center">
          <h2 id="premium-testimonials-heading" className="ph-title text-3xl sm:text-4xl">
            {t('premiumHome.testimonials.title')}
          </h2>
          <p className="mt-4 text-muted-foreground">{t('premiumHome.testimonials.subtitle')}</p>
        </Reveal>

        <div className="mt-12 grid gap-5 lg:grid-cols-3">
          {QUOTES.map((quote, i) => (
            <Reveal key={quote.textKey} delay={i * 0.06}>
              <figure className="ph-card flex h-full flex-col p-6 hover:translate-y-0 hover:scale-100">
                <div className="flex gap-0.5 text-amber-400" aria-label="5 stars">
                  {Array.from({ length: 5 }).map((_, star) => (
                    <Star key={star} className="h-4 w-4 fill-current" aria-hidden />
                  ))}
                </div>
                <blockquote className="mt-4 flex-1 text-sm leading-relaxed text-foreground/85">
                  “{t(quote.textKey)}”
                </blockquote>
                <figcaption className="mt-6 flex items-center gap-3">
                  <span
                    className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-[#2563EB] to-[#06B6D4] text-sm font-bold text-white"
                    aria-hidden
                  >
                    {t(quote.roleKey).charAt(0)}
                  </span>
                  <span className="text-sm font-medium text-foreground">{t(quote.roleKey)}</span>
                </figcaption>
              </figure>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
