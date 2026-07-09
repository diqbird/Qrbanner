import type { BlogPost } from '../../types';

export const logisticsWarehouseQrTr: BlogPost = {
  slug: 'logistics-warehouse-qr-tracking',
  title: 'Depo ve Lojistik QR: Rıhtım Durumu, Güvenlik Formları ve Sürücü Self-Servis',
  description:
    '3PL ve depo ekipleri canlı sevkiyat durumu, güvenlik kontrol listeleri ve sürücü talimatları için rıhtım kapılarında dinamik QR’ı nasıl kullanıyor.',
  keywords: ['depo QR kodu', 'lojistik QR takip', 'rıhtım QR', '3PL QR kodu'],
  publishedAt: '2026-06-29',
  updatedAt: '2026-06-29',
  readingMinutes: 6,
  author: 'QRbanner Team',
  category: 'Lojistik',
  sections: [
    {
      type: 'p',
      content:
        'Çıkış noktasında basılan palet etiketleri bir sonraki hub’daki bekletme, yeniden yönlendirme veya güvenlik güncellemelerini yansıtamaz. Rıhtım kapıları ve hazırlık şeritlerindeki dinamik QR, sürücülere ve saha personeline canlı talimatlar için tek tarama sunar.',
    },
    {
      type: 'h2',
      content: 'WMS’inize bağlayın',
    },
    {
      type: 'ul',
      items: [
        'Toplu işler değiştiğinde bekletme/serbest bırakma URL’lerini panelden güncelleyin',
        'Webhook’lar tarama olaylarını depo veya TMS araçlarına aktarır',
        'Hassas sevkiyat detayları için şifre korumalı kodlar',
        'Çok sahalı rıhtım yayınları için toplu CSV',
      ],
    },
    {
      type: 'h2',
      content: 'Güvenlik ve uyum',
    },
    {
      type: 'p',
      content:
        'Aynı dayanıklı QR’ı günlük güvenlik kontrol listelerine ve SDS formlarına bağlayın. Prosedürler değiştiğinde PDF URL’sini bir kez güncelleyin — rıhtım tabelası yerinde kalır.',
    },
  ],
};
