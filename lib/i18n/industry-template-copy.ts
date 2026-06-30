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
  'retail-grocery': 'Retail & Grocery',
  'entertainment-venue': 'Entertainment Venue',
  'automotive-marine': 'Automotive & Marine',
  'property-facilities': 'Property & Facilities',
  'specialty-healthcare': 'Specialty Healthcare',
  'family-community': 'Family & Community',
  'mobile-vendor': 'Mobile Vendor',
  'local-services-hub': 'Local Services',
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
  'retail-grocery': 'Perakende & Market',
  'entertainment-venue': 'Eğlence Mekanı',
  'automotive-marine': 'Otomotiv & Denizcilik',
  'property-facilities': 'Tesis & Gayrimenkul',
  'specialty-healthcare': 'Uzman Sağlık',
  'family-community': 'Aile & Topluluk',
  'mobile-vendor': 'Mobil Satıcı',
  'local-services-hub': 'Yerel Hizmetler',
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
    encryption: { label: 'Security type' },
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
    encryption: { label: 'Güvenlik türü' },
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
    promo: { title: 'Promo link', description: 'Weekly deals, loyalty signup or product promo.' },
  },
  'entertainment-venue': {
    tickets: { title: 'Ticketing', description: 'Ticket sales, showtimes or event registration.' },
  },
  'automotive-marine': {
    listing: { title: 'Vehicle or service link', description: 'Inventory page, VDP or service booking.' },
  },
  'property-facilities': {
    portal: { title: 'Portal link', description: 'Tenant, member or warehouse operations portal.' },
  },
  'specialty-healthcare': {
    intake: { title: 'Intake destination', description: 'Patient or pet intake and appointment booking.' },
  },
  'family-community': {
    community: { title: 'Community link', description: 'Enrollment, family portal or faith community hub.' },
  },
  'mobile-vendor': {
    menu: { title: 'Menu or order link', description: 'Daily menu, mobile ordering or location updates.' },
  },
  'local-services-hub': {
    booking: { title: 'Service link', description: 'Online booking, quote request or service promo.' },
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
    promo: { title: 'Promosyon linki', description: 'Haftalık fırsatlar, sadakat kaydı veya ürün promosyonu.' },
  },
  'entertainment-venue': {
    tickets: { title: 'Bilet', description: 'Bilet satışı, seans saatleri veya etkinlik kaydı.' },
  },
  'automotive-marine': {
    listing: { title: 'Araç veya hizmet linki', description: 'Envanter sayfası, ilan detayı veya servis randevusu.' },
  },
  'property-facilities': {
    portal: { title: 'Portal linki', description: 'Kiracı, üye veya depo operasyon portalı.' },
  },
  'specialty-healthcare': {
    intake: { title: 'Kayıt hedefi', description: 'Hasta veya evcil hayvan kaydı ve randevu.' },
  },
  'family-community': {
    community: { title: 'Topluluk linki', description: 'Kayıt, aile portalı veya inanç topluluğu merkezi.' },
  },
  'mobile-vendor': {
    menu: { title: 'Menü veya sipariş linki', description: 'Günlük menü, mobil sipariş veya konum güncellemesi.' },
  },
  'local-services-hub': {
    booking: { title: 'Hizmet linki', description: 'Online randevu, teklif talebi veya hizmet promosyonu.' },
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
    url: { label: 'Deals URL' },
    _storeName: { label: 'Store name' },
    _promo: { label: 'Campaign', placeholder: 'Weekly produce sale' },
  },
  'entertainment-venue': {
    url: { label: 'Tickets URL' },
    _venueName: { label: 'Venue name' },
    _event: { label: 'Show / release' },
  },
  'automotive-marine': {
    url: { label: 'URL' },
    _businessName: { label: 'Dealership / marina' },
  },
  'property-facilities': {
    url: { label: 'Portal URL' },
    _buildingName: { label: 'Building / site' },
  },
  'specialty-healthcare': {
    url: { label: 'Intake URL' },
    _clinicName: { label: 'Clinic name' },
  },
  'family-community': {
    url: { label: 'Portal URL' },
    _orgName: { label: 'Organization' },
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
    url: { label: 'Kampanya URL' },
    _storeName: { label: 'Mağaza adı' },
    _promo: { label: 'Kampanya', placeholder: 'Haftalık sebze indirimi' },
  },
  'entertainment-venue': {
    url: { label: 'Bilet URL' },
    _venueName: { label: 'Mekan adı' },
    _event: { label: 'Gösteri / etkinlik' },
  },
  'automotive-marine': {
    url: { label: 'URL' },
    _businessName: { label: 'Galeri / marina' },
  },
  'property-facilities': {
    url: { label: 'Portal URL' },
    _buildingName: { label: 'Bina / tesis' },
  },
  'specialty-healthcare': {
    url: { label: 'Kayıt URL' },
    _clinicName: { label: 'Klinik adı' },
  },
  'family-community': {
    url: { label: 'Portal URL' },
    _orgName: { label: 'Kuruluş' },
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
