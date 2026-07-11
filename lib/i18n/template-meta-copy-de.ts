import type { TranslationTree } from './types';

/** Per-template tagline, use cases and pro tips — keyed by template id */
export const templateMetaDe: TranslationTree = {
  'restaurant-menu': {
    tagline: 'Digitale Speisekarte am Tisch — kein Neudruck bei Preisänderungen',
    useCases: {
      '0': 'Tischaufsteller',
      '1': 'Schaufenster-Sticker',
      '2': 'Lieferverpackung',
      '3': 'Zimmerservice-Karten',
    },
    tips: {
      '0': 'Auf Tischaufstellern mindestens 3×3 cm QR drucken.',
      '1': 'Zeitbasierte Weiterleitung für Mittags- / Abendmenüs aktivieren.',
      '2': 'Lead-Erfassung auf der Landingpage für Reservierungsanfragen nutzen.',
      '3': 'UTM: source=qr_menu, medium=print.',
    },
  },
  'business-card': {
    tagline: 'Ein Scan speichert Ihren vollständigen Kontakt auf dem Smartphone',
    useCases: {
      '0': 'Konferenz-Badge',
      '1': 'E-Mail-Signatur',
      '2': 'Bürotür',
      '3': 'LinkedIn-Banner',
    },
    tips: {
      '0': 'vCard ist statisch — nur bei Telefon- oder Rollenwechsel neu drucken.',
      '1': 'Fehlerkorrektur H mit zentralem Logo verwenden.',
      '2': 'Auf der Rückseite dynamischen URL-QR für aktuelles Portfolio hinzufügen.',
    },
  },
  wedding: {
    tagline: 'Einladung, RSVP und Details — dynamischer Link, kein Neudruck',
    useCases: {
      '0': 'Gedruckte Einladung',
      '1': 'Tischkarten',
      '2': 'Save-the-date',
      '3': 'Dankeskarten',
    },
    tips: {
      '0': 'Dynamischer QR — Geschenkeliste oder Galerie-Link ohne Neudruck aktualisieren.',
      '1': 'Landingpage + Lead-Formular sammelt RSVPs (Name, E-Mail, Gästeanzahl).',
      '2': 'Event-Datum/-Uhrzeit in den Feldern oben für Landingpage-Untertitel eintragen.',
      '3': 'Druckkontrast mit Scan-Score testen.',
    },
  },
  'event-registration': {
    tagline: 'Scannen zum Registrieren — Poster, Badges und Folien',
    useCases: {
      '0': 'Roll-up-Banner',
      '1': 'Badge-Lanyard',
      '2': 'E-Mail-Kampagne',
      '3': 'Letzte Folie',
    },
    tips: {
      '0': 'Zwei Registrierungsseiten A/B-testen.',
      '1': 'QR für Ankündigungstag planen.',
      '2': 'GA4-Pixel für Poster-zu-Anmeldung-Tracking aktivieren.',
    },
  },
  'instagram-bio': {
    tagline: 'Offline zum Profil — Verpackung, Store, Events',
    useCases: {
      '0': 'Produktbox',
      '1': 'Schaufenster',
      '2': 'Flyer',
      '3': 'Fotowand',
    },
    tips: {
      '0': 'Dynamischer Kurzlink → später auf bestimmten Post umleiten.',
      '1': 'NFC-Sticker: ?src=nfc für Quellen-Analytics hinzufügen.',
      '2': 'Gradient an Instagram-Markenfarben anpassen.',
    },
  },
  'youtube-channel': {
    tagline: 'Druck und Verpackung → Abonnenten',
    useCases: {
      '0': 'Video-Outro',
      '1': 'Merch-Box',
      '2': 'Kurs-Handout',
      '3': 'Folien-Deck',
    },
    tips: {
      '0': 'Mit Onboarding-Playlist für neue Zuschauer verlinken.',
      '1': 'Weiterleitung auf neuestes Video ohne Neudruck aktualisieren.',
      '2': 'Rot auf Weiß scannt am besten — auf dunklen Hintergründen testen.',
    },
  },
  portfolio: {
    tagline: 'Arbeit zeigen und Projekt-Leads erfassen',
    useCases: {
      '0': 'Ausstellungsplakette',
      '1': 'Freelance-Deck',
      '2': 'Behance-Ergänzung',
      '3': 'Kreativer Lebenslauf',
    },
    tips: {
      '0': 'Lead-Formular: Name, E-Mail, Projekttyp.',
      '1': 'Vertrauliche Kundenarbeit passwortschützen.',
      '2': 'Transparentes PNG auf dunklen Ausstellungswänden.',
    },
  },
  'cv-resume': {
    tagline: 'Recruiter öffnen Ihren aktuellen Lebenslauf mit einem Scan',
    useCases: {
      '0': 'Jobmesse',
      '1': 'Lebenslauf-Kopfzeile',
      '2': 'Networking',
      '3': 'LinkedIn Featured',
    },
    tips: {
      '0': 'QR „CV 2026“ benennen und alte Versionen archivieren.',
      '1': 'Scan-Spitze vor dem Interview = Datei wurde geöffnet.',
      '2': 'Mit vCard-QR auf Networking-Karten kombinieren.',
    },
  },
  'crypto-donate': {
    tagline: 'BTC- oder ETH-Empfangsadresse — keine Tippfehler',
    useCases: {
      '0': 'Streamer-Trinkgeld',
      '1': 'Wohltätigkeits-Poster',
      '2': 'Künstler-Glas',
      '3': 'Event-Sponsoring',
    },
    tips: {
      '0': 'Statischer QR — neue Adresse erfordert neuen Druck.',
      '1': 'Fehlerkorrektur H + hoher Kontrast auf dunklem Hintergrund.',
      '2': 'Zuerst mit kleiner Überweisung testen.',
    },
  },
  'real-estate': {
    tagline: 'Gartenschild → Exposé → Besichtigungsanfrage',
    useCases: {
      '0': 'Zu-verkaufen-Schild',
      '1': 'Open-House-Flyer',
      '2': 'Maklerkarte',
      '3': 'Mietanzeige',
    },
    tips: {
      '0': 'Lead-Formular: Name, Telefon, bevorzugte Besichtigungszeit.',
      '1': 'Geofencing für DE vs. internationale Käufer.',
      '2': 'URL bei Preissenkung aktualisieren — gleicher QR auf dem Schild.',
      '3': 'NFC-Broschüre für kaufbereite Interessenten.',
    },
  },
  'wifi-guest': {
    tagline: 'Lobby- und Zimmerkarten — verbinden ohne Passwort-Eingabe',
    useCases: {
      '0': 'Hotel-Zimmermappe',
      '1': 'Café-Theken-Aufsteller',
      '2': 'Co-Working-Lobby',
      '3': 'Airbnb-Willkommenskarte',
    },
    tips: {
      '0': 'Gäste-VLAN vom Geschäftsnetzwerk isolieren.',
      '1': 'Passwörter in stark frequentierten Locations monatlich rotieren.',
      '2': 'Für Lobby-Ständer mindestens 3×3 cm drucken.',
    },
  },
  'retail-stores': {
    tagline: 'Regaltafeln und Verpackung → Produktseiten und Aktionen',
    useCases: {
      '0': 'Regaltafel',
      '1': 'Produkt-Anhänger',
      '2': 'Schaufenster-Display',
      '3': 'Treueprogramm-Anmeldung',
    },
    tips: {
      '0': 'UTM-Tags: source=qr_shelf, medium=print.',
      '1': 'CSV-Massenimport für hunderte SKUs.',
      '2': 'Promo-URL-Wechsel nach Datum planen.',
    },
  },
  'hotels-hospitality': {
    tagline: 'Ein Scan — WLAN, Menüs, Spa und lokaler Reiseführer',
    useCases: {
      '0': 'Zimmer-Aufsteller',
      '1': 'Lobby-Verzeichnis',
      '2': 'Pool-Beschilderung',
      '3': 'Spa-Menü-Ständer',
    },
    tips: {
      '0': 'Saisonale Spa- und Restaurant-Links ohne Neudruck aktualisieren.',
      '1': 'Sprach-Routing für internationale Gäste hinzufügen.',
      '2': 'Hotel-Landing-Vorlage für elegantes Branding nutzen.',
    },
  },
  'healthcare-clinics': {
    tagline: 'Patientenaufnahme und Aufklärung — kein Papierstapel',
    useCases: {
      '0': 'Wartezimmer-Poster',
      '1': 'Check-in-Schalter',
      '2': 'Behandlungsraum-Handout',
      '3': 'Nachsorge',
    },
    tips: {
      '0': 'Keine PHI in der QR-URL — Link zu Ihrem konformen Portal.',
      '1': 'Nur-für-Personal-Abläufe passwortschützen.',
      '2': 'Formulare bei Protokolländerungen aktualisieren — gleicher gedruckter QR.',
    },
  },
  'museums-venues': {
    tagline: 'Ausstellungslabels → Audio, Tickets und Spenden',
    useCases: {
      '0': 'Ausstellungsplakette',
      '1': 'Galerie-Bereichsschild',
      '2': 'Spendenständer',
      '3': 'Zeitfenster-Eingang',
    },
    tips: {
      '0': 'Mehrsprachiges Routing nach Besucherland.',
      '1': 'Beliebte Ausstellungen per Scan-Volumen tracken.',
      '2': 'Mindestens 2×2 cm auf Armlänge Betrachtungsabstand.',
    },
  },
  'fitness-gyms': {
    tagline: 'Kurspläne und Mitgliedschaften aus der Lobby',
    useCases: {
      '0': 'Lobby-Kursplan-Tafel',
      '1': 'Gerätezone',
      '2': 'Trainer-Poster',
      '3': 'Probetraining-Promo',
    },
    tips: {
      '0': 'Wöchentliche Kursänderungen ohne neue Poster aktualisieren.',
      '1': 'Gerätezone-QR → How-to-Video pro Maschine.',
      '2': 'Geofence-Routing für Multi-Standort-Ketten.',
    },
  },
  'salon-spa': {
    tagline: 'Buchung und Service-Menüs von Spiegel-Aufklebern',
    useCases: {
      '0': 'Spiegel-Aufkleber',
      '1': 'Rezeption',
      '2': 'Stylist-Karte',
      '3': 'Retail-Regal',
    },
    tips: {
      '0': 'Saisonale Promos ohne Neudruck der Aufkleber wechseln.',
      '1': 'Lead-Formular für Braut- und Event-Pakete.',
      '2': 'Stylist-spezifische URLs für Provisions-Tracking.',
    },
  },
  'nonprofit-fundraising': {
    tagline: 'Spenden, Freiwillige und Anmeldungen von gedrucktem Material',
    useCases: {
      '0': 'Gala-Tischaufsteller',
      '1': 'Direktmail-Beilage',
      '2': 'Event-Poster',
      '3': 'Freiwilligen-Stand',
    },
    tips: {
      '0': 'Spenden-URLs zwischen Kampagnen wechseln — gleicher Poster-QR.',
      '1': 'Tischaufsteller vs. Poster per Chargen-Label tracken.',
      '2': 'Spenden-Seiten-Text auf Landingpage A/B-testen.',
    },
  },
  'dental-clinics': {
    tagline: 'Aufnahme, Buchung und Nachsorge vom Behandlungsstuhl',
    useCases: {
      '0': 'Rezeptions-Poster',
      '1': 'Terminerinnerungskarte',
      '2': 'Nachsorge am Stuhl',
      '3': 'Bleaching-Promo',
    },
    tips: {
      '0': 'Link zu HIPAA-konformem Portal — keine PHI im QR.',
      '1': 'Nachsorge-PDF, das Patienten in Fotos speichern können.',
      '2': 'Hygiene-Specials auf saisonalen Karten bewerben.',
    },
  },
  'home-services': {
    tagline: 'Fahrzeugaufkleber und Gartenschilder → Buchung und Bewertungen',
    useCases: {
      '0': 'Fahrzeugaufkleber',
      '1': 'Gartenschild',
      '2': 'Türhänger',
      '3': 'Baustellenschild',
    },
    tips: {
      '0': 'QR pro Techniker für Gebiets-Tracking.',
      '1': 'Saisonale Promos auf demselben Fahrzeugaufkleber rotieren.',
      '2': 'Webhook ins CRM bei Lead-Formular-Absendung.',
    },
  },
  'coffee-shops-cafes': {
    tagline: 'Treueprogramm, Menü und Bestellung an der Theke',
    useCases: {
      '0': 'Theken-Aufsteller',
      '1': 'Tischkarte',
      '2': 'To-go-Becherhülle',
      '3': 'Treue-Poster',
    },
    tips: {
      '0': 'Mit separatem WLAN-QR für Gästenetzwerk kombinieren.',
      '1': 'Saisongetränke ohne Neudruck der Aufsteller aktualisieren.',
      '2': 'UTM: source=qr_counter für Attribution.',
    },
  },
  'tourist-attractions': {
    tagline: 'Eingangs-Scan → Tickets, Audio und Karten',
    useCases: {
      '0': 'Eingangstor',
      '1': 'Wegweiser',
      '2': 'Ticket-Schalter',
      '3': 'Audioguide-Pfosten',
    },
    tips: {
      '0': 'Mehrsprachiges Routing für internationale Touristen.',
      '1': 'QR pro Eingang für Besucherstrom-Analytics.',
      '2': 'Öffnungszeiten und Ausstellungen ohne Neudruck der Schilder aktualisieren.',
    },
  },
  'campus-institution': {
    tagline: 'Karten, Services und öffentliche Infos — ein Scan pro Standort',
    useCases: {
      '0': 'Gebäudeplakette',
      '1': 'Orientierung',
      '2': 'Bürgerdienste',
      '3': 'Fachbereichs-Lobby',
    },
    tips: {
      '0': 'CSV-Massenimport für hunderte Raumplaketten.',
      '1': 'Mehrsprachiges Routing für internationale Nutzer.',
    },
  },
  'professional-services': {
    tagline: 'Kundenaufnahme und sichere Portale — Recht, Versicherung, Buchhaltung',
    useCases: {
      '0': 'Büro-Lobby',
      '1': 'Visitenkarte',
      '2': 'Mailer-Beilage',
      '3': 'Messe-Stand',
    },
    tips: {
      '0': 'Sensible Dokumentenlinks passwortschützen.',
      '1': 'Niemals PII in der QR-URL selbst kodieren.',
    },
  },
  'retail-grocery': {
    tagline: 'Wochenprospekt, Treue-Anmeldung und Preischecks aus dem Gang',
    useCases: {
      '0': 'Wochenprospekt-Ständer',
      '1': 'Gang-Regaltafel',
      '2': 'Treue-Anmelde-Poster',
      '3': 'Kassenbereich',
    },
    tips: {
      '0': 'Wochenprospekt-Link jeden Montag wechseln — gleicher gedruckter Regal-QR.',
      '1': 'Treue-Anmelde-URL hinzufügen, um die Liste aus dem Gang zu erweitern.',
      '2': 'Separaten QR pro Filiale für Fußgänger-Analytics nutzen.',
    },
  },
  'entertainment-venue': {
    tagline: 'Tickets, Vorstellungszeiten und Merch von einem Poster',
    useCases: {
      '0': 'Lobby-Poster',
      '1': 'Zapfhahn',
      '2': 'Event-Armband',
      '3': 'Tischaufsteller',
    },
    tips: {
      '0': 'Show-URLs zwischen Events wechseln — gleicher gedruckter Poster-QR.',
    },
  },
  'automotive-marine': {
    tagline: 'Bestand, Service-Spur und Marina-Liegeplätze',
    useCases: {
      '0': 'Fensteraufkleber',
      '1': 'Service-Spur',
      '2': 'Marina-Steg',
      '3': 'Aufbereitungsbucht',
    },
    tips: {
      '0': 'Geofence pro Standort.',
      '1': 'VDP-Links bei Bestandswechsel aktualisieren.',
    },
  },
  'property-facilities': {
    tagline: 'Mieterportale, Coworking und Lagerbetrieb',
    useCases: {
      '0': 'Gebäude-Lobby',
      '1': 'Laderampe',
      '2': 'Mitglieder-Schalter',
      '3': 'Einheiten-Mailer',
    },
    tips: {
      '0': 'Ordner pro Gebäude im Dashboard.',
      '1': 'Webhook ins Wartungs-Ticketing.',
    },
  },
  'specialty-healthcare': {
    tagline: 'Tierarzt, Augenoptik und Fachklinik-Aufnahme',
    useCases: {
      '0': 'Rezeptions-Poster',
      '1': 'Terminkarte',
      '2': 'Wartezimmer',
    },
    tips: {
      '0': 'Link zu konformem Portal — keine PHI in der QR-URL.',
    },
  },
  'family-community': {
    tagline: 'Anmeldung, Familienportale und Glaubensgemeinschaft',
    useCases: {
      '0': 'Lobby-Schild',
      '1': 'Mitteilungsblatt-Beilage',
      '2': 'Familien-Mailer',
      '3': 'Event-Poster',
    },
    tips: {
      '0': 'Nur-für-Familien-Inhalte passwortschützen.',
      '1': 'Event-Kalender ohne Neudruck aktualisieren.',
    },
  },
  'mobile-vendor': {
    tagline: 'Food Trucks und Pop-ups — Menü und Bestellungen unterwegs',
    useCases: {
      '0': 'Truck-Fenster',
      '1': 'Festival-Stand',
      '2': 'Social Bio',
    },
    tips: {
      '0': 'Täglichen Standort auf der Landingpage aktualisieren.',
      '1': 'Gleicher QR am Truck die ganze Saison.',
    },
  },
  'local-services-hub': {
    tagline: 'Buchung, Aufnahme und Promos für lokale Unternehmen',
    useCases: {
      '0': 'Schaufenster',
      '1': 'Fahrzeugaufkleber',
      '2': 'Thekenkarte',
      '3': 'Gartenschild',
    },
    tips: {
      '0': 'Saisonale Promos auf demselben Fahrzeugaufkleber wechseln.',
      '1': 'Lead-Formular auf der Landingpage.',
    },
  },
  'whatsapp-order': {
    tagline: 'Ein Scan öffnet einen WhatsApp-Chat — Bestellungen und Support ohne App-Suche',
    useCases: { '0': 'Tischaufsteller', '1': 'Schaufenster', '2': 'Lieferverpackung', '3': 'Flyer' },
    tips: {
      '0': 'Nachricht mit Menü-Link oder „Ich möchte bestellen“ vorausfüllen.',
      '1': 'Geschäftsnummer mit WhatsApp Business für Auto-Antworten nutzen.',
      '2': 'Auf Tischaufstellern und Verpackung mindestens 3×3 cm drucken.',
    },
  },
  'google-review': {
    tagline: 'Zufriedene Kunden direkt zum Google-Bewertungsformular leiten',
    useCases: { '0': 'Thekenkarte', '1': 'Kassenbon-Fußzeile', '2': 'Tischaufsteller', '3': 'Liefer-Beilage' },
    tips: {
      '0': 'Im Moment der Freude fragen — nach dem Checkout oder einem tollen Essen.',
      '1': 'Mit kurzer Zeile kombinieren: „Gefallen? Scannen und bewerten.“',
      '2': 'Scan-Spitzen tracken, um zu sehen, welche Standorte am meisten fragen.',
    },
  },
  'tiktok-profile': {
    tagline: 'Offline-Traffic in TikTok-Follower verwandeln',
    useCases: { '0': 'Produktbox', '1': 'Schaufenster', '2': 'Event-Stand', '3': 'Flyer' },
    tips: {
      '0': 'Dynamischer Kurzlink — später auf Kampagne umleiten.',
      '1': '?src=nfc auf NFC-Stickern für Quellen-Analytics hinzufügen.',
      '2': 'Auf Verpackung drucken, um Käufer nach dem Kauf zu erreichen.',
    },
  },
  'linkedin-profile': {
    tagline: 'Professionelles Networking von Karten, Badges und Broschüren',
    useCases: { '0': 'Konferenz-Badge', '1': 'Visitenkarte', '2': 'Broschüre', '3': 'E-Mail-Signatur' },
    tips: {
      '0': 'Slug in Ihrer öffentlichen LinkedIn-Profil-URL finden.',
      '1': 'Mit vCard-QR auf Networking-Karten kombinieren.',
      '2': 'Hohe Fehlerkorrektur mit zentralem Logo scannt am besten.',
    },
  },
  'facebook-page': {
    tagline: 'Facebook-Seite durch Druck und Verpackung wachsen lassen',
    useCases: { '0': 'Schaufenster', '1': 'Flyer', '2': 'Kassenbon-Fußzeile', '3': 'Event-Poster' },
    tips: {
      '0': 'Vanity-URL der Seite nutzen, nicht die numerische ID.',
      '1': 'Events und Angebote auf derselben Seite bewerben.',
      '2': 'Tracken, welches Druckstück die meisten Follower bringt.',
    },
  },
};
