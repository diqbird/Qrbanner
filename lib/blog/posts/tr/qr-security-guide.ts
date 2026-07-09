import type { BlogPost } from '../../types';

export const qrSecurityGuideTr: BlogPost = {
  slug: 'qr-code-security-best-practices',
  title: 'QR Kod Güvenliği: Markanızı ve Kullanıcılarınızı Koruyun',
  description:
    'QR phishing gerçektir. Dinamik QR kampanyalarını şifre koruması, alan adı güveni, link izleme ve personel eğitimiyle nasıl güvence altına alacağınızı öğrenin.',
  keywords: ['QR kod güvenliği', 'QR phishing', 'güvenli QR kodlar', 'dinamik QR güvenliği', 'QR dolandırıcılık'],
  publishedAt: '2026-06-18',
  updatedAt: '2026-06-29',
  readingMinutes: 6,
  author: 'QRbanner Team',
  category: 'Güvenlik',
  sections: [
    {
      type: 'p',
      content:
        'Saldırganlar meşru QR’ların üzerine kötü amaçlı çıkartmalar yapıştırabilir. İşletmeler, müdahale edilmesi zor ve müşterilerin güvenmesi kolay kampanyalar tasarlamalıdır.',
    },
    {
      type: 'h2',
      content: 'Kontrol ettiğiniz dinamik yönlendirmeleri kullanın',
    },
    {
      type: 'p',
      content:
        'Kendi alan adınızdaki (veya QRbanner’ın doğrulanmış yönlendirmesindeki) kısa linkler, bir ortak URL’si ele geçirilirse hedefleri değiştirmenizi sağlar. Ham URL’lerle basılan statik kodlar yeniden basmadan iptal edilemez.',
    },
    {
      type: 'h2',
      content: 'Yüksek riskli akışları güçlendirin',
    },
    {
      type: 'ul',
      items: [
        'Dahili belgeler veya VIP teklifler için kodları şifreyle koruyun.',
        'Etkinlik biletlerinde son kullanma tarihi ve tarama limitleri belirleyin.',
        'Markanıza uyan özel tarama alan adları kullanın (scan.markaniz.com).',
        'Ani tarama zirvelerini izleyin — çıkartma dolandırıcılığına işaret edebilir.',
      ],
    },
    {
      type: 'h2',
      content: 'Ekip hesaplarını koruyun',
    },
    {
      type: 'ul',
      items: [
        'Her yönetici kullanıcı için Ayarlar’da TOTP iki faktörlü kimlik doğrulamayı etkinleştirin.',
        'Business çalışma alanları SSO zorunlu kılabilir ve izin verilen e-posta alan adlarıyla SAML yapılandırabilir.',
        'Tarama verisi QRbanner’dan dış sistemlere çıkıyorsa webhook teslimat günlüklerini inceleyin.',
      ],
    },
    {
      type: 'h2',
      content: 'Müşteri eğitimi',
    },
    {
      type: 'p',
      content:
        'Personeli üst üste yapıştırılmış çıkartmaları günlük kontrol etmeye eğitin. Basılı kodların yanında logonuzu gösterin. Açılış sayfalarında kişisel veri istemeden önce marka renklerinizi ve HTTPS kilit simgesini gösterin.',
    },
  ],
};
