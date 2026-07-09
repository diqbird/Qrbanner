import type { BlogPost } from '../../types';

export const landingCtaAnalyticsGuideTr: BlogPost = {
  slug: 'landing-page-cta-analytics-guide',
  title: 'Açılış Sayfası CTA Analitiği: Tarama-Tıklama Dönüşümünü Ölçün',
  description:
    'Ham tarama sayıları hikayenin yalnızca yarısını anlatır. Menü, kupon ve uygulama kurulumlarını optimize etmek için QRbanner’ın açılış sayfası buton tıklamalarını nasıl izlediğini öğrenin.',
  keywords: ['QR CTA analitiği', 'açılış sayfası dönüşümü', 'QR pazarlama ROI', 'buton tıklama takibi'],
  publishedAt: '2026-07-01',
  updatedAt: '2026-07-01',
  readingMinutes: 6,
  author: 'QRbanner Team',
  category: 'Analitik',
  sections: [
    {
      type: 'p',
      content:
        'Bir restoran QR’ı haftada 500 tarama alabilir — ama kaç misafir gerçekten “Menüyü gör” veya “Sipariş ver”e dokundu? QRbanner, markalı açılış sayfalarında tarama olaylarını CTA tıklamalarından ayırır.',
    },
    {
      type: 'h2',
      content: 'İzlenecek metrikler',
    },
    {
      type: 'ul',
      items: [
        'QR kodu başına CTA tıklama oranı (tıklama ÷ tarama).',
        'A/B yönlendirme açıksa varyantları karşılaştırın.',
        'Aşağı akış geliri için GA4 veya Meta Pixel ile eşleştirin.',
      ],
    },
    {
      type: 'h2',
      content: 'Veriyi nerede bulursunuz',
    },
    {
      type: 'p',
      content:
        'Herhangi bir QR → Analitik’i açın. Açılış CTA paneli toplam tıklamaları, benzersiz tıklayanları ve son olayları gösterir. Kampanya raporları için ülke, cihaz ve zaman dağılımlarının yanında CSV dışa aktarın.',
    },
    {
      type: 'h2',
      content: 'Optimizasyon rehberi',
    },
    {
      type: 'ul',
      items: [
        'Daha kısa CTA etiketlerini test edin (“Sipariş” vs “Online sipariş için dokunun”).',
        'Güven için vurgu renklerini basılı tabelanızla eşleştirin.',
        'Düşük CTR’li kodları taşıyın veya QR görselini yeniden basmadan açılış metnini yenileyin.',
      ],
    },
  ],
};
