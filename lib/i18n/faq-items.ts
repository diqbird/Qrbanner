import type { Locale } from './types';

export interface FaqItem {
  question: string;
  answer: string;
}

const FAQ_EN: FaqItem[] = [
  {
    question: 'What is a dynamic QR code?',
    answer:
      'A dynamic QR code points to a short link you control. You can change the destination URL, routing rules and analytics without reprinting the QR image.',
  },
  {
    question: 'Does QRbanner support geofencing?',
    answer:
      'Yes. You can route scanners to different URLs based on country and optional city, detected from IP. Combine with time-based and device rules.',
  },
  {
    question: 'Can I use my own domain for scan links?',
    answer:
      'Yes. Add a custom subdomain, verify DNS records and serve scans from your brand URL while managing codes in the QRbanner dashboard.',
  },
  {
    question: 'Is there a REST API?',
    answer:
      'Yes. QRbanner offers a v1 REST API to create and manage QR codes and folders. Generate an API key in Settings.',
  },
  {
    question: 'What happens to my QR codes if I cancel?',
    answer:
      'QRbanner is designed so your dynamic codes can keep working on the Free plan after you downgrade or cancel, within plan limits — your printed codes are not held hostage.',
  },
  {
    question: 'Which analytics are included?',
    answer:
      'Track total and unique scans, custom date ranges, country, city, device, browser and OS breakdowns, GPS heatmaps, A/B variant stats, NFC vs QR source, and landing page CTA click-through rates. Export CSV reports from the dashboard.',
  },
  {
    question: 'Can I bulk-create QR codes?',
    answer:
      'Yes. Upload a CSV to create many QR codes at once — ideal for stores, events and multi-location campaigns.',
  },
  {
    question: 'Do you support GA4 and Meta Pixel?',
    answer:
      'Yes. Attach Google Analytics 4 and Meta Pixel IDs to fire scan and CTA events on landing pages and redirects.',
  },
  {
    question: 'Can I receive webhooks when a QR is scanned?',
    answer:
      'Yes. Add webhook endpoints in Settings. Each scan sends a signed JSON payload you can connect to Zapier, Slack or your CRM.',
  },
  {
    question: 'Can landing pages collect leads?',
    answer:
      'Yes. Enable lead capture on any landing page to collect name, email, phone or message before redirecting visitors.',
  },
  {
    question: 'Does QRbanner support A/B testing?',
    answer:
      'Yes. Split traffic between multiple destination URLs with weighted variants, sticky cookies and per-variant analytics.',
  },
  {
    question: 'Can my team collaborate on QR codes?',
    answer:
      'Yes. Create team workspaces, invite members by email and assign roles. Switch workspaces from Settings.',
  },
  {
    question: 'Do you support SSO?',
    answer:
      'Yes. Sign in with Google or Microsoft Azure AD. Business workspaces can enforce SSO and configure SAML (Okta, Azure AD, etc.) with allowed email domains.',
  },
  {
    question: 'Is two-factor authentication available?',
    answer:
      'Yes. Enable TOTP authenticator apps (Google Authenticator, 1Password, etc.) in Settings for an extra layer of account security.',
  },
  {
    question: 'Can AI help write landing page copy?',
    answer:
      'Yes. In the landing page editor, use Generate with AI to draft titles, subtitles, CTA labels and SEO metadata. Requires an OpenAI API key on the server (optional).',
  },
  {
    question: 'Does QRbanner support NFC tags?',
    answer:
      'Yes. Program NFC tags with the same dynamic URL. Scans are tracked separately as NFC in analytics.',
  },
  {
    question: 'How do I contact support?',
    answer:
      'Email us at support@qrbanner.com for help with your account, billing, QR codes or technical issues. We typically respond within one business day.',
  },
];

const FAQ_TR: FaqItem[] = [
  {
    question: 'Dinamik QR kodu nedir?',
    answer:
      'Dinamik QR kodu, sizin kontrol ettiğiniz kısa bir linke yönlendirir. Hedef URL, yönlendirme kuralları ve analitiği QR görselini yeniden basmadan değiştirebilirsiniz.',
  },
  {
    question: 'QRbanner coğrafi sınır (geofencing) destekliyor mu?',
    answer:
      'Evet. IP üzerinden ülke ve isteğe bağlı şehre göre tarayıcıları farklı URL\'lere yönlendirebilirsiniz. Zaman ve cihaz kurallarıyla birleştirin.',
  },
  {
    question: 'Tarama linkleri için kendi alan adımı kullanabilir miyim?',
    answer:
      'Evet. Özel alt alan adı ekleyin, DNS kayıtlarını doğrulayın ve kodları QRbanner panelinden yönetirken taramaları markanızın URL\'si üzerinden sunun.',
  },
  {
    question: 'REST API var mı?',
    answer:
      'Evet. QRbanner, QR kodları ve klasörleri oluşturmak ve yönetmek için v1 REST API sunar. Ayarlar\'dan API anahtarı oluşturun.',
  },
  {
    question: 'İptal edersem QR kodlarıma ne olur?',
    answer:
      'QRbanner, plan limitleri dahilinde iptal veya düşürme sonrası dinamik kodlarınızın Ücretsiz planda çalışmaya devam etmesi için tasarlanmıştır — basılı kodlarınız rehin alınmaz.',
  },
  {
    question: 'Hangi analitikler dahil?',
    answer:
      'Toplam ve benzersiz taramalar, özel tarih aralıkları, ülke, şehir, cihaz, tarayıcı ve işletim sistemi dağılımları, GPS ısı haritaları, A/B varyant istatistikleri, NFC vs QR kaynağı ve açılış sayfası CTA tıklama oranları. Panelden CSV raporları dışa aktarın.',
  },
  {
    question: 'Toplu QR kodu oluşturabilir miyim?',
    answer:
      'Evet. CSV yükleyerek çok sayıda QR kodu oluşturun — mağazalar, etkinlikler ve çok lokasyonlu kampanyalar için ideal.',
  },
  {
    question: 'GA4 ve Meta Pixel destekleniyor mu?',
    answer:
      'Evet. Google Analytics 4 ve Meta Pixel ID\'lerini ekleyerek açılış sayfalarında ve yönlendirmelerde tarama ve CTA olaylarını tetikleyin.',
  },
  {
    question: 'QR tarandığında webhook alabilir miyim?',
    answer:
      'Evet. Ayarlar\'dan webhook uç noktaları ekleyin. Her tarama, Zapier, Slack veya CRM\'inize bağlayabileceğiniz imzalı bir JSON gönderir.',
  },
  {
    question: 'Açılış sayfaları lead toplayabilir mi?',
    answer:
      'Evet. Herhangi bir açılış sayfasında lead yakalamayı etkinleştirerek ziyaretçileri yönlendirmeden önce ad, e-posta, telefon veya mesaj toplayın.',
  },
  {
    question: 'QRbanner A/B testi destekliyor mu?',
    answer:
      'Evet. Ağırlıklı varyantlar, yapışkan çerezler ve varyant başına analitik ile trafiği birden fazla hedef URL arasında bölün.',
  },
  {
    question: 'Ekibim QR kodlarında işbirliği yapabilir mi?',
    answer:
      'Evet. Ekip çalışma alanları oluşturun, e-posta ile üye davet edin ve roller atayın. Ayarlar\'dan çalışma alanı değiştirin.',
  },
  {
    question: 'SSO destekleniyor mu?',
    answer:
      'Evet. Google veya Microsoft Azure AD ile giriş yapın. Business çalışma alanları SSO zorunluluğu ve SAML (Okta, Azure AD vb.) ile izinli e-posta alan adları yapılandırabilir.',
  },
  {
    question: 'İki faktörlü kimlik doğrulama var mı?',
    answer:
      'Evet. Ayarlar\'dan TOTP kimlik doğrulayıcı uygulamalarını (Google Authenticator, 1Password vb.) etkinleştirerek ekstra hesap güvenliği sağlayın.',
  },
  {
    question: 'AI açılış sayfası metni yazabilir mi?',
    answer:
      'Evet. Açılış sayfası düzenleyicisinde AI ile oluştur ile başlık, alt başlık, CTA ve SEO metinleri üretin. Sunucuda OpenAI API anahtarı gerektirir (isteğe bağlı).',
  },
  {
    question: 'QRbanner NFC etiketlerini destekliyor mu?',
    answer:
      'Evet. NFC etiketlerini aynı dinamik URL ile programlayın. Taramalar analitikte ayrı olarak NFC olarak izlenir.',
  },
  {
    question: 'Destek ile nasıl iletişime geçerim?',
    answer:
      'Hesap, faturalama, QR kodları veya teknik konularda support@qrbanner.com adresine yazın. Genellikle bir iş günü içinde yanıt veriyoruz.',
  },
];

const FAQ_DE: FaqItem[] = [
  {
    question: 'Was ist ein dynamischer QR-Code?',
    answer:
      'Ein dynamischer QR-Code verweist auf einen von Ihnen kontrollierten Kurzlink. Sie können Ziel-URL, Routing-Regeln und Analysen ändern, ohne den QR-Code neu zu drucken.',
  },
  {
    question: 'Unterstützt QRbanner Geofencing?',
    answer:
      'Ja. Sie können Scanner nach Land und optional Stadt (per IP) auf unterschiedliche URLs leiten. Kombinieren Sie mit zeit- und gerätebasierten Regeln.',
  },
  {
    question: 'Kann ich meine eigene Domain für Scan-Links nutzen?',
    answer:
      'Ja. Subdomain hinzufügen, DNS verifizieren und Scans über Ihre Marken-URL ausliefern — Codes im QRbanner-Dashboard verwalten.',
  },
  {
    question: 'Gibt es eine REST-API?',
    answer:
      'Ja. QRbanner bietet eine v1 REST-API zum Erstellen und Verwalten von QR-Codes und Ordnern. API-Key unter Einstellungen erzeugen.',
  },
  {
    question: 'Was passiert mit meinen QR-Codes bei Kündigung?',
    answer:
      'QRbanner ist so konzipiert, dass dynamische Codes nach Downgrade oder Kündigung im Free-Plan weiter funktionieren können — innerhalb der Planlimits. Gedruckte Codes werden nicht blockiert.',
  },
  {
    question: 'Welche Analysen sind enthalten?',
    answer:
      'Gesamt- und Unique-Scans, Datumsbereiche, Land, Stadt, Gerät, Browser und OS, GPS-Heatmaps, A/B-Varianten, NFC vs. QR, Landingpage-CTA-Raten. CSV-Export aus dem Dashboard.',
  },
  {
    question: 'Kann ich QR-Codes in Bulk erstellen?',
    answer:
      'Ja. CSV hochladen und viele QR-Codes auf einmal erstellen — ideal für Filialen, Events und Multi-Location-Kampagnen.',
  },
  {
    question: 'Unterstützt ihr GA4 und Meta Pixel?',
    answer:
      'Ja. Google Analytics 4 und Meta Pixel IDs anbinden, um Scan- und CTA-Events auf Landingpages und Redirects auszulösen.',
  },
  {
    question: 'Kann ich Webhooks bei Scans erhalten?',
    answer:
      'Ja. Webhook-Endpunkte unter Einstellungen hinzufügen. Jeder Scan sendet signiertes JSON für Zapier, Slack oder Ihr CRM.',
  },
  {
    question: 'Können Landingpages Leads erfassen?',
    answer:
      'Ja. Lead-Erfassung auf Landingpages aktivieren — Name, E-Mail, Telefon oder Nachricht vor der Weiterleitung.',
  },
  {
    question: 'Unterstützt QRbanner A/B-Tests?',
    answer:
      'Ja. Traffic zwischen mehreren Ziel-URLs mit gewichteten Varianten, Sticky Cookies und Analysen pro Variante aufteilen.',
  },
  {
    question: 'Kann mein Team an QR-Codes zusammenarbeiten?',
    answer:
      'Ja. Team-Workspaces erstellen, Mitglieder per E-Mail einladen und Rollen zuweisen. Workspace unter Einstellungen wechseln.',
  },
  {
    question: 'Unterstützt ihr SSO?',
    answer:
      'Ja. Anmeldung mit Google oder Microsoft Azure AD. Business-Workspaces können SSO erzwingen und SAML (Okta, Azure AD usw.) mit erlaubten E-Mail-Domains konfigurieren.',
  },
  {
    question: 'Ist Zwei-Faktor-Authentifizierung verfügbar?',
    answer:
      'Ja. TOTP-Authenticator-Apps (Google Authenticator, 1Password usw.) unter Einstellungen für zusätzliche Kontosicherheit aktivieren.',
  },
  {
    question: 'Kann KI Landingpage-Texte schreiben?',
    answer:
      'Ja. Im Landingpage-Editor „Mit KI generieren“ für Titel, Untertitel, CTAs und SEO-Metadaten. Optional OpenAI API-Key auf dem Server.',
  },
  {
    question: 'Unterstützt QRbanner NFC-Tags?',
    answer:
      'Ja. NFC-Tags mit derselben dynamischen URL programmieren. Scans werden in Analysen separat als NFC erfasst.',
  },
  {
    question: 'Wie kontaktiere ich den Support?',
    answer:
      'E-Mail an support@qrbanner.com bei Fragen zu Konto, Abrechnung, QR-Codes oder Technik. Antwort in der Regel innerhalb eines Werktags.',
  },
];

const FAQ_ES: FaqItem[] = [
  {
    question: '¿Qué es un código QR dinámico?',
    answer:
      'Un código QR dinámico apunta a un enlace corto que usted controla. Puede cambiar la URL de destino, reglas de enrutamiento y analíticas sin volver a imprimir el código.',
  },
  {
    question: '¿QRbanner admite geovallas?',
    answer:
      'Sí. Puede enrutar escaneos a distintas URLs según país y ciudad opcional (por IP). Combínelo con reglas por horario y dispositivo.',
  },
  {
    question: '¿Puedo usar mi propio dominio para enlaces de escaneo?',
    answer:
      'Sí. Añada un subdominio, verifique DNS y sirva escaneos desde su URL de marca mientras gestiona los códigos en el panel de QRbanner.',
  },
  {
    question: '¿Hay API REST?',
    answer:
      'Sí. QRbanner ofrece API REST v1 para crear y gestionar códigos QR y carpetas. Genere una clave API en Ajustes.',
  },
  {
    question: '¿Qué pasa con mis códigos QR si cancelo?',
    answer:
      'QRbanner está diseñado para que los códigos dinámicos sigan funcionando en el plan Free tras cancelar o bajar de plan, dentro de los límites — sus códigos impresos no quedan bloqueados.',
  },
  {
    question: '¿Qué analíticas incluye?',
    answer:
      'Escaneos totales y únicos, rangos de fechas, país, ciudad, dispositivo, navegador y SO, mapas de calor GPS, variantes A/B, NFC vs QR y tasas de clic en CTA. Exporte CSV desde el panel.',
  },
  {
    question: '¿Puedo crear códigos QR en masa?',
    answer:
      'Sí. Suba un CSV para crear muchos códigos a la vez — ideal para tiendas, eventos y campañas multilocal.',
  },
  {
    question: '¿Admiten GA4 y Meta Pixel?',
    answer:
      'Sí. Conecte IDs de Google Analytics 4 y Meta Pixel para disparar eventos de escaneo y CTA en landing pages y redirecciones.',
  },
  {
    question: '¿Puedo recibir webhooks al escanear?',
    answer:
      'Sí. Añada endpoints en Ajustes. Cada escaneo envía JSON firmado para Zapier, Slack o su CRM.',
  },
  {
    question: '¿Las landing pages capturan leads?',
    answer:
      'Sí. Active captura de leads para recoger nombre, email, teléfono o mensaje antes de redirigir.',
  },
  {
    question: '¿QRbanner admite pruebas A/B?',
    answer:
      'Sí. Divida tráfico entre varias URLs con variantes ponderadas, cookies persistentes y analíticas por variante.',
  },
  {
    question: '¿Mi equipo puede colaborar en códigos QR?',
    answer:
      'Sí. Cree workspaces de equipo, invite miembros por email y asigne roles. Cambie de workspace en Ajustes.',
  },
  {
    question: '¿Admiten SSO?',
    answer:
      'Sí. Inicio con Google o Microsoft Azure AD. Workspaces Business pueden exigir SSO y configurar SAML (Okta, Azure AD, etc.).',
  },
  {
    question: '¿Hay autenticación de dos factores?',
    answer:
      'Sí. Active apps TOTP (Google Authenticator, 1Password, etc.) en Ajustes para mayor seguridad.',
  },
  {
    question: '¿La IA puede escribir textos de landing?',
    answer:
      'Sí. En el editor de landing use Generar con IA para títulos, subtítulos, CTAs y metadatos SEO. Requiere clave OpenAI opcional en el servidor.',
  },
  {
    question: '¿QRbanner admite etiquetas NFC?',
    answer:
      'Sí. Programe etiquetas NFC con la misma URL dinámica. Los escaneos se registran por separado como NFC en analíticas.',
  },
  {
    question: '¿Cómo contacto con soporte?',
    answer:
      'Escriba a support@qrbanner.com para cuenta, facturación, códigos QR o temas técnicos. Respondemos normalmente en un día laborable.',
  },
];

export function getFaqItems(locale: Locale): FaqItem[] {
  if (locale === 'tr') return FAQ_TR;
  if (locale === 'de') return FAQ_DE;
  if (locale === 'es') return FAQ_ES;
  return FAQ_EN;
}
