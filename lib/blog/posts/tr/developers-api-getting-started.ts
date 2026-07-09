import type { BlogPost } from '../../types';

export const developersApiGettingStartedTr: BlogPost = {
  slug: 'developers-api-getting-started',
  title: 'QRbanner REST API v1: 10 Dakikada Başlangıç',
  description:
    'İlk API anahtarınızı oluşturun, QR kodları listeleyin ve HMAC imzalı tarama webhook’ları alın — QR operasyonlarını otomatikleştiren geliştiriciler için hızlı başlangıç.',
  keywords: ['QR kod API', 'QRbanner API', 'dinamik QR API', 'QR webhook', 'QR otomasyon'],
  publishedAt: '2026-06-29',
  updatedAt: '2026-06-29',
  readingMinutes: 7,
  author: 'QRbanner Team',
  category: 'Geliştiriciler',
  sections: [
    {
      type: 'p',
      content:
        'QRbanner REST API v1, script’ler, backend’ler ve CI hatlarından QR kodları oluşturmanıza, güncellemenize ve düzenlemenize olanak tanır. API anahtarları ücretsiz planda kullanılabilir — satış görüşmesi gerekmez.',
    },
    {
      type: 'h2',
      content: 'API anahtarı oluşturun',
    },
    {
      type: 'ul',
      items: [
        'Giriş yapın ve Panel → Ayarlar → API Anahtarları’nı açın',
        'Açıklayıcı bir adla anahtar oluşturun (ör. “Production backend”)',
        'Anahtarı bir kez kopyalayın — yalnızca oluşturma anında gösterilir',
        'Her istekte Authorization: Bearer veya X-API-Key olarak gönderin',
      ],
    },
    {
      type: 'h2',
      content: 'İlk QR kodunuzu oluşturun',
    },
    {
      type: 'p',
      content:
        'name, category ve qr_data içeren JSON gövdesiyle POST /api/v1/qr gönderin. URL kodları { "url": "https://..." } gerektirir. Yanıt short_code ve tarama URL’sini içerir.',
    },
    {
      type: 'h2',
      content: 'Tarama webhook’larını alın',
    },
    {
      type: 'p',
      content:
        'Ayarlar → Tarama Webhook’ları altında bir HTTPS uç noktası ekleyin. Her tarama event, qr_code_id ve tarama meta verisiyle JSON POST eder. Webhook gizli anahtarınızla HMAC-SHA256 kullanarak X-QRbanner-Signature’ı doğrulayın. Aynı panelde teslimat geçmişini inceleyin.',
    },
    {
      type: 'h2',
      content: 'OpenAPI spesifikasyonu',
    },
    {
      type: 'p',
      content:
        'Postman, Insomnia veya API gateway’inize REST API v1’i içe aktarmak için /developers veya /api/openapi.json adresinden openapi.json indirin — QR, klasör ve webhook şemalarını içerir.',
    },
  ],
};
