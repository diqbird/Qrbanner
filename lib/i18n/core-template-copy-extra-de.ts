import type { TranslationTree } from './types';

/** Sections & fields for remaining core industry templates (DE) */
export const extraCoreSectionsDe: TranslationTree = {
  wedding: {
    couple: { title: 'Paar & Botschaft', description: 'Überschrift auf Kalendern und Erinnerungen.' },
    when: { title: 'Datum & Uhrzeit', description: 'Beginn der Zeremonie; Ende optional für die Feier.' },
    where: { title: 'Location', description: 'Vollständiger Veranstaltungsort und Stadt für Karten.' },
    rsvp: { title: 'RSVP & Weiterleitung', description: 'Landingpage sammelt RSVPs; optionaler Link nach Bestätigung.' },
  },
  'event-registration': {
    'event-info': { title: 'Event-Identität', description: 'Name und Datum auf der Landingpage.' },
    registration: { title: 'Registrierungslink', description: 'Ticketplattform oder Anmeldeseite.' },
    venue: { title: 'Location & Agenda', description: 'Wo oder wie Teilnehmer teilnehmen.' },
  },
  'instagram-bio': {
    profile: { title: 'Instagram-Profil', description: 'Benutzername ohne @ — öffnet instagram.com/username' },
    campaign: { title: 'Kampagnen-Tracking', description: 'Erfahren Sie, welches Druckstück Follower gebracht hat.' },
  },
  'youtube-channel': {
    channel: { title: 'Kanal oder Video', description: 'Handle für den Kanal oder URL für ein Video/eine Playlist.' },
    cta: { title: 'Gedruckter Call-to-Action', description: 'Zeile neben dem QR auf Ihrem Material.' },
  },
  portfolio: {
    work: { title: 'Portfolio-Link', description: 'Behance, Dribbble, Notion oder persönliche Website.' },
    positioning: { title: 'Ihre Positionierung', description: 'Landingpage-Überschrift vor der Weiterleitung.' },
    contact: { title: 'Gespräch buchen', description: 'Optionaler Terminlink auf der Landingpage.' },
  },
  'cv-resume': {
    document: { title: 'Lebenslauf-Dokument', description: 'PDF auf Drive, Dropbox oder Ihrer Website.' },
    profile: { title: 'Berufliche Zusammenfassung', description: 'Wird auf der Landingpage vor dem PDF-Öffnen angezeigt.' },
  },
  'crypto-donate': {
    network: { title: 'Netzwerk & Asset', description: 'Falsches Netzwerk = verlorene Mittel. Vor dem Druck prüfen.' },
    wallet: { title: 'Wallet-Adresse', description: 'Nur öffentliche Empfangsadresse — niemals Seed Phrase.' },
    amount: { title: 'Empfohlener Betrag', description: 'Optionale Vorausfüllung in kompatiblen Wallets.' },
  },
  'real-estate': {
    listing: { title: 'Exposé-Seite', description: 'Fotos, Preis, Grundriss und Details.' },
    property: { title: 'Objekt-Snapshot', description: 'Kurzreferenz für die Landingpage.' },
    viewing: { title: 'Open House & Makler', description: 'Besichtigungstermine und direkter Kontakt.' },
  },
  'retail-stores': {
    product: { title: 'Produkt- oder Promo-Link', description: 'Ziel, auf das Käufer nach dem Scan gelangen.' },
    campaign: { title: 'Kampagnen-Tracking', description: 'Interne Labels für Analytics und Chargen.' },
  },
  'hotels-hospitality': {
    property: { title: 'Objekt-Identität', description: 'Wird auf der Gäste-Hub-Landingpage angezeigt.' },
    'guest-services': {
      title: 'Gäste-Hub-Links',
      description: 'Füllt Hub-Buttons vor — URLs saisonal anpassen.',
    },
  },
  'healthcare-clinics': {
    portal: { title: 'Patienten-Ziel', description: 'Aufnahmeformular, Buchungsseite oder Aufklärungs-PDF auf Ihrem Portal.' },
    clinic: { title: 'Klinik-Details', description: 'Landingpage-Kontext — nicht im QR-Link kodiert.' },
  },
  'museums-venues': {
    exhibit: { title: 'Ausstellungs-Ziel', description: 'Audioguide, Video, Ticketseite oder Spendenlink.' },
    label: { title: 'Ausstellungs-Label', description: 'Titel auf der Landingpage vor der Weiterleitung.' },
  },
  'fitness-gyms': {
    schedule: { title: 'Kursplan oder Anmeldung', description: 'Live-Kursplan, Mitgliedschaft oder Probetraining.' },
    gym: { title: 'Studio-Branding', description: 'Landingpage-Überschrift und Promo-Zeile.' },
  },
  'salon-spa': {
    booking: { title: 'Buchungslink', description: 'Online-Terminplaner oder Service-Menü.' },
    salon: { title: 'Salon-Details', description: 'Markenzeile auf der Landingpage.' },
  },
  'nonprofit-fundraising': {
    donate: { title: 'Spende oder Anmeldung', description: 'Givebutter, Spendenlink, Freiwilligenformular oder Wirkungsbericht.' },
    org: { title: 'Organisation', description: 'Kampagnenname auf der Landingpage.' },
  },
  'dental-clinics': {
    intake: { title: 'Patienten-Ziel', description: 'Aufnahmeformular, Buchung oder Nachsorge-Anweisungen.' },
    practice: { title: 'Praxis-Details', description: 'Landingpage-Kontext.' },
  },
  'home-services': {
    booking: { title: 'Service-Anfrage', description: 'Online-Terminplaner, Kostenvoranschlag oder Promo-Landingpage.' },
    company: { title: 'Unternehmens-Details', description: 'Marke und Einsatzgebiet für die Landingpage.' },
  },
  'coffee-shops-cafes': {
    menu: { title: 'Menü oder Treueprogramm', description: 'Digitale Speisekarte, Treue-Anmeldung oder Mobile-Order-Seite.' },
    cafe: { title: 'Café-Branding', description: 'Name und Treue-Hook auf der Landingpage.' },
  },
  'tourist-attractions': {
    visit: { title: 'Besucher-Ziel', description: 'Tickets, Audioguide, Karte oder Ausstellungsseite.' },
    attraction: { title: 'Attraktions-Details', description: 'Name und Öffnungszeiten auf der Landingpage.' },
  },
};

export const extraCoreFieldsDe: TranslationTree = {
  wedding: {
    title: { label: 'Event-Titel', placeholder: 'Anna & Max — Hochzeit' },
    description: { label: 'Einladungstext' },
    startDate: { label: 'Beginn der Zeremonie' },
    endDate: { label: 'Ende der Feier (optional)' },
    location: { label: 'Location & Adresse', placeholder: 'Gartenlocation, München' },
    url: { label: 'Link nach RSVP (optional)', placeholder: 'https://ihrehochzeit.de/galerie' },
    _registryUrl: { label: 'Geschenkeliste-URL (optional)' },
  },
  'event-registration': {
    _eventName: { label: 'Event-Name', placeholder: 'Product Summit 2026' },
    _eventDate: { label: 'Datum', placeholder: '15.–16. Juni 2026, Berlin' },
    url: { label: 'Registrierungs-URL', placeholder: 'https://eventbrite.com/...' },
    _venue: { label: 'Location / Plattform', placeholder: 'Messe Berlin / Zoom' },
    _agendaUrl: { label: 'Agenda-URL (optional)' },
  },
  'instagram-bio': {
    _campaign: { label: 'Kampagnen-Label', placeholder: 'Sommerkollektion Box' },
    _highlight: { label: 'Highlight bewerben', placeholder: 'Neuheiten / Menü' },
  },
  'youtube-channel': {
    username: { label: 'Kanal-Handle', placeholder: '@ihrkanal' },
    url: { label: 'Oder Video- / Playlist-URL' },
    _ctaText: { label: 'CTA-Text', placeholder: 'Scannen zum Abonnieren & Tutorials ansehen' },
  },
  portfolio: {
    url: { label: 'Portfolio-URL', placeholder: 'https://behance.net/ihrname' },
    _headline: { label: 'Überschrift', placeholder: 'Brand & UI Designer' },
    _specialty: { label: 'Schwerpunkt', placeholder: 'Fintech, SaaS, Packaging' },
    _calendly: { label: 'Buchungs-URL', placeholder: 'https://calendly.com/sie' },
  },
  'cv-resume': {
    url: { label: 'Lebenslauf-URL', placeholder: 'https://ihreseite.de/cv.pdf' },
    _fullName: { label: 'Vollständiger Name', placeholder: 'Max Mustermann' },
    _role: { label: 'Zielposition', placeholder: 'Senior Product Manager' },
    _linkedin: { label: 'LinkedIn (optional)' },
  },
  'crypto-donate': {
    coin: {
      label: 'Kryptowährung',
      options: {
        btc: 'Bitcoin (BTC)',
        eth: 'Ethereum (ETH)',
      },
    },
    address: { label: 'Adresse', placeholder: 'bc1q... oder 0x...' },
    _purpose: { label: 'Zweck', placeholder: 'Unterstützen Sie unseren Gemeinschaftsgarten' },
  },
  'real-estate': {
    url: { label: 'Exposé-URL' },
    _address: { label: 'Adresse', placeholder: 'Hauptstraße 123, Berlin' },
    _price: { label: 'Preis', placeholder: '€425.000' },
    _specs: { label: 'Details', placeholder: '3 Zi. · 120 m² · 5. OG' },
    _openHouse: { label: 'Open House', placeholder: 'Sa 14:00–17:00' },
    _agentPhone: { label: 'Makler-Telefon' },
  },
  'retail-stores': {
    url: { label: 'Promo- oder Produkt-URL' },
    _productName: { label: 'Produkt oder SKU', placeholder: 'Bio-Olivenöl 500 ml' },
    _campaign: { label: 'Kampagne', placeholder: 'Frühjahr 2026 Schaufenster' },
    _storeLocation: { label: 'Filiale / Gang', placeholder: 'Innenstadt · Gang 4' },
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
  'healthcare-clinics': {
    url: { label: 'Portal-URL' },
    _clinicName: { label: 'Klinikname', placeholder: 'Praxis Familienmedizin West' },
    _department: { label: 'Abteilung', placeholder: 'Pädiatrie / Notfallversorgung' },
  },
  'museums-venues': {
    url: { label: 'Ausstellungs-URL' },
    _exhibitTitle: { label: 'Ausstellungstitel', placeholder: 'Meister der Renaissance' },
    _gallery: { label: 'Galerie / Bereich', placeholder: 'Galerie 3 · Ostflügel' },
  },
  'fitness-gyms': {
    url: { label: 'Kursplan-URL' },
    _gymName: { label: 'Studio-Name', placeholder: 'IronWorks Fitness' },
    _trialOffer: { label: 'Probetraining', placeholder: '7 Tage kostenlos' },
  },
  'salon-spa': {
    url: { label: 'Buchungs-URL' },
    _salonName: { label: 'Salonname', placeholder: 'Luxe Hair & Spa' },
    _topService: { label: 'Top-Service', placeholder: 'Balayage · Gel-Maniküre' },
  },
  'nonprofit-fundraising': {
    url: { label: 'Kampagnen-URL' },
    _orgName: { label: 'Organisation', placeholder: 'Gemeinschaftsgarten-Allianz' },
    _campaign: { label: 'Kampagne', placeholder: 'Frühjahrs-Pflanzaktion 2026' },
  },
  'dental-clinics': {
    url: { label: 'Patienten-URL' },
    _practiceName: { label: 'Praxisname', placeholder: 'Bright Smile Dental' },
    _servicePromo: { label: 'Aktuelle Aktion', placeholder: 'Kostenlose Bleaching-Beratung' },
  },
  'home-services': {
    url: { label: 'Buchungs-URL' },
    _companyName: { label: 'Firmenname', placeholder: 'CoolAir HVAC' },
    _serviceArea: { label: 'Einsatzgebiet', placeholder: 'Großraum München' },
    _seasonalPromo: { label: 'Saisonangebot', placeholder: 'Klima-Check €79' },
  },
  'coffee-shops-cafes': {
    url: { label: 'Menü- / Treue-URL' },
    _cafeName: { label: 'Café-Name', placeholder: 'Roast & Co.' },
    _loyaltyNote: { label: 'Treue-Hook', placeholder: 'Scannen → 10 % Rabatt auf erste Bestellung' },
  },
  'tourist-attractions': {
    url: { label: 'Besucher-URL' },
    _attractionName: { label: 'Attraktionsname', placeholder: 'Hafen-Leuchtturm' },
    _hours: { label: 'Öffnungszeiten', placeholder: 'Täglich 9:00–18:00' },
  },
};
