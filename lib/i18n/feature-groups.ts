import { FEATURE_GROUPS } from '@/lib/site-content';
import type { Locale } from './types';
import type { SiteFeature } from '@/lib/site-content';

const TAG_TR: Record<string, string> = {
  Differentiator: 'Fark',
  New: 'Yeni',
};

const GROUPS_TR: { title: string; description: string; features: { title: string; description: string }[] }[] = [
  {
    title: 'Oluştur & Tasarla',
    description: 'Baskı ve dijital için markalı QR kodlar.',
    features: [
      { title: 'Düzenlenebilir QR Kodları', description: 'QR\'ın işaret ettiği yeri istediğiniz zaman değiştirin — menü, poster veya ambalajı yeniden basmaya gerek yok.' },
      { title: 'QR Kodunuzu Markalayın', description: 'Özel renkler, nokta stilleri, çerçeveler ve logolar ile kodlarınız her temas noktasında markanıza uysun.' },
      { title: 'Ortada Logo', description: 'Logonuzu akıllı boyutlandırma ile ekleyin; baskı ve ambalajda tarama kolaylığı korunsun.' },
      { title: '26+ QR Tipi', description: 'Web sitesi, kartvizit, Wi‑Fi, menü, WhatsApp, Instagram, PDF, etkinlik, ödeme ve daha fazlası — hepsi tek yerde.' },
      { title: 'Baskı Banner Dışa Aktarma', description: 'QR, başlık ve marka renklerinizle baskıya hazır pazarlama posterleri indirin (PNG/PDF).' },
      { title: 'Tasarım Asistanı', description: 'QR tipinize uygun renk ve stil önerileri — kolay tarama için optimize.' },
      { title: 'Tarama Güvenilirlik Kontrolü', description: 'Basmadan önce tasarımınızın ne kadar taranabilir olduğunu görün — kontrast, boyut ve kamera önizlemesi.' },
      { title: 'AI Açılış Sayfası Metni', description: 'Açılış sayfası düzenleyicisinde başlık, alt başlık, CTA ve SEO metinlerini tek tıkla oluşturun.' },
    ],
  },
  {
    title: 'Akıllı Yönlendirme',
    description: 'Tarayıcıları otomatik olarak doğru yere gönderin.',
    features: [
      { title: 'Zamana Göre Program', description: 'Öğle menüsünü öğlen, akşam menüsünü gece gösterin — otomatik.' },
      { title: 'Konuma Göre Linkler', description: 'Farklı ülke veya şehirlerdeki ziyaretçileri doğru sayfaya yönlendirin.' },
      { title: 'Cihaz Yönlendirme', description: 'Uygulama indirme kampanyaları için ayrı iOS ve Android URL\'leri.' },
      { title: 'Açılış Sayfaları', description: 'Yönlendirmeden önce isteğe bağlı lead formu ile 5 mobil şablon — promosyon ve etkinlikler için ideal.' },
      { title: 'A/B Testi', description: 'İki açılış sayfası veya teklifi test edin, hangisinin daha çok tarama aldığını görün.' },
      { title: 'Kampanya Takibi', description: 'Hangi poster, el ilanı veya reklamın en çok taramayı getirdiğini Google Analytics\'te izleyin.' },
    ],
  },
  {
    title: 'Analitik & Pazarlama',
    description: 'Taramaları ölçün ve reklam yığınınıza bağlayın.',
    features: [
      { title: 'Gerçek Zamanlı Analitik', description: 'Toplam ve benzersiz taramalar, özel tarih aralıkları, cihaz, tarayıcı, işletim sistemi, ülke ve şehir dağılımları.' },
      { title: 'Coğrafi İçgörüler', description: 'Ülke ve şehir grafikleri ile son tarama günlüğüyle kodların nerede performans gösterdiğini görün.' },
      { title: 'GA4 & Meta Pixel', description: 'Tarama, açılış sayfası ve CTA tıklamalarında Google Analytics 4 ve Facebook Pixel olayları tetikleyin.' },
      { title: 'Tarama Bildirimleri', description: 'İlk tarama, kilometre taşları (10, 50, 100…) veya her taramada e-posta uyarıları.' },
      { title: 'CSV Dışa Aktarma', description: 'Panel ve QR başına analitik sayfalarından özet raporları dışa aktarın.' },
      { title: 'Lead Yakalama', description: 'Açılış sayfalarında ad, e-posta, telefon ve mesaj toplayın. Gönderimleri QR analitiğinde görün.' },
      { title: 'Tarama Webhook\'ları', description: 'Her taramada HMAC imzalı HTTP POST bildirimleri — Zapier, Slack veya CRM\'inize bağlayın.' },
      { title: 'NFC Etiket Desteği', description: 'NFC etiketlerini aynı dinamik URL ile programlayın. Taramalar analitikte ayrı NFC olarak izlenir.' },
      { title: 'GPS Isı Haritası', description: 'Taramada isteğe bağlı tarayıcı konumu ve IP yedeklemesi — tarama kümelerini haritada görselleştirin.' },
      { title: 'Açılış Sayfası CTA Analitiği', description: 'Tarama açılış sayfalarındaki buton tıklamalarını izleyin — taramadan aksiyona dönüşümü ölçün.' },
    ],
  },
  {
    title: 'Platform & Ölçek',
    description: 'Ekipler, ajanslar ve geliştiriciler için araçlar.',
    features: [
      { title: 'Toplu CSV İçe Aktarma', description: 'Elektronik tablodan tek seferde 100\'e kadar QR kodu oluşturun — mağazalar, menüler, etkinlikler.' },
      { title: 'Klasörler & Etiketler', description: 'Kodları renkli klasörlerde düzenleyin ve panelde özel etiketlere göre filtreleyin.' },
      { title: 'REST API v1', description: 'API anahtarlarıyla QR kodları ve klasörleri programatik yönetin. Bearer veya X-API-Key kimlik doğrulama.' },
      { title: 'Marka Stil Şablonları', description: 'QR nokta stilleri, renkler ve çerçeveleri kampanyalar arasında kaydedin ve yeniden kullanın.' },
      { title: 'Özel Tarama Alan Adları', description: 'DNS ile alan adınızı doğrulayın ve taramaları markanızın URL\'si üzerinden sunun (ör. go.markaniz.com).' },
      { title: 'Ekip Çalışma Alanları', description: 'Ekip alanları oluşturun, rollü üyeler davet edin (sahip, admin, editör, görüntüleyici) ve birlikte çalışın.' },
      { title: 'SSO & SAML', description: 'Google veya Microsoft Azure AD ile giriş. Business çalışma alanları SSO zorunluluğu ve SAML (Okta, Azure AD vb.) yapılandırabilir.' },
      { title: 'Erişim Kontrolleri', description: 'Şifre korumalı QR\'lar, isteğe bağlı son kullanma tarihleri ve kapalı kampanyalar için tarama limitleri.' },
      { title: 'İstediğiniz Zaman Düzenleyin', description: 'Basılı QR görselini değiştirmeden içerik, stil, yönlendirme kuralları ve pikselleri güncelleyin.' },
      { title: 'İki Faktörlü Kimlik Doğrulama', description: 'TOTP kimlik doğrulayıcı uygulamalarıyla hesabınızı koruyun — Google Authenticator, 1Password ve daha fazlası.' },
      { title: 'OpenAPI & Webhook Günlükleri', description: 'REST API v1 için OpenAPI 3.0 belgesini indirin ve Ayarlar\'da webhook teslimat geçmişini inceleyin.' },
    ],
  },
];

export function getFeatureGroups(locale: Locale) {
  if (locale === 'en') return FEATURE_GROUPS;

  return FEATURE_GROUPS.map((group, gi) => {
    const tr = GROUPS_TR[gi];
    return {
      title: tr?.title ?? group.title,
      description: tr?.description ?? group.description,
      features: group.features.map((feature, fi) => {
        const trFeature = tr?.features[fi];
        return {
          ...feature,
          title: trFeature?.title ?? feature.title,
          description: trFeature?.description ?? feature.description,
          tag: feature.tag ? TAG_TR[feature.tag] ?? feature.tag : undefined,
        } satisfies SiteFeature;
      }),
    };
  });
}
