import type { BlogPost } from '../../types';

export const restaurantMenuQrTr: BlogPost = {
  slug: 'restaurant-menu-qr-codes',
  title: 'Restoran Menü QR Kodları: Kurulum, Tasarım ve En İyi Uygulamalar (2026)',
  description:
    'Kağıt menüleri dinamik QR kodlarla nasıl değiştirirsiniz — yerleşim ipuçları, boyutlandırma, hijyen dostu tasarım ve yeniden basmadan yemek güncelleme.',
  keywords: ['restoran menü QR', 'dijital menü QR', 'QR kod menü', 'otelcilik QR', 'masa tentesi QR'],
  publishedAt: '2026-06-10',
  updatedAt: '2026-06-29',
  readingMinutes: 7,
  author: 'QRbanner Team',
  category: 'Otelcilik',
  sections: [
    {
      type: 'p',
      content:
        'Kağıt menüler yeniden basmak pahalıdır ve fiyat veya alerjen değiştiğinde yavaş güncellenir. Her masadaki dinamik menü QR kodu, misafirlerin tek taramayla her zaman en güncel PDF veya web menünüzü görmesini sağlar — hangi lokasyonların en çok tarama aldığını da izlersiniz.',
    },
    {
      type: 'h2',
      content: 'Neden statik değil dinamik menü QR?',
    },
    {
      type: 'ul',
      items: [
        'Yazdırdıktan sonra menü URL’sini veya PDF’ini değiştirin — yeni etiket gerekmez.',
        'Masa, gün dilimi veya kampanyaya göre tarama sayılarını görün.',
        'Menü açılmadan önce markalı bir açılış sayfası ekleyin.',
        'Zamanlama kurallarıyla öğle ve akşam menülerini yönlendirin.',
      ],
    },
    {
      type: 'h2',
      content: 'Yerleşim ve boyutlandırma',
    },
    {
      type: 'p',
      content:
        'Kodları masa tentelerinde, hesap sunucularında veya vitrin çıkartmalarında göz hizasında yerleştirin. Minimum baskı boyutu sessiz bölge payıyla yaklaşık 2×2 cm’dir. Yüksek kontrast kullanın (açık zemin üzerinde koyu kod) ve restoran aydınlatmanızda 30–50 cm mesafeden taramayı test edin.',
    },
    {
      type: 'h2',
      content: 'Dönüşüm sağlayan içerik',
    },
    {
      type: 'p',
      content:
        'Açılış sayfanızda kısa bir başlık (“Bu akşamın menüsü”) ve tek net bir buton kullanın. Son menüyü mobil öncelikli tutun: büyük dokunma alanları, alerjen ikonları ve hızlı yüklenen görseller. Mevsimlik ürünleri QRbanner panelinden saniyeler içinde güncelleyin.',
    },
    {
      type: 'faq',
      faq: [
        {
          question: 'Her masa için tek QR kullanabilir miyim?',
          answer:
            'Evet. Tek dinamik kod her yerde çalışır. Salon veya teras bazında ayrıntılı analitik istiyorsanız lokasyon başına ayrı kod kullanın.',
        },
        {
          question: 'Wi‑Fi zayıfsa ne olur?',
          answer:
            'Menüleri hızlı bir CDN veya hafif HTML sayfasında barındırın. Aynı QR hedefinde indirilebilir PDF yedek olarak sunun.',
        },
      ],
    },
  ],
};
