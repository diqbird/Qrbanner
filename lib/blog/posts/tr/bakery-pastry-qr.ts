import type { BlogPost } from '../../types';

export const bakeryPastryQrTr: BlogPost = {
  slug: 'bakery-pastry-qr',
  title: 'Fırın QR: Günlük Özel Ürünler, Ön Sipariş ve Sadakat',
  description:
    'Fırınlar ve pastaneler tezgah tabelaları ve torba etiketlerinde günlük özel ürünler, ön sipariş ve sadakat kaydı için dinamik QR’ı nasıl kullanıyor.',
  keywords: ['fırın QR kodu', 'pastane QR', 'fırın sadakat QR', 'ön sipariş QR', 'ikram QR'],
  publishedAt: '2026-06-29',
  updatedAt: '2026-06-29',
  readingMinutes: 6,
  author: 'QRbanner Team',
  category: 'Yiyecek & İçecek',
  sections: [
    {
      type: 'p',
      content:
        'Fırınlar QR’ı vitrin tabelalarına, torba etiketlerine ve vitrin çıkartmalarına koyar. Müşteriler tezgah tabelasını yeniden basmadan günlük özel ürünleri görür, ön sipariş verir ve sadakat programına katılır.',
    },
    {
      type: 'h2',
      content: 'Tezgah ve torba temas noktaları',
    },
    {
      type: 'ul',
      items: [
        'Vitrin günlük özel ürün tabelaları',
        'Tatil ön sipariş formları',
        'İkram talep açılış sayfaları',
        'Kasa standlarında sadakat kaydı',
      ],
    },
    {
      type: 'h2',
      content: 'Çok lokasyonlu fırınlar',
    },
    {
      type: 'p',
      content:
        'Günlük özel ürün URL’lerini her sabah merkezden güncelleyin. Lokasyon başına klasörler hangi mağazaların en çok ön sipariş taraması getirdiğini gösterir.',
    },
  ],
};
