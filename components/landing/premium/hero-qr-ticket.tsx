'use client';

import Link from 'next/link';
import { Loader2, Save, ArrowRight, SlidersHorizontal } from 'lucide-react';
import { useQrQuickCreate } from '@/hooks/use-qr-quick-create';
import { useQrPreview } from '@/hooks/use-qr-preview';
import { useLanguage } from '@/components/i18n/language-provider';
import { useLocalePath } from '@/components/i18n/use-locale-path';

/** Compact live QR creator for the Job Ticket homepage hero. */
export function HeroQrTicket() {
  const { t } = useLanguage();
  const localePath = useLocalePath();
  const quick = useQrQuickCreate(false);
  const { url, setUrl, name, setName, style, isValid, saving, handleSave, session, normalizedUrl } =
    quick;

  const preview = useQrPreview({
    category: 'url',
    qrData: { url: isValid ? normalizedUrl : 'https://qrbanner.com' },
    style,
    logoPreview: null,
    qrName: name.trim() || t('quick.namePlaceholder'),
  });

  const statusLabel = isValid
    ? t('quick.ticketReady')
    : url.trim()
      ? t('quick.ticketEnterUrl')
      : t('quick.ticketDemo');

  return (
    <div className="jt-ticket relative overflow-hidden rounded-sm border border-[var(--ph-rule)] bg-[var(--ph-tint)] shadow-[0_24px_48px_-32px_rgba(28,25,23,0.45)]">
      <div
        className="pointer-events-none absolute inset-y-3 left-0 w-2 border-r border-dashed border-[var(--ph-rule)]"
        aria-hidden
      />
      <div
        className="flex items-center justify-between border-b border-[var(--ph-rule)] bg-[var(--ph-kraft)]/15 px-4 py-2.5 pl-5 font-mono text-[10px] uppercase tracking-[0.16em] text-[var(--ph-ink)]/70 sm:px-5 sm:pl-6"
        aria-hidden
      >
        <span>{t('quick.ticketJob')}</span>
        <span>{t('quick.ticketLive')}</span>
      </div>

      <div className="grid gap-5 p-4 pl-5 sm:grid-cols-[1fr_148px] sm:gap-6 sm:p-5 sm:pl-6">
        <div className="space-y-3">
          <label className="block space-y-1.5">
            <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-[var(--ph-ink)]/55">
              {t('quick.urlLabel')}
            </span>
            <input
              id="hero-ticket-url"
              type="url"
              inputMode="url"
              autoComplete="url"
              placeholder={t('quick.urlPlaceholder')}
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              className="w-full rounded-sm border border-[var(--ph-rule)] bg-[var(--ph-paper)] px-3 py-2.5 text-sm text-[var(--ph-ink)] outline-none ring-[var(--ph-ultramarine)] placeholder:text-[var(--ph-ink)]/35 focus:ring-2"
            />
          </label>
          <label className="block space-y-1.5">
            <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-[var(--ph-ink)]/55">
              {t('quick.nameLabel')}
            </span>
            <input
              id="hero-ticket-name"
              placeholder={t('quick.namePlaceholder')}
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full rounded-sm border border-[var(--ph-rule)] bg-[var(--ph-paper)] px-3 py-2.5 text-sm text-[var(--ph-ink)] outline-none ring-[var(--ph-ultramarine)] placeholder:text-[var(--ph-ink)]/35 focus:ring-2"
            />
          </label>

          <div className="flex flex-col gap-2 pt-1 sm:flex-row sm:flex-wrap">
            {session?.user ? (
              <button
                type="button"
                disabled={!isValid || saving}
                onClick={handleSave}
                className="ph-btn-primary disabled:opacity-50"
              >
                {saving ? (
                  <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
                ) : (
                  <Save className="h-4 w-4" aria-hidden />
                )}
                {saving ? t('quick.saving') : t('quick.saveToDashboard')}
              </button>
            ) : (
              <Link
                href={`/signup?callbackUrl=${encodeURIComponent('/qr/create?quick=1')}`}
                className="ph-btn-primary"
              >
                <Save className="h-4 w-4" aria-hidden />
                {t('quick.signUpToSave')}
              </Link>
            )}
            <Link href={localePath('/qr/create')} className="ph-btn-secondary">
              <SlidersHorizontal className="h-4 w-4" aria-hidden />
              {t('quick.openEditor')}
              <ArrowRight className="h-4 w-4" aria-hidden />
            </Link>
          </div>
        </div>

        <div className="flex flex-col items-center justify-center gap-2">
          <div
            className="relative flex h-[140px] w-[140px] items-center justify-center rounded-sm border border-[var(--ph-rule)] bg-white p-2.5 shadow-[inset_0_0_0_1px_rgba(28,25,23,0.04)]"
            style={{
              backgroundColor: preview.normalized.transparentBg
                ? 'transparent'
                : preview.normalized.bgColor,
            }}
          >
            {preview.loading && (
              <Loader2 className="absolute h-6 w-6 animate-spin text-[var(--ph-ink)]/40" />
            )}
            <div
              ref={preview.containerRef}
              className={`max-h-full max-w-full ${preview.loading || preview.error ? 'invisible' : ''}`}
            />
            {!preview.loading && preview.error ? (
              <p className="px-1 text-center font-mono text-[10px] text-[var(--ph-ink)]/50">
                {preview.error}
              </p>
            ) : null}
          </div>
          <p
            className={`font-mono text-[9px] uppercase tracking-[0.12em] ${
              isValid ? 'text-[var(--ph-ultramarine)]' : 'text-[var(--ph-ink)]/45'
            }`}
          >
            {statusLabel}
          </p>
        </div>
      </div>
    </div>
  );
}
