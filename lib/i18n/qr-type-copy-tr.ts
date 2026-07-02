import type { QrTypePage } from '@/lib/qr-type-pages';

/**
 * Turkish (tr) copy overrides for QR type pages.
 * Keyed by the category slug defined in QR_CATEGORIES (lib/qr-utils.ts).
 */
export const QR_TYPE_COPY_TR: Record<string, Partial<QrTypePage>> = {
  url: {
    title: 'Web Sitesi Bağlantısı QR Kodu',
    headline: 'Web Sitesi QR Kodu Oluşturun — Ücretsiz',
    metaDescription:
      'Web sitenize yönlendiren ücretsiz QR kod oluşturucu. Markalı tasarım, tarama analitiği ve yeniden bastırmadan güncellenebilen bağlantılar.',
    description:
      'İnsanları istediğiniz herhangi bir sayfaya yönlendirin ve bağlantıyı istediğiniz zaman yeniden bastırmadan değiştirin.',
    benefits: [
      'Bağlantıyı istediğiniz an güncelleyin, kodu yeniden bastırmanıza gerek kalmaz',
      'Renk, logo ve çerçeve ile markanıza uygun tasarım',
      'PNG, SVG veya baskıya hazır PDF olarak indirin',
      'Kaç kişinin, nereden ve ne zaman taradığını analitikle görün',
    ],
    useCases: ['Ürün ambalajları', 'Afiş ve broşürler', 'E-posta imzaları'],
  },
  text: {
    title: 'Düz Metin QR Kodu',
    headline: 'Metin QR Kodu Oluşturun — Ücretsiz',
    metaDescription:
      'Tarandığında bir mesaj, kod veya not gösteren ücretsiz metin QR kod oluşturucu. Markalı tasarım ve baskıya hazır çıktılar.',
    description:
      'Birisi kodu taradığında görünecek bir mesaj, kod ya da not gösterin.',
    benefits: [
      'Uygulama gerekmeden anında okunabilen düz metin',
      'Talimat, kupon kodu veya kısa duyuru paylaşın',
      'Renk, logo ve çerçeve ile özelleştirilebilir tasarım',
      'PNG, SVG veya baskıya hazır PDF olarak indirin',
    ],
    useCases: ['Ürün etiketleri', 'Bilgilendirme panoları', 'Promosyon kartları'],
  },
  vcard: {
    title: 'Dijital Kartvizit QR Kodu',
    headline: 'Dijital Kartvizit QR Kodu Oluşturun — Ücretsiz',
    metaDescription:
      'Tek taramayla ad, telefon ve e-postanızı kaydettiren ücretsiz dijital kartvizit QR kod oluşturucu. Markalı ve baskıya hazır.',
    description:
      'Tek bir tarama adınızı, telefonunuzu ve e-postanızı karşı tarafın telefonuna kaydeder.',
    benefits: [
      'Tüm iletişim bilgileriniz tek taramayla rehbere eklenir',
      'Kağıt kartvizit taşımaya son, her zaman güncel kalır',
      'Renk, logo ve çerçeve ile profesyonel görünüm',
      'PNG, SVG veya baskıya hazır PDF olarak indirin',
    ],
    useCases: ['Kartvizitler', 'Konferans yaka kartları', 'E-posta altbilgileri'],
  },
  wifi: {
    title: 'Wi‑Fi Erişimi QR Kodu',
    headline: 'Wi‑Fi QR Kodu Oluşturun — Ücretsiz',
    metaDescription:
      'Misafirlerin şifre yazmadan ağınıza anında bağlanmasını sağlayan ücretsiz Wi‑Fi QR kod oluşturucu. Markalı ve baskıya hazır.',
    description:
      'Misafirleriniz şifre yazmadan ağınıza anında bağlanır.',
    benefits: [
      'Misafirler şifreyi elle yazmadan tek taramayla bağlanır',
      'Ağ adı ve şifre kodun içinde güvenli şekilde saklanır',
      'Renk, logo ve çerçeve ile mekânınıza uygun tasarım',
      'PNG, SVG veya baskıya hazır PDF olarak indirin',
    ],
    useCases: ['Otel lobileri', 'Kafe ve ortak çalışma alanları', 'Konaklama karşılama kartları'],
  },
  email: {
    title: 'E-posta QR Kodu',
    headline: 'E-posta QR Kodu Oluşturun — Ücretsiz',
    metaDescription:
      'Adresiniz ve mesajınız hazır şekilde e-posta uygulamasını açan ücretsiz e-posta QR kod oluşturucu. Markalı ve baskıya hazır.',
    description:
      'Adresiniz ve mesajınız hazır şekilde karşı tarafın e-posta uygulamasını açar.',
    benefits: [
      'Alıcı, konu ve mesaj otomatik olarak doldurulur',
      'Geri bildirim ve iletişim taleplerini kolaylaştırır',
      'Renk, logo ve çerçeve ile özelleştirilebilir tasarım',
      'PNG, SVG veya baskıya hazır PDF olarak indirin',
    ],
    useCases: ['Destek broşürleri', 'İletişim kartları', 'Fuar standları'],
  },
  sms: {
    title: 'Kısa Mesaj (SMS) QR Kodu',
    headline: 'SMS QR Kodu Oluşturun — Ücretsiz',
    metaDescription:
      'Telefon numaranıza hazır bir mesaj gönderten ücretsiz SMS QR kod oluşturucu. Markalı tasarım ve baskıya hazır çıktılar.',
    description:
      'Telefon numaranıza gönderilecek bir mesajı önceden doldurun.',
    benefits: [
      'Numara ve mesaj metni otomatik olarak hazır gelir',
      'Kampanya katılımı ve onay süreçlerini hızlandırır',
      'Renk, logo ve çerçeve ile markanıza uygun tasarım',
      'PNG, SVG veya baskıya hazır PDF olarak indirin',
    ],
    useCases: ['Kampanya afişleri', 'Çekiliş katılımları', 'Kısa kod duyuruları'],
  },
  phone: {
    title: 'Telefon Araması QR Kodu',
    headline: 'Telefon QR Kodu Oluşturun — Ücretsiz',
    metaDescription:
      'Numaranızı tek dokunuşla aratan ücretsiz telefon QR kod oluşturucu. Destek ve satış için ideal, markalı ve baskıya hazır.',
    description:
      'Dokununca numaranızı arar — destek ve satış için idealdir.',
    benefits: [
      'Numara elle yazılmadan tek dokunuşla aranır',
      'Destek ve satış hattına erişimi kolaylaştırır',
      'Renk, logo ve çerçeve ile özelleştirilebilir tasarım',
      'PNG, SVG veya baskıya hazır PDF olarak indirin',
    ],
    useCases: ['Vitrin ve tabelalar', 'Servis araçları', 'Kartvizit ve broşürler'],
  },
  location: {
    title: 'Harita Konumu QR Kodu',
    headline: 'Konum QR Kodu Oluşturun — Ücretsiz',
    metaDescription:
      'Mağaza, ofis veya etkinlik mekânınıza yol tarifi açan ücretsiz konum QR kod oluşturucu. Markalı ve baskıya hazır.',
    description:
      'Mağazanıza, ofisinize veya etkinlik mekânınıza yol tarifi açar.',
    benefits: [
      'Ziyaretçiler tek taramayla yol tarifi alır',
      'Adres yazma derdi olmadan doğru konuma ulaşırlar',
      'Renk, logo ve çerçeve ile markanıza uygun tasarım',
      'PNG, SVG veya baskıya hazır PDF olarak indirin',
    ],
    useCases: ['Davetiyeler', 'Etkinlik yönlendirmeleri', 'Vitrin ve tabelalar'],
  },
  event: {
    title: 'Takvim Etkinliği QR Kodu',
    headline: 'Etkinlik QR Kodu Oluşturun — Ücretsiz',
    metaDescription:
      'Etkinliğinizi tek taramayla takvime ekleten ücretsiz etkinlik QR kod oluşturucu. Markalı tasarım ve baskıya hazır çıktılar.',
    description:
      'Tek bir taramayla etkinliğinizi karşı tarafın takvimine ekler.',
    benefits: [
      'Tarih, saat ve konum otomatik olarak takvime eklenir',
      'Katılımcıların etkinliği unutma ihtimalini azaltır',
      'Renk, logo ve çerçeve ile özelleştirilebilir tasarım',
      'PNG, SVG veya baskıya hazır PDF olarak indirin',
    ],
    useCases: ['Davetiyeler', 'Konferans yaka kartları', 'Düğün programları'],
  },
  whatsapp: {
    title: 'WhatsApp Sohbeti QR Kodu',
    headline: 'WhatsApp QR Kodu Oluşturun — Ücretsiz',
    metaDescription:
      'İsteğe bağlı hazır mesajla WhatsApp sohbeti başlatan ücretsiz WhatsApp QR kod oluşturucu. Markalı ve baskıya hazır.',
    description:
      'WhatsApp sohbeti başlatır — isteğe bağlı olarak hazır bir mesaj ekleyebilirsiniz.',
    benefits: [
      'Numara aramadan tek taramayla sohbet başlar',
      'İsteğe bağlı hazır mesajla iletişimi kolaylaştırır',
      'Renk, logo ve çerçeve ile markanıza uygun tasarım',
      'PNG, SVG veya baskıya hazır PDF olarak indirin',
    ],
    useCases: ['Müşteri destek etiketleri', 'Ürün etiketleri', 'Fuar standları'],
  },
  telegram: {
    title: 'Telegram QR Kodu',
    headline: 'Telegram QR Kodu Oluşturun — Ücretsiz',
    metaDescription:
      'Telegram kanalınızı veya sohbetinizi açan ücretsiz Telegram QR kod oluşturucu. Markalı tasarım ve baskıya hazır çıktılar.',
    description:
      'Telegram kanalınızı veya doğrudan sohbetinizi açar.',
    benefits: [
      'Takipçiler tek taramayla kanalınıza katılır',
      'Bağlantıyı istediğiniz an güncelleyebilirsiniz',
      'Renk, logo ve çerçeve ile özelleştirilebilir tasarım',
      'PNG, SVG veya baskıya hazır PDF olarak indirin',
    ],
    useCases: ['Topluluk afişleri', 'Etkinlik duyuruları', 'Sosyal medya gönderileri'],
  },
  discord: {
    title: 'Discord Sunucusu QR Kodu',
    headline: 'Discord QR Kodu Oluşturun — Ücretsiz',
    metaDescription:
      'Topluluğunuza davet bağlantısıyla katılım sağlayan ücretsiz Discord QR kod oluşturucu. Markalı ve baskıya hazır.',
    description:
      'Topluluğunuza bir davet bağlantısıyla katılım sağlar.',
    benefits: [
      'Üyeler tek taramayla sunucunuza katılır',
      'Davet bağlantısını istediğiniz an güncelleyebilirsiniz',
      'Renk, logo ve çerçeve ile markanıza uygun tasarım',
      'PNG, SVG veya baskıya hazır PDF olarak indirin',
    ],
    useCases: ['Oyun topluluğu afişleri', 'Yayın ekranı görselleri', 'Etkinlik duyuruları'],
  },
  instagram: {
    title: 'Instagram Profili QR Kodu',
    headline: 'Instagram QR Kodu Oluşturun — Ücretsiz',
    metaDescription:
      'Ambalaj, afiş ve mağaza içi ekranlardan takipçi kazandıran ücretsiz Instagram QR kod oluşturucu. Markalı ve baskıya hazır.',
    description:
      'Ambalaj, afiş ve mağaza içi ekranlardan takipçi kazanın.',
    benefits: [
      'Çevrimdışı trafiği Instagram takipçilerine dönüştürür',
      'Profil bağlantısını istediğiniz an güncelleyebilirsiniz',
      'Renk, logo ve çerçeve ile markanıza uygun tasarım',
      'PNG, SVG veya baskıya hazır PDF olarak indirin',
    ],
    useCases: ['Perakende teşhirleri', 'Ambalaj ekleri', 'Mağaza içi tabelalar'],
  },
  facebook: {
    title: 'Facebook Sayfası QR Kodu',
    headline: 'Facebook QR Kodu Oluşturun — Ücretsiz',
    metaDescription:
      'Facebook sayfanıza veya profilinize bağlanan ücretsiz Facebook QR kod oluşturucu. Markalı tasarım ve baskıya hazır çıktılar.',
    description:
      'Facebook sayfanıza veya profilinize bağlantı verir.',
    benefits: [
      'Ziyaretçiler tek taramayla sayfanıza ulaşır',
      'Bağlantıyı istediğiniz an güncelleyebilirsiniz',
      'Renk, logo ve çerçeve ile markanıza uygun tasarım',
      'PNG, SVG veya baskıya hazır PDF olarak indirin',
    ],
    useCases: ['Mağaza tabelaları', 'Broşür ve el ilanları', 'Etkinlik afişleri'],
  },
  tiktok: {
    title: 'TikTok Profili QR Kodu',
    headline: 'TikTok QR Kodu Oluşturun — Ücretsiz',
    metaDescription:
      'Çevrimdışı trafiği TikTok takipçilerine dönüştüren ücretsiz TikTok QR kod oluşturucu. Markalı ve baskıya hazır.',
    description:
      'Çevrimdışı trafiği TikTok takipçilerine dönüştürün.',
    benefits: [
      'Fiziksel materyallerden TikTok takipçisi kazandırır',
      'Profil bağlantısını istediğiniz an güncelleyebilirsiniz',
      'Renk, logo ve çerçeve ile markanıza uygun tasarım',
      'PNG, SVG veya baskıya hazır PDF olarak indirin',
    ],
    useCases: ['Perakende teşhirleri', 'Ürün ambalajları', 'Etkinlik standları'],
  },
  linkedin: {
    title: 'LinkedIn Profili QR Kodu',
    headline: 'LinkedIn QR Kodu Oluşturun — Ücretsiz',
    metaDescription:
      'Kartvizit, yaka kartı ve broşürlerden profesyonel ağ kuran ücretsiz LinkedIn QR kod oluşturucu. Markalı ve baskıya hazır.',
    description:
      'Kartvizit, yaka kartı ve broşürlerden profesyonel ağ kurun.',
    benefits: [
      'Profil bağlantınızı tek taramayla paylaşırsınız',
      'Bağlantıyı istediğiniz an güncelleyebilirsiniz',
      'Renk, logo ve çerçeve ile profesyonel görünüm',
      'PNG, SVG veya baskıya hazır PDF olarak indirin',
    ],
    useCases: ['Kartvizitler', 'Konferans yaka kartları', 'Kurumsal broşürler'],
  },
  youtube: {
    title: 'YouTube Kanalı QR Kodu',
    headline: 'YouTube QR Kodu Oluşturun — Ücretsiz',
    metaDescription:
      'İzleyicileri kanalınıza veya belirli bir videoya yönlendiren ücretsiz YouTube QR kod oluşturucu. Markalı ve baskıya hazır.',
    description:
      'İzleyicileri kanalınıza veya belirli bir videoya yönlendirir.',
    benefits: [
      'Ziyaretçiler tek taramayla içeriğinizi izler',
      'Kanal veya video bağlantısını istediğiniz an güncelleyin',
      'Renk, logo ve çerçeve ile markanıza uygun tasarım',
      'PNG, SVG veya baskıya hazır PDF olarak indirin',
    ],
    useCases: ['Ürün ambalajları', 'Tanıtım afişleri', 'Sunum ve etkinlikler'],
  },
  spotify: {
    title: 'Spotify QR Kodu',
    headline: 'Spotify QR Kodu Oluşturun — Ücretsiz',
    metaDescription:
      'Bir şarkı, albüm veya çalma listesi paylaşan ücretsiz Spotify QR kod oluşturucu. Markalı tasarım ve baskıya hazır çıktılar.',
    description:
      'Bir şarkı, albüm veya çalma listesi paylaşın.',
    benefits: [
      'Dinleyiciler tek taramayla müziğinize ulaşır',
      'Bağlantıyı istediğiniz an güncelleyebilirsiniz',
      'Renk, logo ve çerçeve ile markanıza uygun tasarım',
      'PNG, SVG veya baskıya hazır PDF olarak indirin',
    ],
    useCases: ['Konser afişleri', 'Albüm ve merch tasarımları', 'Sosyal medya gönderileri'],
  },
  social: {
    title: 'Diğer Sosyal Bağlantı QR Kodu',
    headline: 'Sosyal Medya QR Kodu Oluşturun — Ücretsiz',
    metaDescription:
      'Herhangi bir sosyal profil veya bağlantı sayfası için ücretsiz sosyal medya QR kod oluşturucu. Markalı ve baskıya hazır.',
    description:
      'Herhangi bir sosyal profil veya bağlantı sayfası adresini paylaşın.',
    benefits: [
      'İstediğiniz sosyal platforma tek taramayla yönlendirir',
      'Bağlantıyı istediğiniz an güncelleyebilirsiniz',
      'Renk, logo ve çerçeve ile markanıza uygun tasarım',
      'PNG, SVG veya baskıya hazır PDF olarak indirin',
    ],
    useCases: ['Sosyal medya kampanyaları', 'Perakende teşhirleri', 'Etkinlik materyalleri'],
  },
  link_hub: {
    title: 'Bağlantı Merkezi QR Kodu',
    headline: 'Bağlantı Merkezi QR Kodu Oluşturun — Ücretsiz',
    metaDescription:
      'Birden fazla butonu tek QR ile toplayan, Linktree benzeri ücretsiz bağlantı merkezi QR kod oluşturucu. Markalı ve baskıya hazır.',
    description:
      'Birden fazla butonu tek bir QR ile toplar — Linktree gibi.',
    benefits: [
      'Tüm bağlantılarınızı tek QR altında toplarsınız',
      'Buton ve bağlantıları istediğiniz an güncelleyebilirsiniz',
      'Renk, logo ve çerçeve ile markanıza uygun tasarım',
      'PNG, SVG veya baskıya hazır PDF olarak indirin',
    ],
    useCases: ['Biyografi bağlantıları', 'Etkinlik programları', 'Restoran bağlantı menüleri'],
  },
  zoom: {
    title: 'Zoom Toplantısı QR Kodu',
    headline: 'Zoom QR Kodu Oluşturun — Ücretsiz',
    metaDescription:
      'Afiş, sunum veya e-postadan Zoom görüşmenize katılım sağlayan ücretsiz Zoom QR kod oluşturucu. Markalı ve baskıya hazır.',
    description:
      'Afiş, sunum veya e-postadan Zoom görüşmenize katılım sağlar.',
    benefits: [
      'Katılımcılar toplantı kimliği yazmadan tek taramayla katılır',
      'Toplantı bağlantısını istediğiniz an güncelleyebilirsiniz',
      'Renk, logo ve çerçeve ile markanıza uygun tasarım',
      'PNG, SVG veya baskıya hazır PDF olarak indirin',
    ],
    useCases: ['Sunum slaytları', 'Etkinlik afişleri', 'E-posta davetleri'],
  },
  google_meet: {
    title: 'Google Meet QR Kodu',
    headline: 'Google Meet QR Kodu Oluşturun — Ücretsiz',
    metaDescription:
      'Tek taramayla Google Meet odanızı açan ücretsiz Google Meet QR kod oluşturucu. Markalı tasarım ve baskıya hazır çıktılar.',
    description:
      'Tek bir tarama Google Meet odanızı açar.',
    benefits: [
      'Katılımcılar tek taramayla toplantı odanıza girer',
      'Toplantı bağlantısını istediğiniz an güncelleyebilirsiniz',
      'Renk, logo ve çerçeve ile markanıza uygun tasarım',
      'PNG, SVG veya baskıya hazır PDF olarak indirin',
    ],
    useCases: ['Sunum slaytları', 'Etkinlik afişleri', 'E-posta davetleri'],
  },
  menu: {
    title: 'Restoran Menüsü QR Kodu',
    headline: 'Menü QR Kodu Oluşturun — Ücretsiz',
    metaDescription:
      'Masalarda dijital menü sunan, fiyatları yeniden bastırmadan güncellenen ücretsiz menü QR kod oluşturucu. Markalı ve baskıya hazır.',
    description:
      'Masalarda dijital menü sunun ve fiyatları yeniden bastırmadan güncelleyin.',
    benefits: [
      'Menüyü yeniden bastırmadan istediğiniz an güncellersiniz',
      'Müşteriler tek taramayla güncel menüye ulaşır',
      'Renk, logo ve çerçeve ile mekânınıza uygun tasarım',
      'PNG, SVG veya baskıya hazır PDF olarak indirin',
    ],
    useCases: ['Masa üstü stantlar', 'Paket servis poşetleri', 'Dijital menü panoları'],
  },
  pdf: {
    title: 'PDF Belgesi QR Kodu',
    headline: 'PDF QR Kodu Oluşturun — Ücretsiz',
    metaDescription:
      'Broşür, menü, CV veya katalogları PDF bağlantısı olarak paylaşan ücretsiz PDF QR kod oluşturucu. Markalı ve baskıya hazır.',
    description:
      'Broşür, menü, CV veya katalogları bir PDF bağlantısı olarak paylaşın.',
    benefits: [
      'Ziyaretçiler tek taramayla belgeye erişir',
      'PDF bağlantısını istediğiniz an güncelleyebilirsiniz',
      'Renk, logo ve çerçeve ile markanıza uygun tasarım',
      'PNG, SVG veya baskıya hazır PDF olarak indirin',
    ],
    useCases: ['Broşürler', 'Kataloglar', 'PDF formatındaki menüler'],
  },
  file: {
    title: 'Dosya İndirme QR Kodu',
    headline: 'Dosya İndirme QR Kodu Oluşturun — Ücretsiz',
    metaDescription:
      'Ziyaretçilerin indirebileceği herhangi bir dosyaya bağlanan ücretsiz dosya QR kod oluşturucu. Markalı ve baskıya hazır.',
    description:
      'Ziyaretçilerin indirebileceği herhangi bir dosyaya bağlantı verin.',
    benefits: [
      'Ziyaretçiler tek taramayla dosyayı indirir',
      'Dosya bağlantısını istediğiniz an güncelleyebilirsiniz',
      'Renk, logo ve çerçeve ile markanıza uygun tasarım',
      'PNG, SVG veya baskıya hazır PDF olarak indirin',
    ],
    useCases: ['Kullanım kılavuzları', 'Sunum dosyaları', 'Dijital kaynaklar'],
  },
  app: {
    title: 'Uygulama İndirme QR Kodu',
    headline: 'Uygulama İndirme QR Kodu Oluşturun — Ücretsiz',
    metaDescription:
      'iOS ve Android kullanıcılarını doğru uygulama mağazasına yönlendiren ücretsiz uygulama QR kod oluşturucu. Markalı ve baskıya hazır.',
    description:
      'iOS ve Android kullanıcılarını doğru uygulama mağazasına yönlendirin.',
    benefits: [
      'Her kullanıcı otomatik olarak doğru mağazaya yönlenir',
      'Mağaza bağlantısını istediğiniz an güncelleyebilirsiniz',
      'Renk, logo ve çerçeve ile markanıza uygun tasarım',
      'PNG, SVG veya baskıya hazır PDF olarak indirin',
    ],
    useCases: ['Tanıtım afişleri', 'Ürün ambalajları', 'Dijital reklamlar'],
  },
  crypto: {
    title: 'Kripto Ödeme QR Kodu',
    headline: 'Kripto Ödeme QR Kodu Oluşturun — Ücretsiz',
    metaDescription:
      'Kopyala-yapıştır hatası olmadan Bitcoin veya Ethereum cüzdanınızı paylaşan ücretsiz kripto ödeme QR kod oluşturucu. Markalı ve baskıya hazır.',
    description:
      'Bitcoin veya Ethereum cüzdanınızı paylaşın — kopyala-yapıştır hatası olmadan.',
    benefits: [
      'Cüzdan adresi hatasız şekilde tek taramayla okunur',
      'İsteğe bağlı tutarla ödeme sürecini kolaylaştırır',
      'Renk, logo ve çerçeve ile markanıza uygun tasarım',
      'PNG, SVG veya baskıya hazır PDF olarak indirin',
    ],
    useCases: ['Bağış afişleri', 'Fatura ve makbuzlar', 'Satış noktası ekranları'],
  },
};
