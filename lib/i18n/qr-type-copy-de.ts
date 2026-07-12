import type { QrTypePage } from '@/lib/qr-type-pages';

/**
 * German (de) copy overrides for QR type pages.
 * Keyed by the category slug defined in QR_CATEGORIES (lib/qr-utils.ts).
 */
export const QR_TYPE_COPY_DE: Record<string, Partial<QrTypePage>> = {
  url: {
    title: 'Website-Link-QR-Code',
    headline: 'Website-QR-Code erstellen — Kostenlos',
    metaDescription:
      'Kostenloser QR-Code-Generator für Ihre Website. Markenkonformes Design, Scan-Analysen und Links, die Sie ohne Neudruck aktualisieren können.',
    description:
      'Leiten Sie Besucher auf jede beliebige Seite und ändern Sie den Link jederzeit ohne Neudruck.',
    benefits: [
      'Link jederzeit aktualisieren — ohne den Code neu zu drucken',
      'Design mit Farben, Logo und Rahmen passend zu Ihrer Marke',
      'Als PNG, SVG oder druckfertiges PDF herunterladen',
      'Mit Analysen sehen, wie viele Personen wo und wann scannen',
    ],
    useCases: ['Produktverpackungen', 'Plakate und Flyer', 'E-Mail-Signaturen'],
  },
  text: {
    title: 'Klartext-QR-Code',
    headline: 'Text-QR-Code erstellen — Kostenlos',
    metaDescription:
      'Kostenloser Text-QR-Code-Generator, der beim Scannen eine Nachricht, einen Code oder eine Notiz anzeigt. Markenkonformes Design und druckfertige Ausgaben.',
    description:
      'Zeigen Sie eine Nachricht, einen Code oder eine Notiz an, sobald jemand den Code scannt.',
    benefits: [
      'Sofort lesbarer Klartext — ohne App',
      'Anweisungen, Gutscheincodes oder kurze Hinweise teilen',
      'Anpassbares Design mit Farben, Logo und Rahmen',
      'Als PNG, SVG oder druckfertiges PDF herunterladen',
    ],
    useCases: ['Produktetiketten', 'Infotafeln', 'Promotionskarten'],
  },
  vcard: {
    title: 'Digitale Visitenkarten-QR-Code',
    headline: 'Digitale Visitenkarte als QR-Code erstellen — Kostenlos',
    metaDescription:
      'Kostenloser Visitenkarten-QR-Code-Generator, der Name, Telefon und E-Mail mit einem Scan speichert. Markenkonform und druckfertig.',
    description:
      'Ein Scan speichert Ihren Namen, Ihre Telefonnummer und E-Mail auf dem Telefon der anderen Person.',
    benefits: [
      'Alle Kontaktdaten landen mit einem Scan im Adressbuch',
      'Keine Papierkarten mehr — immer aktuell',
      'Professionelles Erscheinungsbild mit Farben, Logo und Rahmen',
      'Als PNG, SVG oder druckfertiges PDF herunterladen',
    ],
    useCases: ['Visitenkarten', 'Konferenz-Namensschilder', 'E-Mail-Fußzeilen'],
  },
  wifi: {
    title: 'WLAN-Zugangs-QR-Code',
    headline: 'WLAN-QR-Code erstellen — Kostenlos',
    metaDescription:
      'Kostenloser WLAN-QR-Code-Generator: Gäste verbinden sich sofort ohne Passworteingabe. Markenkonform und druckfertig.',
    description:
      'Ihre Gäste verbinden sich sofort mit Ihrem Netzwerk — ohne Passwort tippen.',
    benefits: [
      'Gäste verbinden sich mit einem Scan — ohne Passwort tippen',
      'Netzwerkname und Passwort sind sicher im Code hinterlegt',
      'Design mit Farben, Logo und Rahmen passend zu Ihrem Standort',
      'Als PNG, SVG oder druckfertiges PDF herunterladen',
    ],
    useCases: ['Hotellobbys', 'Cafés und Coworking-Spaces', 'Willkommenskarten für Unterkünfte'],
  },
  email: {
    title: 'E-Mail-QR-Code',
    headline: 'E-Mail-QR-Code erstellen — Kostenlos',
    metaDescription:
      'Kostenloser E-Mail-QR-Code-Generator, der die E-Mail-App mit Adresse und Nachricht öffnet. Markenkonform und druckfertig.',
    description:
      'Öffnet die E-Mail-App der anderen Person mit Ihrer Adresse und Nachricht vorausgefüllt.',
    benefits: [
      'Empfänger, Betreff und Nachricht werden automatisch ausgefüllt',
      'Erleichtert Feedback und Kontaktanfragen',
      'Anpassbares Design mit Farben, Logo und Rahmen',
      'Als PNG, SVG oder druckfertiges PDF herunterladen',
    ],
    useCases: ['Support-Broschüren', 'Kontaktkarten', 'Messestände'],
  },
  sms: {
    title: 'SMS-QR-Code',
    headline: 'SMS-QR-Code erstellen — Kostenlos',
    metaDescription:
      'Kostenloser SMS-QR-Code-Generator, der eine vorgefüllte Nachricht an Ihre Nummer sendet. Markenkonformes Design und druckfertige Ausgaben.',
    description:
      'Füllen Sie vorab eine Nachricht aus, die an Ihre Telefonnummer gesendet wird.',
    benefits: [
      'Nummer und Nachrichtentext sind automatisch vorausgefüllt',
      'Beschleunigt Kampagnenteilnahme und Bestätigungsprozesse',
      'Design mit Farben, Logo und Rahmen passend zu Ihrer Marke',
      'Als PNG, SVG oder druckfertiges PDF herunterladen',
    ],
    useCases: ['Kampagnenplakate', 'Gewinnspielteilnahmen', 'Kurzcode-Ankündigungen'],
  },
  phone: {
    title: 'Telefonanruf-QR-Code',
    headline: 'Telefon-QR-Code erstellen — Kostenlos',
    metaDescription:
      'Kostenloser Telefon-QR-Code-Generator, der Ihre Nummer mit einem Tippen anruft. Ideal für Support und Vertrieb — markenkonform und druckfertig.',
    description:
      'Tippen zum Anrufen Ihrer Nummer — ideal für Support und Vertrieb.',
    benefits: [
      'Anruf mit einem Tippen — ohne Nummer manuell einzugeben',
      'Erleichtert den Zugang zu Support- und Verkaufshotlines',
      'Anpassbares Design mit Farben, Logo und Rahmen',
      'Als PNG, SVG oder druckfertiges PDF herunterladen',
    ],
    useCases: ['Schaufenster und Schilder', 'Servicefahrzeuge', 'Visitenkarten und Broschüren'],
  },
  location: {
    title: 'Kartenstandort-QR-Code',
    headline: 'Standort-QR-Code erstellen — Kostenlos',
    metaDescription:
      'Kostenloser Standort-QR-Code-Generator mit Route zu Shop, Büro oder Event-Location. Markenkonform und druckfertig.',
    description:
      'Öffnet die Route zu Ihrem Shop, Büro oder Event-Standort.',
    benefits: [
      'Besucher erhalten mit einem Scan die Wegbeschreibung',
      'Erreichen den richtigen Ort — ohne Adresse abzutippen',
      'Design mit Farben, Logo und Rahmen passend zu Ihrer Marke',
      'Als PNG, SVG oder druckfertiges PDF herunterladen',
    ],
    useCases: ['Einladungen', 'Event-Wegweisungen', 'Schaufenster und Schilder'],
  },
  event: {
    title: 'Kalendertermin-QR-Code',
    headline: 'Event-QR-Code erstellen — Kostenlos',
    metaDescription:
      'Kostenloser Event-QR-Code-Generator, der Ihren Termin mit einem Scan in den Kalender übernimmt. Markenkonformes Design und druckfertige Ausgaben.',
    description:
      'Ein Scan fügt Ihren Termin dem Kalender der anderen Person hinzu.',
    benefits: [
      'Datum, Uhrzeit und Ort werden automatisch in den Kalender übernommen',
      'Verringert die Chance, dass Teilnehmer das Event vergessen',
      'Anpassbares Design mit Farben, Logo und Rahmen',
      'Als PNG, SVG oder druckfertiges PDF herunterladen',
    ],
    useCases: ['Einladungen', 'Konferenz-Namensschilder', 'Hochzeitsprogramme'],
  },
  whatsapp: {
    title: 'WhatsApp-Chat-QR-Code',
    headline: 'WhatsApp-QR-Code erstellen — Kostenlos',
    metaDescription:
      'Kostenloser WhatsApp-QR-Code-Generator, der einen Chat startet — optional mit vorgefüllter Nachricht. Markenkonform und druckfertig.',
    description:
      'Startet einen WhatsApp-Chat — optional mit einer vorgefüllten Nachricht.',
    benefits: [
      'Chat startet mit einem Scan — ohne Nummer zu suchen',
      'Optionale Vorlagennachricht erleichtert die Kontaktaufnahme',
      'Design mit Farben, Logo und Rahmen passend zu Ihrer Marke',
      'Als PNG, SVG oder druckfertiges PDF herunterladen',
    ],
    useCases: ['Kundensupport-Aufkleber', 'Produktetiketten', 'Messestände'],
  },
  telegram: {
    title: 'Telegram-QR-Code',
    headline: 'Telegram-QR-Code erstellen — Kostenlos',
    metaDescription:
      'Kostenloser Telegram-QR-Code-Generator, der Ihren Kanal oder Chat öffnet. Markenkonformes Design und druckfertige Ausgaben.',
    description:
      'Öffnet Ihren Telegram-Kanal oder direkten Chat.',
    benefits: [
      'Follower treten Ihrem Kanal mit einem Scan bei',
      'Link jederzeit aktualisierbar',
      'Anpassbares Design mit Farben, Logo und Rahmen',
      'Als PNG, SVG oder druckfertiges PDF herunterladen',
    ],
    useCases: ['Community-Plakate', 'Event-Ankündigungen', 'Social-Media-Beiträge'],
  },
  discord: {
    title: 'Discord-Server-QR-Code',
    headline: 'Discord-QR-Code erstellen — Kostenlos',
    metaDescription:
      'Kostenloser Discord-QR-Code-Generator für den Beitritt zu Ihrer Community per Einladungslink. Markenkonform und druckfertig.',
    description:
      'Ermöglicht den Beitritt zu Ihrer Community über einen Einladungslink.',
    benefits: [
      'Mitglieder treten Ihrem Server mit einem Scan bei',
      'Einladungslink jederzeit aktualisierbar',
      'Design mit Farben, Logo und Rahmen passend zu Ihrer Marke',
      'Als PNG, SVG oder druckfertiges PDF herunterladen',
    ],
    useCases: ['Gaming-Community-Plakate', 'Stream-Overlay-Grafiken', 'Event-Ankündigungen'],
  },
  instagram: {
    title: 'Instagram-Profil-QR-Code',
    headline: 'Instagram-QR-Code erstellen — Kostenlos',
    metaDescription:
      'Kostenloser Instagram-QR-Code-Generator, der Follower von Verpackung, Plakat und Store-Displays gewinnt. Markenkonform und druckfertig.',
    description:
      'Gewinnen Sie Follower über Verpackung, Plakate und Displays im Store.',
    benefits: [
      'Wandelt Offline-Traffic in Instagram-Follower um',
      'Profillink jederzeit aktualisierbar',
      'Design mit Farben, Logo und Rahmen passend zu Ihrer Marke',
      'Als PNG, SVG oder druckfertiges PDF herunterladen',
    ],
    useCases: ['Retail-Displays', 'Verpackungseinlagen', 'Schilder im Store'],
  },
  facebook: {
    title: 'Facebook-Seiten-QR-Code',
    headline: 'Facebook-QR-Code erstellen — Kostenlos',
    metaDescription:
      'Kostenloser Facebook-QR-Code-Generator für Ihre Seite oder Ihr Profil. Markenkonformes Design und druckfertige Ausgaben.',
    description:
      'Verlinkt auf Ihre Facebook-Seite oder Ihr Profil.',
    benefits: [
      'Besucher erreichen Ihre Seite mit einem Scan',
      'Link jederzeit aktualisierbar',
      'Design mit Farben, Logo und Rahmen passend zu Ihrer Marke',
      'Als PNG, SVG oder druckfertiges PDF herunterladen',
    ],
    useCases: ['Ladenschilder', 'Flyer und Handzettel', 'Event-Plakate'],
  },
  tiktok: {
    title: 'TikTok-Profil-QR-Code',
    headline: 'TikTok-QR-Code erstellen — Kostenlos',
    metaDescription:
      'Kostenloser TikTok-QR-Code-Generator, der Offline-Traffic in TikTok-Follower umwandelt. Markenkonform und druckfertig.',
    description:
      'Wandeln Sie Offline-Traffic in TikTok-Follower um.',
    benefits: [
      'Gewinnt TikTok-Follower über physische Materialien',
      'Profillink jederzeit aktualisierbar',
      'Design mit Farben, Logo und Rahmen passend zu Ihrer Marke',
      'Als PNG, SVG oder druckfertiges PDF herunterladen',
    ],
    useCases: ['Retail-Displays', 'Produktverpackungen', 'Event-Stände'],
  },
  linkedin: {
    title: 'LinkedIn-Profil-QR-Code',
    headline: 'LinkedIn-QR-Code erstellen — Kostenlos',
    metaDescription:
      'Kostenloser LinkedIn-QR-Code-Generator für professionelles Networking über Visitenkarten, Namensschilder und Broschüren. Markenkonform und druckfertig.',
    description:
      'Bauen Sie Ihr professionelles Netzwerk über Visitenkarten, Namensschilder und Broschüren aus.',
    benefits: [
      'Profillink mit einem Scan teilen',
      'Link jederzeit aktualisierbar',
      'Professionelles Erscheinungsbild mit Farben, Logo und Rahmen',
      'Als PNG, SVG oder druckfertiges PDF herunterladen',
    ],
    useCases: ['Visitenkarten', 'Konferenz-Namensschilder', 'Unternehmensbroschüren'],
  },
  youtube: {
    title: 'YouTube-Kanal-QR-Code',
    headline: 'YouTube-QR-Code erstellen — Kostenlos',
    metaDescription:
      'Kostenloser YouTube-QR-Code-Generator, der Zuschauer zu Ihrem Kanal oder einem bestimmten Video führt. Markenkonform und druckfertig.',
    description:
      'Leitet Zuschauer zu Ihrem Kanal oder einem bestimmten Video.',
    benefits: [
      'Besucher sehen Ihre Inhalte mit einem Scan',
      'Kanal- oder Videolink jederzeit aktualisieren',
      'Design mit Farben, Logo und Rahmen passend zu Ihrer Marke',
      'Als PNG, SVG oder druckfertiges PDF herunterladen',
    ],
    useCases: ['Produktverpackungen', 'Werbeplakate', 'Präsentationen und Events'],
  },
  spotify: {
    title: 'Spotify-QR-Code',
    headline: 'Spotify-QR-Code erstellen — Kostenlos',
    metaDescription:
      'Kostenloser Spotify-QR-Code-Generator zum Teilen von Song, Album oder Playlist. Markenkonformes Design und druckfertige Ausgaben.',
    description:
      'Teilen Sie einen Song, ein Album oder eine Playlist.',
    benefits: [
      'Hörer erreichen Ihre Musik mit einem Scan',
      'Link jederzeit aktualisierbar',
      'Design mit Farben, Logo und Rahmen passend zu Ihrer Marke',
      'Als PNG, SVG oder druckfertiges PDF herunterladen',
    ],
    useCases: ['Konzertplakate', 'Album- und Merch-Designs', 'Social-Media-Beiträge'],
  },
  social: {
    title: 'Social-Link-QR-Code',
    headline: 'Social-Media-QR-Code erstellen — Kostenlos',
    metaDescription:
      'Kostenloser Social-Media-QR-Code-Generator für jedes Profil oder jede Linkseite. Markenkonform und druckfertig.',
    description:
      'Teilen Sie die Adresse eines beliebigen Social-Profils oder einer Linkseite.',
    benefits: [
      'Leitet mit einem Scan zur gewünschten Social-Plattform',
      'Link jederzeit aktualisierbar',
      'Design mit Farben, Logo und Rahmen passend zu Ihrer Marke',
      'Als PNG, SVG oder druckfertiges PDF herunterladen',
    ],
    useCases: ['Social-Media-Kampagnen', 'Retail-Displays', 'Event-Materialien'],
  },
  link_hub: {
    title: 'Link-Hub-QR-Code',
    headline: 'Link-Hub-QR-Code erstellen — Kostenlos',
    metaDescription:
      'Kostenloser Link-Hub-QR-Code-Generator im Linktree-Stil: mehrere Buttons hinter einem QR. Markenkonform und druckfertig.',
    description:
      'Bündelt mehrere Buttons hinter einem QR — wie Linktree.',
    benefits: [
      'Alle Links unter einem QR zusammenfassen',
      'Buttons und Links jederzeit aktualisierbar',
      'Design mit Farben, Logo und Rahmen passend zu Ihrer Marke',
      'Als PNG, SVG oder druckfertiges PDF herunterladen',
    ],
    useCases: ['Bio-Links', 'Event-Programme', 'Restaurant-Link-Menüs'],
  },
  zoom: {
    title: 'Zoom-Meeting-QR-Code',
    headline: 'Zoom-QR-Code erstellen — Kostenlos',
    metaDescription:
      'Kostenloser Zoom-QR-Code-Generator für den Beitritt zu Ihrem Meeting von Plakat, Präsentation oder E-Mail. Markenkonform und druckfertig.',
    description:
      'Ermöglicht die Teilnahme an Ihrem Zoom-Call über Plakat, Präsentation oder E-Mail.',
    benefits: [
      'Teilnehmer treten mit einem Scan bei — ohne Meeting-ID einzugeben',
      'Meeting-Link jederzeit aktualisierbar',
      'Design mit Farben, Logo und Rahmen passend zu Ihrer Marke',
      'Als PNG, SVG oder druckfertiges PDF herunterladen',
    ],
    useCases: ['Präsentationsfolien', 'Event-Plakate', 'E-Mail-Einladungen'],
  },
  google_meet: {
    title: 'Google-Meet-QR-Code',
    headline: 'Google-Meet-QR-Code erstellen — Kostenlos',
    metaDescription:
      'Kostenloser Google-Meet-QR-Code-Generator, der Ihren Meeting-Raum mit einem Scan öffnet. Markenkonformes Design und druckfertige Ausgaben.',
    description:
      'Ein Scan öffnet Ihren Google-Meet-Raum.',
    benefits: [
      'Teilnehmer betreten Ihren Meeting-Raum mit einem Scan',
      'Meeting-Link jederzeit aktualisierbar',
      'Design mit Farben, Logo und Rahmen passend zu Ihrer Marke',
      'Als PNG, SVG oder druckfertiges PDF herunterladen',
    ],
    useCases: ['Präsentationsfolien', 'Event-Plakate', 'E-Mail-Einladungen'],
  },
  menu: {
    title: 'Restaurantmenü-QR-Code',
    headline: 'Menü-QR-Code erstellen — Kostenlos',
    metaDescription:
      'Kostenloser Menü-QR-Code-Generator für digitale Menüs am Tisch — Preise ohne Neudruck aktualisieren. Markenkonform und druckfertig.',
    description:
      'Bieten Sie am Tisch ein digitales Menü und aktualisieren Sie Preise ohne Neudruck.',
    benefits: [
      'Menü jederzeit aktualisieren — ohne Neudruck',
      'Gäste erreichen das aktuelle Menü mit einem Scan',
      'Design mit Farben, Logo und Rahmen passend zu Ihrem Lokal',
      'Als PNG, SVG oder druckfertiges PDF herunterladen',
    ],
    useCases: ['Tischaufsteller', 'Takeaway-Tüten', 'Digitale Menüboards'],
  },
  pdf: {
    title: 'PDF-Dokument-QR-Code',
    headline: 'PDF-QR-Code erstellen — Kostenlos',
    metaDescription:
      'Kostenloser PDF-QR-Code-Generator zum Teilen von Broschüren, Menüs, CVs oder Katalogen als PDF-Link. Markenkonform und druckfertig.',
    description:
      'Teilen Sie Broschüren, Menüs, CVs oder Kataloge als PDF-Link.',
    benefits: [
      'Besucher öffnen das Dokument mit einem Scan',
      'PDF-Link jederzeit aktualisierbar',
      'Design mit Farben, Logo und Rahmen passend zu Ihrer Marke',
      'Als PNG, SVG oder druckfertiges PDF herunterladen',
    ],
    useCases: ['Broschüren', 'Kataloge', 'Menüs als PDF'],
  },
  file: {
    title: 'Datei-Download-QR-Code',
    headline: 'Datei-Download-QR-Code erstellen — Kostenlos',
    metaDescription:
      'Kostenloser Datei-QR-Code-Generator, der auf jede herunterladbare Datei verlinkt. Markenkonform und druckfertig.',
    description:
      'Verlinken Sie auf jede Datei, die Besucher herunterladen können.',
    benefits: [
      'Besucher laden die Datei mit einem Scan herunter',
      'Datei-Link jederzeit aktualisierbar',
      'Design mit Farben, Logo und Rahmen passend zu Ihrer Marke',
      'Als PNG, SVG oder druckfertiges PDF herunterladen',
    ],
    useCases: ['Bedienungsanleitungen', 'Präsentationsdateien', 'Digitale Ressourcen'],
  },
  app: {
    title: 'App-Download-QR-Code',
    headline: 'App-Download-QR-Code erstellen — Kostenlos',
    metaDescription:
      'Kostenloser App-QR-Code-Generator, der iOS- und Android-Nutzer in den richtigen Store leitet. Markenkonform und druckfertig.',
    description:
      'Leiten Sie iOS- und Android-Nutzer in den richtigen App Store.',
    benefits: [
      'Jeder Nutzer wird automatisch in den richtigen Store geleitet',
      'Store-Link jederzeit aktualisierbar',
      'Design mit Farben, Logo und Rahmen passend zu Ihrer Marke',
      'Als PNG, SVG oder druckfertiges PDF herunterladen',
    ],
    useCases: ['Werbeplakate', 'Produktverpackungen', 'Digitale Anzeigen'],
  },
  crypto: {
    title: 'Krypto-Zahlungs-QR-Code',
    headline: 'Krypto-Zahlungs-QR-Code erstellen — Kostenlos',
    metaDescription:
      'Kostenloser Krypto-Zahlungs-QR-Code-Generator zum Teilen Ihrer Bitcoin- oder Ethereum-Wallet — ohne Copy-Paste-Fehler. Markenkonform und druckfertig.',
    description:
      'Teilen Sie Ihre Bitcoin- oder Ethereum-Wallet — ohne Copy-Paste-Fehler.',
    benefits: [
      'Wallet-Adresse wird fehlerfrei mit einem Scan gelesen',
      'Optionaler Betrag erleichtert den Zahlungsprozess',
      'Design mit Farben, Logo und Rahmen passend zu Ihrer Marke',
      'Als PNG, SVG oder druckfertiges PDF herunterladen',
    ],
    useCases: ['Spendenplakate', 'Rechnungen und Quittungen', 'Kassendisplays'],
  },
};
