'use client';

import Image from 'next/image';
import type { BlogSection } from '@/lib/blog/types';
import { useLanguage } from '@/components/i18n/language-provider';

/** Hosts allowed by next.config.js images.remotePatterns (+ same-origin paths). */
function canOptimizeBlogImage(src: string): boolean {
  if (src.startsWith('/') && !src.startsWith('//')) return true;
  try {
    const { hostname, protocol } = new URL(src);
    if (protocol !== 'https:' && protocol !== 'http:') return false;
    if (hostname === 'images.unsplash.com' || hostname === 'qrbanner.com') return true;
    if (hostname.endsWith('.amazonaws.com')) return true;
    return false;
  } catch {
    return false;
  }
}

function BlogSectionImage({ src, alt }: { src: string; alt: string }) {
  const descriptiveAlt = alt.trim() || 'Article illustration';

  if (!canOptimizeBlogImage(src)) {
    return (
      // Fallback for rare hosts outside next/image allowlist
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={src}
        alt={descriptiveAlt}
        className="h-auto w-full rounded-xl border border-border/50"
        loading="lazy"
        decoding="async"
        width={1200}
        height={675}
      />
    );
  }

  return (
    <Image
      src={src}
      alt={descriptiveAlt}
      width={1200}
      height={675}
      className="h-auto w-full rounded-xl border border-border/50"
      sizes="(max-width: 768px) 100vw, 720px"
    />
  );
}

export function BlogArticleBody({ sections }: { sections: BlogSection[] }) {
  const { t } = useLanguage();

  return (
    <article className="prose prose-neutral dark:prose-invert max-w-none prose-headings:font-display prose-headings:tracking-tight prose-p:leading-relaxed prose-li:leading-relaxed">
      {sections.map((section, i) => {
        if (section.type === 'h2' && section.content) {
          return (
            <h2 key={i} className="mt-10 text-2xl font-bold first:mt-0">
              {section.content}
            </h2>
          );
        }
        if (section.type === 'h3' && section.content) {
          return (
            <h3 key={i} className="mt-8 text-xl font-semibold">
              {section.content}
            </h3>
          );
        }
        if (section.type === 'p' && section.content) {
          return (
            <p key={i} className="mt-4 text-muted-foreground">
              {section.content}
            </p>
          );
        }
        if (section.type === 'ul' && section.items) {
          return (
            <ul key={i} className="mt-4 list-disc space-y-2 pl-6 text-muted-foreground">
              {section.items.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          );
        }
        if (section.type === 'faq' && section.faq) {
          return (
            <div key={i} className="mt-10 space-y-6">
              <h2 className="font-display text-2xl font-bold">{t('blogPost.faqTitle')}</h2>
              {section.faq.map((item) => (
                <div key={item.question} className="rounded-xl border border-border/60 bg-card p-5">
                  <h3 className="font-display text-base font-semibold">{item.question}</h3>
                  <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{item.answer}</p>
                </div>
              ))}
            </div>
          );
        }
        if (section.type === 'img' && section.src) {
          return (
            <figure key={i} className="mt-8">
              <BlogSectionImage src={section.src} alt={section.alt ?? ''} />
              {section.alt ? (
                <figcaption className="mt-2 text-center text-xs text-muted-foreground">
                  {section.alt}
                </figcaption>
              ) : null}
            </figure>
          );
        }
        return null;
      })}
    </article>
  );
}
