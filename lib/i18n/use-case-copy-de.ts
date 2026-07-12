import type { UseCasePage } from '@/lib/use-case-pages';

/**
 * German (de) marketing copy for use-case pages.
 * Keys are the same slugs defined in `lib/use-case-pages.ts`.
 * Only translatable fields are overridden; structural fields
 * (categoryId, icon, relatedSolutionSlug, slug) come from the base data.
 */
export const USE_CASE_COPY_DE: Record<string, Partial<UseCasePage>> = {
  'product-packaging': {
    title: 'QR-Codes auf Produktverpackungen',
    headline: 'Verwandeln Sie jede Verpackung in einen digitalen Touchpoint',
    metaDescription:
      'Fügen Sie QR-Codes auf Produktverpackungen für Anleitungen, Garantieanmeldung, Nachbestell-Links und Scan-Analysen hinzu. Kostenloser dynamischer QR-Generator.',
    keywords: ['Produktverpackung QR-Code', 'Karton QR-Code', 'Verpackungs-QR-Marketing'],
    description:
      'Platzieren Sie einen QR-Code auf Kartons, Etiketten oder Beilagen, um Einrichtungsanleitungen, Garantieformulare, Rezepte oder Nachbestellseiten zu teilen — und aktualisieren Sie den Link ohne Neudruck.',
    benefits: [
      'Verlinken Sie auf Anleitungen, Videos oder Support ohne zusätzliche Druckkosten',
      'Verfolgen Sie Scans nach Region und Kampagnencharge',
      'Tauschen Sie Ziele für saisonale Aktionen oder Rückrufe aus',
      'Individuelles Branding mit Logo und Markenfarben',
    ],
    steps: [
      'Erstellen Sie einen dynamischen Website- oder PDF-QR-Code',
      'Fügen Sie Ihr Logo und den Rahmenstil hinzu',
      'Exportieren Sie druckfertiges PNG oder SVG für die Verpackungsgrafik',
      'Überwachen Sie Scans nach dem Launch im Dashboard',
    ],
  },
  'trade-show-leads': {
    title: 'Lead-Erfassung auf Messen und Expos',
    headline: 'Standbesucher ohne Papierformulare erfassen',
    metaDescription:
      'Nutzen Sie QR-Codes auf Messen für Lead-Erfassung, Broschüren-Downloads und Follow-up-Links. Messen Sie Standverkehr mit Scan-Analysen.',
    keywords: ['Messe QR-Code', 'Expo Lead-Erfassung QR', 'Stand QR-Code'],
    description:
      'Ersetzen Sie Klemmbretter durch eine scanbare Landingpage oder vCard. Leiten Sie Besucher zu Demos, Kalendern oder CRM-Formularen und messen Sie Stoßzeiten am Stand.',
    benefits: [
      'Sofortige Kontaktspeicherung mit vCard-QR-Codes',
      'A/B-Test zweier Landingpages von einem Stand aus',
      'Geofencing-Weiterleitung für Mehrtädte-Touren',
      'Webhook-Leads an HubSpot oder Zapier',
    ],
    steps: [
      'Wählen Sie eine Visitenkarten- oder Link-Hub-Vorlage',
      'Fügen Sie Demo-Buchung oder Lead-Formular-URL hinzu',
      'Drucken Sie auf Bannern, Badges und Handouts',
      'Prüfen Sie Scan-Heatmaps nach der Veranstaltung',
    ],
  },
  'print-advertising': {
    title: 'Printanzeigen, Poster und Flyer',
    headline: 'Offline-Print mit Online-Conversions verbinden',
    metaDescription:
      'Fügen Sie QR-Codes auf Postern, Flyern und Magazinanzeigen hinzu. Verfolgen Sie, welche Platzierungen Scans bringen, und aktualisieren Sie Angebote ohne Neudruck.',
    keywords: ['Poster QR-Code', 'Flyer QR-Code', 'Printwerbung QR'],
    description:
      'Verbinden Sie Printkampagnen mit Landingpages, Aktionscodes oder Videoinhalten. Dynamische Codes ermöglichen Korrekturen und Kreativ-Updates während der Kampagne.',
    benefits: [
      'UTM-freundliche Landingpages je Platzierung',
      'Passwortgeschützte Vorschauen für Kunden',
      'Geplante Weiterleitungen für Kampagnenstart und -ende',
      'Exportieren Sie Printbanner mit Beschnittmarken',
    ],
    steps: [
      'Erstellen Sie einen URL-QR mit Ihrer Kampagnen-Landingpage',
      'Gestalten Sie einen kontrastreichen Code für das Druckformat',
      'Nutzen Sie eindeutige Codes je Stadt oder Publikation',
      'Vergleichen Sie Scan-Raten in den Analysen',
    ],
  },
  'email-signature': {
    title: 'QR-Codes in der E-Mail-Signatur',
    headline: 'Kontaktdaten aus jeder E-Mail teilen',
    metaDescription:
      'Fügen Sie einen QR-Code in E-Mail-Signaturen für vCard-Speicherung, Buchungslinks oder Social-Profile hinzu. Einmal aktualisieren — Signaturen bleiben aktuell.',
    keywords: ['E-Mail-Signatur QR-Code', 'vCard E-Mail QR', 'professioneller E-Mail QR'],
    description:
      'Platzieren Sie einen kleinen QR im Signaturblock, damit mobile Leser Ihren Kontakt speichern oder ein Meeting mit einem Scan buchen können.',
    benefits: [
      'vCard speichert Name, Telefon und E-Mail automatisch',
      'Titel oder Telefon aktualisieren ohne neue Signaturen',
      'Verfolgen Sie, wie oft Ihre Signatur Scans erzeugt',
      'Kompatibel mit Gmail, Outlook und Apple Mail',
    ],
    steps: [
      'Erstellen Sie einen vCard-QR mit Ihren aktuellen Daten',
      'Laden Sie ein kompaktes PNG für die Signatur herunter',
      'Verlinken Sie Kalender oder Portfolio als sekundären CTA',
      'Aktualisieren Sie den Code bei einem Rollenwechsel',
    ],
  },
  'restaurant-table-tents': {
    title: 'QR-Codes für Restaurant-Tischaufsteller',
    headline: 'Menü, Bewertungen und WLAN an jedem Tisch',
    metaDescription:
      'Erstellen Sie Tischaufsteller-QR-Codes für digitale Menüs, Google-Bewertungen und Gäste-WLAN. Menü-Links aktualisieren ohne Aufsteller neu zu drucken.',
    keywords: ['Tischaufsteller QR-Code', 'Restaurant-Tisch QR', 'Menü-Aufsteller QR'],
    description:
      'Gäste scannen für Menü, Tagesangebote, Feedback oder WLAN-Zugangsdaten. Dynamische Menüs bedeuten: Preisänderungen ohne neuen Druck.',
    benefits: [
      'Menü-PDF oder Web-URL mit einem Code pro Raum',
      'Mittag-/Abendrouting zu unterschiedlichen Menüs',
      'Optionales Passwort für mitarbeiterinterne Menüs',
      'Druckfertige Aufsteller-Layouts mit Branding',
    ],
    steps: [
      'Nutzen Sie die Restaurant-Menü-Vorlage',
      'Fügen Sie Ihre Menü-URL ein oder laden Sie einen PDF-Link hoch',
      'Logo und Markenfarben zum QR-Rahmen hinzufügen',
      'Aufsteller drucken und Öffnungen stundenweise überwachen',
    ],
  },
  'hotel-guest-experience': {
    title: 'QR für das Hotelerlebnis der Gäste',
    headline: 'WLAN, Guides und Upsells in jedem Zimmer',
    metaDescription:
      'Hotelzimmer-QR-Codes für WLAN, lokale Guides, Spa-Buchung und Concierge-Chat. Hospitality-Vorlagen mit Analysen.',
    keywords: ['Hotelzimmer QR-Code', 'Hospitality QR', 'Gäste-WLAN QR Hotel'],
    description:
      'Ersetzen Sie laminierte Karten durch einen einzigen scanbaren Hub für WLAN, Zimmerservice, Check-out-Infos und lokale Empfehlungen.',
    benefits: [
      'WLAN-QR verbindet ohne Passworteingabe',
      'Link-Hub für Spa, Gastronomie und Transportpartner',
      'Mehrsprachige Landingpages für internationale Gäste',
      'Scan-Analysen nach Etage oder Objekt',
    ],
    steps: [
      'Erstellen Sie WLAN- und Link-Hub-Codes je Objekt',
      'Branding gemäß Ihren Property-Richtlinien hinzufügen',
      'Auf Schlüsselmäppchen, Spiegeln und Aufzügen platzieren',
      'Saisonale Angebote über geplante Weiterleitungen steuern',
    ],
  },
  'event-check-in': {
    title: 'Event-Check-in und Badges',
    headline: 'Schnellere Registrierung und Session-Links',
    metaDescription:
      'Event-QR-Codes für Check-in, Agenda, Session-Folien und Networking. Dynamische Codes für Konferenzen, Hochzeiten und Meetups.',
    keywords: ['Event-Check-in QR', 'Konferenz-Badge QR', 'Hochzeits-QR-Code'],
    description:
      'Nutzen Sie QR auf Badges für Teilnehmerprofile, Session-Materialien oder Kalendereinträge. Aktualisieren Sie Links bei Raum- oder Zeitänderungen.',
    benefits: [
      'Kalender-Event-QR fügt den Plan mit einem Tippen hinzu',
      'Badge-vCards für Networking',
      'Geofenced Weiterleitungen je Venue-Zone',
      'Echtzeit-Scan-Zählungen je Session',
    ],
    steps: [
      'Erstellen Sie Event- oder vCard-Codes je Teilnehmertyp',
      'Verlinken Sie Agenda, Folien oder Livestream',
      'Drucken Sie auf Badges, Programmen und Beschilderung',
      'Exportieren Sie den Scan-Bericht nach dem Event',
    ],
  },
  'retail-loyalty': {
    title: 'Retail-Loyalty und SMS-Anmeldung',
    headline: 'Ihre Liste direkt vom Verkaufsraum wachsen lassen',
    metaDescription:
      'Retail-QR-Codes für Loyalty-Anmeldung, SMS-Promos und Produktsuchen. Verfolgen Sie In-Store-Engagement mit Scan-Analysen.',
    keywords: ['Retail-Loyalty QR', 'Laden QR-Marketing', 'SMS-Anmeldung QR'],
    description:
      'Platzieren Sie Codes an Kasse, Regalen und Belegen, um Kunden für Loyalty-Programme oder SMS-Angebote zu gewinnen.',
    benefits: [
      'SMS-QR füllt die Opt-in-Nachricht voraus',
      'Link zum Loyalty-Portal oder App-Download',
      'Unterschiedliche Codes je Filiale für Attribution',
      'Webhook neuer Anmeldungen an Ihr CRM',
    ],
    steps: [
      'Wählen Sie SMS- oder App-Download-QR-Typ',
      'Fügen Sie Angebotstext und Compliance-Hinweis hinzu',
      'Drucken Sie Regalstopper und Beilage-Belege',
      'Messen Sie die Conversion nach Standort',
    ],
  },
  'real-estate-listings': {
    title: 'QR-Codes für Immobilienanzeigen',
    headline: 'Mehr Anfragen über Schilder und Broschüren',
    metaDescription:
      'Immobilien-QR-Codes auf Verkaufsschildern, Open-House-Flyern und Exposés. Leiten Sie Käufer zu Besichtigungen, Video-Rundgängen und Maklerkontakt.',
    keywords: ['Immobilien QR-Code', 'Verkaufsschild QR', 'Open House QR'],
    description:
      'Käufer scannen für Objektdetails, 3D-Touren, Finanzierungsrechner oder Makler-vCards — Status aktualisieren, wenn das Objekt verkauft ist.',
    benefits: [
      'Dynamischer Link bleibt bei Preis- oder Statusänderungen gültig',
      'vCard am Schildaufsatz für sofortigen Maklerkontakt',
      'Interesse nach Stadtteil verfolgen',
      'Passwortschutz für Off-Market-Vorschauen',
    ],
    steps: [
      'Erstellen Sie einen URL-QR zu Ihrer Objektseite',
      'Fügen Sie die Makler-vCard als zweites Druckstück hinzu',
      'Platzieren Sie auf Schildern, Schlüsselboxen und Mailings',
      'Pausieren oder umleiten, wenn das Inserat geschlossen ist',
    ],
  },
  'healthcare-patient-info': {
    title: 'Patienteninformationen im Gesundheitswesen',
    headline: 'Nachsorge-Anweisungen, die Patienten wirklich öffnen',
    metaDescription:
      'Gesundheits-QR-Codes für Patientenaufklärung, Terminbuchung und Portal-Login. HIPAA-/DSGVO-bewusste Workflows mit passwortgeschützten Links.',
    keywords: ['Gesundheitswesen QR-Code', 'Patientenaufklärung QR', 'Klinik QR-Code'],
    description:
      'Teilen Sie Pflegeanweisungen, Formulare und Folgetermine ohne App-Installation. Aktualisieren Sie Inhalte, wenn Protokolle sich ändern.',
    benefits: [
      'PDF-QR für Entlassungsanweisungen',
      'Passwortgeschützte Links für sensible Dokumente',
      'Buchungs-URL mit Analysen je Klinik',
      'Druck auf Handouts und Wartezimmer-Postern',
    ],
    steps: [
      'Laden Sie Patientenaufklärungs-PDF oder Portal-URL hoch',
      'Aktivieren Sie ein Passwort bei sensiblen Inhalten',
      'Drucken Sie für Behandlungsräume und Lobby',
      'Prüfen Sie Scan-Trends nach Abteilung',
    ],
  },
  'museum-exhibits': {
    title: 'Audio-Guides für Museen und Ausstellungen',
    headline: 'Reichere Geschichten hinter jedem Exponat',
    metaDescription:
      'Museums-QR-Codes für Ausstellungsschilder, Audio-Guides und Spendenseiten. Keine App nötig — funktioniert auf Besuchertelefonen.',
    keywords: ['Museum QR-Code', 'Ausstellungs-QR-Etikett', 'Galerie Audio-Guide QR'],
    description:
      'Besucher scannen für Objektgeschichten, Videos, Übersetzungen und Timed-Entry-Infos. Inhalte austauschen, wenn Ausstellungen wechseln.',
    benefits: [
      'Mehrsprachige Landingpages je Ausstellung',
      'Spenden- und Mitgliedschaftslinks',
      'Kontrastreiche QR-Stile für wenig Licht',
      'Analysen nach Galeriezone',
    ],
    steps: [
      'Erstellen Sie URL- oder PDF-Codes je Ausstellung',
      'Audio/Video auf einer mobilen Landingpage hinzufügen',
      'Auf Schildern und Eingangsbeschilderung drucken',
      'Aktualisieren, wenn Exponate wechseln',
    ],
  },
  'social-media-growth': {
    title: 'Social-Media-Follower-Wachstum',
    headline: 'Offline-Fans in Follower verwandeln',
    metaDescription:
      'Instagram-, TikTok- und LinkedIn-QR-Codes für Verpackung, Poster und Retail-Displays. Social aus physischen Touchpoints wachsen lassen.',
    keywords: ['Instagram QR-Code Marketing', 'Social-Media QR', 'TikTok QR Poster'],
    description:
      'Verlinken Sie direkt auf Profile, Reels oder Link-in-Bio-Seiten. Verfolgen Sie, welche Filialen oder Kampagnen die meisten Follows bringen.',
    benefits: [
      'Eigene QR-Typen für Instagram, TikTok, LinkedIn',
      'Link-Hub für mehrere Social-Buttons',
      'Markenfarbige Rahmen für Retail-Displays',
      'Scan-Analysen nach Platzierung',
    ],
    steps: [
      'Wählen Sie den benötigten Social-Profil-QR-Typ',
      'Handle oder Profil-URL eingeben',
      'Auf Verpackung, Belegen und Beschilderung drucken',
      'Scan-Volumen nach Kanal vergleichen',
    ],
  },
  'app-download-campaign': {
    title: 'App-Download-Kampagnen',
    headline: 'Ein QR für iOS- und Android-Stores',
    metaDescription:
      'App-Download-QR-Codes für Poster, TV-Spots und Produktverpackungen. Intelligente Weiterleitung zum richtigen App Store.',
    keywords: ['App-Download QR-Code', 'App Store QR', 'Mobile-App-Marketing QR'],
    description:
      'Senden Sie Nutzer von jeder Print- oder OOH-Platzierung zur richtigen Store-Seite. Store-URLs ändern, wenn neue Versionen erscheinen.',
    benefits: [
      'Dynamische Weiterleitung zu App Store oder Play Store',
      'Kampagnenspezifische Codes für Attribution',
      'Landingpage-Fallback für Desktop-Scanner',
      'Hochauflösender Export für Billboards',
    ],
    steps: [
      'Erstellen Sie einen App-Download-QR mit Store-Links',
      'Gestalten Sie einen markanten Code für Großformatdruck',
      'Verteilen Sie eindeutige Codes je Anzeigenplatzierung',
      'Überwachen Sie Installationen über Scan-Spitzen',
    ],
  },
  'feedback-surveys': {
    title: 'Kundenfeedback und Umfragen',
    headline: 'Mehr Bewertungen und Umfrageantworten',
    metaDescription:
      'QR-Codes für Google-Bewertungen, NPS-Umfragen und Feedbackformulare auf Belegen, Tischen und Verpackungen. Den Kreis schneller schließen.',
    keywords: ['Feedback QR-Code', 'Umfrage QR-Code', 'Google-Bewertung QR'],
    description:
      'Machen Sie es mühelos, direkt nach Kauf oder Service eine Bewertung abzugeben oder eine Umfrage auszufüllen.',
    benefits: [
      'Link zu Google, Trustpilot oder Typeform',
      'Tischaufsteller-Hinweise nach dem Essen',
      'Webhook von Umfrageantworten an Slack',
      'Antwortquote nach Standort verfolgen',
    ],
    steps: [
      'Erstellen Sie einen URL-QR zu Ihrer Bewertungs- oder Umfrageform',
      'Drucken Sie auf Belegen, Verpackung oder Tischkarten',
      'Nutzen Sie separate Codes je Standort',
      'Folgen Sie Low-Score-Alarmen per Webhook',
    ],
  },
  'employee-onboarding': {
    title: 'Mitarbeiter-Onboarding und HR',
    headline: 'Papierloses Onboarding für Neueinstellungen',
    metaDescription:
      'HR-QR-Codes für Mitarbeiterhandbücher, Benefits-Anmeldung und IT-Setup. Richtlinien aktualisieren ohne Ordner neu zu drucken.',
    keywords: ['Mitarbeiter-Onboarding QR', 'HR-Handbuch QR', 'Arbeitsplatz QR-Code'],
    description:
      'Neueinstellungen scannen Handbücher, Benefits-Portale, WLAN und Geräteanfragen — alles von einem Willkommensblatt.',
    benefits: [
      'PDF-Handbuch mit stets aktuellem Link',
      'WLAN-QR für Konnektivität am ersten Tag',
      'Passwortgeschützte interne Dokumente',
      'Workspace-SSO für Team-Rollouts',
    ],
    steps: [
      'Handbuch-PDF und Portal-Links bündeln',
      'Auf Willkommenspaketen und Badges drucken',
      'Sensible Links mit Passwort einschränken',
      'Ziele aktualisieren, wenn Richtlinien sich ändern',
    ],
  },
  'nonprofit-donations': {
    title: 'Spendenkampagnen für Nonprofits',
    headline: 'Reibungsloses Spenden von Postern und Events',
    metaDescription:
      'Fundraising-QR-Codes für Spendenseiten, wiederkehrende Gaben und Event-Ticketing. Kampagnenleistung nach Platzierung verfolgen.',
    keywords: ['Spenden QR-Code', 'Fundraising QR', 'Wohltätigkeits-QR-Code'],
    description:
      'Unterstützer scannen zum Spenden, zur Anmeldung für Läufe oder zum Teilen von Kampagnengeschichten in sozialen Medien.',
    benefits: [
      'Link zu Spenden- oder Zahlungsplattform',
      'Event-Registrierung mit Kalendereintrag',
      'Druck auf Postern, Sammelbüchsen und Mailings',
      'Geofenced Kampagnen für lokale Ortsgruppen',
    ],
    steps: [
      'Erstellen Sie einen URL-QR zu Ihrem Spendenfluss',
      'Mit Nonprofit-Farben und Logo branden',
      'Auf Print und Event-Beschilderung ausrollen',
      'Scan-Summen an Sponsoren melden',
    ],
  },
  'education-campus': {
    title: 'Campus-Wegeleitung und Ressourcen',
    headline: 'Studierenden helfen, Räume und Ressourcen zu finden',
    metaDescription:
      'Universitäts-QR-Codes für Campus-Karten, Kursmaterialien, Club-Anmeldungen und Event-Kalender. Jedes Semester einfach aktualisieren.',
    keywords: ['Campus QR-Code', 'Universität QR', 'Schule QR-Code'],
    description:
      'Platzieren Sie Codes an Gebäuden, Syllabi und Club-Flyern für Karten, LMS-Links und Sprechstunden.',
    benefits: [
      'Standort-QR öffnet Karten mit Gebäude-Pin',
      'PDF-Syllabi und Leselisten',
      'Club-Link-Hubs für Multi-Channel-Präsenz',
      'Analysen nach Gebäude oder Fachbereich',
    ],
    steps: [
      'Karten-QR-Codes für zentrale Gebäude erstellen',
      'Syllabus-PDFs je Kurs verlinken',
      'Auf Orientierungsmaterialien drucken',
      'Links jedes Semester aktualisieren',
    ],
  },
  'logistics-tracking': {
    title: 'Logistik- und Lageretiketten',
    headline: 'Paletten und Sendungen per Scan verfolgen',
    metaDescription:
      'Logistik-QR-Codes für Sendungsverfolgung, Wareneingangsdokumente und Sicherheitschecklisten. Dynamische Links für Live-Statusseiten.',
    keywords: ['Logistik QR-Code', 'Lager QR-Etikett', 'Sendungsverfolgung QR'],
    description:
      'Mitarbeiter scannen Etiketten für Kommissionierhinweise, MSDS-Bögen oder Proof-of-Delivery-Portale.',
    benefits: [
      'Eindeutige dynamische URL je Sendungscharge',
      'PDF-Sicherheitsdatenblätter auf Abruf',
      'API-Massenerstellung für Etikettenläufe',
      'Webhook von Scan-Ereignissen an das WMS',
    ],
    steps: [
      'URL-Codes per CSV oder API massenhaft erstellen',
      'Mit Tracking- oder Checklisten-Seiten verknüpfen',
      'Auf Etiketten und Rampenschildern drucken',
      'Scan-Webhooks mit dem WMS integrieren',
    ],
  },
  'video-marketing': {
    title: 'Video- und YouTube-Marketing',
    headline: 'Ihre Geschichte von jedem Druckstück abspielen',
    metaDescription:
      'YouTube- und Video-QR-Codes für Verpackung, Poster und Retail-Displays. Views von Offline-Touchpoints generieren.',
    keywords: ['YouTube QR-Code', 'Video-Marketing QR', 'QR zu Video'],
    description:
      'Verbinden Sie Printkampagnen direkt mit Produktdemos, Testimonials oder How-to-Videos auf YouTube oder Ihrer Website.',
    benefits: [
      'Eigener YouTube-Kanal- oder Video-QR-Typ',
      'Landingpage mit eingebettetem Player',
      'Verfolgen, welche Platzierungen Views bringen',
      'Video-URL ohne Neudruck aktualisieren',
    ],
    steps: [
      'Erstellen Sie einen YouTube- oder URL-QR zu Ihrem Video',
      'Nutzen Sie einen Video-Play-CTA auf der Landingpage',
      'Auf Verpackung und Retail-Displays drucken',
      'Scan-Raten über SKUs vergleichen',
    ],
  },
  'whatsapp-support': {
    title: 'WhatsApp-Kundensupport',
    headline: 'Kunden sofort Nachrichten schreiben lassen',
    metaDescription:
      'WhatsApp-QR-Codes für Produktetiketten, Belege und Schaufenster. Vorausgefüllte Nachrichten für Bestellungen und Support.',
    keywords: ['WhatsApp QR-Code', 'WhatsApp Business QR', 'Kundensupport QR'],
    description:
      'Kunden scannen, um WhatsApp mit Ihrer Geschäftsnummer und einer vorausgefüllten Bestell- oder Support-Nachricht zu öffnen.',
    benefits: [
      'Vorausgefüllte Nachrichtenvorlagen je SKU',
      'Funktioniert auf Verpackung und Visitenkarten',
      'Scan-Volumen nach Filiale verfolgen',
      'Mehrsprachige Nachrichtenvarianten per Routing',
    ],
    steps: [
      'Erstellen Sie einen WhatsApp-QR mit Ihrer Geschäftsnummer',
      'Standardnachricht für Bestellungen oder Support festlegen',
      'Auf Etiketten, Schaufenstern und Belegen drucken',
      'Außerhalb der Geschäftszeiten zu einer FAQ-Seite weiterleiten',
    ],
  },
};
