import type { TranslationTree } from './types';

/** Per-template tagline, use cases and pro tips — keyed by template id */
export const templateMetaEn: TranslationTree = {
    'restaurant-menu': {
      tagline: 'Table-side digital menu — no reprint when prices change',
      useCases: {
        '0': 'Table tents',
        '1': 'Window stickers',
        '2': 'Delivery packaging',
        '3': 'Room service cards',
      },
      tips: {
        '0': 'Print at least 3×3 cm on table tents.',
        '1': 'Enable time-based routing for lunch / dinner menus.',
        '2': 'Use lead capture on landing for reservation requests.',
        '3': 'UTM: source=qr_menu, medium=print.',
      },
    },
    'business-card': {
      tagline: 'One scan saves your full contact to their phone',
      useCases: {
        '0': 'Conference badge',
        '1': 'Email signature',
        '2': 'Office door',
        '3': 'LinkedIn banner',
      },
      tips: {
        '0': 'vCard is static — reprint only when phone or role changes.',
        '1': 'Use error correction H with a center logo.',
        '2': 'Add a dynamic URL QR on the back for your latest portfolio.',
      },
    },
    'wedding': {
      tagline: 'Invitation, RSVP and details — dynamic link, no reprint',
      useCases: {
        '0': 'Printed invitation',
        '1': 'Table cards',
        '2': 'Save-the-date',
        '3': 'Thank-you cards',
      },
      tips: {
        '0': 'Dynamic QR — update registry or gallery link without reprinting.',
        '1': 'Landing + lead form collects RSVP (name, email, guest count).',
        '2': 'Add event date/time in fields above for landing subtitle.',
        '3': 'Test print contrast with scannability score.',
      },
    },
    'event-registration': {
      tagline: 'Scan to register — posters, badges and slides',
      useCases: {
        '0': 'Roll-up banner',
        '1': 'Badge lanyard',
        '2': 'Email campaign',
        '3': 'Last slide',
      },
      tips: {
        '0': 'A/B test two registration pages.',
        '1': 'Schedule QR to go live on announcement day.',
        '2': 'Enable GA4 pixel for poster-to-signup tracking.',
      },
    },
    'instagram-bio': {
      tagline: 'Offline to profile — packaging, store, events',
      useCases: {
        '0': 'Product box',
        '1': 'Store window',
        '2': 'Flyer',
        '3': 'Photo wall',
      },
      tips: {
        '0': 'Dynamic short link → change to a specific post later.',
        '1': 'NFC stickers: add ?src=nfc for source analytics.',
        '2': 'Match gradient to Instagram brand colors.',
      },
    },
    'youtube-channel': {
      tagline: 'Print and packaging → subscribers',
      useCases: {
        '0': 'Video outro',
        '1': 'Merch box',
        '2': 'Course handout',
        '3': 'Slide deck',
      },
      tips: {
        '0': 'Link to onboarding playlist for new viewers.',
        '1': 'Update redirect to latest video without reprinting.',
        '2': 'Red on white scans best — test on dark backgrounds.',
      },
    },
    'portfolio': {
      tagline: 'Show work and capture project leads',
      useCases: {
        '0': 'Exhibition plaque',
        '1': 'Freelance deck',
        '2': 'Behance supplement',
        '3': 'Creative CV',
      },
      tips: {
        '0': 'Lead form: name, email, project type.',
        '1': 'Password-protect confidential client work.',
        '2': 'Transparent PNG on dark exhibition walls.',
      },
    },
    'cv-resume': {
      tagline: 'Recruiters open your latest CV in one scan',
      useCases: {
        '0': 'Job fair',
        '1': 'Resume header',
        '2': 'Networking',
        '3': 'LinkedIn featured',
      },
      tips: {
        '0': 'Name QR "CV 2026" and archive old versions.',
        '1': 'Scan spike before interview = they opened your file.',
        '2': 'Pair with vCard QR on networking cards.',
      },
    },
    'crypto-donate': {
      tagline: 'BTC or ETH receive address — no typos',
      useCases: {
        '0': 'Streamer tip',
        '1': 'Charity poster',
        '2': 'Artist jar',
        '3': 'Event sponsorship',
      },
      tips: {
        '0': 'Static QR — new address needs new print.',
        '1': 'Error correction H + high contrast on dark bg.',
        '2': 'Test with a small send first.',
      },
    },
    'real-estate': {
      tagline: 'Yard sign → listing → viewing request',
      useCases: {
        '0': 'For-sale sign',
        '1': 'Open house flyer',
        '2': 'Broker card',
        '3': 'Rental ad',
      },
      tips: {
        '0': 'Lead form: name, phone, preferred viewing time.',
        '1': 'Geofence for TR vs international buyers.',
        '2': 'Update URL when price drops — same sign QR.',
        '3': 'NFC brochure for high-intent buyers.',
      },
    },
    'wifi-guest': {
      tagline: 'Lobby and room cards — connect without typing passwords',
      useCases: {
        '0': 'Hotel room folder',
        '1': 'Café counter tent',
        '2': 'Co-working lobby',
        '3': 'Airbnb welcome card',
      },
      tips: {
        '0': 'Use a guest VLAN isolated from your business network.',
        '1': 'Rotate passwords monthly in high-traffic venues.',
        '2': 'Print at least 3×3 cm for lobby stands.',
      },
    },
    'retail-stores': {
      tagline: 'Shelf talkers and packaging → product pages and promos',
      useCases: {
        '0': 'Shelf talker',
        '1': 'Product hang tag',
        '2': 'Window display',
        '3': 'Loyalty signup',
      },
      tips: {
        '0': 'UTM tags: source=qr_shelf, medium=print.',
        '1': 'Bulk CSV import for hundreds of SKUs.',
        '2': 'Schedule promo URL swaps by date.',
      },
    },
    'hotels-hospitality': {
      tagline: 'One scan — Wi‑Fi, menus, spa and local guide',
      useCases: {
        '0': 'Room tent card',
        '1': 'Lobby directory',
        '2': 'Pool signage',
        '3': 'Spa menu stand',
      },
      tips: {
        '0': 'Update seasonal spa and restaurant links without reprinting.',
        '1': 'Add language routing for international guests.',
        '2': 'Use hotel landing template for elegant branding.',
      },
    },
    'healthcare-clinics': {
      tagline: 'Patient intake and education — no paper stacks',
      useCases: {
        '0': 'Waiting room poster',
        '1': 'Check-in desk',
        '2': 'Exam room handout',
        '3': 'Post-visit care',
      },
      tips: {
        '0': 'Never put PHI in the QR URL — link to your compliant portal.',
        '1': 'Password-protect staff-only flows.',
        '2': 'Update forms when protocols change — same printed QR.',
      },
    },
    'museums-venues': {
      tagline: 'Exhibit labels → audio, tickets and donations',
      useCases: {
        '0': 'Exhibit plaque',
        '1': 'Gallery zone sign',
        '2': 'Donation stand',
        '3': 'Timed-entry gate',
      },
      tips: {
        '0': 'Multilingual routing by visitor country.',
        '1': 'Track popular exhibits by scan volume.',
        '2': 'Minimum 2×2 cm at arm\'s length viewing distance.',
      },
    },
    'fitness-gyms': {
      tagline: 'Class schedules and memberships from the lobby',
      useCases: {
        '0': 'Lobby schedule board',
        '1': 'Equipment zone',
        '2': 'Trainer poster',
        '3': 'Trial pass promo',
      },
      tips: {
        '0': 'Update weekly class changes without new posters.',
        '1': 'Equipment zone QR → how-to video for each machine.',
        '2': 'Geofence routing for multi-location chains.',
      },
    },
    'salon-spa': {
      tagline: 'Booking and service menus from mirror clings',
      useCases: {
        '0': 'Mirror cling',
        '1': 'Reception desk',
        '2': 'Stylist card',
        '3': 'Retail shelf',
      },
      tips: {
        '0': 'Seasonal promo swaps without reprinting clings.',
        '1': 'Lead form for bridal and event packages.',
        '2': 'Stylist-specific URLs for commission tracking.',
      },
    },
    'nonprofit-fundraising': {
      tagline: 'Donate, volunteer and sign up from printed collateral',
      useCases: {
        '0': 'Gala table tent',
        '1': 'Direct mail insert',
        '2': 'Event poster',
        '3': 'Volunteer booth',
      },
      tips: {
        '0': 'Swap donation URLs between campaigns — same poster QR.',
        '1': 'Track table tents vs posters by batch label.',
        '2': 'A/B test donation page copy on landing.',
      },
    },
    'dental-clinics': {
      tagline: 'Intake, booking and aftercare from chairside',
      useCases: {
        '0': 'Reception poster',
        '1': 'Appointment reminder card',
        '2': 'Chairside aftercare',
        '3': 'Whitening promo',
      },
      tips: {
        '0': 'Link to HIPAA-compliant portal — no PHI in QR.',
        '1': 'Aftercare PDF patients can save to photos.',
        '2': 'Promote hygiene specials on seasonal cards.',
      },
    },
    'home-services': {
      tagline: 'Truck decals and yard signs → booking and reviews',
      useCases: {
        '0': 'Truck decal',
        '1': 'Yard sign',
        '2': 'Door hanger',
        '3': 'Job site sign',
      },
      tips: {
        '0': 'Per-technician QR for territory tracking.',
        '1': 'Rotate seasonal promos on same truck decal.',
        '2': 'Webhook to CRM when lead form submits.',
      },
    },
    'coffee-shops-cafes': {
      tagline: 'Loyalty, menu and ordering from the counter',
      useCases: {
        '0': 'Counter tent',
        '1': 'Table card',
        '2': 'Takeaway cup sleeve',
        '3': 'Loyalty poster',
      },
      tips: {
        '0': 'Pair with a separate Wi‑Fi QR for guest network.',
        '1': 'Update seasonal drinks without reprinting tents.',
        '2': 'UTM: source=qr_counter for attribution.',
      },
    },
    'tourist-attractions': {
      tagline: 'Entrance scan → tickets, audio and maps',
      useCases: {
        '0': 'Entrance gate',
        '1': 'Trail marker',
        '2': 'Ticket booth',
        '3': 'Audio guide post',
      },
      tips: {
        '0': 'Multilingual routing for international tourists.',
        '1': 'Per-entrance QR for crowd flow analytics.',
        '2': 'Update hours and exhibits without reprinting signs.',
      },
    },
    'campus-institution': {
      tagline: 'Maps, services and public info — one scan per location',
      useCases: {
        '0': 'Building placard',
        '1': 'Orientation',
        '2': 'Citizen services',
        '3': 'Department lobby',
      },
      tips: {
        '0': 'Bulk CSV for hundreds of room placards.',
        '1': 'Multilingual routing for international users.',
      },
    },
    'professional-services': {
      tagline: 'Client intake and secure portals — law, insurance, accounting',
      useCases: {
        '0': 'Office lobby',
        '1': 'Business card',
        '2': 'Mailer insert',
        '3': 'Conference booth',
      },
      tips: {
        '0': 'Password-protect sensitive document links.',
        '1': 'Never put PII in the QR URL itself.',
      },
    },
    'retail-grocery': {
      tagline: 'Weekly circular, loyalty signup and price checks from the aisle',
      useCases: {
        '0': 'Weekly flyer stand',
        '1': 'Aisle shelf talker',
        '2': 'Loyalty signup poster',
        '3': 'Checkout counter',
      },
      tips: {
        '0': 'Swap the weekly flyer link every Monday — same printed shelf QR.',
        '1': 'Add a loyalty signup URL to grow your list from the aisle.',
        '2': 'Use a separate QR per store location for footfall analytics.',
      },
    },
    'entertainment-venue': {
      tagline: 'Tickets, showtimes and merch from one poster',
      useCases: {
        '0': 'Lobby poster',
        '1': 'Tap handle',
        '2': 'Event wristband',
        '3': 'Table tent',
      },
      tips: {
        '0': 'Swap show URLs between events — same printed poster QR.',
      },
    },
    'automotive-marine': {
      tagline: 'Inventory, service lane and marina slips',
      useCases: {
        '0': 'Window sticker',
        '1': 'Service lane',
        '2': 'Marina dock',
        '3': 'Detailing bay',
      },
      tips: {
        '0': 'Geofence per lot location.',
        '1': 'Update VDP links when inventory turns.',
      },
    },
    'property-facilities': {
      tagline: 'Tenant portals, coworking and warehouse ops',
      useCases: {
        '0': 'Building lobby',
        '1': 'Dock door',
        '2': 'Member desk',
        '3': 'Unit mailer',
      },
      tips: {
        '0': 'Per-building folders in dashboard.',
        '1': 'Webhook to maintenance ticketing.',
      },
    },
    'specialty-healthcare': {
      tagline: 'Vet, optometry and specialty clinic intake',
      useCases: {
        '0': 'Reception poster',
        '1': 'Appointment card',
        '2': 'Waiting room',
      },
      tips: {
        '0': 'Link to compliant portal — no PHI in QR URL.',
      },
    },
    'family-community': {
      tagline: 'Enrollment, family portals and faith community',
      useCases: {
        '0': 'Lobby sign',
        '1': 'Bulletin insert',
        '2': 'Family mailer',
        '3': 'Event poster',
      },
      tips: {
        '0': 'Password-protect family-only content.',
        '1': 'Update event calendars without reprinting.',
      },
    },
    'mobile-vendor': {
      tagline: 'Food trucks and pop-ups — menu and orders on the go',
      useCases: {
        '0': 'Truck window',
        '1': 'Festival booth',
        '2': 'Social bio',
      },
      tips: {
        '0': 'Update daily location on landing page.',
        '1': 'Same QR on truck all season.',
      },
    },
    'local-services-hub': {
      tagline: 'Booking, intake and promos for neighborhood businesses',
      useCases: {
        '0': 'Storefront',
        '1': 'Vehicle decal',
        '2': 'Counter card',
        '3': 'Yard sign',
      },
      tips: {
        '0': 'Seasonal promo swaps on same truck decal.',
        '1': 'Lead form on landing page.',
      },
    },
    'whatsapp-order': {
      tagline: 'One scan opens a WhatsApp chat — orders and support with no app hunting',
      useCases: { '0': 'Table tent', '1': 'Shop window', '2': 'Delivery packaging', '3': 'Flyer' },
      tips: {
        '0': 'Pre-fill the message with a menu link or "I want to order".',
        '1': 'Use a business number with WhatsApp Business for auto-replies.',
        '2': 'Print at least 3×3 cm on table tents and packaging.',
      },
    },
    'google-review': {
      tagline: 'Send happy customers straight to your Google review form',
      useCases: { '0': 'Counter card', '1': 'Receipt footer', '2': 'Table tent', '3': 'Delivery insert' },
      tips: {
        '0': 'Ask at the moment of delight — after checkout or a great meal.',
        '1': 'Pair with a short line: "Loved it? Scan to leave a review."',
        '2': 'Track scan spikes to see which locations ask most.',
      },
    },
    'tiktok-profile': {
      tagline: 'Turn offline traffic into TikTok followers',
      useCases: { '0': 'Product box', '1': 'Store window', '2': 'Event booth', '3': 'Flyer' },
      tips: {
        '0': 'Dynamic short link — repoint to a campaign later.',
        '1': 'Add ?src=nfc on NFC stickers for source analytics.',
        '2': 'Print on packaging to catch buyers post-purchase.',
      },
    },
    'linkedin-profile': {
      tagline: 'Professional networking from cards, badges and brochures',
      useCases: { '0': 'Conference badge', '1': 'Business card', '2': 'Brochure', '3': 'Email signature' },
      tips: {
        '0': 'Find your slug in your LinkedIn public profile URL.',
        '1': 'Pair with a vCard QR on networking cards.',
        '2': 'High error correction with a center logo scans best.',
      },
    },
    'facebook-page': {
      tagline: 'Grow your Facebook page from print and packaging',
      useCases: { '0': 'Store window', '1': 'Flyer', '2': 'Receipt footer', '3': 'Event poster' },
      tips: {
        '0': 'Use your page vanity URL, not the numeric ID.',
        '1': 'Promote events and offers on the same page.',
        '2': 'Track which print pieces drive the most follows.',
      },
    },
  };

export const templateMetaTr: TranslationTree = {
    'restaurant-menu': {
      tagline: 'Masada dijital menü — fiyat değişince yeniden baskı yok',
      useCases: {
        '0': 'Masa tent kartı',
        '1': 'Vitrin etiketi',
        '2': 'Paket servis ambalajı',
        '3': 'Oda servisi kartı',
      },
      tips: {
        '0': 'Masa tentlerinde en az 3×3 cm baskı yapın.',
        '1': 'Öğle/akşam menüleri için zaman bazlı yönlendirme açın.',
        '2': 'Rezervasyon talepleri için landing\'de lead formu kullanın.',
        '3': 'UTM: source=qr_menu, medium=print.',
      },
    },
    'business-card': {
      tagline: 'Tek tarama ile tüm iletişim bilgileri telefona kaydedilir',
      useCases: {
        '0': 'Konferans rozeti',
        '1': 'E-posta imzası',
        '2': 'Ofis kapısı',
        '3': 'LinkedIn banner',
      },
      tips: {
        '0': 'vCard statiktir — telefon veya ünvan değişince yeniden basın.',
        '1': 'Ortada logo için H hata düzeltme kullanın.',
        '2': 'Arka yüze güncel portfolyo için dinamik URL QR ekleyin.',
      },
    },
    'wedding': {
      tagline: 'Davetiye, RSVP ve detaylar — dinamik link, yeniden baskı yok',
      useCases: {
        '0': 'Basılı davetiye',
        '1': 'Masa kartı',
        '2': 'Save-the-date',
        '3': 'Teşekkür kartı',
      },
      tips: {
        '0': 'Dinamik QR — hediye listesi veya galeri linkini yeniden basmadan güncelleyin.',
        '1': 'Landing + lead formu RSVP toplar (ad, e-posta, misafir sayısı).',
        '2': 'Landing alt başlığı için yukarıdaki tarih/saat alanlarını doldurun.',
        '3': 'Baskı kontrastını tarama skoru ile test edin.',
      },
    },
    'event-registration': {
      tagline: 'Kayıt için tarayın — poster, rozet ve slaytlar',
      useCases: {
        '0': 'Roll-up banner',
        '1': 'Rozet askısı',
        '2': 'E-posta kampanyası',
        '3': 'Son slayt',
      },
      tips: {
        '0': 'İki kayıt sayfasında A/B testi yapın.',
        '1': 'Duyuru gününde QR\'ın yayına girmesini zamanlayın.',
        '2': 'Poster→kayıt takibi için GA4 pikseli açın.',
      },
    },
    'instagram-bio': {
      tagline: 'Çevrimdışından profile — ambalaj, mağaza, etkinlik',
      useCases: {
        '0': 'Ürün kutusu',
        '1': 'Vitrin',
        '2': 'El ilanı',
        '3': 'Fotoğraf duvarı',
      },
      tips: {
        '0': 'Dinamik kısa link → sonra belirli gönderiye yönlendirin.',
        '1': 'NFC etiketler: kaynak analitiği için ?src=nfc ekleyin.',
        '2': 'Gradient\'i Instagram marka renklerine uydurun.',
      },
    },
    'youtube-channel': {
      tagline: 'Baskı ve ambalaj → abone',
      useCases: {
        '0': 'Video outro',
        '1': 'Merch kutusu',
        '2': 'Kurs el notu',
        '3': 'Slayt sunumu',
      },
      tips: {
        '0': 'Yeni izleyiciler için onboarding oynatma listesine bağlayın.',
        '1': 'Yeniden basmadan en son videoya yönlendirmeyi güncelleyin.',
        '2': 'Kırmızı-beyaz en iyi taranır — koyu zeminlerde test edin.',
      },
    },
    'portfolio': {
      tagline: 'İşleri gösterin, proje talebi toplayın',
      useCases: {
        '0': 'Sergi plaketi',
        '1': 'Freelance sunum',
        '2': 'Behance eki',
        '3': 'Yaratıcı CV',
      },
      tips: {
        '0': 'Lead formu: ad, e-posta, proje türü.',
        '1': 'Gizli müşteri işlerini şifreyle koruyun.',
        '2': 'Koyu sergi duvarlarında şeffaf PNG kullanın.',
      },
    },
    'cv-resume': {
      tagline: 'İşverenler tek taramada güncel CV\'nizi açar',
      useCases: {
        '0': 'İş fuarı',
        '1': 'CV başlığı',
        '2': 'Networking',
        '3': 'LinkedIn öne çıkan',
      },
      tips: {
        '0': 'QR\'ı "CV 2026" adlandırın, eski sürümleri arşivleyin.',
        '1': 'Mülakat öncesi tarama artışı = dosyanızı açtılar.',
        '2': 'Networking kartlarında vCard QR ile eşleştirin.',
      },
    },
    'crypto-donate': {
      tagline: 'BTC veya ETH alım adresi — yazım hatası yok',
      useCases: {
        '0': 'Yayıncı bahşişi',
        '1': 'Hayır kurumu posteri',
        '2': 'Sanatçı kavanozu',
        '3': 'Etkinlik sponsorluğu',
      },
      tips: {
        '0': 'Statik QR — yeni adres için yeni baskı gerekir.',
        '1': 'H hata düzeltme + koyu zeminde yüksek kontrast.',
        '2': 'Önce küçük bir transferle test edin.',
      },
    },
    'real-estate': {
      tagline: 'Bahçe tabelası → ilan → görüntüleme talebi',
      useCases: {
        '0': 'Satılık tabela',
        '1': 'Açık ev el ilanı',
        '2': 'Emlakçı kartı',
        '3': 'Kiralık ilan',
      },
      tips: {
        '0': 'Lead formu: ad, telefon, tercih edilen görüntüleme saati.',
        '1': 'TR ve yabancı alıcılar için geofence.',
        '2': 'Fiyat düşünce URL güncelleyin — aynı tabela QR\'ı.',
        '3': 'Yüksek niyetli alıcılar için NFC broşür.',
      },
    },
    'wifi-guest': {
      tagline: 'Lobi ve oda kartları — şifre yazmadan bağlanın',
      useCases: {
        '0': 'Otel oda klasörü',
        '1': 'Kafe tezgah tenti',
        '2': 'Co-working lobisi',
        '3': 'Airbnb karşılama kartı',
      },
      tips: {
        '0': 'İş ağınızdan ayrı misafir VLAN kullanın.',
        '1': 'Yoğun mekanlarda şifreleri aylık yenileyin.',
        '2': 'Lobi standları için en az 3×3 cm baskı.',
      },
    },
    'retail-stores': {
      tagline: 'Raf etiketleri ve ambalaj → ürün sayfaları ve promosyonlar',
      useCases: {
        '0': 'Raf etiketi',
        '1': 'Ürün askı etiketi',
        '2': 'Vitrin',
        '3': 'Sadakat kaydı',
      },
      tips: {
        '0': 'UTM etiketleri: source=qr_shelf, medium=print.',
        '1': 'Yüzlerce SKU için toplu CSV içe aktarma.',
        '2': 'Promosyon URL\'lerini tarihe göre zamanlayın.',
      },
    },
    'hotels-hospitality': {
      tagline: 'Tek tarama — Wi‑Fi, menüler, spa ve yerel rehber',
      useCases: {
        '0': 'Oda tent kartı',
        '1': 'Lobi rehberi',
        '2': 'Havuz tabelası',
        '3': 'Spa menü standı',
      },
      tips: {
        '0': 'Mevsimlik spa ve restoran linklerini yeniden basmadan güncelleyin.',
        '1': 'Uluslararası misafirler için dil yönlendirmesi ekleyin.',
        '2': 'Zarif marka için otel landing şablonu kullanın.',
      },
    },
    'healthcare-clinics': {
      tagline: 'Hasta kaydı ve eğitim — kağıt yığını yok',
      useCases: {
        '0': 'Bekleme odası posteri',
        '1': 'Kayıt masası',
        '2': 'Muayene odası el ilanı',
        '3': 'Ziyaret sonrası bakım',
      },
      tips: {
        '0': 'QR URL\'sine PHI koymayın — uyumlu portala bağlayın.',
        '1': 'Yalnızca personele özel akışları şifreleyin.',
        '2': 'Protokol değişince formları güncelleyin — aynı basılı QR.',
      },
    },
    'museums-venues': {
      tagline: 'Sergi etiketleri → ses, bilet ve bağış',
      useCases: {
        '0': 'Sergi plaketi',
        '1': 'Galeri bölge tabelası',
        '2': 'Bağış standı',
        '3': 'Zamanlı giriş kapısı',
      },
      tips: {
        '0': 'Ziyaretçi ülkesine göre çok dilli yönlendirme.',
        '1': 'Popüler sergileri tarama hacmiyle izleyin.',
        '2': 'Kol mesafesinde görüntüleme için minimum 2×2 cm.',
      },
    },
    'fitness-gyms': {
      tagline: 'Ders programları ve üyelik lobiden',
      useCases: {
        '0': 'Lobi program panosu',
        '1': 'Ekipman bölgesi',
        '2': 'Antrenör posteri',
        '3': 'Deneme üyelik promosu',
      },
      tips: {
        '0': 'Haftalık ders değişikliklerini yeni poster olmadan güncelleyin.',
        '1': 'Ekipman bölgesi QR → her makine için nasıl yapılır videosu.',
        '2': 'Çok şubeli zincirler için geofence yönlendirme.',
      },
    },
    'salon-spa': {
      tagline: 'Ayna etiketlerinden randevu ve hizmet menüleri',
      useCases: {
        '0': 'Ayna etiketi',
        '1': 'Resepsiyon',
        '2': 'Stilist kartı',
        '3': 'Perakende rafı',
      },
      tips: {
        '0': 'Mevsimlik promosyonları etiketleri yeniden basmadan değiştirin.',
        '1': 'Gelin ve etkinlik paketleri için lead formu.',
        '2': 'Komisyon takibi için stilist bazlı URL\'ler.',
      },
    },
    'nonprofit-fundraising': {
      tagline: 'Basılı materyallerden bağış, gönüllülük ve kayıt',
      useCases: {
        '0': 'Gala masa tenti',
        '1': 'Direkt posta eki',
        '2': 'Etkinlik posteri',
        '3': 'Gönüllü standı',
      },
      tips: {
        '0': 'Kampanyalar arası bağış URL\'lerini değiştirin — aynı poster QR\'ı.',
        '1': 'Masa tentleri vs posterleri parti etiketiyle izleyin.',
        '2': 'Landing\'de bağış sayfası metninde A/B testi.',
      },
    },
    'dental-clinics': {
      tagline: 'Koltuk başından kayıt, randevu ve sonrası bakım',
      useCases: {
        '0': 'Resepsiyon posteri',
        '1': 'Randevu hatırlatma kartı',
        '2': 'Koltuk başı bakım',
        '3': 'Beyazlatma promosu',
      },
      tips: {
        '0': 'HIPAA uyumlu portala bağlayın — QR\'da PHI olmasın.',
        '1': 'Hastaların fotoğraflara kaydedebileceği bakım PDF\'i.',
        '2': 'Mevsimlik kartlarda hijyen kampanyaları.',
      },
    },
    'home-services': {
      tagline: 'Kamyon etiketi ve bahçe tabelası → randevu ve yorumlar',
      useCases: {
        '0': 'Kamyon etiketi',
        '1': 'Bahçe tabelası',
        '2': 'Kapı askısı',
        '3': 'İş sahası tabelası',
      },
      tips: {
        '0': 'Bölge takibi için teknisyen bazlı QR.',
        '1': 'Aynı kamyon etiketinde mevsimlik promosyon değişimi.',
        '2': 'Lead formu gönderiminde CRM webhook.',
      },
    },
    'coffee-shops-cafes': {
      tagline: 'Tezgâhtan sadakat, menü ve sipariş',
      useCases: {
        '0': 'Tezgah tenti',
        '1': 'Masa kartı',
        '2': 'Paket bardak kılıfı',
        '3': 'Sadakat posteri',
      },
      tips: {
        '0': 'Misafir ağı için ayrı Wi‑Fi QR ile eşleştirin.',
        '1': 'Mevsimlik içecekleri tentleri yeniden basmadan güncelleyin.',
        '2': 'UTM: source=qr_counter atıf için.',
      },
    },
    'tourist-attractions': {
      tagline: 'Giriş taraması → bilet, ses rehberi ve haritalar',
      useCases: {
        '0': 'Giriş kapısı',
        '1': 'Patika işareti',
        '2': 'Bilet gişesi',
        '3': 'Ses rehberi direği',
      },
      tips: {
        '0': 'Uluslararası turistler için çok dilli yönlendirme.',
        '1': 'Kalabalık akışı analitiği için giriş bazlı QR.',
        '2': 'Saat ve sergileri tabelaları yeniden basmadan güncelleyin.',
      },
    },
    'campus-institution': {
      tagline: 'Haritalar, hizmetler ve kamu bilgisi — konum başına tek tarama',
      useCases: {
        '0': 'Bina plaketi',
        '1': 'Oryantasyon',
        '2': 'Vatandaş hizmetleri',
        '3': 'Bölüm lobisi',
      },
      tips: {
        '0': 'Yüzlerce oda plaketi için toplu CSV.',
        '1': 'Uluslararası kullanıcılar için çok dilli yönlendirme.',
      },
    },
    'professional-services': {
      tagline: 'Müvekkil kaydı ve güvenli portallar — hukuk, sigorta, muhasebe',
      useCases: {
        '0': 'Ofis lobisi',
        '1': 'Kartvizit',
        '2': 'Posta eki',
        '3': 'Konferans standı',
      },
      tips: {
        '0': 'Hassas belge linklerini şifreyle koruyun.',
        '1': 'QR URL\'sine asla PII koymayın.',
      },
    },
    'retail-grocery': {
      tagline: 'Reyondan haftalık broşür, sadakat kaydı ve fiyat kontrolü',
      useCases: {
        '0': 'Haftalık broşür standı',
        '1': 'Reyon raf etiketi',
        '2': 'Sadakat kayıt posteri',
        '3': 'Kasa önü',
      },
      tips: {
        '0': 'Haftalık broşür linkini her Pazartesi değiştirin — aynı basılı raf QR\'ı.',
        '1': 'Reyondan liste büyütmek için sadakat kayıt URL\'i ekleyin.',
        '2': 'Ayak trafiği analizi için mağaza başına ayrı QR kullanın.',
      },
    },
    'entertainment-venue': {
      tagline: 'Tek posterden bilet, seans saatleri ve merch',
      useCases: {
        '0': 'Lobi posteri',
        '1': 'Musluk başlığı',
        '2': 'Etkinlik bilekliği',
        '3': 'Masa tenti',
      },
      tips: {
        '0': 'Etkinlikler arası gösteri URL\'lerini değiştirin — aynı poster QR\'ı.',
      },
    },
    'automotive-marine': {
      tagline: 'Envanter, servis şeridi ve marina bağlama yerleri',
      useCases: {
        '0': 'Vitrin etiketi',
        '1': 'Servis şeridi',
        '2': 'Marina iskelesi',
        '3': 'Detay bayı',
      },
      tips: {
        '0': 'Her otopark konumu için geofence.',
        '1': 'Envanter değişince VDP linklerini güncelleyin.',
      },
    },
    'property-facilities': {
      tagline: 'Kiracı portalları, coworking ve depo operasyonları',
      useCases: {
        '0': 'Bina lobisi',
        '1': 'Yükleme kapısı',
        '2': 'Üye masası',
        '3': 'Daire postası',
      },
      tips: {
        '0': 'Panelde bina bazlı klasörler.',
        '1': 'Bakım talebi için webhook.',
      },
    },
    'specialty-healthcare': {
      tagline: 'Veteriner, optik ve uzman klinik kaydı',
      useCases: {
        '0': 'Resepsiyon posteri',
        '1': 'Randevu kartı',
        '2': 'Bekleme odası',
      },
      tips: {
        '0': 'Uyumlu portala bağlayın — QR URL\'sinde PHI olmasın.',
      },
    },
    'family-community': {
      tagline: 'Kayıt, aile portalları ve inanç topluluğu',
      useCases: {
        '0': 'Lobi tabelası',
        '1': 'Bülten eki',
        '2': 'Aile postası',
        '3': 'Etkinlik posteri',
      },
      tips: {
        '0': 'Yalnızca aileye özel içeriği şifreyle koruyun.',
        '1': 'Etkinlik takvimlerini yeniden basmadan güncelleyin.',
      },
    },
    'mobile-vendor': {
      tagline: 'Food truck ve pop-up — hareket halinde menü ve sipariş',
      useCases: {
        '0': 'Kamyon camı',
        '1': 'Festival standı',
        '2': 'Sosyal bio',
      },
      tips: {
        '0': 'Günlük konumu landing sayfasında güncelleyin.',
        '1': 'Tüm sezon aynı kamyon QR\'ı.',
      },
    },
    'local-services-hub': {
      tagline: 'Mahalle işletmeleri için randevu, kayıt ve promosyon',
      useCases: {
        '0': 'Vitrin',
        '1': 'Araç etiketi',
        '2': 'Tezgah kartı',
        '3': 'Bahçe tabelası',
      },
      tips: {
        '0': 'Aynı kamyon etiketinde mevsimlik promosyon değişimi.',
        '1': 'Landing sayfasında lead formu.',
      },
    },
    'whatsapp-order': {
      tagline: 'Tek tarama WhatsApp sohbetini açar — uygulama aramadan sipariş ve destek',
      useCases: { '0': 'Masa kartı', '1': 'Vitrin', '2': 'Teslimat paketi', '3': 'El ilanı' },
      tips: {
        '0': 'Mesajı menü linki veya "Sipariş vermek istiyorum" ile önceden doldurun.',
        '1': 'Otomatik yanıt için WhatsApp Business numarası kullanın.',
        '2': 'Masa kartı ve pakette en az 3×3 cm basın.',
      },
    },
    'google-review': {
      tagline: 'Memnun müşterileri doğrudan Google yorum formuna gönderin',
      useCases: { '0': 'Tezgah kartı', '1': 'Fiş altı', '2': 'Masa kartı', '3': 'Teslimat kartı' },
      tips: {
        '0': 'En keyifli anda isteyin — ödeme veya güzel bir yemekten sonra.',
        '1': 'Kısa bir cümleyle eşleştirin: "Beğendiniz mi? Yorum için tarayın."',
        '2': 'Hangi şubenin daha çok istediğini tarama artışından izleyin.',
      },
    },
    'tiktok-profile': {
      tagline: 'Çevrimdışı trafiği TikTok takipçisine dönüştürün',
      useCases: { '0': 'Ürün kutusu', '1': 'Vitrin', '2': 'Etkinlik standı', '3': 'El ilanı' },
      tips: {
        '0': 'Dinamik kısa link — sonra bir kampanyaya yönlendirin.',
        '1': 'NFC etiketlerinde kaynak analizi için ?src=nfc ekleyin.',
        '2': 'Satın alma sonrası yakalamak için pakete basın.',
      },
    },
    'linkedin-profile': {
      tagline: 'Kartvizit, yaka kartı ve broşürlerden profesyonel networking',
      useCases: { '0': 'Konferans yaka kartı', '1': 'Kartvizit', '2': 'Broşür', '3': 'E-posta imzası' },
      tips: {
        '0': 'Slug\'ınızı LinkedIn herkese açık profil adresinizde bulun.',
        '1': 'Networking kartlarında vCard QR ile eşleştirin.',
        '2': 'Merkez logoyla yüksek hata düzeltme en iyi taranır.',
      },
    },
    'facebook-page': {
      tagline: 'Baskı ve paketlemeden Facebook sayfanızı büyütün',
      useCases: { '0': 'Vitrin', '1': 'El ilanı', '2': 'Fiş altı', '3': 'Etkinlik afişi' },
      tips: {
        '0': 'Sayısal ID değil, sayfa özel adını (vanity URL) kullanın.',
        '1': 'Aynı sayfada etkinlik ve teklifleri tanıtın.',
        '2': 'Hangi baskının en çok takip getirdiğini izleyin.',
      },
    },
  };
