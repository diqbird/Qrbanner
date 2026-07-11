import { PLANS, type PlanId, type PlanLimits, annualMonthlyEquivalent, type BillingInterval } from '@/lib/plans';
import { isBillingConfigured } from '@/lib/billing-provider';
import { PRO_TRIAL_DAYS } from '@/lib/pro-trial';
import { formatLocaleCurrency, formatLocaleNumber } from '@/lib/i18n/format-locale';
import { formatDynamicQrLabel, formatFreePlanDynamicQrLabel } from '@/lib/i18n/dynamic-qr-label';
import { formatPlanPriceLabel, formatPlanPricePerMonth, annualBilledNoteVars } from '@/lib/i18n/plan-pricing-display';
import type { Locale } from './types';

export function getLaunchBanner(locale: Locale, options?: { billingLive?: boolean }): string {
  const qrLabel = formatFreePlanDynamicQrLabel(locale);
  const trialDays = formatLocaleNumber(PRO_TRIAL_DAYS, locale);
  const billingLive = options?.billingLive ?? isBillingConfigured();
  const proPrice = formatPlanPricePerMonth('pro', locale);
  if (locale === 'tr') {
    if (!billingLive) {
      return `Ücretsiz plan sonsuza kadar — ${qrLabel} dahil. Ödeme geçici olarak kapalı — destekle iletişime geçin.`;
    }
    return `Ücretsiz plan sonsuza kadar — ${qrLabel} dahil. Yeni hesaplarda ${trialDays} gün Pro denemesi. Daha fazlası için Pro ${proPrice}.`;
  }
  if (locale === 'de') {
    if (!billingLive) {
      return `Kostenloser Tarif für immer — ${qrLabel} inklusive. Checkout vorübergehend nicht verfügbar — Support kontaktieren.`;
    }
    return `Kostenloser Tarif für immer — ${qrLabel} inklusive. Neue Konten: ${trialDays} Tage Pro-Test. Upgrade ab ${proPrice}.`;
  }
  if (locale === 'es') {
    if (!billingLive) {
      return `Plan gratuito para siempre — incluye ${qrLabel}. Pago temporalmente no disponible — contacte soporte.`;
    }
    return `Plan gratuito para siempre — incluye ${qrLabel}. Cuentas nuevas: ${trialDays} días de prueba Pro. Actualice desde ${proPrice}.`;
  }
  if (!billingLive) {
    return `Free plan forever — ${qrLabel} included. Checkout is temporarily unavailable — contact support.`;
  }
  return `Free plan forever — ${qrLabel} included. New accounts get a ${trialDays}-day Pro trial. Upgrade from ${proPrice} when you need more.`;
}

function apiLimitFeature(plan: PlanLimits, locale: Locale): string | null {
  if (!plan.apiAccess) return null;
  const perMin = formatLocaleNumber(plan.apiRateLimitPerMin, locale);
  const monthly = formatLocaleNumber(plan.apiMonthlyQuota, locale);
  if (locale === 'tr') {
    return `API: ${perMin}/dk, ${monthly}/ay kota`;
  }
  if (locale === 'de') {
    return `API: ${perMin}/Min., ${monthly}/Mon. Kontingent`;
  }
  if (locale === 'es') {
    return `API: ${perMin}/min, cuota ${monthly}/mes`;
  }
  return `API: ${perMin}/min, ${monthly}/mo quota`;
}

function planFeatures(plan: PlanLimits, locale: Locale): string[] {
  const domains =
    locale === 'tr'
      ? `${formatLocaleNumber(plan.maxCustomDomains, locale)} özel tarama alan adı`
      : locale === 'de'
        ? `${formatLocaleNumber(plan.maxCustomDomains, locale)} eigene Scan-Domain${plan.maxCustomDomains === 1 ? '' : 's'}`
        : locale === 'es'
          ? `${formatLocaleNumber(plan.maxCustomDomains, locale)} dominio${plan.maxCustomDomains === 1 ? '' : 's'} de escaneo personalizado${plan.maxCustomDomains === 1 ? '' : 's'}`
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
  const sharedDe = [
    'Smartes Routing (Zeitplan, Geofence, Gerät)',
    'Landingpages, Lead-Erfassung & CTA-Analysen',
    'GA4, Meta Pixel & Scan-Webhooks mit Zustellungsprotokoll',
    'Marken-Stilvorlagen & Branchenvorlagen',
    'Ordner, Labels & Scan-Benachrichtigungen',
    'Zwei-Faktor-Authentifizierung (TOTP)',
  ];
  const sharedEs = [
    'Enrutamiento inteligente (horario, geovalla, dispositivo)',
    'Landing pages, captura de leads y analítica CTA',
    'GA4, Meta Pixel y webhooks de escaneo con registro de entregas',
    'Plantillas de marca y por sector',
    'Carpetas, etiquetas y alertas de escaneo',
    'Autenticación de dos factores (TOTP)',
  ];

  if (locale === 'tr') {
    const features = [
      formatDynamicQrLabel(plan.maxQrCodes, locale),
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

  if (locale === 'de') {
    const features = [
      formatDynamicQrLabel(plan.maxQrCodes, locale),
      domains,
      `Bulk-Import bis ${formatLocaleNumber(plan.maxBulkRows, locale)} Zeilen`,
      plan.apiAccess ? 'REST-API + OpenAPI-Spezifikation' : 'Kein API-Zugang',
      ...(apiLimitFeature(plan, locale) ? [apiLimitFeature(plan, locale)!] : []),
      plan.analyticsRetentionDays
        ? `${formatLocaleNumber(plan.analyticsRetentionDays, locale)} Tage Analysehistorie`
        : 'Unbegrenzte Analysehistorie',
      plan.codesActiveAfterCancel
        ? 'QR-Codes bleiben nach Kündigung aktiv'
        : 'Codes pausieren bei Abo-Ende',
      ...sharedDe,
    ];
    if (plan.id === 'business' || plan.id === 'agency') {
      features.push('Team-SSO (Google, Microsoft, SAML)');
      features.push('KI-gestützte Landingpage-Texte');
    } else if (plan.id === 'pro') {
      features.push('KI-Landingpage-Texte (optional)');
    }
    if (plan.whiteLabel) {
      features.push('White-Label-Landingpages (Powered by ausblenden)');
    }
    return features;
  }

  if (locale === 'es') {
    const features = [
      formatDynamicQrLabel(plan.maxQrCodes, locale),
      domains,
      `Importación masiva hasta ${formatLocaleNumber(plan.maxBulkRows, locale)} filas`,
      plan.apiAccess ? 'API REST + especificación OpenAPI' : 'Sin acceso API',
      ...(apiLimitFeature(plan, locale) ? [apiLimitFeature(plan, locale)!] : []),
      plan.analyticsRetentionDays
        ? `${formatLocaleNumber(plan.analyticsRetentionDays, locale)} días de historial analítico`
        : 'Historial analítico ilimitado',
      plan.codesActiveAfterCancel
        ? 'Los códigos QR siguen activos al cancelar'
        : 'Los códigos se pausan al terminar la suscripción',
      ...sharedEs,
    ];
    if (plan.id === 'business' || plan.id === 'agency') {
      features.push('SSO de equipo (Google, Microsoft, SAML)');
      features.push('Texto de landing con IA');
    } else if (plan.id === 'pro') {
      features.push('Texto de landing con IA (opcional)');
    }
    if (plan.whiteLabel) {
      features.push('Landing pages white-label (ocultar Powered by)');
    }
    return features;
  }

  const features = [
    formatDynamicQrLabel(plan.maxQrCodes, locale),
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

export function getPricingPlans(
  locale: Locale,
  interval: BillingInterval = 'monthly',
  t?: (key: string, vars?: Record<string, string | number>) => string,
) {
  return Object.values(PLANS).map((plan) => {
    let priceLabel = formatPlanPriceLabel(plan.id, locale);
    let priceMonthly = plan.priceMonthly;
    let billedNote: string | undefined;

    if (interval === 'annual' && plan.priceMonthly && plan.priceMonthly > 0) {
      const monthlyEq = annualMonthlyEquivalent(plan.priceMonthly);
      priceMonthly = monthlyEq;
      priceLabel = formatLocaleCurrency(monthlyEq, locale, { maximumFractionDigits: 2, convertTry: true });
      const annualVars = annualBilledNoteVars(plan.id, locale);
      if (annualVars && t) {
        billedNote = t('pricing.billedAnnually', annualVars);
      }
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

function formatApiLimitsComparison(locale: Locale): string {
  const free = PLANS.free;
  const agency = PLANS.agency;
  return `${formatLocaleNumber(free.apiRateLimitPerMin, locale)} / ${formatLocaleNumber(free.apiMonthlyQuota, locale)} → ${formatLocaleNumber(agency.apiRateLimitPerMin, locale)} / ${formatLocaleNumber(agency.apiMonthlyQuota, locale)}`;
}

export function getComparisonRows(locale: Locale) {
  const apiLimits = formatApiLimitsComparison(locale);
  const rows = [
    ['Dynamic QR codes', 'Included', 'Included'],
    ['Codes active after cancel', 'Yes', 'Often no'],
    ['Geofence + schedule routing', 'Included', 'Paid tier'],
    ['Custom scan domain', 'Free plan', 'Paid tier'],
    ['REST API + OpenAPI', 'Free plan', 'Paid tier'],
    ['API rate limits (per min / month)', apiLimits, 'Often lower free tier'],
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

  if (locale === 'tr') {
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
      'Dahil', 'Evet', 'Dahil', 'Ücretsiz plan', 'Ücretsiz plan', apiLimits, 'Dahil', 'Dahil', 'Dahil',
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

  if (locale === 'de') {
    const deFeatures = [
      'Dynamische QR-Codes',
      'Codes aktiv nach Kündigung',
      'Geofence + Zeitplan-Routing',
      'Eigene Scan-Domain',
      'REST-API + OpenAPI',
      'API-Limits (Min. / Monat)',
      'Bulk-CSV-Import',
      'Druck-Banner-Export',
      'GA4 + Meta Pixel beim Scan',
      'Webhooks + Zustellungsprotokoll',
      'Landingpage-CTA-Analysen',
      'Lead-Erfassung auf Landingpages',
      'KI-Landingpage-Texte',
      'Analyse-Datumsfilter',
      'Marken- & Branchenvorlagen',
      'A/B-Varianten-Routing',
      'Team-Workspaces + SSO/SAML',
      'Zwei-Faktor-Auth (TOTP)',
      'NFC-Tag-Tracking',
      'GPS-Scan-Heatmap',
      'Mehrsprachige Site (EN/TR/DE/ES)',
    ];
    const deQr = [
      'Inklusive', 'Ja', 'Inklusive', 'Free-Tarif', 'Free-Tarif', apiLimits, 'Inklusive', 'Inklusive', 'Inklusive',
      'Inklusive', 'Inklusive', 'Inklusive', 'Pro+', 'Inklusive', 'Inklusive', 'Inklusive', 'Business+', 'Inklusive', 'Inklusive',
      'Inklusive', 'Inklusive',
    ];
    const deTypical = [
      'Inklusive', 'Oft nein', 'Bezahlter Tarif', 'Bezahlter Tarif', 'Bezahlter Tarif', 'Oft niedriger Free-Tier',
      'Bezahlter Tarif', 'Selten', 'Teilweise', 'Bezahlter Tarif', 'Selten', 'Bezahlter Tarif', 'Selten', 'Bezahlter Tarif', 'Selten',
      'Bezahlter Tarif', 'Enterprise', 'Selten', 'Selten', 'Bezahlter Tarif', 'Selten',
    ];
    return deFeatures.map((feature, i) => ({
      feature,
      qrbanner: deQr[i],
      typical: deTypical[i],
    }));
  }

  if (locale === 'es') {
    const esFeatures = [
      'Códigos QR dinámicos',
      'Códigos activos tras cancelar',
      'Geovalla + enrutamiento por horario',
      'Dominio de escaneo personalizado',
      'API REST + OpenAPI',
      'Límites API (min / mes)',
      'Importación CSV masiva',
      'Exportación banner impresión',
      'GA4 + Meta Pixel al escanear',
      'Webhooks + registro de entregas',
      'Analítica CTA en landing',
      'Captura de leads en landing',
      'Texto landing con IA',
      'Filtro de rango de fechas',
      'Plantillas de marca y sector',
      'Enrutamiento variantes A/B',
      'Workspaces + SSO/SAML',
      'Autenticación 2FA (TOTP)',
      'Seguimiento etiquetas NFC',
      'Mapa de calor GPS',
      'Sitio multidioma (EN/TR/DE/ES)',
    ];
    const esQr = [
      'Incluido', 'Sí', 'Incluido', 'Plan gratuito', 'Plan gratuito', apiLimits, 'Incluido', 'Incluido', 'Incluido',
      'Incluido', 'Incluido', 'Incluido', 'Pro+', 'Incluido', 'Incluido', 'Incluido', 'Business+', 'Incluido', 'Incluido',
      'Incluido', 'Incluido',
    ];
    const esTypical = [
      'Incluido', 'A menudo no', 'Plan de pago', 'Plan de pago', 'Plan de pago', 'Free tier más bajo',
      'Plan de pago', 'Raro', 'Parcial', 'Plan de pago', 'Raro', 'Plan de pago', 'Raro', 'Plan de pago', 'Raro',
      'Plan de pago', 'Enterprise', 'Raro', 'Raro', 'Plan de pago', 'Raro',
    ];
    return esFeatures.map((feature, i) => ({
      feature,
      qrbanner: esQr[i],
      typical: esTypical[i],
    }));
  }

  return rows.map(([feature, qrbanner, typical]) => ({ feature, qrbanner, typical }));
}

export function planName(planId: PlanId, locale: Locale): string {
  if (locale === 'tr') {
    return { free: 'Ücretsiz', pro: 'Pro', business: 'Business', agency: 'Agency' }[planId];
  }
  if (locale === 'de') {
    return { free: 'Kostenlos', pro: 'Pro', business: 'Business', agency: 'Agency' }[planId];
  }
  if (locale === 'es') {
    return { free: 'Gratis', pro: 'Pro', business: 'Business', agency: 'Agency' }[planId];
  }
  return PLANS[planId].name;
}

export function planCtaLabel(
  planId: PlanId,
  priceMonthly: number | null,
  t: (key: string, vars?: Record<string, string | number>) => string,
  options?: { proTrialEligible?: boolean },
): string {
  if (!priceMonthly || priceMonthly <= 0) return t('pricing.startFree');
  if (planId === 'pro' && options?.proTrialEligible) return t('pricing.startProTrial');
  if (planId === 'agency') return t('pricing.upgradeAgency');
  if (planId === 'business') return t('pricing.upgradeBusiness');
  if (planId === 'pro') return t('pricing.upgradePro');
  return t('pricing.upgrade');
}
