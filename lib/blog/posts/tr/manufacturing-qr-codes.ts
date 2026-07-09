import type { BlogPost } from '../../types';

export const manufacturingQrCodesTr: BlogPost = {
  slug: 'manufacturing-qr-codes',
  title: 'Üretim QR Kodları: İş Talimatları, Varlıklar ve Kalite Kontrolleri',
  description:
    'Fabrikalar makineler, iş emirleri ve kalite istasyonlarında dinamik QR kullanır — ekipmanı yeniden etiketlemeden SOP PDF’lerini ve denetim formlarını güncelleyin.',
  keywords: ['üretim QR kodu', 'fabrika QR', 'iş talimatı QR', 'varlık etiketi QR', 'kalite kontrol QR'],
  publishedAt: '2026-06-29',
  updatedAt: '2026-06-29',
  readingMinutes: 7,
  author: 'QRbanner Team',
  category: 'Üretim',
  sections: [
    {
      type: 'p',
      content:
        'Tesisler SOP’ları sık günceller ama makine etiketleri yıllarca kalır. Ekipman etiketleri ve istasyon panolarındaki dinamik QR, teknisyenleri en güncel iş talimatı URL’sinde tutar.',
    },
    {
      type: 'h2',
      content: 'Üretim sahası yerleşimleri',
    },
    {
      type: 'ul',
      items: [
        'CNC ve montaj istasyonu SOP linkleri',
        'Önleyici bakım kontrol listeleri',
        'Yedek parça sipariş portalları',
        'Kimyasal bölgeye göre güvenlik bilgi formları (SDS)',
      ],
    },
    {
      type: 'h2',
      content: 'Yönetişim',
    },
    {
      type: 'p',
      content:
        'Dahili kodları şifreyle koruyun. Açılış sayfalarında revizyon tarihlerini kaydedin. Eğitim yayınlarından sonra tarama benimsenmesini karşılaştırmak için üretim hattı başına toplu iş etiketleri kullanın.',
    },
  ],
};
