import type { BlogPost } from '../../types';

export const logisticsQrCodesTr: BlogPost = {
  slug: 'logistics-warehouse-qr-codes',
  title: 'Lojistik ve Depo QR Kodları: Takip, Toplama Listeleri ve Güvenlik',
  description:
    'Depolar ve lojistik ekipleri toplama listeleri, rıhtım programları, güvenlik kontrol listeleri ve varlık takibi için dinamik QR kullanır — yeniden etiketlemeden SOP linklerini güncelleyin.',
  keywords: ['depo QR kodu', 'lojistik QR', 'toplama listesi QR', 'rıhtım QR kodu', 'tedarik zinciri QR'],
  publishedAt: '2026-06-29',
  updatedAt: '2026-06-29',
  readingMinutes: 7,
  author: 'QRbanner Team',
  category: 'Lojistik',
  sections: [
    {
      type: 'p',
      content:
        'Dağıtım merkezleri SOP’lar veya taşıyıcı portalları değiştiğinde kasaları ve rıhtım kapılarını yeniden etiketler. Koridor işaretleri ve palet etiketlerindeki dinamik QR, saha personelini en güncel kontrol listesi URL’sinde tutar.',
    },
    {
      type: 'h2',
      content: 'Saha kullanım senaryoları',
    },
    {
      type: 'ul',
      items: [
        'Rıhtım kapısı programları ve taşıyıcı teslim alma linkleri',
        'Ekipman istasyonlarında güvenlik kontrol listesi PDF’leri',
        'Mevsimlik SKU düzenleri için toplama yolu haritaları',
        'Paketleme istasyonlarında iade portalı QR',
      ],
    },
    {
      type: 'h2',
      content: 'Operasyon ipuçları',
    },
    {
      type: 'p',
      content:
        'Dahili SOP kodlarını şifreyle koruyun. Tarama oranlarını karşılaştırmak için vardiya başına toplu iş etiketleri kullanın. Tarama bir durum güncellemesi tetiklediğinde WMS’inizle webhook eşleştirin.',
    },
  ],
};
