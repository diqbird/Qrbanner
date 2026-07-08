import type { BlogPost } from '../../types';

export const bulkQrGuideTr: BlogPost = {
  slug: 'bulk-qr-codes-csv-import',
  title: 'Toplu QR Kodlar: Çok Lokasyonlu Yayınlar İçin CSV İçe Aktarma',
  description:
    'Elektronik tablodan yüzlerce dinamik QR kodu oluşturun — perakende zincirleri, etkinlikler ve ürün ambalajları için ideal. CSV formatı, adlandırma ve QA kontrol listesi.',
  keywords: ['toplu QR kod', 'CSV QR içe aktarma', 'toplu QR oluşturucu', 'perakende QR yayını', 'QR toplu işlem'],
  publishedAt: '2026-06-22',
  updatedAt: '2026-06-29',
  readingMinutes: 6,
  author: 'QRbanner Team',
  category: 'Operasyon',
  sections: [
    {
      type: 'p',
      content:
        'Onlarca mağaza veya SKU’da QR’ı elle kurmak yavaş ve hataya açıktır. QRbanner toplu içe aktarma CSV okur, tek seferde dinamik kodlar oluşturur ve kampanya olarak filtreleyebilmeniz için paylaşılan bir toplu iş kimliği atar.',
    },
    {
      type: 'h2',
      content: 'CSV sütunları',
    },
    {
      type: 'ul',
      items: [
        'name — panelde görünen etiket (ör. “Mağaza 042 – Giriş”).',
        'category — url, menu, vcard, wifi vb.',
        'content — hedef URL veya kategoriye özel yük.',
        'İsteğe bağlı: klasör, etiketler, satır başına UTM etiketleri.',
      ],
    },
    {
      type: 'h2',
      content: 'Ön uçuş kontrol listesi',
    },
    {
      type: 'ul',
      items: [
        'İçe aktarmadan önce URL’lerin HTTP 200 döndürdüğünü doğrulayın.',
        'Raporlama için tutarlı adlandırma kullanın.',
        'Baskı tedarikçiniz için kısa kodlu sonuç CSV’sini dışa aktarın.',
        'İçe aktarmadan sonra iOS ve Android’de rastgele 5 kodu spot kontrol edin.',
      ],
    },
    {
      type: 'h2',
      content: 'İçe aktarmadan sonra',
    },
    {
      type: 'p',
      content:
        'Tüm toplu işi görmek için panel kampanya filtresini açın. Baskıya hazır PNG/SVG dışa aktarımları için paylaşılan stil şablonu uygulayın. Plan limitleri satır sayısını sınırlar — büyük yayınlardan önce yükseltin.',
    },
  ],
};
