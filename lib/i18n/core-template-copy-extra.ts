import type { TranslationTree } from './types';

/** Sections & fields for remaining core industry templates (EN) */
export const extraCoreSectionsEn: TranslationTree = {
  wedding: {
    couple: { title: 'Couple & message', description: 'Headline on calendars and reminders.' },
    when: { title: 'Date & time', description: 'Ceremony start; end time optional for reception.' },
    where: { title: 'Venue', description: 'Full venue name and city for maps.' },
    rsvp: { title: 'RSVP & redirect', description: 'Landing page collects RSVPs; optional link after confirmation.' },
  },
  'event-registration': {
    'event-info': { title: 'Event identity', description: 'Name and date on landing page.' },
    registration: { title: 'Registration link', description: 'Ticket platform or signup page.' },
    venue: { title: 'Venue & agenda', description: 'Where or how attendees join.' },
  },
  'instagram-bio': {
    profile: { title: 'Instagram profile', description: 'Username without @ — opens instagram.com/username' },
    campaign: { title: 'Campaign tracking', description: 'Know which print piece drove follows.' },
  },
  'youtube-channel': {
    channel: { title: 'Channel or video', description: 'Handle for channel, or URL for one video/playlist.' },
    cta: { title: 'Printed call-to-action', description: 'Line next to the QR on your material.' },
  },
  portfolio: {
    work: { title: 'Portfolio link', description: 'Behance, Dribbble, Notion or personal site.' },
    positioning: { title: 'Your positioning', description: 'Landing page headline before redirect.' },
    contact: { title: 'Book a call', description: 'Optional scheduling link on landing.' },
  },
  'cv-resume': {
    document: { title: 'CV document', description: 'PDF on Drive, Dropbox or your site.' },
    profile: { title: 'Professional summary', description: 'Shown on landing before PDF opens.' },
  },
  'crypto-donate': {
    network: { title: 'Network & asset', description: 'Wrong network = lost funds. Verify before print.' },
    wallet: { title: 'Wallet address', description: 'Public receive address only — never seed phrase.' },
    amount: { title: 'Suggested amount', description: 'Optional pre-fill in compatible wallets.' },
  },
  'real-estate': {
    listing: { title: 'Listing page', description: 'Photos, price, floor plan and specs.' },
    property: { title: 'Property snapshot', description: 'Quick reference for landing page.' },
    viewing: { title: 'Open house & agent', description: 'Viewing times and direct contact.' },
  },
  'retail-stores': {
    product: { title: 'Product or promo link', description: 'Destination shoppers land on after scanning.' },
    campaign: { title: 'Campaign tracking', description: 'Internal labels for analytics and batches.' },
  },
  'hotels-hospitality': {
    property: { title: 'Property identity', description: 'Shown on the guest hub landing page.' },
  },
  'healthcare-clinics': {
    portal: { title: 'Patient destination', description: 'Intake form, booking page or education PDF on your portal.' },
    clinic: { title: 'Clinic details', description: 'Landing page context — not encoded in the QR link.' },
  },
  'museums-venues': {
    exhibit: { title: 'Exhibit destination', description: 'Audio guide, video, ticket page or donation link.' },
    label: { title: 'Exhibit label', description: 'Title shown on landing before redirect.' },
  },
  'fitness-gyms': {
    schedule: { title: 'Schedule or signup', description: 'Live class timetable, membership or trial page.' },
    gym: { title: 'Gym branding', description: 'Landing page headline and promo line.' },
  },
  'salon-spa': {
    booking: { title: 'Booking link', description: 'Online scheduler or service menu page.' },
    salon: { title: 'Salon details', description: 'Brand line on landing page.' },
  },
  'nonprofit-fundraising': {
    donate: { title: 'Donation or signup', description: 'Givebutter, donation link, volunteer form or impact report.' },
    org: { title: 'Organization', description: 'Campaign name on landing page.' },
  },
  'dental-clinics': {
    intake: { title: 'Patient destination', description: 'Intake form, booking or aftercare instructions.' },
    practice: { title: 'Practice details', description: 'Landing page context.' },
  },
  'home-services': {
    booking: { title: 'Service request', description: 'Online scheduler, estimate form or promo landing.' },
    company: { title: 'Company details', description: 'Brand and territory for landing page.' },
  },
  'coffee-shops-cafes': {
    menu: { title: 'Menu or loyalty', description: 'Digital menu, loyalty signup or mobile order page.' },
    cafe: { title: 'Café branding', description: 'Name and loyalty hook on landing.' },
  },
  'tourist-attractions': {
    visit: { title: 'Visitor destination', description: 'Tickets, audio guide, map or exhibit page.' },
    attraction: { title: 'Attraction details', description: 'Name and hours on landing page.' },
  },
};

export const extraCoreSectionsTr: TranslationTree = {
  wedding: {
    couple: { title: 'Çift ve mesaj', description: 'Takvim ve hatırlatmalarda görünen başlık.' },
    when: { title: 'Tarih ve saat', description: 'Tören başlangıcı; resepsiyon için bitiş isteğe bağlı.' },
    where: { title: 'Mekan', description: 'Haritalar için tam mekan adı ve şehir.' },
    rsvp: { title: 'RSVP ve yönlendirme', description: 'Açılış sayfası RSVP toplar; onay sonrası isteğe bağlı link.' },
  },
  'event-registration': {
    'event-info': { title: 'Etkinlik kimliği', description: 'Açılış sayfasında ad ve tarih.' },
    registration: { title: 'Kayıt linki', description: 'Bilet platformu veya kayıt sayfası.' },
    venue: { title: 'Mekan ve ajanda', description: 'Katılımcılar nerede veya nasıl katılır.' },
  },
  'instagram-bio': {
    profile: { title: 'Instagram profili', description: '@ olmadan kullanıcı adı — instagram.com/username açar' },
    campaign: { title: 'Kampanya takibi', description: 'Hangi baskının takip getirdiğini bilin.' },
  },
  'youtube-channel': {
    channel: { title: 'Kanal veya video', description: 'Kanal için handle veya video/çalma listesi URL.' },
    cta: { title: 'Basılı harekete geçirici', description: 'Materyalde QR yanındaki satır.' },
  },
  portfolio: {
    work: { title: 'Portfolyo linki', description: 'Behance, Dribbble, Notion veya kişisel site.' },
    positioning: { title: 'Konumlandırmanız', description: 'Yönlendirmeden önce açılış sayfası başlığı.' },
    contact: { title: 'Görüşme ayarla', description: 'Açılış sayfasında isteğe bağlı randevu linki.' },
  },
  'cv-resume': {
    document: { title: 'CV belgesi', description: 'Drive, Dropbox veya sitenizdeki PDF.' },
    profile: { title: 'Profesyonel özet', description: 'PDF açılmadan önce açılış sayfasında gösterilir.' },
  },
  'crypto-donate': {
    network: { title: 'Ağ ve varlık', description: 'Yanlış ağ = kayıp fon. Baskıdan önce doğrulayın.' },
    wallet: { title: 'Cüzdan adresi', description: 'Yalnızca herkese açık alım adresi — asla seed phrase.' },
    amount: { title: 'Önerilen tutar', description: 'Uyumlu cüzdanlarda isteğe bağlı ön doldurma.' },
  },
  'real-estate': {
    listing: { title: 'İlan sayfası', description: 'Fotoğraflar, fiyat, kat planı ve özellikler.' },
    property: { title: 'Mülk özeti', description: 'Açılış sayfası için hızlı referans.' },
    viewing: { title: 'Açık ev ve danışman', description: 'Görüntüleme saatleri ve doğrudan iletişim.' },
  },
  'retail-stores': {
    product: { title: 'Ürün veya promosyon linki', description: 'Alışverişçilerin tarama sonrası gittiği hedef.' },
    campaign: { title: 'Kampanya takibi', description: 'Analitik ve toplu işlemler için dahili etiketler.' },
  },
  'hotels-hospitality': {
    property: { title: 'Tesis kimliği', description: 'Misafir merkezi açılış sayfasında gösterilir.' },
  },
  'healthcare-clinics': {
    portal: { title: 'Hasta hedefi', description: 'Kayıt formu, randevu sayfası veya portalınızdaki eğitim PDF.' },
    clinic: { title: 'Klinik bilgileri', description: 'Açılış sayfası bağlamı — QR linkinde kodlanmaz.' },
  },
  'museums-venues': {
    exhibit: { title: 'Sergi hedefi', description: 'Ses rehberi, video, bilet sayfası veya bağış linki.' },
    label: { title: 'Sergi etiketi', description: 'Yönlendirmeden önce açılış sayfasında başlık.' },
  },
  'fitness-gyms': {
    schedule: { title: 'Program veya kayıt', description: 'Canlı ders programı, üyelik veya deneme sayfası.' },
    gym: { title: 'Spor salonu markası', description: 'Açılış sayfası başlığı ve promosyon satırı.' },
  },
  'salon-spa': {
    booking: { title: 'Randevu linki', description: 'Online planlayıcı veya hizmet menüsü sayfası.' },
    salon: { title: 'Salon bilgileri', description: 'Açılış sayfasında marka satırı.' },
  },
  'nonprofit-fundraising': {
    donate: { title: 'Bağış veya kayıt', description: 'Givebutter, bağış linki, gönüllü formu veya etki raporu.' },
    org: { title: 'Kuruluş', description: 'Açılış sayfasında kampanya adı.' },
  },
  'dental-clinics': {
    intake: { title: 'Hasta hedefi', description: 'Kayıt formu, randevu veya sonrası bakım talimatları.' },
    practice: { title: 'Klinik bilgileri', description: 'Açılış sayfası bağlamı.' },
  },
  'home-services': {
    booking: { title: 'Hizmet talebi', description: 'Online planlayıcı, teklif formu veya promosyon açılışı.' },
    company: { title: 'Şirket bilgileri', description: 'Açılış sayfası için marka ve bölge.' },
  },
  'coffee-shops-cafes': {
    menu: { title: 'Menü veya sadakat', description: 'Dijital menü, sadakat kaydı veya mobil sipariş sayfası.' },
    cafe: { title: 'Kafe markası', description: 'Açılış sayfasında ad ve sadakat mesajı.' },
  },
  'tourist-attractions': {
    visit: { title: 'Ziyaretçi hedefi', description: 'Biletler, ses rehberi, harita veya sergi sayfası.' },
    attraction: { title: 'Mekan bilgileri', description: 'Açılış sayfasında ad ve saatler.' },
  },
};

export const extraCoreFieldsEn: TranslationTree = {
  wedding: {
    title: { label: 'Event title', placeholder: 'Elif & Mehmet — Wedding' },
    description: { label: 'Invitation message' },
    startDate: { label: 'Ceremony start' },
    endDate: { label: 'Reception end (optional)' },
    location: { label: 'Venue & address', placeholder: 'Garden Venue, Bebek, Istanbul' },
    url: { label: 'After-RSVP link (optional)', placeholder: 'https://yourwedding.com/gallery' },
    _registryUrl: { label: 'Gift registry URL (optional)' },
  },
  'event-registration': {
    _eventName: { label: 'Event name', placeholder: 'Product Summit 2026' },
    _eventDate: { label: 'Date(s)', placeholder: '15–16 June 2026, Istanbul' },
    url: { label: 'Registration URL', placeholder: 'https://eventbrite.com/...' },
    _venue: { label: 'Venue / platform', placeholder: 'ICC Istanbul / Zoom' },
    _agendaUrl: { label: 'Agenda URL (optional)' },
  },
  'instagram-bio': {
    _campaign: { label: 'Campaign label', placeholder: 'Summer collection box' },
    _highlight: { label: 'Highlight to promote', placeholder: 'New arrivals / Menu' },
  },
  'youtube-channel': {
    username: { label: 'Channel handle', placeholder: '@yourchannel' },
    url: { label: 'Or video / playlist URL' },
    _ctaText: { label: 'CTA text', placeholder: 'Scan to subscribe & watch tutorials' },
  },
  portfolio: {
    url: { label: 'Portfolio URL', placeholder: 'https://behance.net/yourname' },
    _headline: { label: 'Headline', placeholder: 'Brand & UI Designer' },
    _specialty: { label: 'Specialty', placeholder: 'Fintech, SaaS, packaging' },
    _calendly: { label: 'Booking URL', placeholder: 'https://calendly.com/you' },
  },
  'cv-resume': {
    url: { label: 'CV URL', placeholder: 'https://yoursite.com/cv.pdf' },
    _fullName: { label: 'Full name', placeholder: 'Can Demir' },
    _role: { label: 'Target role', placeholder: 'Senior Product Manager' },
    _linkedin: { label: 'LinkedIn (optional)' },
  },
  'crypto-donate': {
    address: { label: 'Address', placeholder: 'bc1q... or 0x...' },
    _purpose: { label: 'Purpose', placeholder: 'Support our community garden' },
  },
  'real-estate': {
    url: { label: 'Listing URL' },
    _address: { label: 'Address', placeholder: '123 Main Street, Brooklyn, NY' },
    _price: { label: 'Price', placeholder: '$425,000' },
    _specs: { label: 'Specs', placeholder: '3+1 · 120 m² · 5th floor' },
    _openHouse: { label: 'Open house', placeholder: 'Sat 14:00–17:00' },
    _agentPhone: { label: 'Agent phone' },
  },
  'retail-stores': {
    url: { label: 'Promo or product URL' },
    _productName: { label: 'Product or SKU', placeholder: 'Organic olive oil 500ml' },
    _campaign: { label: 'Campaign', placeholder: 'Spring 2026 window' },
    _storeLocation: { label: 'Store / aisle', placeholder: 'Downtown · Aisle 4' },
  },
  'hotels-hospitality': {
    _propertyName: { label: 'Property name', placeholder: 'Harbor Bay Hotel' },
  },
  'healthcare-clinics': {
    url: { label: 'Portal URL' },
    _clinicName: { label: 'Clinic name', placeholder: 'Westside Family Medicine' },
    _department: { label: 'Department', placeholder: 'Pediatrics / Urgent care' },
  },
  'museums-venues': {
    url: { label: 'Exhibit URL' },
    _exhibitTitle: { label: 'Exhibit title', placeholder: 'Renaissance Masters' },
    _gallery: { label: 'Gallery / zone', placeholder: 'Gallery 3 · East Wing' },
  },
  'fitness-gyms': {
    url: { label: 'Schedule URL' },
    _gymName: { label: 'Gym / studio name', placeholder: 'IronWorks Fitness' },
    _trialOffer: { label: 'Trial offer', placeholder: '7-day free pass' },
  },
  'salon-spa': {
    url: { label: 'Booking URL' },
    _salonName: { label: 'Salon name', placeholder: 'Luxe Hair & Spa' },
    _topService: { label: 'Featured service', placeholder: 'Balayage · Gel manicure' },
  },
  'nonprofit-fundraising': {
    url: { label: 'Campaign URL' },
    _orgName: { label: 'Organization', placeholder: 'Community Garden Alliance' },
    _campaign: { label: 'Campaign', placeholder: 'Spring planting drive 2026' },
  },
  'dental-clinics': {
    url: { label: 'Patient URL' },
    _practiceName: { label: 'Practice name', placeholder: 'Bright Smile Dental' },
    _servicePromo: { label: 'Current promo', placeholder: 'Free whitening consult' },
  },
  'home-services': {
    url: { label: 'Booking URL' },
    _companyName: { label: 'Company name', placeholder: 'CoolAir HVAC' },
    _serviceArea: { label: 'Service area', placeholder: 'Greater Boston' },
    _seasonalPromo: { label: 'Seasonal offer', placeholder: 'AC tune-up $79' },
  },
  'coffee-shops-cafes': {
    url: { label: 'Menu / loyalty URL' },
    _cafeName: { label: 'Café name', placeholder: 'Roast & Co.' },
    _loyaltyNote: { label: 'Loyalty hook', placeholder: 'Scan → 10% off first order' },
  },
  'tourist-attractions': {
    url: { label: 'Visitor URL' },
    _attractionName: { label: 'Attraction name', placeholder: 'Harbor Lighthouse' },
    _hours: { label: 'Hours', placeholder: 'Daily 9:00–18:00' },
  },
};

export const extraCoreFieldsTr: TranslationTree = {
  wedding: {
    title: { label: 'Etkinlik başlığı', placeholder: 'Elif & Mehmet — Düğün' },
    description: { label: 'Davet mesajı' },
    startDate: { label: 'Tören başlangıcı' },
    endDate: { label: 'Resepsiyon bitişi (isteğe bağlı)' },
    location: { label: 'Mekan ve adres', placeholder: 'Bahçe Mekanı, Bebek, İstanbul' },
    url: { label: 'RSVP sonrası link (isteğe bağlı)', placeholder: 'https://dugununuz.com/galeri' },
    _registryUrl: { label: 'Hediye listesi URL (isteğe bağlı)' },
  },
  'event-registration': {
    _eventName: { label: 'Etkinlik adı', placeholder: 'Ürün Zirvesi 2026' },
    _eventDate: { label: 'Tarih(ler)', placeholder: '15–16 Haziran 2026, İstanbul' },
    url: { label: 'Kayıt URL', placeholder: 'https://eventbrite.com/...' },
    _venue: { label: 'Mekan / platform', placeholder: 'ICC İstanbul / Zoom' },
    _agendaUrl: { label: 'Ajanda URL (isteğe bağlı)' },
  },
  'instagram-bio': {
    _campaign: { label: 'Kampanya etiketi', placeholder: 'Yaz koleksiyonu kutusu' },
    _highlight: { label: 'Öne çıkarılacak highlight', placeholder: 'Yeni ürünler / Menü' },
  },
  'youtube-channel': {
    username: { label: 'Kanal handle', placeholder: '@kanaliniz' },
    url: { label: 'Veya video / çalma listesi URL' },
    _ctaText: { label: 'CTA metni', placeholder: 'Abone olmak ve eğitimleri izlemek için tarayın' },
  },
  portfolio: {
    url: { label: 'Portfolyo URL' },
    _headline: { label: 'Başlık', placeholder: 'Marka & UI Tasarımcısı' },
    _specialty: { label: 'Uzmanlık', placeholder: 'Fintech, SaaS, ambalaj' },
    _calendly: { label: 'Randevu URL', placeholder: 'https://calendly.com/siz' },
  },
  'cv-resume': {
    url: { label: 'CV URL', placeholder: 'https://siteniz.com/cv.pdf' },
    _fullName: { label: 'Ad soyad', placeholder: 'Can Demir' },
    _role: { label: 'Hedef rol', placeholder: 'Kıdemli Ürün Müdürü' },
    _linkedin: { label: 'LinkedIn (isteğe bağlı)' },
  },
  'crypto-donate': {
    address: { label: 'Adres', placeholder: 'bc1q... veya 0x...' },
    _purpose: { label: 'Amaç', placeholder: 'Topluluk bahçemizi destekleyin' },
  },
  'real-estate': {
    url: { label: 'İlan URL' },
    _address: { label: 'Adres', placeholder: 'Ana Cadde No:123, İstanbul' },
    _price: { label: 'Fiyat', placeholder: '₺4.250.000' },
    _specs: { label: 'Özellikler', placeholder: '3+1 · 120 m² · 5. kat' },
    _openHouse: { label: 'Açık ev', placeholder: 'Cmt 14:00–17:00' },
    _agentPhone: { label: 'Danışman telefonu' },
  },
  'retail-stores': {
    url: { label: 'Promosyon veya ürün URL' },
    _productName: { label: 'Ürün veya SKU', placeholder: 'Organik zeytinyağı 500ml' },
    _campaign: { label: 'Kampanya', placeholder: 'İlkbahar 2026 vitrin' },
    _storeLocation: { label: 'Mağaza / reyon', placeholder: 'Merkez · Reyon 4' },
  },
  'hotels-hospitality': {
    _propertyName: { label: 'Tesis adı', placeholder: 'Liman Körfez Otel' },
  },
  'healthcare-clinics': {
    url: { label: 'Portal URL' },
    _clinicName: { label: 'Klinik adı', placeholder: 'Batı Aile Tıp Merkezi' },
    _department: { label: 'Bölüm', placeholder: 'Pediatri / Acil bakım' },
  },
  'museums-venues': {
    url: { label: 'Sergi URL' },
    _exhibitTitle: { label: 'Sergi başlığı', placeholder: 'Rönesans Ustaları' },
    _gallery: { label: 'Galeri / bölge', placeholder: 'Galeri 3 · Doğu Kanadı' },
  },
  'fitness-gyms': {
    url: { label: 'Program URL' },
    _gymName: { label: 'Spor salonu adı', placeholder: 'IronWorks Fitness' },
    _trialOffer: { label: 'Deneme teklifi', placeholder: '7 günlük ücretsiz pass' },
  },
  'salon-spa': {
    url: { label: 'Randevu URL' },
    _salonName: { label: 'Salon adı', placeholder: 'Luxe Hair & Spa' },
    _topService: { label: 'Öne çıkan hizmet', placeholder: 'Balayage · Jel manikür' },
  },
  'nonprofit-fundraising': {
    url: { label: 'Kampanya URL' },
    _orgName: { label: 'Kuruluş', placeholder: 'Topluluk Bahçesi Birliği' },
    _campaign: { label: 'Kampanya', placeholder: 'İlkbahar ekim kampanyası 2026' },
  },
  'dental-clinics': {
    url: { label: 'Hasta URL' },
    _practiceName: { label: 'Klinik adı', placeholder: 'Bright Smile Dental' },
    _servicePromo: { label: 'Güncel promosyon', placeholder: 'Ücretsiz beyazlatma konsültasyonu' },
  },
  'home-services': {
    url: { label: 'Randevu URL' },
    _companyName: { label: 'Şirket adı', placeholder: 'CoolAir HVAC' },
    _serviceArea: { label: 'Hizmet bölgesi', placeholder: 'İstanbul Avrupa Yakası' },
    _seasonalPromo: { label: 'Mevsimsel teklif', placeholder: 'Klima bakımı ₺79' },
  },
  'coffee-shops-cafes': {
    url: { label: 'Menü / sadakat URL' },
    _cafeName: { label: 'Kafe adı', placeholder: 'Roast & Co.' },
    _loyaltyNote: { label: 'Sadakat mesajı', placeholder: 'Tara → ilk siparişte %10 indirim' },
  },
  'tourist-attractions': {
    url: { label: 'Ziyaretçi URL' },
    _attractionName: { label: 'Mekan adı', placeholder: 'Liman Feneri' },
    _hours: { label: 'Saatler', placeholder: 'Her gün 09:00–18:00' },
  },
};
