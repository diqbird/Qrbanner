import type { BlogPost } from '../../types';

export const pharmacyQrCodesTr: BlogPost = {
  slug: 'pharmacy-retail-qr-codes',
  title: 'Eczane ve Sağlık Perakendesi QR Kodları: Ürün Bilgisi ve Hizmetler',
  description:
    'Eczaneler ve sağlık perakendecileri ürün broşürleri, reçete yenileme linkleri, grip aşısı randevusu ve sağlık programları için QR kullanır — uyumlu ve kolay güncellenir.',
  keywords: ['eczane QR kodu', 'sağlık perakende QR', 'eczane QR', 'reçete QR', 'sağlık programı QR'],
  publishedAt: '2026-06-29',
  updatedAt: '2026-06-29',
  readingMinutes: 6,
  author: 'QRbanner Team',
  category: 'Sağlık',
  sections: [
    {
      type: 'p',
      content:
        'Sağlık perakendecileri düzenlemeler veya envanter değiştiğinde ürün bilgisi ve hizmet linklerini doğru tutmalıdır. Raf etiketlerindeki statik QR, PDF’ler süresi dolduğunda uyum riski oluşturur.',
    },
    {
      type: 'h2',
      content: 'Yaygın eczane kullanım senaryoları',
    },
    {
      type: 'ul',
      items: [
        'Dozaj ve etkileşim PDF’li reçetesiz ürün detay sayfaları',
        'Reçete yenileme portalları (personel alanları için şifre korumalı kodlar)',
        'Grip aşısı ve aşı randevu rezervasyonu',
        'Kasa tezgahlarında sağlık programı kayıtları',
        'Mağaza bölgesine göre çok dilli hasta eğitimi',
      ],
    },
    {
      type: 'h2',
      content: 'Uyum ipuçları',
    },
    {
      type: 'p',
      content:
        'Yalnızca personele özel operasyonel linkler için şifre koruması kullanın. Tıbbi PDF’leri güncellerken kampanya notlarında değişiklik günlüğü tutun. Denetçiler için net “son güncelleme” tarihli HTTPS açılış sayfalarını tercih edin.',
    },
  ],
};
