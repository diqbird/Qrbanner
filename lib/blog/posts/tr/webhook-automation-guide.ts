import type { BlogPost } from '../../types';

export const webhookAutomationGuideTr: BlogPost = {
  slug: 'qr-scan-webhook-automation-guide',
  title: 'QR Tarama Webhook’ları: Her Taramadan Slack, Sheets ve CRM Otomasyonu',
  description:
    'QRbanner HMAC imzalı webhook’larına adım adım rehber — taramaları Zapier, Slack, Google Sheets, HubSpot ve özel backend’lere bağlayın.',
  keywords: ['QR webhook', 'QR tarama otomasyonu', 'Zapier QR kodu', 'QRbanner webhook', 'tarama API'],
  publishedAt: '2026-06-29',
  updatedAt: '2026-06-29',
  readingMinutes: 7,
  author: 'QRbanner Team',
  category: 'Geliştiriciler',
  sections: [
    {
      type: 'p',
      content:
        'Her tarama QR kimliği, zaman damgası, cihaz ve coğrafi alanlar içeren imzalı bir webhook yükü tetikleyebilir. Ekipler bunu Slack kanallarını uyarmak, Google Sheets satırları eklemek veya CRM lead’lerini gerçek zamanlı güncellemek için kullanır.',
    },
    {
      type: 'h2',
      content: 'Üç adımda kurulum',
    },
    {
      type: 'ul',
      items: [
        'Ayarlar → Webhook’lar → Uç nokta ekleyin ve imzalama gizli anahtarını kopyalayın',
        'Sunucunuzda HMAC imzalarını doğrulayın veya Zapier Catch Hook kullanın',
        'Alanları eyleminize eşleyin — Slack mesajı, Sheet satırı veya CRM güncellemesi',
      ],
    },
    {
      type: 'h2',
      content: 'Zapier ve kodsuz',
    },
    {
      type: 'p',
      content:
        'Görsel bir yürüyüş için /integrations/zapier sayfasına bakın. Özel uygulamalar için webhook’ları /developers adresindeki REST API belgelerimizle eşleştirin.',
    },
    {
      type: 'h2',
      content: 'Teslimat günlükleri ve hata ayıklama',
    },
    {
      type: 'p',
      content:
        'Ayarlar → Tarama Webhook’ları, HTTP durum kodlarıyla son teslimat denemelerini gösterir. Taramaların yığınınıza ulaşıp ulaşmadığını tahmin etmeden Zapier veya özel uç noktaları ayıklamak için bunu kullanın.',
    },
    {
      type: 'h2',
      content: 'Güvenilirlik ipuçları',
    },
    {
      type: 'p',
      content:
        'Hızlıca 2xx döndürün ve asenkron işleyin. Başarısız teslimatları üstel geri çekilmeyle yeniden deneriz. Yüksek trafikli kodlarda gürültüyü azaltmak için webhook’ları QR veya kampanya başına filtreleyin.',
    },
  ],
};
