import type { BlogPost } from '../../types';

export const recruitmentHiringQrTr: BlogPost = {
  slug: 'recruitment-hiring-qr',
  title: 'İşe Alım QR: İş İlanları, Başvuru Linkleri ve Kariyer Fuarları',
  description:
    'İşe alımcılar ve personel firmaları açık pozisyonlar ve mobil başvurular için kariyer posterleri ve iş fuarı çadırlarında dinamik QR’ı nasıl kullanıyor.',
  keywords: ['işe alım QR kodu', 'işe alım QR', 'iş fuarı QR', 'personel ajansı QR', 'kariyer QR'],
  publishedAt: '2026-06-29',
  updatedAt: '2026-06-29',
  readingMinutes: 6,
  author: 'QRbanner Team',
  category: 'Profesyonel Hizmetler',
  sections: [
    {
      type: 'p',
      content:
        'İşe alımcılar QR’ı ofis lobi tabelalarına, iş fuarı çadırlarına ve vitrin işe alım posterlerine koyar. Adaylar güncelliğini yitirmiş basılı ilanlar olmadan açık pozisyonları görür ve telefonlarından başvurur.',
    },
    {
      type: 'h2',
      content: 'Kariyer ve iş fuarı yerleşimleri',
    },
    {
      type: 'ul',
      items: [
        'Ofis lobi kariyer tabelaları',
        'İş fuarı stand çadırları ve brandalar',
        'Vitrin işe alıyoruz tabelaları',
        'Kişisel başvuru linkli işe alımcı kartvizitleri',
      ],
    },
    {
      type: 'h2',
      content: 'ATS’inize bağlayın',
    },
    {
      type: 'p',
      content:
        'Webhook’lar başvuru olaylarını ATS’inize aktarır. Hangi işe alımcıların ve etkinliklerin en nitelikli adayları getirdiğini izleyin.',
    },
  ],
};
