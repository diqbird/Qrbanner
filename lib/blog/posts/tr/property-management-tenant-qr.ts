import type { BlogPost } from '../../types';

export const propertyManagementTenantQrTr: BlogPost = {
  slug: 'property-management-tenant-qr',
  title: 'Site Yönetimi QR: Kiracı Portalları, Bakım ve Kira Belgeleri',
  description:
    'Site yöneticileri kiracı portalları, bakım talepleri ve kira PDF’leri için lobi tabelaları ve daire postalarında dinamik QR’ı yeniden basmadan nasıl kullanıyor.',
  keywords: ['site yönetimi QR', 'kiracı portal QR', 'apartman QR kodu', 'bakım talep QR', 'kira belgesi QR'],
  publishedAt: '2026-06-29',
  updatedAt: '2026-06-29',
  readingMinutes: 6,
  author: 'QRbanner Team',
  category: 'Emlak',
  sections: [
    {
      type: 'p',
      content:
        'Site yöneticileri QR’ı lobi posterlerine, asansör tabelalarına ve karşılama paketlerine bir kez basar. Dinamik linkler politikalar veya tedarikçiler değiştiğinde kiracı portallarını, bakım formlarını ve olanak rehberlerini güncel tutar.',
    },
    {
      type: 'h2',
      content: 'QR kodları nereye koymalı',
    },
    {
      type: 'ul',
      items: [
        'Lobi masa ve asansör katı tabelaları',
        'Taşınma karşılama paketleri ve daire postaları',
        'Olanak odası kuralları ve otopark izinleri',
        'Personel için bakım dolabı talimatları',
      ],
    },
    {
      type: 'h2',
      content: 'Bina başına analitik',
    },
    {
      type: 'p',
      content:
        'Mülk başına kod oluşturun ve portföyleri klasörlerde gruplayın. Politika e-postaları sonrası ile lobi tabelası sonrası tarama zirvelerini karşılaştırın. Sahiplik raporlaması için CSV dışa aktarın.',
    },
  ],
};
