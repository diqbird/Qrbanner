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
      'Unlike many competitors, QRbanner is designed so your dynamic codes can keep working on the Free plan after you downgrade or cancel, within plan limits.',
  },
  {
    question: 'Which analytics are included?',
    answer:
      'Track total and unique scans, custom date ranges, country, city, device, browser and OS breakdowns, GPS heatmaps, A/B variant stats and NFC vs QR source. Export CSV reports from the dashboard.',
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
      'Yes. Sign in with Google or Microsoft Azure AD. Team workspaces can enforce SSO for members.',
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
      'Birçok rakipten farklı olarak QRbanner, plan limitleri dahilinde iptal veya düşürme sonrası dinamik kodlarınızın Ücretsiz planda çalışmaya devam etmesi için tasarlanmıştır.',
  },
  {
    question: 'Hangi analitikler dahil?',
    answer:
      'Toplam ve benzersiz taramalar, özel tarih aralıkları, ülke, şehir, cihaz, tarayıcı ve işletim sistemi dağılımları, GPS ısı haritaları, A/B varyant istatistikleri ve NFC vs QR kaynağı. Panelden CSV raporları dışa aktarın.',
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
      'Evet. Google veya Microsoft Azure AD ile giriş yapın. Ekip çalışma alanları üyeler için SSO zorunluluğu uygulayabilir.',
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

export function getFaqItems(locale: Locale): FaqItem[] {
  return locale === 'tr' ? FAQ_TR : FAQ_EN;
}
