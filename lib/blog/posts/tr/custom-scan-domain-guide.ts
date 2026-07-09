import type { BlogPost } from '../../types';

export const customScanDomainGuideTr: BlogPost = {
  slug: 'custom-scan-domain-setup-guide',
  title: 'Özel Tarama Alan Adları: QR Linklerinizi scan.markaniz.com ile Markalayın',
  description:
    'Menüler, ambalaj ve kampanyalarda markalı kısa linkler için özel tarama alt alan adını QRbanner’a nasıl yönlendireceğiniz — ücretsiz planda dahil.',
  keywords: ['özel QR alan adı', 'markalı QR link', 'tarama alt alan adı', 'beyaz etiket QR URL', 'QRbanner alan adı'],
  publishedAt: '2026-06-29',
  updatedAt: '2026-06-29',
  readingMinutes: 6,
  author: 'QRbanner Team',
  category: 'Rehberler',
  sections: [
    {
      type: 'p',
      content:
        'Varsayılan kısa linkler her yerde çalışır, ancak markalar ambalaj ve menülerde scan.markaniz.com tercih eder. QRbanner ücretsiz planda özel tarama alan adı eklemenizi sağlar — ziyaretçiler her yönlendirmede sizin ana bilgisayar adınızı görür.',
    },
    {
      type: 'h2',
      content: 'Kurulum kontrol listesi',
    },
    {
      type: 'ul',
      items: [
        'Bir alt alan adı seçin (ör. scan.acme.com veya qr.acme.com)',
        'QRbanner’ın verdiği CNAME kaydını DNS’inize ekleyin',
        'Alan adını Ayarlar → Özel alan adları’nda doğrulayın',
        'Mevcut dinamik kodlar otomatik olarak markalı ana bilgisayarı kullanır',
      ],
    },
    {
      type: 'h2',
      content: 'Ajans ipucu',
    },
    {
      type: 'p',
      content:
        'Ajanslar Business ve Agency planlarda müşteri başına bir alan adı ekler. Tam beyaz etiket teslimat için açılış sayfalarında gizli powered-by markalamasıyla birleştirin.',
    },
  ],
};
