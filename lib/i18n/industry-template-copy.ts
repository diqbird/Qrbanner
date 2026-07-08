import type { TranslationTree } from './types';
import {
  extraCoreFieldsEn,
  extraCoreFieldsTr,
  extraCoreSectionsEn,
  extraCoreSectionsTr,
} from './core-template-copy-extra';

const namesEn: TranslationTree = {
  'restaurant-menu': 'Restaurant Menu',
  'business-card': 'Digital Business Card',
  wedding: 'Wedding & RSVP',
  'event-registration': 'Event Registration',
  'instagram-bio': 'Instagram Bio',
  'youtube-channel': 'YouTube Channel',
  portfolio: 'Creative Portfolio',
  'cv-resume': 'CV & Resume',
  'crypto-donate': 'Crypto Donate',
  'real-estate': 'Real Estate Listing',
  'wifi-guest': 'Guest Wi‑Fi',
  'retail-stores': 'Retail & Product',
  'hotels-hospitality': 'Hotel & Hospitality',
  'healthcare-clinics': 'Healthcare Clinic',
  'museums-venues': 'Museum & Venue',
  'fitness-gyms': 'Fitness & Gym',
  'salon-spa': 'Salon & Spa',
  'nonprofit-fundraising': 'Nonprofit Fundraising',
  'dental-clinics': 'Dental Clinic',
  'home-services': 'Home Services',
  'coffee-shops-cafes': 'Coffee Shop & Cafe',
  'tourist-attractions': 'Tourist Attraction',
  'campus-institution': 'Campus & Institution',
  'professional-services': 'Professional Services',
  'retail-grocery': 'Supermarket & Grocery',
  'entertainment-venue': 'Entertainment Venue',
  'automotive-marine': 'Automotive & Marine',
  'property-facilities': 'Property & Facilities',
  'specialty-healthcare': 'Specialty Healthcare',
  'family-community': 'Family & Community',
  'mobile-vendor': 'Mobile Vendor',
  'local-services-hub': 'Local Services',
  'whatsapp-order': 'WhatsApp Orders',
  'google-review': 'Google Reviews',
  'tiktok-profile': 'TikTok Profile',
  'linkedin-profile': 'LinkedIn Profile',
  'facebook-page': 'Facebook Page',
};

const namesTr: TranslationTree = {
  'restaurant-menu': 'Restoran Menüsü',
  'business-card': 'Dijital Kartvizit',
  wedding: 'Düğün & RSVP',
  'event-registration': 'Etkinlik Kaydı',
  'instagram-bio': 'Instagram Bio',
  'youtube-channel': 'YouTube Kanalı',
  portfolio: 'Yaratıcı Portfolyo',
  'cv-resume': 'CV & Özgeçmiş',
  'crypto-donate': 'Kripto Bağış',
  'real-estate': 'Emlak İlanı',
  'wifi-guest': 'Misafir Wi‑Fi',
  'retail-stores': 'Perakende & Ürün',
  'hotels-hospitality': 'Otel & Konaklama',
  'healthcare-clinics': 'Sağlık Kliniği',
  'museums-venues': 'Müze & Mekan',
  'fitness-gyms': 'Fitness & Spor Salonu',
  'salon-spa': 'Salon & Spa',
  'nonprofit-fundraising': 'STK & Bağış',
  'dental-clinics': 'Diş Kliniği',
  'home-services': 'Ev Hizmetleri',
  'coffee-shops-cafes': 'Kafe & Kahve',
  'tourist-attractions': 'Turistik Mekan',
  'campus-institution': 'Kampüs & Kurum',
  'professional-services': 'Profesyonel Hizmetler',
  'retail-grocery': 'Süpermarket & Market',
  'entertainment-venue': 'Eğlence Mekanı',
  'automotive-marine': 'Otomotiv & Denizcilik',
  'property-facilities': 'Tesis & Gayrimenkul',
  'specialty-healthcare': 'Uzman Sağlık',
  'family-community': 'Aile & Topluluk',
  'mobile-vendor': 'Mobil Satıcı',
  'local-services-hub': 'Yerel Hizmetler',
  'whatsapp-order': 'WhatsApp Sipariş',
  'google-review': 'Google Yorumları',
  'tiktok-profile': 'TikTok Profili',
  'linkedin-profile': 'LinkedIn Profili',
  'facebook-page': 'Facebook Sayfası',
};

const coreSectionsEn: TranslationTree = {
  'restaurant-menu': {
    venue: { title: 'Venue & brand', description: 'How guests recognize you before they open the menu.' },
    'menu-link': { title: 'Menu destination', description: 'Link to your digital menu (website, PDF, or menu platform).' },
    service: { title: 'Service extras', description: 'Paths guests often need from the same campaign.' },
  },
  'business-card': {
    personal: { title: 'Personal details', description: 'Name and role on the saved contact card.' },
    company: { title: 'Company', description: 'Organization name and website.' },
    reach: { title: 'Contact channels', description: 'Mobile-first — include country code.' },
    location: { title: 'Office address (optional)', description: 'Helps maps and navigation apps.' },
  },
  'wifi-guest': {
    venue: { title: 'Venue label', description: 'Printed name on your Wi‑Fi sign — not encoded in the QR.' },
    network: { title: 'Guest network', description: 'SSID, password and security type for automatic join.' },
  },
};

const coreSectionsTr: TranslationTree = {
  'restaurant-menu': {
    venue: { title: 'Mekan ve marka', description: 'Misafirler menüyü açmadan önce sizi nasıl tanır.' },
    'menu-link': { title: 'Menü hedefi', description: 'Dijital menünüze link (web sitesi, PDF veya menü platformu).' },
    service: { title: 'Ek hizmetler', description: 'Aynı kampanyadan sık ihtiyaç duyulan yollar.' },
  },
  'business-card': {
    personal: { title: 'Kişisel bilgiler', description: 'Kaydedilen kartvizitte görünen ad ve ünvan.' },
    company: { title: 'Şirket', description: 'Kurum adı ve web sitesi.' },
    reach: { title: 'İletişim kanalları', description: 'Mobil öncelikli — ülke kodu ekleyin.' },
    location: { title: 'Ofis adresi (isteğe bağlı)', description: 'Harita ve navigasyon uygulamalarına yardımcı olur.' },
  },
  'wifi-guest': {
    venue: { title: 'Mekan etiketi', description: 'Wi‑Fi tabelasında basılı ad — QR içinde kodlanmaz.' },
    network: { title: 'Misafir ağı', description: 'Otomatik bağlantı için SSID, şifre ve güvenlik türü.' },
  },
};

const coreFieldsEn: TranslationTree = {
  'restaurant-menu': {
    _venueName: { label: 'Restaurant name', placeholder: 'e.g. The Garden Bistro' },
    url: { label: 'Menu URL', placeholder: 'https://yourrestaurant.com/menu' },
    _wifiNote: { label: 'Wi‑Fi note (optional)' },
    _reservationUrl: { label: 'Reservations link (optional)' },
  },
  'business-card': {
    title: { label: 'Job title', placeholder: 'Sales Director' },
    org: { label: 'Company name', placeholder: 'Acme Inc.' },
  },
  'wifi-guest': {
    _venueName: { label: 'Venue name', placeholder: 'e.g. Harbor Hotel Lobby' },
    ssid: { label: 'Network name (SSID)', placeholder: 'Guest_WiFi' },
    password: { label: 'Password', placeholder: 'guest2026' },
    encryption: {
      label: 'Security type',
      options: {
        WPA: 'WPA / WPA2',
        WEP: 'WEP',
        nopass: 'Open (no password)',
      },
    },
  },
};

const coreFieldsTr: TranslationTree = {
  'restaurant-menu': {
    _venueName: { label: 'Restoran adı', placeholder: 'ör. Bahçe Bistro' },
    url: { label: 'Menü linki', placeholder: 'https://restoraniniz.com/menu' },
    _wifiNote: { label: 'Wi‑Fi notu (isteğe bağlı)' },
    _reservationUrl: { label: 'Rezervasyon linki (isteğe bağlı)' },
  },
  'business-card': {
    title: { label: 'Ünvan', placeholder: 'Satış Müdürü' },
    org: { label: 'Şirket adı', placeholder: 'Örnek A.Ş.' },
  },
  'wifi-guest': {
    _venueName: { label: 'Mekan adı', placeholder: 'ör. Liman Otel Lobisi' },
    ssid: { label: 'Ağ adı (SSID)', placeholder: 'Misafir_WiFi' },
    password: { label: 'Şifre', placeholder: 'misafir2026' },
    encryption: {
      label: 'Güvenlik türü',
      options: {
        WPA: 'WPA / WPA2',
        WEP: 'WEP',
        nopass: 'Açık (şifresiz)',
      },
    },
  },
};

const archetypeSectionsEn: TranslationTree = {
  'campus-institution': {
    link: { title: 'Destination', description: 'Portal, map or service page.' },
    org: { title: 'Organization', description: 'Shown on landing page.' },
  },
  'professional-services': {
    portal: { title: 'Client destination', description: 'Intake form or secure document portal.' },
    firm: { title: 'Firm details', description: 'Shown on landing page and print collateral.' },
  },
  'retail-grocery': {
    circular: { title: 'Weekly deals link', description: 'Your live weekly flyer, circular or deals page — update it without reprinting shelf signs.' },
    store: { title: 'Store details', description: 'Shown on the landing page for shoppers.' },
  },
  'entertainment-venue': {
    tickets: { title: 'Ticketing', description: 'Ticket sales, showtimes or event registration.' },
    venue: { title: 'Venue & show details', description: 'Shown on the landing page before redirect.' },
  },
  'automotive-marine': {
    listing: { title: 'Vehicle or service link', description: 'Inventory page, VDP or service booking.' },
    business: { title: 'Business details', description: 'Shown on the landing page and print collateral.' },
  },
  'property-facilities': {
    portal: { title: 'Portal link', description: 'Tenant, member or warehouse operations portal.' },
    building: { title: 'Building details', description: 'Shown on the landing page for tenants and members.' },
  },
  'specialty-healthcare': {
    intake: { title: 'Intake destination', description: 'Patient or pet intake and appointment booking.' },
    clinic: { title: 'Clinic details', description: 'Shown on the landing page — never encode PHI in the QR link.' },
  },
  'family-community': {
    community: { title: 'Community link', description: 'Enrollment, family portal or faith community hub.' },
    org: { title: 'Organization details', description: 'Shown on the landing page for families and members.' },
  },
  'mobile-vendor': {
    menu: { title: 'Menu or order link', description: 'Daily menu, mobile ordering or location updates.' },
  },
  'local-services-hub': {
    booking: { title: 'Service link', description: 'Online booking, quote request or service promo.' },
  },
  'whatsapp-order': {
    number: { title: 'WhatsApp number', description: 'Include country code — scanners open a chat with this number.' },
    message: { title: 'Pre-written message', description: 'Optional — pre-fills the chat so customers start faster.' },
  },
  'google-review': {
    'review-link': { title: 'Google review link', description: 'Paste your "write a review" short link from Google Business Profile.' },
    business: { title: 'Business name', description: 'Shown on the card — not encoded in the link.' },
  },
  'tiktok-profile': {
    profile: { title: 'TikTok username', description: 'Without @ — opens tiktok.com/@username.' },
  },
  'linkedin-profile': {
    profile: { title: 'LinkedIn profile', description: 'Your public profile slug — opens linkedin.com/in/slug.' },
  },
  'facebook-page': {
    profile: { title: 'Facebook page', description: 'Page username or vanity name — opens facebook.com/name.' },
  },
};

const archetypeSectionsTr: TranslationTree = {
  'campus-institution': {
    link: { title: 'Hedef', description: 'Portal, harita veya hizmet sayfası.' },
    org: { title: 'Kurum', description: 'Açılış sayfasında gösterilir.' },
  },
  'professional-services': {
    portal: { title: 'Müşteri hedefi', description: 'Kayıt formu veya güvenli belge portalı.' },
    firm: { title: 'Firma bilgileri', description: 'Açılış sayfasında ve baskı materyallerinde gösterilir.' },
  },
  'retail-grocery': {
    circular: { title: 'Haftalık fırsat linki', description: 'Canlı haftalık broşür veya fırsat sayfanız — raf tabelalarını yeniden basmadan güncelleyin.' },
    store: { title: 'Mağaza bilgileri', description: 'Müşteriler için açılış sayfasında gösterilir.' },
  },
  'entertainment-venue': {
    tickets: { title: 'Bilet', description: 'Bilet satışı, seans saatleri veya etkinlik kaydı.' },
    venue: { title: 'Mekan & gösteri bilgileri', description: 'Yönlendirmeden önce açılış sayfasında gösterilir.' },
  },
  'automotive-marine': {
    listing: { title: 'Araç veya hizmet linki', description: 'Envanter sayfası, ilan detayı veya servis randevusu.' },
    business: { title: 'İşletme bilgileri', description: 'Açılış sayfasında ve baskı materyallerinde gösterilir.' },
  },
  'property-facilities': {
    portal: { title: 'Portal linki', description: 'Kiracı, üye veya depo operasyon portalı.' },
    building: { title: 'Bina bilgileri', description: 'Kiracılar ve üyeler için açılış sayfasında gösterilir.' },
  },
  'specialty-healthcare': {
    intake: { title: 'Kayıt hedefi', description: 'Hasta veya evcil hayvan kaydı ve randevu.' },
    clinic: { title: 'Klinik bilgileri', description: 'Açılış sayfasında gösterilir — QR linkine asla PHI kodlamayın.' },
  },
  'family-community': {
    community: { title: 'Topluluk linki', description: 'Kayıt, aile portalı veya inanç topluluğu merkezi.' },
    org: { title: 'Kuruluş bilgileri', description: 'Aileler ve üyeler için açılış sayfasında gösterilir.' },
  },
  'mobile-vendor': {
    menu: { title: 'Menü veya sipariş linki', description: 'Günlük menü, mobil sipariş veya konum güncellemesi.' },
  },
  'local-services-hub': {
    booking: { title: 'Hizmet linki', description: 'Online randevu, teklif talebi veya hizmet promosyonu.' },
  },
  'whatsapp-order': {
    number: { title: 'WhatsApp numarası', description: 'Ülke kodunu ekleyin — tarayanlar bu numarayla sohbet açar.' },
    message: { title: 'Hazır mesaj', description: 'İsteğe bağlı — sohbeti önceden doldurur, müşteri daha hızlı başlar.' },
  },
  'google-review': {
    'review-link': { title: 'Google yorum linki', description: 'Google İşletme Profili\'ndeki "yorum yaz" kısa linkini yapıştırın.' },
    business: { title: 'İşletme adı', description: 'Kartta gösterilir — linke kodlanmaz.' },
  },
  'tiktok-profile': {
    profile: { title: 'TikTok kullanıcı adı', description: '@ olmadan — tiktok.com/@kullanıcıadı açılır.' },
  },
  'linkedin-profile': {
    profile: { title: 'LinkedIn profili', description: 'Herkese açık profil slug\'ınız — linkedin.com/in/slug açılır.' },
  },
  'facebook-page': {
    profile: { title: 'Facebook sayfası', description: 'Sayfa kullanıcı adı veya özel adı — facebook.com/ad açılır.' },
  },
};

const archetypeFieldsEn: TranslationTree = {
  'campus-institution': {
    url: { label: 'URL', placeholder: 'https://campus.edu/services' },
    _orgName: { label: 'Institution name', placeholder: 'State University' },
    _department: { label: 'Department / office', placeholder: 'Student Affairs' },
  },
  'professional-services': {
    url: { label: 'Portal URL', placeholder: 'https://yourfirm.com/intake' },
    _firmName: { label: 'Firm name' },
    _practiceArea: { label: 'Practice area', placeholder: 'Tax · Litigation · P&C' },
  },
  'retail-grocery': {
    url: { label: 'Weekly deals URL', placeholder: 'https://yourstore.com/weekly' },
    _storeName: { label: 'Store name', placeholder: 'FreshMart Kadıköy' },
    _loyaltyUrl: { label: 'Loyalty signup URL', placeholder: 'https://yourstore.com/loyalty' },
    _weekOf: { label: 'Valid dates', placeholder: 'Valid 8–14 July' },
    _openHours: { label: 'Opening hours', placeholder: 'Daily 08:00–22:00' },
  },
  'entertainment-venue': {
    url: { label: 'Tickets URL' },
    _venueName: { label: 'Venue name' },
    _event: { label: 'Show / release' },
    _showtimes: { label: 'Showtimes', placeholder: 'Fri–Sun · 20:00' },
    _merchUrl: { label: 'Merch / info URL' },
  },
  'automotive-marine': {
    url: { label: 'Listing / booking URL' },
    _businessName: { label: 'Dealership / marina' },
    _stockInfo: { label: 'Stock / model info', placeholder: '2024 models · 45 in stock' },
    _servicePromo: { label: 'Service offer', placeholder: 'Free multi-point inspection' },
    _agentPhone: { label: 'Sales / service phone' },
  },
  'property-facilities': {
    url: { label: 'Portal URL' },
    _buildingName: { label: 'Building / site' },
    _unitInfo: { label: 'Unit / floor info', placeholder: 'Floors 1–12 · 240 units' },
    _managerContact: { label: 'Management contact' },
    _maintenanceUrl: { label: 'Maintenance request URL' },
  },
  'specialty-healthcare': {
    url: { label: 'Intake URL' },
    _clinicName: { label: 'Clinic name' },
    _specialty: { label: 'Specialty', placeholder: 'Veterinary · Optometry · Dermatology' },
    _bookingPhone: { label: 'Booking phone' },
    _hours: { label: 'Hours', placeholder: 'Mon–Fri 9:00–18:00' },
  },
  'family-community': {
    url: { label: 'Portal URL' },
    _orgName: { label: 'Organization' },
    _programType: { label: 'Program type', placeholder: 'Childcare · Senior living · Faith community' },
    _scheduleInfo: { label: 'Schedule / hours' },
    _contactInfo: { label: 'Contact' },
  },
  'mobile-vendor': {
    url: { label: 'Menu URL' },
    _truckName: { label: 'Vendor name' },
    _location: { label: "Today's location" },
  },
  'local-services-hub': {
    url: { label: 'Booking URL' },
    _businessName: { label: 'Business name' },
    _offer: { label: 'Current offer' },
  },
  'whatsapp-order': {
    phone: { label: 'WhatsApp number', placeholder: '+90 532 000 00 00' },
    message: { label: 'Message', placeholder: 'Hi! I would like to order…' },
  },
  'google-review': {
    url: { label: 'Review URL', placeholder: 'https://g.page/r/…/review' },
    _businessName: { label: 'Business name', placeholder: 'The Garden Bistro' },
  },
  'tiktok-profile': {
    username: { label: 'Username', placeholder: 'yourbrand' },
  },
  'linkedin-profile': {
    username: { label: 'Profile slug', placeholder: 'ayse-yilmaz' },
  },
  'facebook-page': {
    username: { label: 'Page name', placeholder: 'yourbusiness' },
  },
};

const archetypeFieldsTr: TranslationTree = {
  'campus-institution': {
    url: { label: 'URL', placeholder: 'https://kampus.edu/hizmetler' },
    _orgName: { label: 'Kurum adı', placeholder: 'Devlet Üniversitesi' },
    _department: { label: 'Bölüm / ofis', placeholder: 'Öğrenci İşleri' },
  },
  'professional-services': {
    url: { label: 'Portal URL', placeholder: 'https://firmaniz.com/kayit' },
    _firmName: { label: 'Firma adı' },
    _practiceArea: { label: 'Uzmanlık alanı', placeholder: 'Vergi · Dava · Sigorta' },
  },
  'retail-grocery': {
    url: { label: 'Haftalık fırsat URL', placeholder: 'https://magazaniz.com/haftalik' },
    _storeName: { label: 'Mağaza adı', placeholder: 'FreshMart Kadıköy' },
    _loyaltyUrl: { label: 'Sadakat kayıt URL', placeholder: 'https://magazaniz.com/sadakat' },
    _weekOf: { label: 'Geçerlilik tarihi', placeholder: '8–14 Temmuz geçerli' },
    _openHours: { label: 'Çalışma saatleri', placeholder: 'Her gün 08:00–22:00' },
  },
  'entertainment-venue': {
    url: { label: 'Bilet URL' },
    _venueName: { label: 'Mekan adı' },
    _event: { label: 'Gösteri / etkinlik' },
    _showtimes: { label: 'Seans saatleri', placeholder: 'Cuma–Paz · 20:00' },
    _merchUrl: { label: 'Ürün / bilgi URL' },
  },
  'automotive-marine': {
    url: { label: 'İlan / randevu URL' },
    _businessName: { label: 'Galeri / marina' },
    _stockInfo: { label: 'Stok / model bilgisi', placeholder: '2024 modeller · 45 stokta' },
    _servicePromo: { label: 'Servis teklifi', placeholder: 'Ücretsiz genel kontrol' },
    _agentPhone: { label: 'Satış / servis telefonu' },
  },
  'property-facilities': {
    url: { label: 'Portal URL' },
    _buildingName: { label: 'Bina / tesis' },
    _unitInfo: { label: 'Daire / kat bilgisi', placeholder: 'Kat 1–12 · 240 daire' },
    _managerContact: { label: 'Yönetim iletişimi' },
    _maintenanceUrl: { label: 'Bakım talebi URL' },
  },
  'specialty-healthcare': {
    url: { label: 'Kayıt URL' },
    _clinicName: { label: 'Klinik adı' },
    _specialty: { label: 'Uzmanlık', placeholder: 'Veteriner · Göz · Dermatoloji' },
    _bookingPhone: { label: 'Randevu telefonu' },
    _hours: { label: 'Çalışma saatleri', placeholder: 'Pzt–Cum 9:00–18:00' },
  },
  'family-community': {
    url: { label: 'Portal URL' },
    _orgName: { label: 'Kuruluş' },
    _programType: { label: 'Program türü', placeholder: 'Kreş · Huzurevi · İnanç topluluğu' },
    _scheduleInfo: { label: 'Program / saatler' },
    _contactInfo: { label: 'İletişim' },
  },
  'mobile-vendor': {
    url: { label: 'Menü URL' },
    _truckName: { label: 'Satıcı adı' },
    _location: { label: 'Bugünkü konum' },
  },
  'local-services-hub': {
    url: { label: 'Randevu URL' },
    _businessName: { label: 'İşletme adı' },
    _offer: { label: 'Güncel teklif' },
  },
  'whatsapp-order': {
    phone: { label: 'WhatsApp numarası', placeholder: '+90 532 000 00 00' },
    message: { label: 'Mesaj', placeholder: 'Merhaba! Sipariş vermek istiyorum…' },
  },
  'google-review': {
    url: { label: 'Yorum URL', placeholder: 'https://g.page/r/…/review' },
    _businessName: { label: 'İşletme adı', placeholder: 'The Garden Bistro' },
  },
  'tiktok-profile': {
    username: { label: 'Kullanıcı adı', placeholder: 'markaniz' },
  },
  'linkedin-profile': {
    username: { label: 'Profil slug', placeholder: 'ayse-yilmaz' },
  },
  'facebook-page': {
    username: { label: 'Sayfa adı', placeholder: 'isletmeniz' },
  },
};

export const industryTemplateCopyEn: TranslationTree = {
  picker: {
    title: 'Quick-start templates',
    subtitle: 'Ready-made setups for restaurants, business cards, events and more — customize everything in the next step.',
    sectionsCount: '{{n}} sections',
  },
  guide: {
    showTips: 'Show tips',
    hideTips: 'Hide tips',
    suggestedCtas: 'Suggested CTAs',
    recommendedPrint: 'Recommended print',
    bestFor: 'Best for',
    helpfulTips: 'Helpful tips',
    minPrintQr: 'min {{cm}} cm QR',
    dismissAria: 'Dismiss template guide',
  },
  visualPresets: {
    title: 'Professional templates',
    subtitle: 'Premium presets optimized for scan reliability, contrast and print. One click applies colors, dots, frame and CTA.',
    all: 'All',
    categories: {
      business: 'Business & Corporate',
      hospitality: 'Restaurant & Hotel',
      retail: 'Retail & Venue',
      social: 'Social & Chat',
      event: 'Events & Nonprofit',
      health: 'Healthcare',
      minimal: 'Minimal & Wi‑Fi',
      luxury: 'Luxury & Premium',
    },
  },
  names: namesEn,
  sections: { ...coreSectionsEn, ...extraCoreSectionsEn, ...archetypeSectionsEn },
  fields: { ...coreFieldsEn, ...extraCoreFieldsEn, ...archetypeFieldsEn },
};

export const industryTemplateCopyTr: TranslationTree = {
  picker: {
    title: 'Hızlı başlangıç şablonları',
    subtitle: 'Restoran, kartvizit, etkinlik ve daha fazlası için hazır kurulumlar — sonraki adımda her şeyi özelleştirin.',
    sectionsCount: '{{n}} bölüm',
  },
  guide: {
    showTips: 'İpuçlarını göster',
    hideTips: 'İpuçlarını gizle',
    suggestedCtas: 'Önerilen CTA\'lar',
    recommendedPrint: 'Önerilen baskı',
    bestFor: 'En uygun kullanım',
    helpfulTips: 'Faydalı ipuçları',
    minPrintQr: 'min {{cm}} cm QR',
    dismissAria: 'Şablon rehberini kapat',
  },
  visualPresets: {
    title: 'Profesyonel şablonlar',
    subtitle: 'Tarama güvenilirliği, kontrast ve baskı için optimize edilmiş premium stiller. Tek tıkla renk, nokta, çerçeve ve CTA uygulanır.',
    all: 'Tümü',
    categories: {
      business: 'İş & Kurumsal',
      hospitality: 'Restoran & Otel',
      retail: 'Perakende & Mekan',
      social: 'Sosyal & Sohbet',
      event: 'Etkinlik & STK',
      health: 'Sağlık',
      minimal: 'Minimal & Wi‑Fi',
      luxury: 'Lüks & Premium',
    },
  },
  names: namesTr,
  sections: { ...coreSectionsTr, ...extraCoreSectionsTr, ...archetypeSectionsTr },
  fields: { ...coreFieldsTr, ...extraCoreFieldsTr, ...archetypeFieldsTr },
};
