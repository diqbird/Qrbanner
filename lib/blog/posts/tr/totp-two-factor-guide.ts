import type { BlogPost } from '../../types';

export const totpTwoFactorGuideTr: BlogPost = {
  slug: 'qr-account-two-factor-authentication',
  title: 'QRbanner Hesabınızı İki Faktörlü Kimlik Doğrulama ile Güvenceye Alın',
  description:
    'Panelleri, API anahtarlarını ve faturalandırmayı korumak için QRbanner’da TOTP kimlik doğrulayıcı uygulamalarını etkinleştirin — ekipler için pratik kurulum rehberi.',
  keywords: ['iki faktörlü kimlik doğrulama', 'TOTP QR kodu', 'QRbanner güvenlik', 'kimlik doğrulayıcı uygulama'],
  publishedAt: '2026-07-01',
  updatedAt: '2026-07-01',
  readingMinutes: 5,
  author: 'QRbanner Team',
  category: 'Güvenlik',
  sections: [
    {
      type: 'p',
      content:
        'QR kodlar çoğu zaman menüleri, ödemeleri ve dahili belgeleri kapılar. Bu kodları yöneten hesap, e-postanız kadar korunmalıdır. QRbanner her planda TOTP iki faktörlü kimlik doğrulamayı destekler.',
    },
    {
      type: 'h2',
      content: 'QR yönetimi için neden 2FA etkinleştirilmeli?',
    },
    {
      type: 'ul',
      items: [
        'Şifre yeniden kullanıldığında veya phishing’e uğradığında ele geçirmeyi önler.',
        'API anahtarlarını, webhook’ları ve faturalandırma ayarlarını korur.',
        'Daha büyük ekipler için Business çalışma alanı SSO/SAML ile eşleşir.',
      ],
    },
    {
      type: 'h2',
      content: 'İki dakikadan kısa kurulum',
    },
    {
      type: 'ul',
      items: [
        'Panel → Ayarlar → İki faktörlü kimlik doğrulama’yı açın.',
        'QR kodu Google Authenticator, 1Password veya Authy ile tarayın.',
        'Onaylamak için 6 haneli kodu girin ve yedek kodları güvenle saklayın.',
      ],
    },
    {
      type: 'h2',
      content: 'Ekip yayını ipuçları',
    },
    {
      type: 'p',
      content:
        'Önce yöneticilerin ve çalışma alanı sahiplerinin 2FA’yı etkinleştirmesini zorunlu kılın. Business planlarda SAML ile birleştirin; böylece çalışanlar Okta veya Azure AD üzerinden giriş yaparken hassas işlemler için kimlik doğrulayıcı uygulamaları kullanmaya devam eder.',
    },
  ],
};
