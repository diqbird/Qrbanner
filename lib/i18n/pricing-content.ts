import { PLANS, type PlanId, type PlanLimits, annualMonthlyEquivalent, annualTotalPrice, type BillingInterval, freePlanQrLimit } from '@/lib/plans';
import { isBillingConfigured } from '@/lib/billing-provider';
import { formatLocaleNumber } from '@/lib/i18n/format-locale';
import type { Locale } from './types';

export function getLaunchBanner(locale: Locale, options?: { billingLive?: boolean }): string {
  const n = formatLocaleNumber(freePlanQrLimit(), locale);
  const trialDays = formatLocaleNumber(14, locale);
  const billingLive = options?.billingLive ?? isBillingConfigured();
  if (locale === 'tr') {
    if (!billingLive) {
      return `Ücretsiz plan sonsuza kadar — ${n} dinamik QR kodu dahil. Ödeme geçici olarak kapalı — destekle iletişime geçin.`;
    }
    return `Ücretsiz plan sonsuza kadar — ${n} dinamik QR kodu dahil. Yeni hesaplarda ${trialDays} gün Pro denemesi. Daha fazlası için Pro $9.99/ay.`;
  }
  if (!billingLive) {
    return `Free plan forever — ${n} dynamic QR codes included. Checkout is temporarily unavailable — contact support.`;
  }
  return `Free plan forever — ${n} dynamic QR codes included. New accounts get a ${trialDays}-day Pro trial. Upgrade from $9.99/mo when you need more.`;
}

function apiLimitFeature(plan: PlanLimits, locale: Locale): string | null {
  if (!plan.apiAccess) return null;
  const perMin = formatLocaleNumber(plan.apiRateLimitPerMin, locale);
  const monthly = formatLocaleNumber(plan.apiMonthlyQuota, locale);
  if (locale === 'tr') {
    return `API: ${perMin}/dk, ${monthly}/ay kota`;
  }
  return `API: ${perMin}/min, ${monthly}/mo quota`;
}

function planFeatures(plan: PlanLimits, locale: Locale): string[] {
  const domains =
    locale === 'tr'
      ? `${formatLocaleNumber(plan.maxCustomDomains, locale)} özel tarama alan adı`
      : `${formatLocaleNumber(plan.maxCustomDomains, locale)} custom scan domain${plan.maxCustomDomains === 1 ? '' : 's'}`;

  const sharedTr = [
    'Akıllı yönlendirme (zaman, konum, cihaz)',
    'Açılış sayfası + lead yakalama + CTA analitiği',
    'GA4, Meta Pixel ve tarama webhook\'ları',
    'Marka stil şablonları ve çözüm şablonları',
    'Klasörler, etiketler ve tarama bildirimleri',
    'İki faktörlü kimlik doğrulama (TOTP)',
  ];
  const sharedEn = [
    'Smart routing (schedule, geofence, device)',
    'Landing pages, lead capture & CTA analytics',
    'GA4, Meta Pixel & scan webhooks with delivery logs',
    'Brand style templates & solution templates',
    'Folders, labels & scan notifications',
    'Two-factor authentication (TOTP)',
  ];

  if (locale === 'tr') {
    const features = [
      `${formatLocaleNumber(plan.maxQrCodes, locale)} dinamik QR kodu`,
      domains,
      `Toplu içe aktarma: ${formatLocaleNumber(plan.maxBulkRows, locale)} satıra kadar`,
      plan.apiAccess ? 'REST API + OpenAPI dokümantasyonu' : 'API erişimi yok',
      ...(apiLimitFeature(plan, locale) ? [apiLimitFeature(plan, locale)!] : []),
      plan.analyticsRetentionDays
        ? `${formatLocaleNumber(plan.analyticsRetentionDays, locale)} günlük analitik geçmişi`
        : 'Sınırsız analitik geçmişi',
      plan.codesActiveAfterCancel
        ? 'İptalde QR kodları aktif kalır'
        : 'Abonelik bitince kodlar duraklar',
      ...sharedTr,
    ];
    if (plan.id === 'business' || plan.id === 'agency') {
      features.push('Ekip SSO (Google, Microsoft, SAML)');
      features.push('AI ile açılış sayfası metni');
    } else if (plan.id === 'pro') {
      features.push('AI ile açılış sayfası metni (isteğe bağlı)');
    }
    if (plan.whiteLabel) {
      features.push('Beyaz etiket açılış sayfaları (Powered by gizle)');
    }
    return features;
  }

  const features = [
    `${formatLocaleNumber(plan.maxQrCodes, locale)} dynamic QR codes`,
    domains,
    `Bulk import up to ${formatLocaleNumber(plan.maxBulkRows, locale)} rows`,
    plan.apiAccess ? 'REST API + OpenAPI spec' : 'No API access',
    ...(apiLimitFeature(plan, locale) ? [apiLimitFeature(plan, locale)!] : []),
    plan.analyticsRetentionDays
      ? `${formatLocaleNumber(plan.analyticsRetentionDays, locale)}-day analytics history`
      : 'Unlimited analytics history',
    plan.codesActiveAfterCancel
      ? 'QR codes stay active if you cancel'
      : 'Codes pause when subscription ends',
    ...sharedEn,
  ];
  if (plan.id === 'business' || plan.id === 'agency') {
    features.push('Team SSO (Google, Microsoft, SAML)');
    features.push('AI-assisted landing page copy');
  } else if (plan.id === 'pro') {
    features.push('AI-assisted landing copy (optional)');
  }
  if (plan.whiteLabel) {
    features.push('White-label landing pages (hide Powered by)');
  }
  return features;
}

export function getPricingPlans(locale: Locale, interval: BillingInterval = 'monthly') {
  return Object.values(PLANS).map((plan) => {
    let priceLabel = plan.priceLabel;
    let priceMonthly = plan.priceMonthly;
    let billedNote: string | undefined;

    if (interval === 'annual' && plan.priceMonthly && plan.priceMonthly > 0) {
      const monthlyEq = annualMonthlyEquivalent(plan.priceMonthly);
      const annualTotal = annualTotalPrice(plan.priceMonthly);
      priceMonthly = monthlyEq;
      priceLabel = locale === 'tr' ? `$${monthlyEq}` : `$${monthlyEq}`;
      billedNote =
        locale === 'tr'
          ? `Yıllık $${annualTotal} faturalandırılır (%20 indirim)`
          : `Billed $${annualTotal}/year (save 20%)`;
    }

    return {
      ...plan,
      priceLabel,
      priceMonthly,
      billedNote,
      billingInterval: interval,
      features: planFeatures(plan, locale),
    };
  });
}

export function getComparisonRows(locale: Locale) {
  const rows = [
    ['Dynamic QR codes', 'Included', 'Included'],
    ['Codes active after cancel', 'Yes', 'Often no'],
    ['Geofence + schedule routing', 'Included', 'Paid tier'],
    ['Custom scan domain', 'Free plan', 'Paid tier'],
    ['REST API + OpenAPI', 'Free plan', 'Paid tier'],
    ['API rate limits (per min / month)', '60 / 1K → 600 / 500K', 'Often lower free tier'],
    ['Bulk CSV import', 'Included', 'Paid tier'],
    ['Print banner export', 'Included', 'Rare'],
    ['GA4 + Meta Pixel on scan', 'Included', 'Partial'],
    ['Scan webhooks + delivery logs', 'Included', 'Paid tier'],
    ['Landing CTA click analytics', 'Included', 'Rare'],
    ['Lead capture on landing pages', 'Included', 'Paid tier'],
    ['AI landing page copy', 'Pro+', 'Rare'],
    ['Analytics date range filter', 'Included', 'Paid tier'],
    ['Brand & solution templates', 'Included', 'Rare'],
    ['A/B variant routing', 'Included', 'Paid tier'],
    ['Team workspaces + SSO/SAML', 'Business+', 'Enterprise'],
    ['Two-factor auth (TOTP)', 'Included', 'Rare'],
    ['NFC tag tracking', 'Included', 'Rare'],
    ['GPS scan heatmap', 'Included', 'Paid tier'],
    ['Turkish locale site (/tr)', 'Included', 'Rare'],
  ] as const;

  if (locale !== 'tr') {
    return rows.map(([feature, qrbanner, typical]) => ({ feature, qrbanner, typical }));
  }

  const trFeatures = [
    'Dinamik QR kodları',
    'İptalde kodlar aktif',
    'Geofence + zaman yönlendirme',
    'Özel tarama alan adı',
    'REST API + OpenAPI',
    'API hız limiti (dk / ay)',
    'Toplu CSV içe aktarma',
    'Baskı banner dışa aktarma',
    'Taramada GA4 + Meta Pixel',
    'Webhook + teslimat günlükleri',
    'Açılış sayfası CTA analitiği',
    'Açılış sayfası lead yakalama',
    'AI açılış sayfası metni',
    'Analitik tarih aralığı filtresi',
    'Marka ve çözüm şablonları',
    'A/B varyant yönlendirme',
    'Ekip çalışma alanı + SSO/SAML',
    'İki faktörlü kimlik doğrulama',
    'NFC etiket takibi',
    'GPS tarama ısı haritası',
    'Türkçe site (/tr)',
  ];
  const trQr = [
    'Dahil', 'Evet', 'Dahil', 'Ücretsiz plan', 'Ücretsiz plan', '60 / 1K → 600 / 500K', 'Dahil', 'Dahil', 'Dahil',
    'Dahil', 'Dahil', 'Dahil', 'Pro+', 'Dahil', 'Dahil', 'Dahil', 'Business+', 'Dahil', 'Dahil',
    'Dahil', 'Dahil',
  ];
  const trTypical = [
    'Dahil', 'Genelde hayır', 'Ücretli plan', 'Ücretli plan', 'Ücretli plan', 'Genelde düşük ücretsiz',
    'Ücretli plan', 'Nadir', 'Kısmi', 'Ücretli plan', 'Nadir', 'Ücretli plan', 'Nadir', 'Ücretli plan', 'Nadir',
    'Ücretli plan', 'Kurumsal', 'Nadir', 'Nadir', 'Ücretli plan', 'Nadir',
  ];

  return trFeatures.map((feature, i) => ({
    feature,
    qrbanner: trQr[i],
    typical: trTypical[i],
  }));
}

export function planName(planId: PlanId, locale: Locale): string {
  if (locale === 'tr') {
    return { free: 'Ücretsiz', pro: 'Pro', business: 'Business', agency: 'Agency' }[planId];
  }
  return PLANS[planId].name;
}

export function planCtaLabel(
  planId: PlanId,
  priceMonthly: number | null,
  t: (key: string) => string,
  options?: { proTrialEligible?: boolean },
): string {
  if (!priceMonthly || priceMonthly <= 0) return t('pricing.startFree');
  if (planId === 'pro' && options?.proTrialEligible) return t('pricing.startProTrial');
  if (planId === 'agency') return t('pricing.upgradeAgency');
  if (planId === 'business') return t('pricing.upgradeBusiness');
  if (planId === 'pro') return t('pricing.upgradePro');
  return t('pricing.upgrade');
}
