import type { BlogPost } from '../../types';

export const referralProgramGuideTr: BlogPost = {
  slug: 'qrbanner-referral-program-guide',
  title: 'QRbanner Referans Programı: Link Paylaşın, Kayıtları Takip Edin, Ödül Talep Edin',
  description:
    'QRbanner referans programı nasıl çalışır — kişisel linkler, ?ref= ile OAuth ve e-posta kayıtları, kilometre taşı avantajları ve 5 referansta Pro deneme kredisi.',
  keywords: ['QRbanner referans', 'QR referans programı', 'SaaS referans linki', 'dinamik QR affiliate'],
  publishedAt: '2026-06-29',
  updatedAt: '2026-06-29',
  readingMinutes: 5,
  author: 'QRbanner Team',
  category: 'Ürün',
  sections: [
    {
      type: 'p',
      content:
        'Her QRbanner hesabı Ayarlar → Referans programı’nda kişisel bir referans linki içerir. Meslektaşlarınız, müşterileriniz veya kitlenizle paylaşın — ?ref=KODUNUZ kullanan kayıtlar istatistiklerinize sayılır.',
    },
    {
      type: 'h2',
      content: 'E-posta ve OAuth kayıtları',
    },
    {
      type: 'ul',
      items: [
        'E-posta kaydı: /signup’a ?ref=KOD ekleyin — kod kayıtta saklanır.',
        'Google, GitHub veya Microsoft: aynı ?ref= linki kısa ömürlü bir çerez ayarlar; böylece OAuth kayıtları da size kredi yazar.',
        'Referanslar yeni hesap başına bir kereliktir — yinelenen kayıtlar sayıları şişirmez.',
      ],
    },
    {
      type: 'h2',
      content: 'Kilometre taşları ve Pro deneme kredisi',
    },
    {
      type: 'p',
      content:
        '1, 3, 5 ve 10 doğrulanmış kayıtta ilerlemeyi takip edin. Beş referansta ücretsiz Pro plan yükseltmesi talep edebilirsiniz. On kayıtta ajans ortakları partner incelemesine hak kazanabilir.',
    },
    {
      type: 'h2',
      content: 'Ajanslar için ipuçları',
    },
    {
      type: 'p',
      content:
        'Müşterilere sunum yaparken referans linkinizi vaka çalışmaları ve ROI hesaplayıcısıyla eşleştirin. Business ve Agency planlardaki beyaz etiketli açılış sayfaları teslimatı profesyonel kılar; referanslar hesap avantajlarınızı büyütür.',
    },
  ],
};
