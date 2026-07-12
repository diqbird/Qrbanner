import type { CaseStudy } from '@/lib/case-studies';
import { formatCaseStudyMetricValue, localizeCaseStudyProse } from './case-study-numbers';
import { localizeCaseStudyMetricLabel } from './case-study-metric-labels';
import type { Locale } from './types';

type LocaleMap = { tr: string; de: string; es: string };

function pick(locale: Locale, map: LocaleMap): string {
  if (locale === 'tr') return map.tr;
  if (locale === 'de') return map.de;
  return map.es;
}

const INDUSTRY_MAP: Record<string, LocaleMap> = {
  Agencies: { tr: 'Ajanslar', de: 'Agenturen', es: 'Agencias' },
  Automotive: { tr: 'Otomotiv', de: 'Automobil', es: 'Automoción' },
  'Beauty & Wellness': { tr: 'Güzellik ve wellness', de: 'Beauty & Wellness', es: 'Belleza y bienestar' },
  Beverage: { tr: 'İçecek', de: 'Getränke', es: 'Bebidas' },
  Cinema: { tr: 'Sinema', de: 'Kino', es: 'Cine' },
  Ecommerce: { tr: 'E-ticaret', de: 'E-Commerce', es: 'Comercio electrónico' },
  Education: { tr: 'Eğitim', de: 'Bildung', es: 'Educación' },
  Entertainment: { tr: 'Eğlence', de: 'Entertainment', es: 'Entretenimiento' },
  Events: { tr: 'Etkinlikler', de: 'Events', es: 'Eventos' },
  Fitness: { tr: 'Fitness', de: 'Fitness', es: 'Fitness' },
  'Food & Beverage': { tr: 'Yiyecek ve içecek', de: 'Gastronomie', es: 'Restauración' },
  Government: { tr: 'Kamu', de: 'Öffentlicher Sektor', es: 'Administración pública' },
  Grocery: { tr: 'Market', de: 'Lebensmittelhandel', es: 'Supermercados' },
  Healthcare: { tr: 'Sağlık', de: 'Gesundheitswesen', es: 'Salud' },
  'Home Services': { tr: 'Ev hizmetleri', de: 'Hausdienste', es: 'Servicios del hogar' },
  Hospitality: { tr: 'Otelcilik', de: 'Hospitality', es: 'Hostelería' },
  Insurance: { tr: 'Sigorta', de: 'Versicherung', es: 'Seguros' },
  Legal: { tr: 'Hukuk', de: 'Recht', es: 'Legal' },
  Logistics: { tr: 'Lojistik', de: 'Logistik', es: 'Logística' },
  Marketing: { tr: 'Pazarlama', de: 'Marketing', es: 'Marketing' },
  Museums: { tr: 'Müzeler', de: 'Museen', es: 'Museos' },
  Nonprofit: { tr: 'STK', de: 'Nonprofit', es: 'Sin ánimo de lucro' },
  'Pet Services': { tr: 'Evcil hayvan hizmetleri', de: 'Haustierdienste', es: 'Servicios para mascotas' },
  Pharmacy: { tr: 'Eczane', de: 'Apotheke', es: 'Farmacia' },
  'Professional Services': { tr: 'Profesyonel hizmetler', de: 'Professionelle Dienstleistungen', es: 'Servicios profesionales' },
  'Real Estate': { tr: 'Gayrimenkul', de: 'Immobilien', es: 'Inmobiliaria' },
  Retail: { tr: 'Perakende', de: 'Retail', es: 'Retail' },
  Workplace: { tr: 'İş yeri', de: 'Arbeitsplatz', es: 'Espacio de trabajo' },
};

const TITLE_MAP: Record<string, LocaleMap> = {
  'Multi-Location Restaurant Group': {
    tr: 'Çok lokasyonlu restoran grubu',
    de: 'Restaurantgruppe mit mehreren Standorten',
    es: 'Grupo de restaurantes multiubicación',
  },
  'National Retail Chain': {
    tr: 'Ulusal perakende zinciri',
    de: 'Nationale Einzelhandelskette',
    es: 'Cadena retail nacional',
  },
  'Boutique Hotel Group': {
    tr: 'Butik otel grubu',
    de: 'Boutique-Hotelgruppe',
    es: 'Grupo hotelero boutique',
  },
  'Digital Marketing Agency': {
    tr: 'Dijital pazarlama ajansı',
    de: 'Digitale Marketingagentur',
    es: 'Agencia de marketing digital',
  },
  'Regional Art Museum': {
    tr: 'Bölgesel sanat müzesi',
    de: 'Regionales Kunstmuseum',
    es: 'Museo de arte regional',
  },
  'City Music Festival': {
    tr: 'Şehir müzik festivali',
    de: 'Städtisches Musikfestival',
    es: 'Festival de música urbano',
  },
  'Multi-Site Clinic Network': {
    tr: 'Çok klinikli sağlık ağı',
    de: 'Kliniknetzwerk mit mehreren Standorten',
    es: 'Red de clínicas multiubicación',
  },
  'DTC Ecommerce Brand': {
    tr: 'DTC e-ticaret markası',
    de: 'DTC-E-Commerce-Marke',
    es: 'Marca DTC de ecommerce',
  },
  'Public University': {
    tr: 'Devlet üniversitesi',
    de: 'Öffentliche Universität',
    es: 'Universidad pública',
  },
  'Regional Logistics Operator': {
    tr: 'Bölgesel lojistik operatörü',
    de: 'Regionaler Logistikbetreiber',
    es: 'Operador logístico regional',
  },
  'National Cinema Chain': {
    tr: 'Ulusal sinema zinciri',
    de: 'Nationale Kinokette',
    es: 'Cadena de cines nacional',
  },
  'Regional Pharmacy Chain': {
    tr: 'Bölgesel eczane zinciri',
    de: 'Regionale Apothekenkette',
    es: 'Cadena de farmacias regional',
  },
  'Multi-Rooftop Dealer Group': {
    tr: 'Çok şubeli bayi grubu',
    de: 'Händlergruppe mit mehreren Standorten',
    es: 'Grupo de concesionarios multiubicación',
  },
  'Boutique Fitness Chain': {
    tr: 'Butik fitness zinciri',
    de: 'Boutique-Fitnesskette',
    es: 'Cadena de fitness boutique',
  },
  'Regional Salon & Spa Group': {
    tr: 'Bölgesel salon ve spa grubu',
    de: 'Regionale Salon- und Spa-Gruppe',
    es: 'Grupo regional de salones y spas',
  },
  'National Nonprofit': {
    tr: 'Ulusal STK',
    de: 'Nationale Nonprofit-Organisation',
    es: 'ONG nacional',
  },
  'Craft Brewery Group': {
    tr: 'Craft bira grubu',
    de: 'Craft-Brauereigruppe',
    es: 'Grupo de cervecerías craft',
  },
  'Independent Agency Network': {
    tr: 'Bağımsız ajans ağı',
    de: 'Unabhängiges Agenturnetzwerk',
    es: 'Red de agencias independientes',
  },
  'Regional Grocery Co-op': {
    tr: 'Bölgesel market kooperatifi',
    de: 'Regionale Lebensmittel-Genossenschaft',
    es: 'Cooperativa de supermercados regional',
  },
  'Municipal Services Agency': {
    tr: 'Belediye hizmetleri birimi',
    de: 'Städtische Servicebehörde',
    es: 'Agencia de servicios municipales',
  },
  'Multifamily Portfolio Operator': {
    tr: 'Çok konutlu portföy operatörü',
    de: 'Betreiber multifamily Portfolios',
    es: 'Operador de cartera multifamily',
  },
  'Dental Practice Network': {
    tr: 'Diş klinikleri ağı',
    de: 'Zahnarztpraxis-Netzwerk',
    es: 'Red de clínicas dentales',
  },
  'Veterinary Clinic Network': {
    tr: 'Veteriner klinik ağı',
    de: 'Tierklinik-Netzwerk',
    es: 'Red de clínicas veterinarias',
  },
  'Regional Law Firm Network': {
    tr: 'Bölgesel hukuk bürosu ağı',
    de: 'Regionales Kanzleinetzwerk',
    es: 'Red regional de bufetes',
  },
  'Regional Accounting Firm': {
    tr: 'Bölgesel muhasebe firması',
    de: 'Regionale Steuerberatungsgesellschaft',
    es: 'Despacho de contabilidad regional',
  },
  'Optometry Practice Group': {
    tr: 'Optometri klinik grubu',
    de: 'Optometrie-Praxisgruppe',
    es: 'Grupo de clínicas de optometría',
  },
  'Childcare Center Network': {
    tr: 'Çocuk bakım merkezi ağı',
    de: 'Kita-Netzwerk',
    es: 'Red de centros de cuidado infantil',
  },
  'Regional HVAC Company': {
    tr: 'Bölgesel HVAC şirketi',
    de: 'Regionales HVAC-Unternehmen',
    es: 'Empresa HVAC regional',
  },
  'Senior Living Operator': {
    tr: 'Yaşlı yaşam operatörü',
    de: 'Betreiber von Seniorenwohnanlagen',
    es: 'Operador de residencias de mayores',
  },
  'Pet Grooming Salon Chain': {
    tr: 'Evcil hayvan kuaför zinciri',
    de: 'Haustierpflege-Salonkette',
    es: 'Cadena de peluquería canina',
  },
  'Flex Office Operator': {
    tr: 'Esnek ofis operatörü',
    de: 'Flex-Office-Betreiber',
    es: 'Operador de oficinas flexibles',
  },
  'Independent Venue Group': {
    tr: 'Bağımsız mekan grubu',
    de: 'Unabhängige Venue-Gruppe',
    es: 'Grupo de venues independientes',
  },
  'Regional Winery Group': {
    tr: 'Bölgesel şaraphane grubu',
    de: 'Regionale Weingutgruppe',
    es: 'Grupo vinícola regional',
  },
  'Farmers Market Cooperative': {
    tr: 'Üretici pazarı kooperatifi',
    de: 'Bauernmarkt-Genossenschaft',
    es: 'Cooperativa de mercado de agricultores',
  },
  'Marina Harbor Group': {
    tr: 'Marina liman grubu',
    de: 'Marina-Hafengruppe',
    es: 'Grupo de marinas',
  },
  'Staffing Agency Network': {
    tr: 'İşe alım ajansı ağı',
    de: 'Personaldienstleister-Netzwerk',
    es: 'Red de agencias de empleo',
  },
  'Trade Show Exhibitor Network': {
    tr: 'Fuar katılımcı ağı',
    de: 'Messeaussteller-Netzwerk',
    es: 'Red de expositores feriales',
  },
  'Regional Coffee Chain': {
    tr: 'Bölgesel kahve zinciri',
    de: 'Regionale Kaffee-Kette',
    es: 'Cadena de café regional',
  },
  'Museum Tour Network': {
    tr: 'Müze tur ağı',
    de: 'Museumstour-Netzwerk',
    es: 'Red de tours de museos',
  },
  'Florist Delivery Chain': {
    tr: 'Çiçekçi teslimat zinciri',
    de: 'Floristen-Lieferkette',
    es: 'Cadena de floristería a domicilio',
  },
  'Food Truck Festival Circuit': {
    tr: 'Food truck festival turu',
    de: 'Food-Truck-Festival-Circuit',
    es: 'Circuito de food trucks',
  },
  'Landscaping Franchise Network': {
    tr: 'Peyzaj franchise ağı',
    de: 'Landschaftsbau-Franchise-Netzwerk',
    es: 'Red de franquicias de jardinería',
  },
  'Regional Dry Cleaning Chain': {
    tr: 'Bölgesel kuru temizleme zinciri',
    de: 'Regionale Textilreinigungs-Kette',
    es: 'Cadena regional de tintorería',
  },
  'Multi-Campus Church Group': {
    tr: 'Çok kampüslü kilise grubu',
    de: 'Kirchengruppe mit mehreren Campus',
    es: 'Grupo religioso multicampus',
  },
  'Print Shop Franchise': {
    tr: 'Matbaa franchise',
    de: 'Druckerei-Franchise',
    es: 'Franquicia de imprenta',
  },
  'Tutoring Center Network': {
    tr: 'Özel ders merkezi ağı',
    de: 'Nachhilfezentrum-Netzwerk',
    es: 'Red de centros de tutoría',
  },
  'Car Wash Membership Chain': {
    tr: 'Üyelikli oto yıkama zinciri',
    de: 'Autowasch-Mitgliedschaftskette',
    es: 'Cadena de lavado con membresía',
  },
  'Bakery Delivery Chain': {
    tr: 'Fırın teslimat zinciri',
    de: 'Bäckerei-Lieferkette',
    es: 'Cadena de panadería a domicilio',
  },
  'Pet Grooming Franchise': {
    tr: 'Evcil hayvan bakımı franchise',
    de: 'Haustierpflege-Franchise',
    es: 'Franquicia de peluquería canina',
  },
  'Coworking Space Network': {
    tr: 'Coworking alanı ağı',
    de: 'Coworking-Netzwerk',
    es: 'Red de espacios de coworking',
  },
};

function localizeIndustry(industry: string, locale: Locale): string {
  const mapped = INDUSTRY_MAP[industry];
  return mapped ? pick(locale, mapped) : industry;
}

function localizeTitle(title: string, locale: Locale): string {
  const mapped = TITLE_MAP[title];
  return mapped ? pick(locale, mapped) : title;
}

function scaleParts(study: CaseStudy, locale: Locale): { label: string; value: string } {
  const primary = study.metrics[0];
  if (!primary) {
    return { label: localizeIndustry(study.industry, locale), value: '' };
  }
  return {
    label: localizeCaseStudyMetricLabel(primary.label, locale),
    value: formatCaseStudyMetricValue(primary.value, locale),
  };
}

function bodyTemplates(
  locale: Locale,
  industry: string,
  title: string,
  scale: { label: string; value: string },
): Pick<
  CaseStudy,
  'headline' | 'metaDescription' | 'companyType' | 'challenge' | 'solution' | 'results' | 'quote' | 'quoteRole'
> {
  const scaleBit = scale.value ? `${scale.value} ${scale.label}` : industry;
  const scaleShort = scale.value || industry;

  if (locale === 'tr') {
    return {
      headline: `${scaleBit} — dinamik QR ile yeniden baskısız güncelleme`,
      metaDescription: `${title} senaryosu: QRbanner dinamik kodlar, kampanya grupları ve tarama analitiği ile ${industry} operasyonlarında baskı maliyetini düşürme.`,
      companyType: `${title} (${scaleBit})`,
      challenge: `${industry} ekipleri her kampanya veya içerik değişiminde statik QR’ları yeniden bastırıyordu. Lokasyonlar arası URL tutarsızlığı ve geciken sevkiyatlar süresi dolmuş tekliflere yol açıyordu.`,
      solution: `QRbanner’da ${scaleShort} ölçeğinde dinamik kodlar oluşturuldu, kampanya klasörlerinde gruplandı ve tek bir güncellenebilir açılış sayfasına bağlandı. Zaman ve coğrafi yönlendirme içerikleri otomatik değiştiriyor; yöneticiler tarama zirvelerini panodan izliyor.`,
      results: [
        `Planlanan yeniden baskı turları azaldı; fiziksel materyal aynı kalırken linkler güncellendi.`,
        `Tarama ısı haritaları düşük performanslı noktaları gösterdi ve yerleşim kararlarını hızlandırdı.`,
        `Yeni lokasyon veya sezon içerikleri aynı şablonla saatler içinde yayına alındı.`,
      ],
      quote: `Artık her değişiklik için sticker siparişi vermiyoruz. Cuma akşamı URL’yi güncellemek, Pazartesi yeniden baskıdan daha hızlı.`,
      quoteRole: `Operasyon lideri, ${industry}`,
    };
  }

  if (locale === 'de') {
    return {
      headline: `${scaleBit} — dynamische QR ohne Neudruck`,
      metaDescription: `Szenario ${title}: Mit QRbanner dynamischen Codes, Kampagnengruppen und Scan-Analysen Druckkosten in ${industry} senken.`,
      companyType: `${title} (${scaleBit})`,
      challenge: `Teams in ${industry} druckten bei jedem Kampagnen- oder Inhaltswechsel statische QR-Codes neu. Uneinheitliche URLs zwischen Standorten und verzögerte Lieferungen führten zu abgelaufenen Angeboten.`,
      solution: `Über QRbanner wurden dynamische Codes im Umfang von ${scaleShort} erzeugt, in Kampagnenordnern gebündelt und auf eine aktualisierbare Landingpage gelegt. Zeit- und Geo-Routing wechseln Inhalte automatisch; Manager prüfen Scan-Peaks im Dashboard.`,
      results: [
        `Geplante Neudruckläufe entfielen; physisches Material blieb, Links wurden aktualisiert.`,
        `Scan-Heatmaps zeigten schwache Standorte und beschleunigten Platzierungsentscheidungen.`,
        `Neue Standorte oder Saisoninhalte gingen mit demselben Template innerhalb von Stunden live.`,
      ],
      quote: `Wir bestellen keine Aufkleber mehr für jede Änderung. Freitagabend die URL zu ändern ist schneller als Montag neu zu drucken.`,
      quoteRole: `Operationsleitung, ${industry}`,
    };
  }

  return {
    headline: `${scaleBit} — QR dinámico sin reimpresión`,
    metaDescription: `Escenario ${title}: con códigos dinámicos QRbanner, lotes de campaña y analítica de escaneos para bajar costes de impresión en ${industry}.`,
    companyType: `${title} (${scaleBit})`,
    challenge: `Los equipos de ${industry} reimprimían códigos QR estáticos en cada cambio de campaña o contenido. URLs inconsistentes entre ubicaciones y retrasos de envío dejaban ofertas caducadas.`,
    solution: `En QRbanner se generaron códigos dinámicos a escala de ${scaleShort}, se agruparon en carpetas de campaña y se apuntaron a una landing actualizable. El enrutado por horario y geolocalización cambia el contenido; los managers revisan picos de escaneo en el panel.`,
    results: [
      `Se evitaron reimpresiones planificadas; el material físico se mantuvo y los enlaces se actualizaron.`,
      `Los mapas de calor de escaneos mostraron puntos débiles y aceleraron decisiones de colocación.`,
      `Nuevas ubicaciones o contenidos de temporada se publicaron en horas con la misma plantilla.`,
    ],
    quote: `Ya no pedimos pegatinas por cada cambio. Actualizar la URL el viernes por la noche gana a reimprimir el lunes.`,
    quoteRole: `Responsable de operaciones, ${industry}`,
  };
}

/** Localize case-study chrome + prose for TR/DE/ES; EN keeps source with number polish. */
export function localizeCaseStudyView(study: CaseStudy, locale: Locale): CaseStudy {
  if (locale === 'en') {
    return {
      ...study,
      headline: localizeCaseStudyProse(study.headline, locale),
      companyType: localizeCaseStudyProse(study.companyType, locale),
      challenge: localizeCaseStudyProse(study.challenge, locale),
      solution: localizeCaseStudyProse(study.solution, locale),
      results: study.results.map((r) => localizeCaseStudyProse(r, locale)),
      metrics: study.metrics.map((m) => ({
        label: localizeCaseStudyMetricLabel(m.label, locale),
        value: formatCaseStudyMetricValue(m.value, locale),
      })),
    };
  }

  const industry = localizeIndustry(study.industry, locale);
  const title = localizeTitle(study.title, locale);
  const scale = scaleParts(study, locale);
  const body = bodyTemplates(locale, industry, title, scale);

  return {
    ...study,
    title,
    industry,
    headline: body.headline,
    metaDescription: body.metaDescription,
    companyType: body.companyType,
    challenge: body.challenge,
    solution: body.solution,
    results: body.results,
    quote: body.quote,
    quoteRole: body.quoteRole,
    metrics: study.metrics.map((m) => ({
      label: localizeCaseStudyMetricLabel(m.label, locale),
      value: formatCaseStudyMetricValue(m.value, locale),
    })),
  };
}
