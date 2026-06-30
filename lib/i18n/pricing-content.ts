import { PLANS, type PlanId, type PlanLimits, annualMonthlyEquivalent, annualTotalPrice, type BillingInterval } from '@/lib/plans';
import type { Locale } from './types';

export function getLaunchBanner(locale: Locale): string {
  if (locale === 'tr') {
    return 'Ücretsiz plan sonsuza kadar. Daha fazlası için Pro $9.99/ay. Düşürme veya iptalde QR kodlarınız aktif kalır.';
  }
  return 'Free plan forever. Upgrade to Pro from $9.99/mo when you need more. Your QR codes stay active if you downgrade or cancel.';
}

function planFeatures(plan: PlanLimits, locale: Locale): string[] {
  const domains =
    locale === 'tr'
      ? `${plan.maxCustomDomains} özel tarama alan adı`
      : `${plan.maxCustomDomains} custom scan domain${plan.maxCustomDomains === 1 ? '' : 's'}`;

  if (locale === 'tr') {
    return [
      `${plan.maxQrCodes.toLocaleString('tr-TR')} dinamik QR kodu`,
      domains,
      `Toplu içe aktarma: ${plan.maxBulkRows} satıra kadar`,
      plan.apiAccess ? 'REST API erişimi' : 'API erişimi yok',
      plan.analyticsRetentionDays
        ? `${plan.analyticsRetentionDays} günlük analitik geçmişi`
        : 'Sınırsız analitik geçmişi',
      plan.codesActiveAfterCancel
        ? 'İptalde QR kodları aktif kalır'
        : 'Abonelik bitince kodlar duraklar',
      'Akıllı yönlendirme (zaman, konum, cihaz)',
      'GA4 ve Meta Pixel desteği',
      'Tarama webhook\'ları ve lead yakalama',
      'Marka stil şablonları',
      'Klasörler, etiketler ve tarama bildirimleri',
      ...(plan.whiteLabel ? ['Beyaz etiket açılış sayfaları (Powered by gizle)'] : []),
    ];
  }

  return [
    `${plan.maxQrCodes.toLocaleString()} dynamic QR codes`,
    domains,
    `Bulk import up to ${plan.maxBulkRows} rows`,
    plan.apiAccess ? 'REST API access' : 'No API access',
    plan.analyticsRetentionDays
      ? `${plan.analyticsRetentionDays}-day analytics history`
      : 'Unlimited analytics history',
    plan.codesActiveAfterCancel
      ? 'QR codes stay active if you cancel'
      : 'Codes pause when subscription ends',
    'Smart routing (schedule, geofence, device)',
    'GA4 & Meta Pixel support',
    'Scan webhooks & lead capture',
    'Brand style templates',
    'Folders, labels & scan notifications',
    ...(plan.whiteLabel ? ['White-label landing pages (hide Powered by)'] : []),
  ];
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
    ['REST API', 'Free plan', 'Paid tier'],
    ['Bulk CSV import', 'Included', 'Paid tier'],
    ['Print banner export', 'Included', 'Rare'],
    ['GA4 + Meta Pixel on scan', 'Included', 'Partial'],
    ['Scan webhooks (Zapier-ready)', 'Included', 'Paid tier'],
    ['Lead capture on landing pages', 'Included', 'Paid tier'],
    ['Analytics date range filter', 'Included', 'Paid tier'],
    ['Brand style templates', 'Included', 'Rare'],
    ['A/B variant routing', 'Included', 'Paid tier'],
    ['Team workspaces', 'Included', 'Paid tier'],
    ['NFC tag tracking', 'Included', 'Rare'],
    ['GPS scan heatmap', 'Included', 'Paid tier'],
    ['SSO (Google / Microsoft)', 'Included', 'Enterprise'],
  ] as const;

  if (locale !== 'tr') {
    return rows.map(([feature, qrbanner, typical]) => ({ feature, qrbanner, typical }));
  }

  const trFeatures = [
    'Dinamik QR kodları',
    'İptalde kodlar aktif',
    'Geofence + zaman yönlendirme',
    'Özel tarama alan adı',
    'REST API',
    'Toplu CSV içe aktarma',
    'Baskı banner dışa aktarma',
    'Taramada GA4 + Meta Pixel',
    'Tarama webhook\'ları (Zapier)',
    'Açılış sayfası lead yakalama',
    'Analitik tarih aralığı filtresi',
    'Marka stil şablonları',
    'A/B varyant yönlendirme',
    'Ekip çalışma alanları',
    'NFC etiket takibi',
    'GPS tarama ısı haritası',
    'SSO (Google / Microsoft)',
  ];
  const trQr = [
    'Dahil', 'Evet', 'Dahil', 'Ücretsiz plan', 'Ücretsiz plan', 'Dahil', 'Dahil', 'Dahil',
    'Dahil', 'Dahil', 'Dahil', 'Dahil', 'Dahil', 'Dahil', 'Dahil', 'Dahil', 'Dahil',
  ];
  const trTypical = [
    'Dahil', 'Genelde hayır', 'Ücretli plan', 'Ücretli plan', 'Ücretli plan', 'Ücretli plan',
    'Nadir', 'Kısmi', 'Ücretli plan', 'Ücretli plan', 'Ücretli plan', 'Nadir', 'Ücretli plan',
    'Ücretli plan', 'Nadir', 'Ücretli plan', 'Kurumsal',
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
  t: (key: string) => string
): string {
  if (!priceMonthly || priceMonthly <= 0) return t('pricing.startFree');
  if (planId === 'agency') return t('pricing.upgradeAgency');
  if (planId === 'business') return t('pricing.upgradeBusiness');
  if (planId === 'pro') return t('pricing.upgradePro');
  return t('pricing.upgrade');
}
