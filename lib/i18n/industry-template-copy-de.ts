import type { TranslationTree } from './types';
import {
  extraCoreFieldsDe,
  extraCoreSectionsDe,
} from './core-template-copy-extra-de';

const namesDe: TranslationTree = {
  'restaurant-menu': 'Restaurant-Speisekarte',
  'business-card': 'Digitale Visitenkarte',
  wedding: 'Hochzeit & RSVP',
  'event-registration': 'Event-Registrierung',
  'instagram-bio': 'Instagram Bio',
  'youtube-channel': 'YouTube-Kanal',
  portfolio: 'Kreatives Portfolio',
  'cv-resume': 'Lebenslauf & CV',
  'crypto-donate': 'Krypto-Spende',
  'real-estate': 'Immobilien-Exposé',
  'wifi-guest': 'Gäste-WLAN',
  'retail-stores': 'Einzelhandel & Produkt',
  'hotels-hospitality': 'Hotel & Hospitality',
  'healthcare-clinics': 'Gesundheitsklinik',
  'museums-venues': 'Museum & Location',
  'fitness-gyms': 'Fitness & Studio',
  'salon-spa': 'Salon & Spa',
  'nonprofit-fundraising': 'Nonprofit-Fundraising',
  'dental-clinics': 'Zahnarztpraxis',
  'home-services': 'Handwerker & Services',
  'coffee-shops-cafes': 'Café & Coffee Shop',
  'tourist-attractions': 'Touristenattraktion',
  'campus-institution': 'Campus & Institution',
  'professional-services': 'Professionelle Dienstleistungen',
  'retail-grocery': 'Supermarkt & Lebensmittel',
  'entertainment-venue': 'Entertainment-Location',
  'automotive-marine': 'Automotive & Marine',
  'property-facilities': 'Immobilien & Facilities',
  'specialty-healthcare': 'Fachärztliche Versorgung',
  'family-community': 'Familie & Gemeinschaft',
  'mobile-vendor': 'Mobiler Anbieter',
  'local-services-hub': 'Lokale Services',
  'whatsapp-order': 'WhatsApp-Bestellungen',
  'google-review': 'Google-Bewertungen',
  'tiktok-profile': 'TikTok-Profil',
  'linkedin-profile': 'LinkedIn-Profil',
  'facebook-page': 'Facebook-Seite',
};

const coreSectionsDe: TranslationTree = {
  'restaurant-menu': {
    venue: { title: 'Lokal & Marke', description: 'Wie Gäste Sie erkennen, bevor sie die Speisekarte öffnen.' },
    'menu-link': { title: 'Menü-Ziel', description: 'Link zu Ihrer digitalen Speisekarte (Website, PDF oder Menüplattform).' },
    service: { title: 'Service-Extras', description: 'Wege, die Gäste oft aus derselben Kampagne brauchen.' },
  },
  'business-card': {
    personal: { title: 'Persönliche Angaben', description: 'Name und Rolle auf der gespeicherten Kontaktkarte.' },
    company: { title: 'Unternehmen', description: 'Organisationsname und Website.' },
    reach: { title: 'Kontaktkanäle', description: 'Mobile-first — Ländervorwahl angeben.' },
    location: { title: 'Büroadresse (optional)', description: 'Hilft Karten- und Navigations-Apps.' },
  },
  'wifi-guest': {
    venue: { title: 'Standort-Label', description: 'Gedruckter Name auf Ihrem WLAN-Schild — nicht im QR kodiert.' },
    network: { title: 'Gästenetzwerk', description: 'SSID, Passwort und Sicherheitstyp für automatische Verbindung.' },
  },
  'hotels-hospitality': {
    property: { title: 'Objekt-Identität', description: 'Wird auf der Gäste-Hub-Landingpage angezeigt.' },
    'guest-services': {
      title: 'Gäste-Hub-Links',
      description: 'Füllt Hub-Buttons vor — URLs saisonal anpassen.',
    },
  },
};

const coreFieldsDe: TranslationTree = {
  'restaurant-menu': {
    _venueName: { label: 'Restaurantname', placeholder: 'z. B. Garten Bistro' },
    url: { label: 'Menü-URL', placeholder: 'https://ihrrestaurant.de/speisekarte' },
    _wifiNote: { label: 'WLAN-Hinweis (optional)' },
    _reservationUrl: { label: 'Reservierungslink (optional)' },
    _hours: { label: 'Öffnungszeiten (optional)', placeholder: 'Mo–So 11:00–23:00' },
    _dietaryNote: { label: 'Ernährungshinweis (optional)', placeholder: 'Glutenfreie Optionen verfügbar' },
  },
  'business-card': {
    title: { label: 'Berufsbezeichnung', placeholder: 'Vertriebsleiter' },
    org: { label: 'Firmenname', placeholder: 'Muster GmbH' },
  },
  'wifi-guest': {
    _venueName: { label: 'Standortname', placeholder: 'z. B. Harbor Hotel Lobby' },
    _instructions: {
      label: 'Verbindungsanleitung (Druck-Untertitel)',
      placeholder: 'Scannen für automatische Verbindung. Zertifikat bei Aufforderung akzeptieren.',
    },
    _supportExt: { label: 'Support / Rezeption', placeholder: '0 wählen' },
    ssid: { label: 'Netzwerkname (SSID)', placeholder: 'Guest_WiFi' },
    password: { label: 'Passwort', placeholder: 'guest2026' },
    encryption: {
      label: 'Sicherheitstyp',
      options: {
        WPA: 'WPA / WPA2',
        WEP: 'WEP',
        nopass: 'Offen (kein Passwort)',
      },
    },
  },
  'hotels-hospitality': {
    _propertyName: { label: 'Objektname', placeholder: 'Harbor Bay Hotel' },
    _conciergePhone: { label: 'Concierge-Telefon', placeholder: '+49 30 000 00 00' },
    _wifiPageUrl: { label: 'Gäste-WLAN-Seite', placeholder: 'https://ihrhotel.de/wlan' },
    _roomServiceUrl: { label: 'Zimmerservice-Menü', placeholder: 'https://ihrhotel.de/zimmerservice' },
    _spaUrl: { label: 'Spa & Annehmlichkeiten', placeholder: 'https://ihrhotel.de/spa' },
    _localGuideUrl: { label: 'Lokaler Reiseführer', placeholder: 'https://ihrhotel.de/lokal' },
    _checkInUrl: { label: 'Mobiles Check-in', placeholder: 'https://ihrhotel.de/check-in' },
  },
};

const archetypeSectionsDe: TranslationTree = {
  'campus-institution': {
    link: { title: 'Ziel', description: 'Portal, Karte oder Serviceseite.' },
    org: { title: 'Organisation', description: 'Wird auf der Landingpage angezeigt.' },
  },
  'professional-services': {
    portal: { title: 'Kunden-Ziel', description: 'Aufnahmeformular oder sicheres Dokumentenportal.' },
    firm: { title: 'Kanzlei-Details', description: 'Auf Landingpage und Druckmaterialien angezeigt.' },
  },
  'retail-grocery': {
    circular: { title: 'Wochenangebote-Link', description: 'Ihr aktueller Wochenprospekt oder Angebotsseite — ohne Neudruck der Regaltafeln aktualisieren.' },
    store: { title: 'Filial-Details', description: 'Wird auf der Landingpage für Käufer angezeigt.' },
  },
  'entertainment-venue': {
    tickets: { title: 'Ticketing', description: 'Ticketverkauf, Vorstellungszeiten oder Event-Registrierung.' },
    venue: { title: 'Location & Show-Details', description: 'Auf der Landingpage vor der Weiterleitung angezeigt.' },
  },
  'automotive-marine': {
    listing: { title: 'Fahrzeug- oder Service-Link', description: 'Bestandsseite, Fahrzeugdetailseite oder Servicebuchung.' },
    business: { title: 'Unternehmens-Details', description: 'Auf Landingpage und Druckmaterialien angezeigt.' },
  },
  'property-facilities': {
    portal: { title: 'Portal-Link', description: 'Mieter-, Mitglieder- oder Lageroperationsportal.' },
    building: { title: 'Gebäude-Details', description: 'Auf der Landingpage für Mieter und Mitglieder angezeigt.' },
  },
  'specialty-healthcare': {
    intake: { title: 'Aufnahme-Ziel', description: 'Patienten- oder Tieraufnahme und Terminbuchung.' },
    clinic: { title: 'Klinik-Details', description: 'Auf der Landingpage angezeigt — niemals PHI im QR-Link kodieren.' },
  },
  'family-community': {
    community: { title: 'Gemeinschafts-Link', description: 'Anmeldung, Familienportal oder Glaubensgemeinschaft-Hub.' },
    org: { title: 'Organisations-Details', description: 'Auf der Landingpage für Familien und Mitglieder angezeigt.' },
  },
  'mobile-vendor': {
    menu: { title: 'Menü- oder Bestell-Link', description: 'Tagesmenü, Mobile Order oder Standort-Updates.' },
  },
  'local-services-hub': {
    booking: { title: 'Service-Link', description: 'Online-Buchung, Angebotsanfrage oder Service-Promo.' },
  },
  'whatsapp-order': {
    number: { title: 'WhatsApp-Nummer', description: 'Ländervorwahl angeben — Scanner öffnen einen Chat mit dieser Nummer.' },
    message: { title: 'Vorgefertigte Nachricht', description: 'Optional — füllt den Chat vor, damit Kunden schneller starten.' },
  },
  'google-review': {
    'review-link': { title: 'Google-Bewertungslink', description: 'Fügen Sie Ihren „Bewertung schreiben“-Kurzlink aus dem Google-Unternehmensprofil ein.' },
    business: { title: 'Unternehmensname', description: 'Auf der Karte angezeigt — nicht im Link kodiert.' },
  },
  'tiktok-profile': {
    profile: { title: 'TikTok-Benutzername', description: 'Ohne @ — öffnet tiktok.com/@benutzername.' },
  },
  'linkedin-profile': {
    profile: { title: 'LinkedIn-Profil', description: 'Ihr öffentlicher Profil-Slug — öffnet linkedin.com/in/slug.' },
  },
  'facebook-page': {
    profile: { title: 'Facebook-Seite', description: 'Seiten-Benutzername oder Vanity-Name — öffnet facebook.com/name.' },
  },
};

const archetypeFieldsDe: TranslationTree = {
  'campus-institution': {
    url: { label: 'URL', placeholder: 'https://campus.edu/services' },
    _orgName: { label: 'Institutionsname', placeholder: 'Staatliche Universität' },
    _department: { label: 'Abteilung / Büro', placeholder: 'Studentenangelegenheiten' },
  },
  'professional-services': {
    url: { label: 'Portal-URL', placeholder: 'https://ihrefirma.de/aufnahme' },
    _firmName: { label: 'Kanzleiname' },
    _practiceArea: { label: 'Fachgebiet', placeholder: 'Steuer · Prozess · Versicherung' },
  },
  'retail-grocery': {
    url: { label: 'Wochenangebote-URL', placeholder: 'https://ihrmarkt.de/woche' },
    _storeName: { label: 'Filialname', placeholder: 'FreshMart Mitte' },
    _loyaltyUrl: { label: 'Treueprogramm-URL', placeholder: 'https://ihrmarkt.de/treue' },
    _weekOf: { label: 'Gültigkeitszeitraum', placeholder: 'Gültig 8.–14. Juli' },
    _openHours: { label: 'Öffnungszeiten', placeholder: 'Täglich 08:00–22:00' },
  },
  'entertainment-venue': {
    url: { label: 'Ticket-URL' },
    _venueName: { label: 'Location-Name' },
    _event: { label: 'Show / Release' },
    _showtimes: { label: 'Vorstellungszeiten', placeholder: 'Fr–So · 20:00' },
    _merchUrl: { label: 'Merch- / Info-URL' },
  },
  'automotive-marine': {
    url: { label: 'Inserat- / Buchungs-URL' },
    _businessName: { label: 'Autohaus / Marina' },
    _stockInfo: { label: 'Bestand / Modellinfo', placeholder: '2024 Modelle · 45 auf Lager' },
    _servicePromo: { label: 'Service-Angebot', placeholder: 'Kostenlose Mehrpunkt-Inspektion' },
    _agentPhone: { label: 'Verkauf / Service-Telefon' },
  },
  'property-facilities': {
    url: { label: 'Portal-URL' },
    _buildingName: { label: 'Gebäude / Standort' },
    _unitInfo: { label: 'Einheit / Etageninfo', placeholder: 'Etagen 1–12 · 240 Einheiten' },
    _managerContact: { label: 'Verwaltungskontakt' },
    _maintenanceUrl: { label: 'Wartungsanfrage-URL' },
  },
  'specialty-healthcare': {
    url: { label: 'Aufnahme-URL' },
    _clinicName: { label: 'Klinikname' },
    _specialty: { label: 'Fachrichtung', placeholder: 'Tierarzt · Augenoptik · Dermatologie' },
    _bookingPhone: { label: 'Buchungs-Telefon' },
    _hours: { label: 'Öffnungszeiten', placeholder: 'Mo–Fr 9:00–18:00' },
  },
  'family-community': {
    url: { label: 'Portal-URL' },
    _orgName: { label: 'Organisation' },
    _programType: { label: 'Programmtyp', placeholder: 'Kinderbetreuung · Seniorenwohnen · Glaubensgemeinschaft' },
    _scheduleInfo: { label: 'Zeitplan / Öffnungszeiten' },
    _contactInfo: { label: 'Kontakt' },
  },
  'mobile-vendor': {
    url: { label: 'Menü-URL' },
    _truckName: { label: 'Anbietername' },
    _location: { label: 'Heutiger Standort' },
  },
  'local-services-hub': {
    url: { label: 'Buchungs-URL' },
    _businessName: { label: 'Firmenname' },
    _offer: { label: 'Aktuelles Angebot' },
  },
  'whatsapp-order': {
    phone: { label: 'WhatsApp-Nummer', placeholder: '+49 170 000 00 00' },
    message: { label: 'Nachricht', placeholder: 'Hallo! Ich möchte bestellen…' },
  },
  'google-review': {
    url: { label: 'Bewertungs-URL', placeholder: 'https://g.page/r/…/review' },
    _businessName: { label: 'Unternehmensname', placeholder: 'Garten Bistro' },
  },
  'tiktok-profile': {
    username: { label: 'Benutzername', placeholder: 'ihremarke' },
  },
  'linkedin-profile': {
    username: { label: 'Profil-Slug', placeholder: 'anna-mueller' },
  },
  'facebook-page': {
    username: { label: 'Seitenname', placeholder: 'ihrunternehmen' },
  },
};

export const industryTemplateCopyDe: TranslationTree = {
  picker: {
    title: 'Schnellstart-Vorlagen',
    subtitle: 'Fertige Setups für Restaurants, Visitenkarten, Events und mehr — im nächsten Schritt alles anpassen.',
    sectionsCount: '{{n}} Bereiche',
  },
  guide: {
    showTips: 'Tipps anzeigen',
    hideTips: 'Tipps ausblenden',
    suggestedCtas: 'Empfohlene CTAs',
    recommendedPrint: 'Empfohlener Druck',
    bestFor: 'Ideal für',
    helpfulTips: 'Hilfreiche Tipps',
    minPrintQr: 'mind. {{cm}} cm QR',
    dismissAria: 'Vorlagen-Guide schließen',
  },
  visualPresets: {
    title: 'Professionelle Vorlagen',
    subtitle: 'Premium-Presets für Scan-Zuverlässigkeit, Kontrast und Druck. Ein Klick wendet Farben, Punkte, Rahmen und CTA an.',
    all: 'Alle',
    categories: {
      business: 'Business & Corporate',
      hospitality: 'Restaurant & Hotel',
      retail: 'Einzelhandel & Location',
      social: 'Social & Chat',
      event: 'Events & Nonprofit',
      health: 'Gesundheitswesen',
      minimal: 'Minimal & WLAN',
      luxury: 'Luxus & Premium',
    },
  },
  names: namesDe,
  sections: { ...coreSectionsDe, ...extraCoreSectionsDe, ...archetypeSectionsDe },
  fields: { ...coreFieldsDe, ...extraCoreFieldsDe, ...archetypeFieldsDe },
};
