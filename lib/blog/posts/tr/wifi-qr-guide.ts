import type { BlogPost } from '../../types';

export const wifiQrGuideTr: BlogPost = {
  slug: 'wifi-qr-codes-guide',
  title: 'WiFi QR Kodları: Şifre Yazmadan Misafir Wi‑Fi',
  description:
    'Misafirlerin tek taramayla ağınıza bağlanması için WiFi QR kodu oluşturun. WPA2 kurulumu, tabela ipuçları ve kafe, otel ve ofisler için güvenlik önerileri.',
  keywords: ['WiFi QR kodu', 'misafir WiFi QR', 'WPA QR', 'otel WiFi', 'kafe WiFi QR'],
  publishedAt: '2026-06-12',
  updatedAt: '2026-06-29',
  readingMinutes: 5,
  author: 'QRbanner Team',
  category: 'Nasıl Yapılır',
  sections: [
    {
      type: 'p',
      content:
        'Uzun Wi‑Fi şifrelerini telefonda yazmak özellikle misafirler için sürtünme yaratır. WiFi QR kodu SSID, şifreleme türü ve şifreyi kodlar; iOS ve Android taradıktan sonra tek dokunuşla “Ağa Katıl” sunar.',
    },
    {
      type: 'h2',
      content: 'Neleri eklemelisiniz?',
    },
    {
      type: 'ul',
      items: [
        'Ağ adı (SSID) — yayınlandığı şekilde birebir.',
        'Güvenlik türü: misafir ağları için WPA/WPA2 standarttır.',
        'Şifre — yönetici kimlik bilgileri değil, misafir VLAN kullanın.',
        'İsteğe bağlı: SSID gizliyse gizli ağ bayrağı.',
      ],
    },
    {
      type: 'h2',
      content: 'Nereye yerleştirmeli?',
    },
    {
      type: 'p',
      content:
        'Resepsiyon masaları, oda klasörleri, toplantı masaları ve giriş posterleri iyi çalışır. QR’ı tarayamayan dizüstü bilgisayarlar için okunabilir SSID ve şifre de ekleyin. Misafir şifresini değiştirdiğinizde kodları yenileyin.',
    },
    {
      type: 'h2',
      content: 'Güvenlik ipuçları',
    },
    {
      type: 'ul',
      items: [
        'Misafir Wi‑Fi’yi POS ve ofis alt ağlarından izole edin.',
        'Yoğun mekânlarda şifreleri aylık döndürün.',
        'Personel veya IoT ağ kimlik bilgilerini herkese açık tabelalarda asla yayınlamayın.',
      ],
    },
  ],
};
