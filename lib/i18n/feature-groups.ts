import { FEATURE_GROUPS } from '@/lib/site-content';
import { localizeMarketingNumbers } from './qr-type-count';
import type { Locale } from './types';
import type { SiteFeature } from '@/lib/site-content';

type GroupCopy = {
  title: string;
  description: string;
  features: { title: string; description: string }[];
};

const TAG_TR: Record<string, string> = {
  Differentiator: 'Fark',
  New: 'Yeni',
};

const TAG_DE: Record<string, string> = {
  Differentiator: 'Alleinstellung',
  New: 'Neu',
};

const TAG_ES: Record<string, string> = {
  Differentiator: 'Diferenciador',
  New: 'Nuevo',
};

const GROUPS_TR: GroupCopy[] = [
  {
    title: 'Oluştur & Tasarla',
    description: 'Baskı ve dijital için markalı QR kodlar.',
    features: [
      { title: 'Düzenlenebilir QR Kodları', description: 'QR\'ın işaret ettiği yeri istediğiniz zaman değiştirin — menü, poster veya ambalajı yeniden basmaya gerek yok.' },
      { title: 'QR Kodunuzu Markalayın', description: 'Özel renkler, nokta stilleri, çerçeveler ve logolar ile kodlarınız her temas noktasında markanıza uysun.' },
      { title: 'Ortada Logo', description: 'Logonuzu akıllı boyutlandırma ile ekleyin; baskı ve ambalajda tarama kolaylığı korunsun.' },
      { title: '26+ QR Tipi', description: 'Web sitesi, kartvizit, Wi‑Fi, menü, WhatsApp, Instagram, PDF, etkinlik, ödeme ve daha fazlası — hepsi tek yerde.' },
      { title: 'Baskı Banner Dışa Aktarma', description: 'QR, başlık ve marka renklerinizle baskıya hazır pazarlama posterleri indirin (PNG/PDF).' },
      { title: 'Tasarım Asistanı', description: 'QR tipinize uygun renk ve stil önerileri — kolay tarama için optimize.' },
      { title: 'Tarama Güvenilirlik Kontrolü', description: 'Basmadan önce tasarımınızın ne kadar taranabilir olduğunu görün — kontrast, boyut ve kamera önizlemesi.' },
      { title: 'AI Açılış Sayfası Metni', description: 'Açılış sayfası düzenleyicisinde başlık, alt başlık, CTA ve SEO metinlerini tek tıkla oluşturun.' },
    ],
  },
  {
    title: 'Akıllı Yönlendirme',
    description: 'Tarayıcıları otomatik olarak doğru yere gönderin.',
    features: [
      { title: 'Zamana Göre Program', description: 'Öğle menüsünü öğlen, akşam menüsünü gece gösterin — otomatik.' },
      { title: 'Konuma Göre Linkler', description: 'Farklı ülke veya şehirlerdeki ziyaretçileri doğru sayfaya yönlendirin.' },
      { title: 'Cihaz Yönlendirme', description: 'Uygulama indirme kampanyaları için ayrı iOS ve Android URL\'leri.' },
      { title: 'Açılış Sayfaları', description: 'Yönlendirmeden önce isteğe bağlı lead formu ile 5 mobil şablon — promosyon ve etkinlikler için ideal.' },
      { title: 'A/B Testi', description: 'İki açılış sayfası veya teklifi test edin, hangisinin daha çok tarama aldığını görün.' },
      { title: 'Kampanya Takibi', description: 'Hangi poster, el ilanı veya reklamın en çok taramayı getirdiğini Google Analytics\'te izleyin.' },
    ],
  },
  {
    title: 'Analitik & Pazarlama',
    description: 'Taramaları ölçün ve reklam yığınınıza bağlayın.',
    features: [
      { title: 'Gerçek Zamanlı Analitik', description: 'Toplam ve benzersiz taramalar, özel tarih aralıkları, cihaz, tarayıcı, işletim sistemi, ülke ve şehir dağılımları.' },
      { title: 'Coğrafi İçgörüler', description: 'Ülke ve şehir grafikleri ile son tarama günlüğüyle kodların nerede performans gösterdiğini görün.' },
      { title: 'GA4 & Meta Pixel', description: 'Tarama, açılış sayfası ve CTA tıklamalarında Google Analytics 4 ve Facebook Pixel olayları tetikleyin.' },
      { title: 'Tarama Bildirimleri', description: 'İlk tarama, kilometre taşları (10, 50, 100…) veya her taramada e-posta uyarıları.' },
      { title: 'CSV Dışa Aktarma', description: 'Panel ve QR başına analitik sayfalarından özet raporları dışa aktarın.' },
      { title: 'Lead Yakalama', description: 'Açılış sayfalarında ad, e-posta, telefon ve mesaj toplayın. Gönderimleri QR analitiğinde görün.' },
      { title: 'Tarama Webhook\'ları', description: 'Her taramada HMAC imzalı HTTP POST bildirimleri — Zapier, Slack veya CRM\'inize bağlayın.' },
      { title: 'NFC Etiket Desteği', description: 'NFC etiketlerini aynı dinamik URL ile programlayın. Taramalar analitikte ayrı NFC olarak izlenir.' },
      { title: 'GPS Isı Haritası', description: 'Taramada isteğe bağlı tarayıcı konumu ve IP yedeklemesi — tarama kümelerini haritada görselleştirin.' },
      { title: 'Açılış Sayfası CTA Analitiği', description: 'Tarama açılış sayfalarındaki buton tıklamalarını izleyin — taramadan aksiyona dönüşümü ölçün.' },
    ],
  },
  {
    title: 'Platform & Ölçek',
    description: 'Ekipler, ajanslar ve geliştiriciler için araçlar.',
    features: [
      { title: 'Toplu CSV İçe Aktarma', description: 'Elektronik tablodan tek seferde 100\'e kadar QR kodu oluşturun — mağazalar, menüler, etkinlikler.' },
      { title: 'Klasörler & Etiketler', description: 'Kodları renkli klasörlerde düzenleyin ve panelde özel etiketlere göre filtreleyin.' },
      { title: 'REST API v1', description: 'API anahtarlarıyla QR kodları ve klasörleri programatik yönetin. Bearer veya X-API-Key kimlik doğrulama.' },
      { title: 'Marka Stil Şablonları', description: 'QR nokta stilleri, renkler ve çerçeveleri kampanyalar arasında kaydedin ve yeniden kullanın.' },
      { title: 'Özel Tarama Alan Adları', description: 'DNS ile alan adınızı doğrulayın ve taramaları markanızın URL\'si üzerinden sunun (ör. go.markaniz.com).' },
      { title: 'Ekip Çalışma Alanları', description: 'Ekip alanları oluşturun, rollü üyeler davet edin (sahip, admin, editör, görüntüleyici) ve birlikte çalışın.' },
      { title: 'SSO & SAML', description: 'Google veya Microsoft Azure AD ile giriş. Business çalışma alanları SSO zorunluluğu ve SAML (Okta, Azure AD vb.) yapılandırabilir.' },
      { title: 'Erişim Kontrolleri', description: 'Şifre korumalı QR\'lar, isteğe bağlı son kullanma tarihleri ve kapalı kampanyalar için tarama limitleri.' },
      { title: 'İstediğiniz Zaman Düzenleyin', description: 'Basılı QR görselini değiştirmeden içerik, stil, yönlendirme kuralları ve pikselleri güncelleyin.' },
      { title: 'İki Faktörlü Kimlik Doğrulama', description: 'TOTP kimlik doğrulayıcı uygulamalarıyla hesabınızı koruyun — Google Authenticator, 1Password ve daha fazlası.' },
      { title: 'OpenAPI & Webhook Günlükleri', description: 'REST API v1 için OpenAPI 3.0 belgesini indirin ve Ayarlar\'da webhook teslimat geçmişini inceleyin.' },
    ],
  },
];

const GROUPS_DE: GroupCopy[] = [
  {
    title: 'Erstellen & Gestalten',
    description: 'Marken-QR-Codes bereit für Druck und Digital.',
    features: [
      { title: 'Editierbare QR-Codes', description: 'Ändern Sie jederzeit das Ziel Ihres QR-Codes — Menüs, Poster oder Verpackungen müssen nicht neu gedruckt werden.' },
      { title: 'QR-Code branden', description: 'Eigene Farben, Punktstile, Rahmen und Logos — Ihre Codes passen an jedem Touchpoint zur Marke.' },
      { title: 'Logo in der Mitte', description: 'Logo mit smarter Größenanpassung einfügen, damit Codes auf Druck und Verpackung gut scannbar bleiben.' },
      { title: '26+ QR-Typen', description: 'Website, Visitenkarte, WLAN, Speisekarte, WhatsApp, Instagram, PDF, Events, Zahlungen und mehr — alles an einem Ort.' },
      { title: 'Druck-Banner-Export', description: 'Druckfertige Marketingposter mit QR, Headline und Markenfarben herunterladen (PNG/PDF).' },
      { title: 'Design-Assistent', description: 'Farb- und Stilvorschläge passend zu Ihrem QR-Typ — optimiert für einfache Scans.' },
      { title: 'Scan-Zuverlässigkeitscheck', description: 'Prüfen Sie vor dem Druck, wie gut Ihr Design scannbar ist — Kontrast, Größe und Kamera-Vorschau.' },
      { title: 'KI-Landingpage-Texte', description: 'Titel, Untertitel, CTA und SEO-Metadaten im Landingpage-Editor mit einem Klick erzeugen.' },
    ],
  },
  {
    title: 'Intelligentes Routing',
    description: 'Scans automatisch an den richtigen Ort leiten.',
    features: [
      { title: 'Zeitplanung', description: 'Mittagskarte mittags, Abendkarte nachts — automatisch.' },
      { title: 'Standortbasierte Links', description: 'Besucher aus verschiedenen Ländern oder Städten zur richtigen Seite leiten.' },
      { title: 'Geräte-Routing', description: 'Separate iOS- und Android-URLs für App-Download- und Store-Kampagnen.' },
      { title: 'Landingpages', description: 'Fünf mobile Vorlagen mit optionalem Lead-Formular vor dem Redirect — ideal für Promos und Events.' },
      { title: 'A/B-Tests', description: 'Zwei Landingpages oder Angebote testen und sehen, welches mehr Scans erhält.' },
      { title: 'Kampagnen-Tracking', description: 'In Google Analytics nachverfolgen, welche Poster, Flyer oder Anzeigen die meisten Scans brachten.' },
    ],
  },
  {
    title: 'Analysen & Marketing',
    description: 'Scans messen und mit Ihrem Ad-Stack verbinden.',
    features: [
      { title: 'Echtzeit-Analysen', description: 'Gesamt- und Unique-Scans, benutzerdefinierte Zeiträume, Gerät, Browser, OS, Land- und Stadtaufschlüsselung.' },
      { title: 'Geografische Insights', description: 'Mit Land- und Stadtcharts sowie aktuellem Scan-Log sehen, wo Codes performen.' },
      { title: 'GA4 & Meta Pixel', description: 'Google Analytics 4- und Facebook-Pixel-Events bei Scan, Landingpage und CTA-Klicks auslösen.' },
      { title: 'Scan-Benachrichtigungen', description: 'E-Mail-Alerts beim ersten Scan, bei Meilensteinen (10, 50, 100…) oder bei jedem Scan.' },
      { title: 'CSV-Export', description: 'Analyse-Zusammenfassungen vom Dashboard und von QR-Analytics-Seiten exportieren.' },
      { title: 'Lead-Erfassung', description: 'Name, E-Mail, Telefon und Nachricht auf Landingpages erfassen. Einsendungen in der QR-Analyse einsehen.' },
      { title: 'Scan-Webhooks', description: 'HTTP-POST-Benachrichtigungen bei jedem Scan mit HMAC-Signatur — Zapier, Slack oder CRM anbinden.' },
      { title: 'NFC-Tag-Unterstützung', description: 'NFC-Tags mit derselben dynamischen URL programmieren. Scans werden in der Analyse separat als NFC erfasst.' },
      { title: 'GPS-Heatmap', description: 'Optionale Browser-Geolokalisierung beim Scan plus IP-Fallback — Scan-Cluster auf der Karte visualisieren.' },
      { title: 'Landing-CTA-Analysen', description: 'Button-Klicks auf Scan-Landingpages tracken — Conversion von Scan zu Aktion messen.' },
    ],
  },
  {
    title: 'Plattform & Skalierung',
    description: 'Tools für Teams, Agenturen und Entwickler.',
    features: [
      { title: 'CSV-Massenimport', description: 'Bis zu 100 QR-Codes pro Import aus einer Tabelle erstellen — Stores, Menüs, Events im großen Stil.' },
      { title: 'Ordner & Labels', description: 'Codes in farbigen Ordnern organisieren und im Dashboard nach eigenen Labels filtern.' },
      { title: 'REST API v1', description: 'QR-Codes und Ordner programmatisch mit API-Keys verwalten. Bearer- oder X-API-Key-Auth.' },
      { title: 'Marken-Stilvorlagen', description: 'QR-Punktstile, Farben und Rahmen speichern und kampagnenübergreifend wiederverwenden.' },
      { title: 'Eigene Scan-Domains', description: 'Domain per DNS verifizieren und Scans über Ihre Marken-URL ausliefern (z. B. go.marke.com).' },
      { title: 'Team-Workspaces', description: 'Team-Workspaces anlegen, Mitglieder mit Rollen (Owner, Admin, Editor, Viewer) einladen und gemeinsam arbeiten.' },
      { title: 'SSO & SAML', description: 'Mit Google oder Microsoft Azure AD anmelden. Business-Workspaces können SSO erzwingen und SAML (Okta, Azure AD usw.) konfigurieren.' },
      { title: 'Zugriffskontrollen', description: 'Passwortgeschützte QRs, optionale Ablaufdaten und Scan-Limits für geschützte Kampagnen.' },
      { title: 'Jederzeit bearbeiten', description: 'Inhalt, Stil, Routing-Regeln und Pixel aktualisieren, ohne das gedruckte QR-Bild zu ändern.' },
      { title: 'Zwei-Faktor-Authentifizierung', description: 'Konto mit TOTP-Authenticator-Apps schützen — Google Authenticator, 1Password und mehr.' },
      { title: 'OpenAPI & Webhook-Logs', description: 'OpenAPI-3.0-Spezifikation für REST API v1 herunterladen und Webhook-Zustellungshistorie in den Einstellungen prüfen.' },
    ],
  },
];

const GROUPS_ES: GroupCopy[] = [
  {
    title: 'Crear y diseñar',
    description: 'Códigos QR de marca listos para impresión y digital.',
    features: [
      { title: 'Códigos QR editables', description: 'Cambia el destino del QR cuando quieras — sin reimprimir menús, carteles o envases.' },
      { title: 'Personaliza tu QR', description: 'Colores, estilos de puntos, marcos y logos para que tus códigos coincidan con tu marca en cada punto de contacto.' },
      { title: 'Logo en el centro', description: 'Añade tu logo con tamaño inteligente para que sigan siendo fáciles de escanear en impresión y packaging.' },
      { title: 'Más de 26 tipos de QR', description: 'Web, tarjeta de visita, Wi‑Fi, menú, WhatsApp, Instagram, PDF, eventos, pagos y más — todo en un solo lugar.' },
      { title: 'Exportación de banners', description: 'Descarga pósters de marketing listos para imprimir con tu QR, titular y colores de marca (PNG/PDF).' },
      { title: 'Asistente de diseño', description: 'Sugerencias de color y estilo según el tipo de QR — optimizadas para un escaneo fácil.' },
      { title: 'Comprobación de escaneo', description: 'Comprueba antes de imprimir lo escaneable que es tu diseño — contraste, tamaño y vista previa de cámara.' },
      { title: 'Copy de landing con IA', description: 'Genera títulos, subtítulos, CTA y metadatos SEO en el editor de landing con un clic.' },
    ],
  },
  {
    title: 'Enrutado inteligente',
    description: 'Envía a los escáneres al lugar correcto automáticamente.',
    features: [
      { title: 'Programación por hora', description: 'Muestra el menú de mediodía al mediodía y el de noche por la noche — automáticamente.' },
      { title: 'Enlaces por ubicación', description: 'Dirige a visitantes de distintos países o ciudades a la página correcta.' },
      { title: 'Enrutado por dispositivo', description: 'URLs separadas de iOS y Android para campañas de descarga de apps y tiendas.' },
      { title: 'Páginas de aterrizaje', description: 'Cinco plantillas móviles con formulario de leads opcional antes de redirigir — ideal para promos y eventos.' },
      { title: 'Pruebas A/B', description: 'Prueba dos landings u ofertas y ve cuál recibe más escaneos.' },
      { title: 'Seguimiento de campañas', description: 'Controla en Google Analytics qué carteles, folletos o anuncios generaron más escaneos.' },
    ],
  },
  {
    title: 'Analítica y marketing',
    description: 'Mide escaneos y conéctalos a tu stack publicitario.',
    features: [
      { title: 'Analítica en tiempo real', description: 'Escaneos totales y únicos, rangos de fechas, dispositivo, navegador, SO, país y ciudad.' },
      { title: 'Insights geográficos', description: 'Ve dónde rinden los códigos con gráficos de país y ciudad más el registro de escaneos recientes.' },
      { title: 'GA4 y Meta Pixel', description: 'Dispara eventos de Google Analytics 4 y Facebook Pixel en escaneo, landing y clics de CTA.' },
      { title: 'Notificaciones de escaneo', description: 'Alertas por email en el primer escaneo, hitos (10, 50, 100…) o en cada escaneo si lo eliges.' },
      { title: 'Exportación CSV', description: 'Exporta resúmenes de analítica desde el panel y las páginas de analítica por QR.' },
      { title: 'Captura de leads', description: 'Recoge nombre, email, teléfono y mensaje en landings. Ver envíos en la analítica del QR.' },
      { title: 'Webhooks de escaneo', description: 'Notificaciones HTTP POST en cada escaneo con firma HMAC — conecta Zapier, Slack o tu CRM.' },
      { title: 'Soporte de etiquetas NFC', description: 'Programa etiquetas NFC con la misma URL dinámica. Los escaneos se rastrean aparte como NFC en analítica.' },
      { title: 'Mapa de calor GPS', description: 'Geolocalización opcional del navegador en el escaneo más respaldo por IP — visualiza clústeres en el mapa.' },
      { title: 'Analítica de CTA de landing', description: 'Rastrea clics de botones en landings de escaneo — mide la conversión de escaneo a acción.' },
    ],
  },
  {
    title: 'Plataforma y escala',
    description: 'Herramientas para equipos, agencias y desarrolladores.',
    features: [
      { title: 'Importación masiva CSV', description: 'Crea hasta 100 códigos QR por importación desde una hoja de cálculo — tiendas, menús, eventos.' },
      { title: 'Carpetas y etiquetas', description: 'Organiza códigos en carpetas de color y filtra por etiquetas personalizadas en el panel.' },
      { title: 'REST API v1', description: 'Gestiona códigos QR y carpetas de forma programática con claves API. Auth Bearer o X-API-Key.' },
      { title: 'Plantillas de estilo de marca', description: 'Guarda y reutiliza estilos de puntos, colores y marcos entre campañas.' },
      { title: 'Dominios de escaneo personalizados', description: 'Verifica tu dominio por DNS y sirve escaneos desde la URL de tu marca (p. ej. go.tumarca.com).' },
      { title: 'Espacios de equipo', description: 'Crea workspaces, invita miembros con roles (propietario, admin, editor, visor) y colabora.' },
      { title: 'SSO y SAML', description: 'Inicia sesión con Google o Microsoft Azure AD. Los workspaces Business pueden exigir SSO y configurar SAML (Okta, Azure AD, etc.).' },
      { title: 'Controles de acceso', description: 'QR protegidos con contraseña, fechas de caducidad opcionales y límites de escaneo para campañas cerradas.' },
      { title: 'Edita en cualquier momento', description: 'Actualiza contenido, estilo, reglas de enrutado y píxeles sin cambiar la imagen QR impresa.' },
      { title: 'Autenticación en dos factores', description: 'Protege tu cuenta con apps TOTP — Google Authenticator, 1Password y más.' },
      { title: 'OpenAPI y logs de webhooks', description: 'Descarga la especificación OpenAPI 3.0 de la REST API v1 e inspecciona el historial de entrega de webhooks en Ajustes.' },
    ],
  },
];

function groupsFor(locale: Locale): GroupCopy[] | undefined {
  if (locale === 'tr') return GROUPS_TR;
  if (locale === 'de') return GROUPS_DE;
  if (locale === 'es') return GROUPS_ES;
  return undefined;
}

function tagFor(locale: Locale, tag: string | undefined): string | undefined {
  if (!tag) return undefined;
  if (locale === 'tr') return TAG_TR[tag] ?? tag;
  if (locale === 'de') return TAG_DE[tag] ?? tag;
  if (locale === 'es') return TAG_ES[tag] ?? tag;
  return tag;
}

export function getFeatureGroups(locale: Locale) {
  const localized = groupsFor(locale);
  return FEATURE_GROUPS.map((group, gi) => {
    const copy = localized?.[gi];
    return {
      title: copy?.title ?? group.title,
      description: copy?.description ?? group.description,
      features: group.features.map((feature, fi) => {
        const featureCopy = copy?.features[fi];
        const title = featureCopy?.title ?? feature.title;
        const description = featureCopy?.description ?? feature.description;
        return {
          ...feature,
          title: localizeMarketingNumbers(title, locale),
          description: localizeMarketingNumbers(description, locale),
          tag: tagFor(locale, feature.tag),
        } satisfies SiteFeature;
      }),
    };
  });
}
