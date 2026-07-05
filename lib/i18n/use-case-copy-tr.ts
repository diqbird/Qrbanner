import type { UseCasePage } from '@/lib/use-case-pages';

/**
 * Turkish (tr) marketing copy for use-case pages.
 * Keys are the same slugs defined in `lib/use-case-pages.ts`.
 * Only translatable fields are overridden; structural fields
 * (categoryId, icon, relatedSolutionSlug, slug) come from the base data.
 */
export const USE_CASE_COPY_TR: Record<string, Partial<UseCasePage>> = {
  'product-packaging': {
    title: 'Ürün Ambalajlarında QR Kodları',
    headline: 'Her ambalajı dijital bir temas noktasına dönüştürün',
    metaDescription:
      'Kullanım kılavuzu, garanti kaydı, yeniden sipariş bağlantıları ve tarama analizi için ürün ambalajlarına QR kodu ekleyin. Ücretsiz dinamik QR oluşturucu.',
    keywords: ['ürün ambalajı QR kodu', 'kutu QR kodu', 'ambalaj QR pazarlama'],
    description:
      'Kutulara, etiketlere veya ambalaj içi belgelere bir QR kodu yerleştirerek kurulum kılavuzlarını, garanti formlarını, tarifleri veya yeniden sipariş sayfalarını paylaşın — üstelik bağlantıyı yeniden baskı yapmadan güncelleyin.',
    benefits: [
      'Ek baskı maliyeti olmadan kılavuzlara, videolara veya desteğe bağlanın',
      'Taramaları bölgeye ve kampanya partisine göre takip edin',
      'Sezonluk promosyonlar veya geri çağırmalar için hedefi anında değiştirin',
      'Logo ve marka renkleriyle özel tasarım',
    ],
    steps: [
      'Dinamik bir web sitesi veya PDF QR kodu oluşturun',
      'Logonuzu ve çerçeve stilinizi ekleyin',
      'Ambalaj tasarımı için baskıya hazır PNG veya SVG dışa aktarın',
      'Lansmandan sonra taramaları panelden izleyin',
    ],
  },
  'trade-show-leads': {
    title: 'Fuar ve Sergi Potansiyel Müşteri Toplama',
    headline: 'Stant ziyaretçilerini kağıt form olmadan yakalayın',
    metaDescription:
      'Fuarlarda potansiyel müşteri toplama, broşür indirme ve takip bağlantıları için QR kodları kullanın. Stant trafiğini tarama analiziyle ölçün.',
    keywords: ['fuar QR kodu', 'sergi lead toplama QR', 'stant QR kodu'],
    description:
      'Panoları taranabilir bir açılış sayfası veya vCard ile değiştirin. Ziyaretçileri demolara, takvimlere veya CRM formlarına yönlendirin ve standınızın en yoğun saatlerini ölçün.',
    benefits: [
      'vCard QR kodlarıyla anında kişi kaydı',
      'Tek stanttan iki açılış sayfasını A/B testi yapın',
      'Çok şehirli turlar için coğrafi konum yönlendirmesi',
      'Potansiyel müşterileri HubSpot veya Zapier’a webhook ile aktarın',
    ],
    steps: [
      'Bir kartvizit veya bağlantı merkezi şablonu seçin',
      'Demo randevusu veya lead formu URL’sini ekleyin',
      'Bannerlara, yaka kartlarına ve broşürlere basın',
      'Etkinlikten sonra tarama ısı haritalarını inceleyin',
    ],
  },
  'print-advertising': {
    title: 'Basılı Reklamlar, Posterler ve El İlanları',
    headline: 'Çevrimdışı baskıyı çevrimiçi dönüşümlere köprüleyin',
    metaDescription:
      'Posterlere, el ilanlarına ve dergi reklamlarına QR kodları ekleyin. Hangi yerleşimin tarama getirdiğini takip edin ve teklifleri yeniden baskı yapmadan güncelleyin.',
    keywords: ['poster QR kodu', 'el ilanı QR kodu', 'basılı reklam QR'],
    description:
      'Basılı kampanyaları açılış sayfalarına, promosyon kodlarına veya video içeriğine bağlayın. Dinamik kodlar sayesinde yazım hatalarını düzeltebilir ve kreatifleri kampanya sırasında yenileyebilirsiniz.',
    benefits: [
      'Her yerleşim için UTM uyumlu açılış sayfaları',
      'Müşteriler için parola korumalı önizlemeler',
      'Kampanya başlangıç/bitiş tarihleri için zamanlanmış yönlendirmeler',
      'Taşma payı kılavuzlarıyla baskı bannerları dışa aktarın',
    ],
    steps: [
      'Kampanya açılış sayfanızla bir URL QR oluşturun',
      'Baskı boyutu için yüksek kontrastlı bir kod tasarlayın',
      'Her şehir veya yayın için benzersiz kodlar kullanın',
      'Analizlerde tarama oranlarını karşılaştırın',
    ],
  },
  'email-signature': {
    title: 'E-posta İmzası QR Kodları',
    headline: 'İletişim bilgilerinizi her e-postadan paylaşın',
    metaDescription:
      'vCard kaydı, randevu bağlantıları veya sosyal profiller için e-posta imzalarına QR kodu ekleyin. Bir kez güncelleyin — imzalar her zaman güncel kalsın.',
    keywords: ['e-posta imzası QR kodu', 'vCard e-posta QR', 'profesyonel e-posta QR'],
    description:
      'İmza bloğunuza küçük bir QR yerleştirin; mobil okuyucular tek taramayla kişinizi kaydedebilir veya bir toplantı ayarlayabilir.',
    benefits: [
      'vCard adı, telefonu ve e-postayı otomatik kaydeder',
      'Unvanı veya telefonu yeni imza olmadan güncelleyin',
      'İmzanızın kaç tarama getirdiğini takip edin',
      'Gmail, Outlook ve Apple Mail ile uyumlu',
    ],
    steps: [
      'En güncel bilgilerinizle bir vCard QR oluşturun',
      'İmza kullanımı için kompakt bir PNG indirin',
      'İkincil CTA olarak takvim veya portfolyoya bağlantı verin',
      'Görev değiştirdiğinizde kodu yenileyin',
    ],
  },
  'restaurant-table-tents': {
    title: 'Restoran Masa Standı QR Kodları',
    headline: 'Her masada menü, yorum ve Wi‑Fi',
    metaDescription:
      'Dijital menüler, Google yorumları ve misafir Wi‑Fi’si için masa standı QR kodları oluşturun. Menü bağlantılarını standları yeniden basmadan güncelleyin.',
    keywords: ['masa standı QR kodu', 'restoran masa QR', 'menü stand QR'],
    description:
      'Misafirler menü, günün fırsatları, geri bildirim veya Wi‑Fi bilgileri için tarasın. Dinamik menüler sayesinde fiyat değişiklikleri yeni baskı gerektirmez.',
    benefits: [
      'Her salon için bir kod ile menü PDF veya web URL’si',
      'Öğle/akşam yemeği için farklı menülere yönlendirme',
      'Personele özel menüler için isteğe bağlı parola',
      'Markalı, baskıya hazır masa standı düzenleri',
    ],
    steps: [
      'Restoran menüsü şablonunu kullanın',
      'Menü URL’nizi yapıştırın veya PDF bağlantısı yükleyin',
      'QR çerçevesine logo ve marka renkleri ekleyin',
      'Standları basın ve açılmaları saatlik izleyin',
    ],
  },
  'hotel-guest-experience': {
    title: 'Otel Misafir Deneyimi QR',
    headline: 'Her odada Wi‑Fi, rehber ve ek satış',
    metaDescription:
      'Wi‑Fi, yerel rehberler, spa rezervasyonu ve konsiyerj sohbeti için otel odası QR kodları. Analiz destekli, konaklama sektörüne uygun şablonlar.',
    keywords: ['otel odası QR kodu', 'konaklama QR', 'otel misafir WiFi QR'],
    description:
      'Laminatlı kartları; Wi‑Fi, oda servisi, çıkış bilgileri ve yerel öneriler için tek bir taranabilir merkezle değiştirin.',
    benefits: [
      'Wi‑Fi QR, parola yazmadan ağa bağlanır',
      'Spa, restoran ve ulaşım partnerleri için bağlantı merkezi',
      'Uluslararası misafirler için çok dilli açılış sayfaları',
      'Kata veya tesise göre tarama analizi',
    ],
    steps: [
      'Her tesis için Wi‑Fi ve bağlantı merkezi kodları oluşturun',
      'Tesis kurallarınıza uygun marka tasarımı ekleyin',
      'Anahtar kılıflarına, aynalara ve asansörlere yerleştirin',
      'Sezonluk teklifleri zamanlanmış yönlendirmelerle sunun',
    ],
  },
  'event-check-in': {
    title: 'Etkinlik Giriş ve Yaka Kartları',
    headline: 'Daha hızlı kayıt ve oturum bağlantıları',
    metaDescription:
      'Giriş, program, oturum sunumları ve networking için etkinlik QR kodları. Konferanslar, düğünler ve buluşmalar için dinamik kodlar.',
    keywords: ['etkinlik giriş QR', 'konferans yaka kartı QR', 'düğün QR kodu'],
    description:
      'Yaka kartlarında QR kullanarak katılımcı profillerini, oturum materyallerini veya takvim eklemelerini sunun. Salon veya saatler değişirse bağlantıları güncelleyin.',
    benefits: [
      'Takvim etkinliği QR’ı programı tek dokunuşla ekler',
      'Networking için yaka kartı vCard’ları',
      'Her mekan bölgesi için coğrafi yönlendirme',
      'Oturum başına gerçek zamanlı tarama sayıları',
    ],
    steps: [
      'Her katılımcı tipi için etkinlik veya vCard kodları oluşturun',
      'Programa, sunumlara veya canlı yayına bağlantı verin',
      'Yaka kartlarına, programlara ve tabelalara basın',
      'Etkinlikten sonra tarama raporunu dışa aktarın',
    ],
  },
  'retail-loyalty': {
    title: 'Perakende Sadakat ve SMS Kaydı',
    headline: 'Satış alanından listenizi büyütün',
    metaDescription:
      'Sadakat kaydı, SMS promosyonları ve ürün sorgulamaları için perakende QR kodları. Mağaza içi etkileşimi tarama analiziyle takip edin.',
    keywords: ['perakende sadakat QR', 'mağaza QR pazarlama', 'SMS kayıt QR'],
    description:
      'Müşterileri sadakat programlarına veya SMS tekliflerine kaydetmek için kasada, raflarda ve fişlerde kodlar yerleştirin.',
    benefits: [
      'SMS QR onay mesajını önceden doldurur',
      'Sadakat portalına veya uygulama indirmeye bağlantı',
      'Atıf için her mağazaya farklı kodlar',
      'Yeni kayıtları CRM’inize webhook ile aktarın',
    ],
    steps: [
      'SMS veya uygulama indirme QR tipini seçin',
      'Teklif metnini ve uyumluluk yazısını ekleyin',
      'Raf konuşmacıları ve fiş ekleri basın',
      'Dönüşümü lokasyona göre ölçün',
    ],
  },
  'real-estate-listings': {
    title: 'Emlak İlanı QR Kodları',
    headline: 'Bahçe tabelalarından ve broşürlerden daha çok talep',
    metaDescription:
      'Satılık tabelalarında, açık ev el ilanlarında ve ilan sayfalarında emlak QR kodları. Alıcıları turlara, video gezintilerine ve danışman iletişimine yönlendirin.',
    keywords: ['emlak QR kodu', 'satılık tabela QR', 'açık ev QR'],
    description:
      'Alıcılar ilan detayları, 3D turlar, kredi hesaplayıcıları veya danışman vCard’ları için tarasın — ev satıldığında durumu güncelleyin.',
    benefits: [
      'Dinamik bağlantı fiyat veya durum değişikliklerinde geçerli kalır',
      'Tabela ekindeki vCard ile anında danışman iletişimi',
      'İlgiyi mahalleye göre takip edin',
      'Piyasa dışı önizlemeler için parola koruması',
    ],
    steps: [
      'İlan sayfanıza bir URL QR oluşturun',
      'İkincil baskı olarak danışman vCard’ı ekleyin',
      'Tabelalara, anahtar kutularına ve postalara yerleştirin',
      'İlan kapandığında duraklatın veya yönlendirin',
    ],
  },
  'healthcare-patient-info': {
    title: 'Sağlık Hasta Bilgilendirme',
    headline: 'Hastaların gerçekten açtığı muayene sonrası talimatlar',
    metaDescription:
      'Hasta eğitimi, randevu alma ve portal girişi için sağlık QR kodları. Parola korumalı bağlantılarla KVKK/HIPAA uyumlu iş akışları.',
    keywords: ['sağlık QR kodu', 'hasta eğitimi QR', 'klinik QR kodu'],
    description:
      'Bakım talimatlarını, formları ve takip randevularını uygulama kurmadan paylaşın. Protokoller değiştiğinde içeriği güncelleyin.',
    benefits: [
      'Taburcu talimatları için PDF QR',
      'Hassas belgeler için parola korumalı bağlantılar',
      'Klinik bazında analizli randevu URL’si',
      'Broşürlere ve bekleme odası posterlerine basın',
    ],
    steps: [
      'Hasta eğitimi PDF’si veya portal URL’si yükleyin',
      'İçerik hassassa parolayı etkinleştirin',
      'Muayene odası ve lobi materyallerine basın',
      'Departmana göre tarama eğilimlerini inceleyin',
    ],
  },
  'museum-exhibits': {
    title: 'Müze ve Sergi Sesli Rehberleri',
    headline: 'Her eserin ardındaki daha zengin hikayeler',
    metaDescription:
      'Sergi etiketleri, sesli rehberler ve bağış sayfaları için müze QR kodları. Uygulama gerekmez — ziyaretçi telefonlarında çalışır.',
    keywords: ['müze QR kodu', 'sergi QR etiketi', 'galeri sesli rehber QR'],
    description:
      'Ziyaretçiler eser hikayeleri, videolar, çeviriler ve zamanlı giriş bilgileri için tarasın. Sergiler değiştikçe içeriği güncelleyin.',
    benefits: [
      'Her sergi için çok dilli açılış sayfaları',
      'Bağış ve üyelik bağlantıları',
      'Az ışığa uygun yüksek kontrastlı QR stilleri',
      'Galeri bölgesine göre analiz',
    ],
    steps: [
      'Her sergi için URL veya PDF kodları oluşturun',
      'Mobil açılış sayfasına ses/video ekleyin',
      'Tabelalara ve giriş yönlendirmelerine basın',
      'Eserler değiştiğinde güncelleyin',
    ],
  },
  'social-media-growth': {
    title: 'Sosyal Medya Takipçi Büyümesi',
    headline: 'Çevrimdışı hayranları takipçiye dönüştürün',
    metaDescription:
      'Ambalaj, poster ve perakende ekranları için Instagram, TikTok ve LinkedIn QR kodları. Fiziksel temas noktalarından sosyal medyanızı büyütün.',
    keywords: ['Instagram QR kodu pazarlama', 'sosyal medya QR', 'TikTok QR poster'],
    description:
      'Doğrudan profillere, reels’lere veya link-in-bio sayfalarına bağlanın. Hangi mağaza veya kampanyanın en çok takipçi getirdiğini takip edin.',
    benefits: [
      'Instagram, TikTok, LinkedIn için özel QR tipleri',
      'Birden fazla sosyal düğme için bağlantı merkezi',
      'Perakende ekranları için marka renkli çerçeveler',
      'Yerleşime göre tarama analizi',
    ],
    steps: [
      'İhtiyacınız olan sosyal profil QR tipini seçin',
      'Kullanıcı adını veya profil URL’sini girin',
      'Ambalaja, fişlere ve tabelalara basın',
      'Kanal bazında tarama hacmini karşılaştırın',
    ],
  },
  'app-download-campaign': {
    title: 'Uygulama İndirme Kampanyaları',
    headline: 'iOS ve Android mağazaları için tek QR',
    metaDescription:
      'Posterler, TV reklamları ve ürün ambalajları için uygulama indirme QR kodları. Otomatik olarak doğru uygulama mağazasına akıllı yönlendirme.',
    keywords: ['uygulama indirme QR kodu', 'App Store QR', 'mobil uygulama pazarlama QR'],
    description:
      'Kullanıcıları herhangi bir basılı veya açık hava yerleşiminden doğru uygulama mağazası sayfasına gönderin. Yeni sürüm yayınladığınızda mağaza URL’lerini değiştirin.',
    benefits: [
      'App Store veya Play Store’a dinamik yönlendirme',
      'Atıf için kampanyaya özel kodlar',
      'Masaüstü tarayıcılar için açılış sayfası yedeği',
      'Bilbordlar için yüksek çözünürlüklü dışa aktarma',
    ],
    steps: [
      'Mağaza bağlantılarıyla bir uygulama indirme QR’ı oluşturun',
      'Büyük format baskı için belirgin bir kod tasarlayın',
      'Her reklam yerleşimine benzersiz kodlar dağıtın',
      'Tarama artışları üzerinden kurulumları izleyin',
    ],
  },
  'feedback-surveys': {
    title: 'Müşteri Geri Bildirimi ve Anketler',
    headline: 'Daha çok yorum ve anket yanıtı',
    metaDescription:
      'Fişlerde, masalarda ve ambalajlarda Google yorumları, NPS anketleri ve geri bildirim formları için QR kodları. Döngüyü daha hızlı kapatın.',
    keywords: ['geri bildirim QR kodu', 'anket QR kodu', 'Google yorum QR'],
    description:
      'Satın alma veya hizmetten hemen sonra yorum bırakmayı ya da anketi tamamlamayı zahmetsiz hale getirin.',
    benefits: [
      'Google, Trustpilot veya Typeform’a bağlantı',
      'Yemek sonrası masa standı yönlendirmeleri',
      'Anket yanıtlarını Slack’e webhook ile gönderin',
      'Yanıt oranını lokasyona göre takip edin',
    ],
    steps: [
      'Yorum veya anket formunuza bir URL QR oluşturun',
      'Fişlere, ambalaja veya masa kartlarına basın',
      'Her lokasyon için ayrı kodlar kullanın',
      'Düşük puan uyarılarını webhook ile takip edin',
    ],
  },
  'employee-onboarding': {
    title: 'Çalışan Oryantasyonu ve İK',
    headline: 'Yeni işe alımlar için kağıtsız oryantasyon',
    metaDescription:
      'Çalışan el kitapları, yan hak kaydı ve BT kurulumu için İK QR kodları. Politikaları klasörleri yeniden basmadan güncelleyin.',
    keywords: ['çalışan oryantasyon QR', 'İK el kitabı QR', 'işyeri QR kodu'],
    description:
      'Yeni işe alınanlar el kitapları, yan hak portalları, Wi‑Fi ve ekipman talepleri için tek bir karşılama sayfasından tarasın.',
    benefits: [
      'Her zaman güncel bağlantıya sahip PDF el kitabı',
      'İlk gün bağlantısı için Wi‑Fi QR',
      'Parola korumalı iç belgeler',
      'Ekip yayılımları için kurumsal SSO',
    ],
    steps: [
      'El kitabı PDF’sini ve portal bağlantılarını birleştirin',
      'Karşılama paketlerine ve yaka kartlarına basın',
      'Hassas bağlantıları parolayla kısıtlayın',
      'Politikalar değiştiğinde hedefleri güncelleyin',
    ],
  },
  'nonprofit-donations': {
    title: 'Sivil Toplum Bağış Kampanyaları',
    headline: 'Posterlerden ve etkinliklerden akıcı bağış',
    metaDescription:
      'Bağış sayfaları, düzenli bağışlar ve etkinlik biletlemesi için bağış toplama QR kodları. Kampanya performansını yerleşime göre takip edin.',
    keywords: ['bağış QR kodu', 'bağış toplama QR', 'hayır kurumu QR kodu'],
    description:
      'Destekçiler bağış yapmak, yürüyüşlere kaydolmak veya kampanya hikayelerini sosyal medyada paylaşmak için tarasın.',
    benefits: [
      'Bağış veya ödeme platformuna bağlantı',
      'Takvim eklemeli etkinlik kaydı',
      'Posterlere, kumbaralara ve postalara basın',
      'Yerel şubeler için coğrafi kampanyalar',
    ],
    steps: [
      'Bağış akışınıza bir URL QR oluşturun',
      'Kurum renkleri ve logosuyla markalayın',
      'Basılı ve etkinlik tabelalarında yayınlayın',
      'Tarama toplamlarını sponsorlara raporlayın',
    ],
  },
  'education-campus': {
    title: 'Kampüs Yön Bulma ve Kaynaklar',
    headline: 'Öğrencilerin oda ve kaynak bulmasına yardımcı olun',
    metaDescription:
      'Kampüs haritaları, ders materyalleri, kulüp kayıtları ve etkinlik takvimleri için üniversite QR kodları. Her dönem kolayca güncelleyin.',
    keywords: ['kampüs QR kodu', 'üniversite QR', 'okul QR kodu'],
    description:
      'Haritalar, LMS bağlantıları ve görüşme saatleri için binalara, ders programlarına ve kulüp ilanlarına kodlar yerleştirin.',
    benefits: [
      'Konum QR’ı bina konumuyla haritaları açar',
      'PDF ders programları ve okuma listeleri',
      'Çok kanallı varlık için kulüp bağlantı merkezleri',
      'Bina veya bölüm bazında analiz',
    ],
    steps: [
      'Ana binalar için harita QR kodları oluşturun',
      'Her ders için ders programı PDF’lerini bağlayın',
      'Oryantasyon materyallerine basın',
      'Bağlantıları her dönem yenileyin',
    ],
  },
  'logistics-tracking': {
    title: 'Lojistik ve Depo Etiketleri',
    headline: 'Palet ve sevkiyatları tarayarak takip edin',
    metaDescription:
      'Sevkiyat takibi, teslim alma belgeleri ve güvenlik kontrol listeleri için lojistik QR kodları. Canlı durum sayfaları için dinamik bağlantılar.',
    keywords: ['lojistik QR kodu', 'depo QR etiketi', 'sevkiyat takip QR'],
    description:
      'Operatörler toplama talimatları, MSDS formları veya teslimat kanıtı portalları için etiketleri tarasın.',
    benefits: [
      'Her sevkiyat partisi için benzersiz dinamik URL',
      'Talep üzerine PDF güvenlik bilgi formları',
      'Etiket serileri için API ile toplu oluşturma',
      'Tarama olaylarını WMS’e webhook ile gönderin',
    ],
    steps: [
      'CSV veya API ile toplu URL kodları oluşturun',
      'Takip veya kontrol listesi sayfalarına bağlayın',
      'Etiketlere ve rampa tabelalarına basın',
      'Tarama webhook’larını WMS ile entegre edin',
    ],
  },
  'video-marketing': {
    title: 'Video ve YouTube Pazarlaması',
    headline: 'Hikayenizi herhangi bir baskıdan oynatın',
    metaDescription:
      'Ambalaj, poster ve perakende ekranları için YouTube ve video QR kodları. Çevrimdışı temas noktalarından izlenme sağlayın.',
    keywords: ['YouTube QR kodu', 'video pazarlama QR', 'QR ile video'],
    description:
      'Basılı kampanyaları doğrudan YouTube’daki veya sitenizdeki ürün demolarına, referanslara veya nasıl yapılır videolarına bağlayın.',
    benefits: [
      'Özel YouTube kanalı veya video QR tipi',
      'Gömülü oynatıcılı açılış sayfası',
      'Hangi yerleşimin izlenme getirdiğini takip edin',
      'Video URL’sini yeniden baskı yapmadan güncelleyin',
    ],
    steps: [
      'Videonuza bir YouTube veya URL QR oluşturun',
      'Açılış sayfasında video oynat CTA’sı kullanın',
      'Ambalaja ve perakende ekranlarına basın',
      'SKU’lar arası tarama oranlarını karşılaştırın',
    ],
  },
  'whatsapp-support': {
    title: 'WhatsApp Müşteri Desteği',
    headline: 'Müşterilerin size anında mesaj atmasını sağlayın',
    metaDescription:
      'Ürün etiketleri, fişler ve mağaza vitrinleri için WhatsApp QR kodları. Siparişler ve destek için önceden doldurulmuş mesajlar.',
    keywords: ['WhatsApp QR kodu', 'WhatsApp business QR', 'müşteri destek QR'],
    description:
      'Müşteriler işletme numaranız ve önceden yazılmış bir sipariş veya destek mesajıyla WhatsApp’ı açmak için tarasın.',
    benefits: [
      'Her SKU için önceden doldurulmuş mesaj şablonları',
      'Ambalaj ve kartvizitlerde çalışır',
      'Tarama hacmini mağazaya göre takip edin',
      'Yönlendirme ile çok dilli mesaj varyantları',
    ],
    steps: [
      'İşletme numaranızla bir WhatsApp QR oluşturun',
      'Siparişler veya destek için varsayılan mesajı belirleyin',
      'Etiketlere, vitrinlere ve fişlere basın',
      'Mesai dışı taramaları SSS sayfasına yönlendirin',
    ],
  },
};
