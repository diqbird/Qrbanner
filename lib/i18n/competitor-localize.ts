import type { CompetitorPage } from '@/lib/competitor-pages';
import type { Locale } from './types';

type LocaleMap = { tr: string; de: string; es: string };

function pick(locale: Locale, map: LocaleMap): string {
  if (locale === 'tr') return map.tr;
  if (locale === 'de') return map.de;
  return map.es;
}

const FEATURE_MAP: Record<string, LocaleMap> = {
  'Free dynamic codes': {
    tr: 'Ücretsiz dinamik kodlar',
    de: 'Kostenlose dynamische Codes',
    es: 'Códigos dinámicos gratis',
  },
  'Free dynamic QR codes': {
    tr: 'Ücretsiz dinamik QR kodları',
    de: 'Kostenlose dynamische QR-Codes',
    es: 'Códigos QR dinámicos gratis',
  },
  'Free dynamic QR': {
    tr: 'Ücretsiz dinamik QR',
    de: 'Kostenloser dynamischer QR',
    es: 'QR dinámico gratis',
  },
  'Codes active after cancel': {
    tr: 'İptal sonrası kodlar aktif',
    de: 'Codes nach Kündigung aktiv',
    es: 'Códigos activos tras cancelar',
  },
  'Active after cancel': {
    tr: 'İptal sonrası aktif',
    de: 'Nach Kündigung aktiv',
    es: 'Activos tras cancelar',
  },
  'REST API (free plan)': {
    tr: 'REST API (ücretsiz plan)',
    de: 'REST-API (Free-Plan)',
    es: 'API REST (plan gratuito)',
  },
  'REST API (free)': {
    tr: 'REST API (ücretsiz)',
    de: 'REST-API (kostenlos)',
    es: 'API REST (gratis)',
  },
  'REST API': {
    tr: 'REST API',
    de: 'REST-API',
    es: 'API REST',
  },
  'Geofence + schedule routing': {
    tr: 'Coğrafi + zaman yönlendirme',
    de: 'Geofencing + Zeitsteuerung',
    es: 'Geovalla + programación',
  },
  'Starting paid price': {
    tr: 'Başlangıç ücretli fiyat',
    de: 'Einstiegspreis (bezahlt)',
    es: 'Precio de entrada de pago',
  },
  'Starting paid': {
    tr: 'Başlangıç ücretli',
    de: 'Einstiegspreis',
    es: 'Precio de entrada',
  },
  'Entry paid plan': {
    tr: 'Giriş ücretli plan',
    de: 'Einstiegs-Paid-Plan',
    es: 'Plan de pago de entrada',
  },
  'Print banner export': {
    tr: 'Baskı banner dışa aktarma',
    de: 'Druckbanner-Export',
    es: 'Exportación de banner para impresión',
  },
  'Print export': {
    tr: 'Baskı dışa aktarma',
    de: 'Druck-Export',
    es: 'Exportación para impresión',
  },
  'A/B testing': {
    tr: 'A/B testi',
    de: 'A/B-Tests',
    es: 'Pruebas A/B',
  },
  'API access': {
    tr: 'API erişimi',
    de: 'API-Zugang',
    es: 'Acceso a la API',
  },
  'Design templates': {
    tr: 'Tasarım şablonları',
    de: 'Design-Vorlagen',
    es: 'Plantillas de diseño',
  },
  'Free plan': {
    tr: 'Ücretsiz plan',
    de: 'Free-Plan',
    es: 'Plan gratuito',
  },
  'Self-serve free plan': {
    tr: 'Self-serve ücretsiz plan',
    de: 'Self-Serve Free-Plan',
    es: 'Plan gratuito self-serve',
  },
  'Custom domain': {
    tr: 'Özel alan adı',
    de: 'Eigene Domain',
    es: 'Dominio personalizado',
  },
  'Custom scan domain': {
    tr: 'Özel tarama alan adı',
    de: 'Eigene Scan-Domain',
    es: 'Dominio de escaneo personalizado',
  },
  'SOC 2 / HIPAA': {
    tr: 'SOC 2 / HIPAA',
    de: 'SOC 2 / HIPAA',
    es: 'SOC 2 / HIPAA',
  },
  'CRM integrations': {
    tr: 'CRM entegrasyonları',
    de: 'CRM-Integrationen',
    es: 'Integraciones CRM',
  },
  'Dynamic QR + analytics': {
    tr: 'Dinamik QR + analitik',
    de: 'Dynamischer QR + Analysen',
    es: 'QR dinámico + analítica',
  },
  'Static design (free)': {
    tr: 'Statik tasarım (ücretsiz)',
    de: 'Statisches Design (kostenlos)',
    es: 'Diseño estático (gratis)',
  },
  API: {
    tr: 'API',
    de: 'API',
    es: 'API',
  },
  'QR-first platform': {
    tr: 'QR odaklı platform',
    de: 'QR-first Plattform',
    es: 'Plataforma QR-first',
  },
  'QR types': {
    tr: 'QR türleri',
    de: 'QR-Typen',
    es: 'Tipos de QR',
  },
  'Scan geo analytics': {
    tr: 'Tarama coğrafi analitiği',
    de: 'Scan-Geo-Analysen',
    es: 'Analítica geo de escaneos',
  },
  'Geo scan analytics': {
    tr: 'Coğrafi tarama analitiği',
    de: 'Geo-Scan-Analysen',
    es: 'Analítica geo de escaneos',
  },
  'Scan analytics': {
    tr: 'Tarama analitiği',
    de: 'Scan-Analysen',
    es: 'Analítica de escaneos',
  },
  'Routing rules': {
    tr: 'Yönlendirme kuralları',
    de: 'Routing-Regeln',
    es: 'Reglas de enrutado',
  },
  'Bulk import': {
    tr: 'Toplu içe aktarma',
    de: 'Massenimport',
    es: 'Importación masiva',
  },
  'Bulk CSV import': {
    tr: 'Toplu CSV içe aktarma',
    de: 'CSV-Massenimport',
    es: 'Importación CSV masiva',
  },
  'Scan webhooks': {
    tr: 'Tarama webhook’ları',
    de: 'Scan-Webhooks',
    es: 'Webhooks de escaneo',
  },
  'Geofence routing': {
    tr: 'Coğrafi yönlendirme',
    de: 'Geofencing-Routing',
    es: 'Enrutado por geovalla',
  },
  'Menu & PDF QR types': {
    tr: 'Menü ve PDF QR türleri',
    de: 'Menü- & PDF-QR-Typen',
    es: 'Tipos QR menú y PDF',
  },
  'Best for': {
    tr: 'En uygun',
    de: 'Am besten für',
    es: 'Ideal para',
  },
  'Dynamic QR (edit after print)': {
    tr: 'Dinamik QR (baskı sonrası düzenleme)',
    de: 'Dynamischer QR (nach Druck änderbar)',
    es: 'QR dinámico (editar tras imprimir)',
  },
  'Dynamic QR': {
    tr: 'Dinamik QR',
    de: 'Dynamischer QR',
    es: 'QR dinámico',
  },
  'QR-native workflow': {
    tr: 'QR odaklı iş akışı',
    de: 'QR-nativer Workflow',
    es: 'Flujo de trabajo QR-nativo',
  },
  'API + webhooks': {
    tr: 'API + webhook’lar',
    de: 'API + Webhooks',
    es: 'API + webhooks',
  },
  'Agency white-label': {
    tr: 'Ajans white-label',
    de: 'Agency White-Label',
    es: 'White-label de agencia',
  },
  'Marketing QR tooling': {
    tr: 'Pazarlama QR araçları',
    de: 'Marketing-QR-Tools',
    es: 'Herramientas QR de marketing',
  },
  'Team features': {
    tr: 'Ekip özellikleri',
    de: 'Team-Funktionen',
    es: 'Funciones de equipo',
  },
  'AI QR art': {
    tr: 'YZ QR sanatı',
    de: 'KI-QR-Art',
    es: 'Arte QR con IA',
  },
};

const VALUE_MAP: Record<string, LocaleMap> = {
  Yes: { tr: 'Evet', de: 'Ja', es: 'Sí' },
  No: { tr: 'Hayır', de: 'Nein', es: 'No' },
  Included: { tr: 'Dahil', de: 'Enthalten', es: 'Incluido' },
  Limited: { tr: 'Sınırlı', de: 'Begrenzt', es: 'Limitado' },
  Paid: { tr: 'Ücretli', de: 'Kostenpflichtig', es: 'De pago' },
  'Higher tiers': { tr: 'Üst paketler', de: 'Höhere Tarife', es: 'Planes superiores' },
  Excellent: { tr: 'Mükemmel', de: 'Ausgezeichnet', es: 'Excelente' },
  Good: { tr: 'İyi', de: 'Gut', es: 'Bueno' },
  'Free plan': { tr: 'Ücretsiz plan', de: 'Free-Plan', es: 'Plan gratuito' },
  'Free tier': { tr: 'Ücretsiz katman', de: 'Free-Tier', es: 'Nivel gratuito' },
  'Paid tiers': { tr: 'Ücretli paketler', de: 'Kostenpflichtige Tarife', es: 'Planes de pago' },
  'All plans': { tr: 'Tüm planlar', de: 'Alle Pläne', es: 'Todos los planes' },
  Varies: { tr: 'Değişir', de: 'Variiert', es: 'Varía' },
  Basic: { tr: 'Temel', de: 'Basis', es: 'Básico' },
  Enterprise: { tr: 'Kurumsal', de: 'Enterprise', es: 'Enterprise' },
  Roadmap: { tr: 'Yol haritası', de: 'Roadmap', es: 'Hoja de ruta' },
  Native: { tr: 'Yerel', de: 'Nativ', es: 'Nativo' },
  'Webhooks/API': { tr: 'Webhook’lar/API', de: 'Webhooks/API', es: 'Webhooks/API' },
  'Core product': { tr: 'Temel ürün', de: 'Kernprodukt', es: 'Producto principal' },
  'Paid platform': { tr: 'Ücretli platform', de: 'Kostenpflichtige Plattform', es: 'Plataforma de pago' },
  'Via upgrade': { tr: 'Yükseltme ile', de: 'Via Upgrade', es: 'Mediante upgrade' },
  'Add-on': { tr: 'Eklenti', de: 'Add-on', es: 'Complemento' },
  'URL-focused': { tr: 'URL odaklı', de: 'URL-fokussiert', es: 'Enfocado en URL' },
  'Trial/limited': { tr: 'Deneme/sınırlı', de: 'Trial/begrenzt', es: 'Prueba/limitado' },
  'Limited trial': { tr: 'Sınırlı deneme', de: 'Begrenzte Trial', es: 'Prueba limitada' },
  'Limited/none': { tr: 'Sınırlı/yok', de: 'Begrenzt/keine', es: 'Limitado/ninguno' },
  'Trial-focused': { tr: 'Deneme odaklı', de: 'Trial-fokussiert', es: 'Enfocado en prueba' },
  'Part of suite': { tr: 'Paket parçası', de: 'Teil der Suite', es: 'Parte del suite' },
  'One-off design export': {
    tr: 'Tek seferlik tasarım dışa aktarma',
    de: 'Einmaliger Design-Export',
    es: 'Exportación de diseño puntual',
  },
  Rarely: { tr: 'Nadiren', de: 'Selten', es: 'Rara vez' },
  'One-off static image': {
    tr: 'Tek seferlik statik görsel',
    de: 'Einmaliges statisches Bild',
    es: 'Imagen estática puntual',
  },
  'Wix site owners': {
    tr: 'Wix site sahipleri',
    de: 'Wix-Site-Betreiber',
    es: 'Propietarios de sitios Wix',
  },
  'Free/static': { tr: 'Ücretsiz/statik', de: 'Kostenlos/statisch', es: 'Gratis/estático' },
  'Product focus': { tr: 'Ürün odaklı', de: 'Produktfokus', es: 'Enfoque de producto' },
  Custom: { tr: 'Özel', de: 'Individuell', es: 'Personalizado' },
  'Very limited': { tr: 'Çok sınırlı', de: 'Sehr begrenzt', es: 'Muy limitado' },
  Strong: { tr: 'Güçlü', de: 'Stark', es: 'Fuerte' },
  'PNG/SVG': { tr: 'PNG/SVG', de: 'PNG/SVG', es: 'PNG/SVG' },
  'Geofence + schedule': {
    tr: 'Coğrafi + zaman',
    de: 'Geofencing + Zeitplan',
    es: 'Geovalla + programación',
  },
  'Agency plan': { tr: 'Ajans planı', de: 'Agency-Plan', es: 'Plan Agency' },
  'Ops & marketing teams': {
    tr: 'Operasyon ve pazarlama ekipleri',
    de: 'Ops- & Marketing-Teams',
    es: 'Equipos de ops y marketing',
  },
  'Ongoing campaigns': {
    tr: 'Süregelen kampanyalar',
    de: 'Laufende Kampagnen',
    es: 'Campañas continuas',
  },
  'QR-first teams': {
    tr: 'QR odaklı ekipler',
    de: 'QR-first Teams',
    es: 'Equipos QR-first',
  },
  'Full stack': { tr: 'Tam yığın', de: 'Full Stack', es: 'Stack completo' },
  'Logo + color': { tr: 'Logo + renk', de: 'Logo + Farbe', es: 'Logo + color' },
  'Banner built in': {
    tr: 'Banner yerleşik',
    de: 'Banner integriert',
    es: 'Banner integrado',
  },
};

const WIN_PHRASE_MAP: Record<string, LocaleMap> = {
  'REST API on free plan': {
    tr: 'Ücretsiz planda REST API',
    de: 'REST-API im Free-Plan',
    es: 'API REST en el plan gratuito',
  },
  'REST API included on free plan': {
    tr: 'Ücretsiz planda REST API dahil',
    de: 'REST-API im Free-Plan enthalten',
    es: 'API REST incluida en el plan gratuito',
  },
  'Print banner export': {
    tr: 'Baskı banner dışa aktarma',
    de: 'Druckbanner-Export',
    es: 'Exportación de banner para impresión',
  },
  'Print banner export built in': {
    tr: 'Yerleşik baskı banner dışa aktarma',
    de: 'Druckbanner-Export integriert',
    es: 'Exportación de banner integrada',
  },
  'Built-in print banner export': {
    tr: 'Yerleşik baskı banner dışa aktarma',
    de: 'Integrierter Druckbanner-Export',
    es: 'Exportación de banner integrada',
  },
  'Print-ready banner export': {
    tr: 'Baskıya hazır banner dışa aktarma',
    de: 'Druckfertiger Banner-Export',
    es: 'Exportación de banner lista para imprimir',
  },
  'Geofence and schedule routing': {
    tr: 'Coğrafi ve zaman yönlendirme',
    de: 'Geofencing- und Zeitsteuerung',
    es: 'Enrutado por geovalla y horario',
  },
  'Geofence and schedule routing included': {
    tr: 'Coğrafi ve zaman yönlendirme dahil',
    de: 'Geofencing- und Zeitsteuerung enthalten',
    es: 'Enrutado por geovalla y horario incluido',
  },
  'Geofence + schedule routing included': {
    tr: 'Coğrafi + zaman yönlendirme dahil',
    de: 'Geofencing + Zeitsteuerung enthalten',
    es: 'Enrutado por geovalla + horario incluido',
  },
  'Codes stay active after cancel': {
    tr: 'İptal sonrası kodlar aktif kalır',
    de: 'Codes bleiben nach Kündigung aktiv',
    es: 'Los códigos siguen activos tras cancelar',
  },
  'Codes stay active after downgrade or cancel': {
    tr: 'Düşürme veya iptal sonrası kodlar aktif kalır',
    de: 'Codes bleiben nach Downgrade oder Kündigung aktiv',
    es: 'Los códigos siguen activos tras bajar de plan o cancelar',
  },
  'Bulk CSV import': {
    tr: 'Toplu CSV içe aktarma',
    de: 'CSV-Massenimport',
    es: 'Importación CSV masiva',
  },
  '27+ QR content types': {
    tr: '27+ QR içerik türü',
    de: '27+ QR-Inhaltstypen',
    es: 'Más de 27 tipos de contenido QR',
  },
  'White-label Agency plan': {
    tr: 'White-label Ajans planı',
    de: 'White-Label Agency-Plan',
    es: 'Plan Agency white-label',
  },
  'White-label on Agency plan': {
    tr: 'Ajans planında white-label',
    de: 'White-Label im Agency-Plan',
    es: 'White-label en el plan Agency',
  },
  'Custom scan domain on free plan': {
    tr: 'Ücretsiz planda özel tarama alan adı',
    de: 'Eigene Scan-Domain im Free-Plan',
    es: 'Dominio de escaneo personalizado en el plan gratuito',
  },
  'Custom scan domain on free tier': {
    tr: 'Ücretsiz katmanda özel tarama alan adı',
    de: 'Eigene Scan-Domain im Free-Tier',
    es: 'Dominio de escaneo personalizado en el nivel gratuito',
  },
  'Custom scan domains on free tier': {
    tr: 'Ücretsiz katmanda özel tarama alan adları',
    de: 'Eigene Scan-Domains im Free-Tier',
    es: 'Dominios de escaneo personalizados en el nivel gratuito',
  },
  'Free custom scan domain': {
    tr: 'Ücretsiz özel tarama alan adı',
    de: 'Kostenlose eigene Scan-Domain',
    es: 'Dominio de escaneo personalizado gratis',
  },
  'Dynamic codes with analytics': {
    tr: 'Analitikli dinamik kodlar',
    de: 'Dynamische Codes mit Analysen',
    es: 'Códigos dinámicos con analítica',
  },
  'Webhooks on all plans': {
    tr: 'Tüm planlarda webhook’lar',
    de: 'Webhooks in allen Plänen',
    es: 'Webhooks en todos los planes',
  },
  'Scan webhooks on all plans': {
    tr: 'Tüm planlarda tarama webhook’ları',
    de: 'Scan-Webhooks in allen Plänen',
    es: 'Webhooks de escaneo en todos los planes',
  },
  'Purpose-built dynamic QR platform': {
    tr: 'Dinamik QR için özel platform',
    de: 'Speziell für dynamische QR gebaut',
    es: 'Plataforma hecha para QR dinámico',
  },
  'Team workspaces': {
    tr: 'Ekip çalışma alanları',
    de: 'Team-Workspaces',
    es: 'Espacios de trabajo de equipo',
  },
  'Team workspaces and folders': {
    tr: 'Ekip çalışma alanları ve klasörler',
    de: 'Team-Workspaces und Ordner',
    es: 'Espacios de trabajo y carpetas',
  },
  'Team workspaces on all plans': {
    tr: 'Tüm planlarda ekip çalışma alanları',
    de: 'Team-Workspaces in allen Plänen',
    es: 'Espacios de trabajo en todos los planes',
  },
  'Pro from $9.99/mo': {
    tr: 'Pro $9.99/mo’dan başlar',
    de: 'Pro ab $9.99/mo',
    es: 'Pro desde $9.99/mo',
  },
};

const WEAKNESS_PHRASE_MAP: Record<string, LocaleMap> = {
  'Fewer free dynamic codes': {
    tr: 'Daha az ücretsiz dinamik kod',
    de: 'Weniger kostenlose dynamische Codes',
    es: 'Menos códigos dinámicos gratis',
  },
  'API on paid tiers': {
    tr: 'API ücretli paketlerde',
    de: 'API in kostenpflichtigen Tarifen',
    es: 'API en planes de pago',
  },
  'API on paid plans': {
    tr: 'API ücretli planlarda',
    de: 'API in kostenpflichtigen Plänen',
    es: 'API en planes de pago',
  },
  'Limited routing automation': {
    tr: 'Sınırlı yönlendirme otomasyonu',
    de: 'Begrenzte Routing-Automatisierung',
    es: 'Automatización de enrutado limitada',
  },
  'Limited developer API': {
    tr: 'Sınırlı geliştirici API’si',
    de: 'Begrenzte Entwickler-API',
    es: 'API para desarrolladores limitada',
  },
  'Limited free dynamic codes': {
    tr: 'Sınırlı ücretsiz dinamik kodlar',
    de: 'Begrenzte kostenlose dynamische Codes',
    es: 'Códigos dinámicos gratis limitados',
  },
  'Limited routing and automation': {
    tr: 'Sınırlı yönlendirme ve otomasyon',
    de: 'Begrenztes Routing und Automatisierung',
    es: 'Enrutado y automatización limitados',
  },
  'No bulk QR management': {
    tr: 'Toplu QR yönetimi yok',
    de: 'Kein Bulk-QR-Management',
    es: 'Sin gestión masiva de QR',
  },
  'Basic team features': {
    tr: 'Temel ekip özellikleri',
    de: 'Basis-Teamfunktionen',
    es: 'Funciones de equipo básicas',
  },
  'API access typically paid': {
    tr: 'API erişimi genelde ücretli',
    de: 'API-Zugang typischerweise kostenpflichtig',
    es: 'Acceso a la API normalmente de pago',
  },
  'Limited scan analytics depth': {
    tr: 'Sınırlı tarama analitiği derinliği',
    de: 'Begrenzte Scan-Analysetiefe',
    es: 'Profundidad limitada de analítica de escaneos',
  },
  'Less ops tooling for teams': {
    tr: 'Ekipler için daha az operasyon aracı',
    de: 'Weniger Ops-Tools für Teams',
    es: 'Menos herramientas de ops para equipos',
  },
  'Generator-first workflow': {
    tr: 'Önce oluşturucu iş akışı',
    de: 'Generator-first Workflow',
    es: 'Flujo centrado en el generador',
  },
  'Link-editor focus': {
    tr: 'Link düzenleyici odaklı',
    de: 'Fokus auf Link-Editor',
    es: 'Enfoque en editor de enlaces',
  },
};

const GENERIC_WINS: Record<'tr' | 'de' | 'es', string[]> = {
  tr: [
    'Ücretsiz planda cömert dinamik QR limiti',
    'Ücretsiz planda REST API',
    'İptal sonrası kodlar aktif kalır',
    'Pro uygun giriş fiyatı',
    'Baskı banner dışa aktarma yerleşik',
  ],
  de: [
    'Großzügige Free-Limits für dynamische QR-Codes',
    'REST-API im Free-Plan',
    'Codes bleiben nach Kündigung aktiv',
    'Günstiger Pro-Einstiegspreis',
    'Druckbanner-Export integriert',
  ],
  es: [
    'Límites generosos de QR dinámicos en el plan gratuito',
    'API REST en el plan gratuito',
    'Los códigos siguen activos tras cancelar',
    'Precio de entrada Pro asequible',
    'Exportación de banner para impresión integrada',
  ],
};

const GENERIC_WEAKNESSES: Record<'tr' | 'de' | 'es', string[]> = {
  tr: [
    'Ücretsiz dinamik kod limitleri daha sıkı olabilir',
    'API genelde ücretli paketlerde',
    'Gelişmiş yönlendirme üst paketlerde',
    'Çok lokasyonlu operasyon araçları sınırlı olabilir',
  ],
  de: [
    'Free-Limits für dynamische Codes können enger sein',
    'API oft nur in Paid-Tarifen',
    'Erweitertes Routing in höheren Tarifen',
    'Weniger Fokus auf Multi-Standort-Ops',
  ],
  es: [
    'Los límites de códigos dinámicos gratis pueden ser más estrictos',
    'La API suele estar en planes de pago',
    'El enrutado avanzado en planes superiores',
    'Menos enfoque en operaciones multiubicación',
  ],
};

/** Pure numbers, ranges, and prices stay as-is (pricing localized later in sanitize). */
function looksLikeNumericOrPrice(value: string): boolean {
  const v = value.trim();
  if (!v) return true;
  if (/^[\d.,~\-–—+×x\/\s]+$/i.test(v)) return true;
  if (/^\$[\d.,]+(\+|\/mo)?$/i.test(v)) return true;
  if (/^~?\$[\d.,]+(\+|\/mo)?$/i.test(v)) return true;
  if (/^\d+[–\-]\d+$/.test(v)) return true;
  return false;
}

export function localizeCompetitorFeature(feature: string, locale: Locale): string {
  if (locale === 'en') return feature;
  const mapped = FEATURE_MAP[feature];
  return mapped ? pick(locale, mapped) : feature;
}

export function localizeCompetitorCellValue(value: string, locale: Locale): string {
  if (locale === 'en') return value;
  if (looksLikeNumericOrPrice(value)) return value;
  const mapped = VALUE_MAP[value];
  return mapped ? pick(locale, mapped) : value;
}

function localizeBulletList(
  bullets: string[],
  locale: Locale,
  phraseMap: Record<string, LocaleMap>,
  generics: string[],
): string[] {
  const mapped = bullets.map((b) => {
    const hit = phraseMap[b];
    return hit ? pick(locale, hit) : null;
  });
  const hits = mapped.filter(Boolean).length;
  if (hits === bullets.length) return mapped as string[];

  const coverage = bullets.length === 0 ? 1 : hits / bullets.length;
  if (coverage >= 0.5) {
    let gi = 0;
    return mapped.map((m) => {
      if (m) return m;
      const fill = generics[gi % generics.length]!;
      gi += 1;
      return fill;
    });
  }

  const len = Math.max(3, Math.min(5, bullets.length || generics.length));
  return generics.slice(0, len);
}

function bodyTemplates(locale: Locale, topic: string): {
  title: string;
  metaDescription: string;
  headline: string;
  summary: string;
} {
  if (locale === 'tr') {
    return {
      title: `QRbanner vs alternatifler — ${topic}`,
      headline: `${topic} karşılaştırması: QRbanner`,
      summary: `QRbanner; cömert ücretsiz limitler, ücretsiz planda API ve iptal sonrası aktif kalan kodlar sunar — ${topic} kategorisindeki tipik alternatiflere kıyasla.`,
      metaDescription: `QRbanner’ı ${topic} kategorisindeki alternatiflerle karşılaştırın: ücretsiz limitler, API, iptal sonrası kodlar ve fiyatlandırma.`,
    };
  }
  if (locale === 'de') {
    return {
      title: `QRbanner vs Alternativen — ${topic}`,
      headline: `${topic}-Vergleich mit QRbanner`,
      summary: `QRbanner bietet großzügige Free-Limits, API im Free-Plan und Codes, die nach Kündigung aktiv bleiben — im Vergleich zu typischen Alternativen in der Kategorie ${topic}.`,
      metaDescription: `QRbanner mit Alternativen in der Kategorie ${topic} vergleichen: Free-Limits, API, Codes nach Kündigung und Preise.`,
    };
  }
  return {
    title: `QRbanner vs alternativas — ${topic}`,
    headline: `Comparativa de ${topic} con QRbanner`,
    summary: `QRbanner ofrece límites gratuitos generosos, API en el plan gratuito y códigos que siguen activos tras cancelar — frente a alternativas típicas en la categoría ${topic}.`,
    metaDescription: `Compara QRbanner con alternativas de ${topic}: límites gratis, API, códigos tras cancelar y precios.`,
  };
}

type BodyFields = {
  title: string;
  metaDescription: string;
  headline: string;
  summary: string;
};

/** Curated DE/ES/TR bodies for Ads sitelink / high-traffic /vs pages. */
const SLUG_BODY_OVERRIDES: Record<string, Partial<Record<'tr' | 'de' | 'es', BodyFields>>> = {
  'qr-tiger': {
    tr: {
      title: 'QRbanner vs QR TIGER — karşılaştırma',
      headline: 'QR TIGER alternatifi: daha cömert ücretsiz plan',
      summary:
        'QR TIGER popüler bir QR platformu. QRbanner ücretsiz planda daha fazla dinamik kod, REST API ve iptal sonrası aktif kalan kodlarla öne çıkar.',
      metaDescription:
        'QRbanner ve QR TIGER: ücretsiz limitler, API, iptal sonrası kodlar ve fiyat. Ekibiniz için doğru QR platformunu seçin.',
    },
    de: {
      title: 'QRbanner vs QR TIGER — Vergleich',
      headline: 'QR-TIGER-Alternative mit großzügigerem Free-Plan',
      summary:
        'QR TIGER ist eine bekannte Allround-QR-Plattform. QRbanner punktet mit mehr Free-Dynamik-Codes, REST-API im Free-Plan und Codes, die nach Kündigung aktiv bleiben.',
      metaDescription:
        'QRbanner und QR TIGER vergleichen: Free-Limits, API, Codes nach Kündigung und Preise. Welche QR-Plattform passt zu Ihrem Team?',
    },
    es: {
      title: 'QRbanner vs QR TIGER — comparativa',
      headline: 'Alternativa a QR TIGER con plan gratuito más generoso',
      summary:
        'QR TIGER es una plataforma QR popular. QRbanner destaca con más códigos dinámicos gratis, API REST en el plan gratuito y códigos que siguen activos tras cancelar.',
      metaDescription:
        'Compara QRbanner y QR TIGER: límites gratis, API, códigos tras cancelar y precios. Elige la plataforma QR para tu equipo.',
    },
  },
  scanova: {
    tr: {
      title: 'QRbanner vs Scanova — karşılaştırma',
      headline: 'Scanova alternatifi: self-serve dinamik QR',
      summary:
        'Scanova kurumsal odaklı olabilir. QRbanner self-serve ücretsiz plan, API ve baskı banner dışa aktarma ile hızlı başlamanızı sağlar.',
      metaDescription:
        'QRbanner ve Scanova karşılaştırması: fiyat, API, ücretsiz dinamik kodlar ve tarama analitiği.',
    },
    de: {
      title: 'QRbanner vs Scanova — Vergleich',
      headline: 'Scanova-Alternative für self-serve dynamische QR',
      summary:
        'Scanova kann enterprise-lastig sein. QRbanner startet self-serve mit Free-Plan, API und Druckbanner-Export — ohne langen Procurement-Zyklus.',
      metaDescription:
        'QRbanner und Scanova vergleichen: Preis, API, kostenlose dynamische Codes und Scan-Analysen.',
    },
    es: {
      title: 'QRbanner vs Scanova — comparativa',
      headline: 'Alternativa a Scanova para QR dinámico self-serve',
      summary:
        'Scanova puede orientarse a enterprise. QRbanner arranca self-serve con plan gratuito, API y exportación de banner de impresión.',
      metaDescription:
        'Compara QRbanner y Scanova: precio, API, códigos dinámicos gratis y analítica de escaneos.',
    },
  },
  bitly: {
    tr: {
      title: 'QRbanner vs Bitly — QR odaklı karşılaştırma',
      headline: 'Bitly QR alternatifi: dinamik kod + yönlendirme',
      summary:
        'Bitly kısaltma ve marka linkleriyle güçlüdür. QRbanner coğrafi/zaman yönlendirme, baskı export ve ücretsiz planda API ile QR operasyonuna odaklanır.',
      metaDescription:
        'QRbanner ve Bitly QR: dinamik kodlar, analitik, API ve yönlendirme özellikleri yan yana.',
    },
    de: {
      title: 'QRbanner vs Bitly — QR-fokussierter Vergleich',
      headline: 'Bitly-QR-Alternative mit Routing und Print-Export',
      summary:
        'Bitly ist stark bei Short Links. QRbanner fokussiert dynamische QR mit Geo-/Zeit-Routing, Druckexport und API im Free-Plan.',
      metaDescription:
        'QRbanner und Bitly QR vergleichen: dynamische Codes, Analysen, API und Routing-Funktionen.',
    },
    es: {
      title: 'QRbanner vs Bitly — comparativa centrada en QR',
      headline: 'Alternativa a Bitly QR con enrutado y exportación de impresión',
      summary:
        'Bitly destaca en acortado de enlaces. QRbanner se centra en QR dinámico con geovalla/horario, exportación de impresión y API en el plan gratuito.',
      metaDescription:
        'Compara QRbanner y Bitly QR: códigos dinámicos, analítica, API y funciones de enrutado.',
    },
  },
};

export function localizeCompetitorBody(
  page: CompetitorPage,
  locale: Locale,
  topic: string,
): CompetitorPage {
  if (locale === 'en') return page;

  const templates = bodyTemplates(locale, topic);
  const override =
    locale === 'tr' || locale === 'de' || locale === 'es'
      ? SLUG_BODY_OVERRIDES[page.slug]?.[locale]
      : undefined;
  const body = override ? { ...templates, ...override } : templates;
  const genericsKey = locale === 'tr' || locale === 'de' || locale === 'es' ? locale : 'de';
  const wins = localizeBulletList(
    page.qrbannerWins,
    locale,
    WIN_PHRASE_MAP,
    GENERIC_WINS[genericsKey],
  );
  const weaknesses = localizeBulletList(
    page.competitorWeaknesses,
    locale,
    WEAKNESS_PHRASE_MAP,
    GENERIC_WEAKNESSES[genericsKey],
  );

  return {
    ...page,
    title: body.title,
    metaDescription: body.metaDescription,
    headline: body.headline,
    summary: body.summary,
    qrbannerWins: wins,
    competitorWeaknesses: weaknesses,
    comparisonRows: page.comparisonRows.map((row) => ({
      feature: localizeCompetitorFeature(row.feature, locale),
      qrbanner: localizeCompetitorCellValue(row.qrbanner, locale),
      competitor: localizeCompetitorCellValue(row.competitor, locale),
    })),
  };
}
