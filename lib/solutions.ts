export interface SolutionPage {
  slug: string;
  title: string;
  headline: string;
  description: string;
  metaDescription: string;
  keywords: string[];
  icon: string;
  templateId?: string;
  categoryId?: string;
  benefits: string[];
  features: string[];
  steps: { title: string; description: string }[];
  faq: { q: string; a: string }[];
}

const PLATFORM_FEATURES = [
  'Geofence and schedule routing on every plan',
  'Scan analytics with export and webhooks',
  'Custom scan domain (scan.yourbrand.com)',
  'Print-ready banner export with your branding',
];

export const SOLUTION_PAGES: SolutionPage[] = [
  {
    slug: 'restaurant-menu',
    title: 'Restaurant Menu QR Code',
    headline: 'Digital menus guests scan at the table',
    description:
      'Replace paper menus with a dynamic QR code. Update prices, allergens and specials without reprinting table tents.',
    metaDescription:
      'Create a restaurant menu QR code for tables and counters. Update your menu online without reprinting. Free QR generator with scan analytics.',
    keywords: ['restaurant menu QR code', 'digital menu QR', 'table QR menu', 'cafe menu QR'],
    icon: 'utensils',
    templateId: 'restaurant-menu',
    categoryId: 'menu',
    benefits: [
      'Update prices and specials instantly',
      'Track menu opens by location and time of day',
      'Works on any phone — no app required',
      'Lunch/dinner routing to different menus',
    ],
    features: [
      'Menu PDF or web URL with landing page',
      'Password-protected menus for staff-only items',
      'GA4 and Meta Pixel on scan',
      ...PLATFORM_FEATURES,
    ],
    steps: [
      { title: 'Pick the restaurant template', description: 'Pre-filled fields for menu URL, venue name and Wi‑Fi notes.' },
      { title: 'Add your menu link', description: 'Link to your website, PDF or menu platform.' },
      { title: 'Print on table tents', description: 'Download PNG or print-ready banner and place on tables.' },
    ],
    faq: [
      {
        q: 'Can I use one QR on every table?',
        a: 'Yes. One dynamic code works everywhere. Use separate codes per room only if you want granular analytics.',
      },
      {
        q: 'What if my menu changes daily?',
        a: 'Update the destination URL or PDF in your dashboard — the printed QR pattern stays the same.',
      },
    ],
  },
  {
    slug: 'business-card',
    title: 'Digital Business Card QR',
    headline: 'One scan saves your contact to their phone',
    description:
      'Turn your business card into a scannable QR code. Guests save your name, phone, email and website in one tap.',
    metaDescription:
      'Create a digital business card QR code. Share contact details on cards, badges and email signatures with scan tracking.',
    keywords: ['business card QR code', 'vCard QR generator', 'digital business card QR'],
    icon: 'id-card',
    templateId: 'business-card',
    categoryId: 'vcard',
    benefits: [
      'No typing — contact saves directly to the phone',
      'Update your details without reprinting cards',
      'Track how often your card is scanned',
      'Add logo and custom QR design',
    ],
    features: ['vCard download on scan', 'Branded landing page before save', 'A/B test card variants', ...PLATFORM_FEATURES],
    steps: [
      { title: 'Enter your details', description: 'Name, role, company, phone and email.' },
      { title: 'Style your QR', description: 'Match your brand colors and add your logo.' },
      { title: 'Print or share', description: 'Add to cards, email signature or LinkedIn banner.' },
    ],
    faq: [
      {
        q: 'Does it work on iPhone and Android?',
        a: 'Yes. Scanning opens a vCard file or landing page that saves contact details on both platforms.',
      },
    ],
  },
  {
    slug: 'wifi-guest',
    title: 'Wi‑Fi QR Code for Guests',
    headline: 'Let guests join Wi‑Fi without typing passwords',
    description:
      'Print a Wi‑Fi QR code in your lobby, café or rental. Visitors scan once and connect automatically.',
    metaDescription:
      'Generate a Wi‑Fi QR code for guest networks. Share SSID and password securely — no more dictating passwords.',
    keywords: ['WiFi QR code generator', 'guest WiFi QR', 'Wi-Fi password QR'],
    icon: 'wifi',
    templateId: 'wifi-guest',
    categoryId: 'wifi',
    benefits: [
      'Faster guest onboarding',
      'Fewer support questions about the password',
      'Works on iPhone and Android',
      'Print for lobby, rooms or table tents',
    ],
    features: ['WPA/WPA2 encoding', 'Static payload — no subscription needed for Wi‑Fi only', ...PLATFORM_FEATURES],
    steps: [
      { title: 'Enter network name & password', description: 'SSID, password and security type (WPA/WPA2).' },
      { title: 'Download your QR', description: 'PNG or SVG for print.' },
      { title: 'Display where guests arrive', description: 'Reception desk, room folder or table stand.' },
    ],
    faq: [
      {
        q: 'Is it safe to print the Wi‑Fi password?',
        a: 'Use a guest VLAN isolated from your business network. Rotate passwords periodically in high-traffic venues.',
      },
    ],
  },
  {
    slug: 'event-rsvp',
    title: 'Event & Wedding QR Code',
    headline: 'Invitations, RSVP and event details in one scan',
    description:
      'Share wedding invitations, conference registration or open-house details with a dynamic QR link you can update anytime.',
    metaDescription:
      'Create event and wedding QR codes with RSVP landing pages, date, venue and registration links.',
    keywords: ['wedding QR code', 'event RSVP QR', 'conference registration QR'],
    icon: 'party-popper',
    templateId: 'wedding',
    categoryId: 'url',
    benefits: [
      'Collect RSVPs on a branded landing page',
      'Update venue or schedule without reprinting',
      'Track invitation scans by print batch',
      'Lead capture forms built in',
    ],
    features: ['Campaign batch IDs for invite batches', 'Geofence for multi-city tours', 'Lead form on landing page', ...PLATFORM_FEATURES],
    steps: [
      { title: 'Choose wedding or event template', description: 'Pre-built sections for date, venue and RSVP.' },
      { title: 'Enable landing page', description: 'Collect RSVPs before redirecting to details.' },
      { title: 'Print on invitations', description: 'Cards, posters or digital invites.' },
    ],
    faq: [
      {
        q: 'Can I change the venue after printing invites?',
        a: 'Yes. Update the destination or landing page content — dynamic codes never need reprinting.',
      },
    ],
  },
  {
    slug: 'retail-stores',
    title: 'Retail & In-Store QR',
    headline: 'Product info, promos and loyalty at the shelf edge',
    description:
      'Link packaging, shelf talkers and window displays to product pages, reviews or limited-time offers — then measure which placements drive scans.',
    metaDescription:
      'Retail QR codes for product labels, shelf displays and in-store promotions. Dynamic links, scan analytics and bulk import for chains.',
    keywords: ['retail QR code', 'in-store QR', 'product label QR', 'shelf QR code'],
    icon: 'store',
    templateId: 'retail-stores',
    categoryId: 'url',
    benefits: [
      'Swap promo URLs without reprinting shelf materials',
      'Bulk-create codes per SKU or store location',
      'Compare scan performance by store batch',
      'UTM tags for attribution in GA4',
    ],
    features: ['Bulk CSV import for hundreds of SKUs', 'GPS heatmap for placement testing', 'Schedule promos by date', ...PLATFORM_FEATURES],
    steps: [
      { title: 'Upload a CSV of products', description: 'Name, URL and optional store folder per row.' },
      { title: 'Assign a campaign batch', description: 'Group codes by store rollout or season.' },
      { title: 'Print and track', description: 'Export PNG/SVG and monitor scans per location.' },
    ],
    faq: [
      {
        q: 'How do multi-location retailers manage codes?',
        a: 'Use folders, labels and batch filters in the dashboard. API and webhooks automate creation from your PIM.',
      },
    ],
  },
  {
    slug: 'hotels-hospitality',
    title: 'Hotels & Hospitality QR',
    headline: 'Guest info, room service and local guides in one scan',
    description:
      'Place QR codes in rooms, lobbies and pool areas for Wi‑Fi, concierge links, menus and upsell offers — update seasonally without reprinting.',
    metaDescription:
      'Hotel and hospitality QR codes for guest Wi‑Fi, room directories, spa menus and local guides. Dynamic updates and multilingual routing.',
    keywords: ['hotel QR code', 'hospitality QR', 'guest room QR', 'resort QR menu'],
    icon: 'hotel',
    templateId: 'hotels-hospitality',
    categoryId: 'link_hub',
    benefits: [
      'Combine Wi‑Fi, menu and concierge in one hub page',
      'Route guests by language or country',
      'Reduce front-desk password requests',
      'White-label landing pages for hotel brands',
    ],
    features: ['Link hub landing pages', 'Geofence for property zones', 'Custom scan domain per property', ...PLATFORM_FEATURES],
    steps: [
      { title: 'Create room folder structure', description: 'Organize codes by floor, building or property.' },
      { title: 'Enable landing hub', description: 'Wi‑Fi, menu, spa and local map links on one page.' },
      { title: 'Print room collateral', description: 'Tent cards, key sleeves and elevator posters.' },
    ],
    faq: [
      {
        q: 'Can each property use its own domain?',
        a: 'Yes. Add verified custom scan domains like scan.yourhotel.com per property on Business and Agency plans.',
      },
    ],
  },
  {
    slug: 'healthcare-clinics',
    title: 'Healthcare & Clinic QR',
    headline: 'Patient forms, check-in and education without paper stacks',
    description:
      'Share intake forms, post-visit instructions and appointment booking links via QR in waiting rooms — update protocols without reprinting posters.',
    metaDescription:
      'Healthcare QR codes for patient intake, appointment links and education materials. Password protection and audit-friendly analytics.',
    keywords: ['healthcare QR code', 'clinic QR', 'patient intake QR', 'hospital QR'],
    icon: 'heart-pulse',
    templateId: 'healthcare-clinics',
    categoryId: 'url',
    benefits: [
      'Password-protected links for sensitive flows',
      'Reduce clipboard contact in waiting areas',
      'Track which education materials get opened',
      'Editable destinations when guidelines change',
    ],
    features: ['Password-protected QR codes', 'Expiry dates and scan limits', 'HTTPS-only redirect safety', ...PLATFORM_FEATURES],
    steps: [
      { title: 'Link to your patient portal', description: 'Forms, booking or education PDF.' },
      { title: 'Set optional password', description: 'Gate access for staff-only or VIP flows.' },
      { title: 'Display in waiting room', description: 'Posters, table tents and check-in desk.' },
    ],
    faq: [
      {
        q: 'Is QRbanner HIPAA certified?',
        a: 'We are building toward enterprise compliance. Do not put PHI in QR URLs — link to your HIPAA-compliant patient portal instead.',
      },
    ],
  },
  {
    slug: 'museums-venues',
    title: 'Museums & Venues QR',
    headline: 'Audio guides, exhibits and ticketing without extra hardware',
    description:
      'Label exhibits with QR codes that open rich media, donations or timed-entry pages. Update exhibit info between rotations without new labels.',
    metaDescription:
      'Museum and venue QR codes for exhibit labels, audio guides, donations and ticketing. Analytics per gallery or installation.',
    keywords: ['museum QR code', 'exhibit QR', 'venue QR', 'gallery QR label'],
    icon: 'landmark',
    templateId: 'museums-venues',
    categoryId: 'url',
    benefits: [
      'Multilingual routing by visitor country',
      'Track popular exhibits by scan volume',
      'Lead capture for memberships and donations',
      'Low-cost alternative to dedicated audio wands',
    ],
    features: ['Landing pages with media and CTA', 'A/B test donation copy', 'NFC + QR source tracking', ...PLATFORM_FEATURES],
    steps: [
      { title: 'Create one QR per exhibit', description: 'Or per gallery zone for aggregate stats.' },
      { title: 'Add landing content', description: 'Title, image, audio/video link and donate CTA.' },
      { title: 'Print durable labels', description: 'Use high-contrast codes with adequate quiet zone.' },
    ],
    faq: [
      {
        q: 'What size should exhibit QR codes be?',
        a: 'Minimum ~2×2 cm at viewing distance under 50 cm. Test scans under your gallery lighting before bulk print.',
      },
    ],
  },
  {
    slug: 'marketing-agencies',
    title: 'Marketing Agencies',
    headline: 'White-label QR delivery for every client campaign',
    description:
      'Manage hundreds of client codes, custom domains and branded landing pages. Hide powered-by branding on Agency plans.',
    metaDescription:
      'Agency QR code platform with white-label, bulk import, team workspaces, API and client reporting.',
    keywords: ['agency QR codes', 'white label QR', 'QR reseller', 'marketing agency QR'],
    icon: 'megaphone',
    templateId: 'portfolio',
    categoryId: 'url',
    benefits: [
      'Agency plan with 5,000+ codes and white-label',
      'Team workspaces per client',
      'Referral program for new signups',
      'API + webhooks for client dashboards',
    ],
    features: ['Hide “Powered by QRbanner” on landing pages', '50 custom scan domains', 'Campaign batch reporting', ...PLATFORM_FEATURES],
    steps: [
      { title: 'Create a workspace per client', description: 'Folders, labels and separate analytics.' },
      { title: 'Apply brand domain', description: 'scan.clientbrand.com with DNS verify.' },
      { title: 'Deliver print assets', description: 'Banner export and CSV of short codes.' },
    ],
    faq: [
      {
        q: 'Can we resell QRbanner to clients?',
        a: 'Agency plan includes white-label branding settings. Contact us for volume partner pricing.',
      },
    ],
  },
  {
    slug: 'real-estate',
    title: 'Real Estate QR',
    headline: 'Listing details, virtual tours and agent contact from yard signs',
    description:
      'Add dynamic QR codes to For Sale signs and brochures. Update listing URL, price drops and open-house times without new signage.',
    metaDescription:
      'Real estate QR codes for yard signs, brochures and open houses. Dynamic listing links and lead capture landing pages.',
    keywords: ['real estate QR code', 'property listing QR', 'open house QR', 'realtor QR'],
    icon: 'building',
    templateId: 'real-estate',
    categoryId: 'url',
    benefits: [
      'Change listing URL when status updates',
      'Capture buyer leads before showing details',
      'Track sign performance by neighborhood batch',
      'vCard QR for agent contact on the same sign',
    ],
    features: ['Lead capture forms on landing pages', 'Schedule open-house routing by date', 'Geofence for multi-city brokerages', ...PLATFORM_FEATURES],
    steps: [
      { title: 'Link to listing or tour', description: 'MLS page, Matterport or booking calendar.' },
      { title: 'Enable lead form', description: 'Collect name and email before redirect.' },
      { title: 'Print on signage', description: 'Rider inserts, brochures and lockbox flyers.' },
    ],
    faq: [
      {
        q: 'What happens when the property sells?',
        a: 'Point the same QR to your sold page or next listing — no new yard sign QR needed.',
      },
    ],
  },
  {
    slug: 'university-campus',
    title: 'University Campus QR',
    headline: 'Wayfinding, dining and student services from one scan',
    description:
      'Deploy dynamic QR across campus for building maps, club sign-ups, dining menus and event schedules — update links each semester without reprinting signage.',
    metaDescription:
      'University and college QR codes for campus wayfinding, dining halls, student clubs and orientation. Dynamic links with scan analytics.',
    keywords: ['university QR code', 'campus QR', 'college QR code', 'student services QR', 'campus wayfinding QR'],
    icon: 'graduation-cap',
    templateId: 'campus-institution',
    categoryId: 'url',
    benefits: [
      'Update orientation links between semesters',
      'Route scans by building zone for analytics',
      'Multilingual landing pages for international students',
      'Bulk CSV for hundreds of room placards',
    ],
    features: ['Schedule routing for dining hours', 'Password-protected staff forms', 'Folder per department', ...PLATFORM_FEATURES],
    steps: [
      { title: 'Group codes by building', description: 'Import room placards via CSV with building column.' },
      { title: 'Link services', description: 'Maps, menus, club signup and shuttle schedules.' },
      { title: 'Print once per room', description: 'Same QR all year — update URLs from the dashboard.' },
    ],
    faq: [
      {
        q: 'Can facilities and student affairs manage separate batches?',
        a: 'Yes. Use folders and team workspaces so each department edits only their codes.',
      },
    ],
  },
  {
    slug: 'stadium-events',
    title: 'Stadium & Event QR',
    headline: 'Concessions, programs and fan engagement on game day',
    description:
      'Dynamic QR on seat backs, concourse signs and parking lots — swap promo links between events while keeping the same printed code all season.',
    metaDescription:
      'Stadium and event venue QR codes for mobile concessions, digital programs, parking maps and sponsor offers with real-time analytics.',
    keywords: ['stadium QR code', 'event venue QR', 'sports arena QR', 'concession menu QR', 'festival QR code'],
    icon: 'trophy',
    templateId: 'event-registration',
    categoryId: 'url',
    benefits: [
      'Change trailer and promo URLs on release day',
      'Section-level scan analytics for signage placement',
      'Campaign batches for sponsor swaps at kickoff',
      'Post-event surveys without new print runs',
    ],
    features: ['Geofence parking zones', 'Lead capture for loyalty apps', 'Time-based concession menus', ...PLATFORM_FEATURES],
    steps: [
      { title: 'Bulk-create by section', description: 'CSV import for sections 101–120, 201–220, etc.' },
      { title: 'Attach event landing page', description: 'Programs, ordering links and sponsor CTAs.' },
      { title: 'Measure each concourse', description: 'Compare scan volume to optimize staff and signage.' },
    ],
    faq: [
      {
        q: 'How fast can we swap sponsors between games?',
        a: 'Update the dynamic URL or use campaign batch scheduling — physical codes stay unchanged.',
      },
    ],
  },
  {
    slug: 'government-public-sector',
    title: 'Government & Public Sector QR',
    headline: 'Citizen services, permits and public info without paper churn',
    description:
      'Agencies use dynamic QR on forms, facility signage and outreach materials — update PDFs and portals when policies change without reprinting posters.',
    metaDescription:
      'Government QR codes for citizen services, permit applications, public facility info and multilingual outreach with audit-friendly updates.',
    keywords: ['government QR code', 'public sector QR', 'citizen services QR', 'municipal QR code', 'agency QR'],
    icon: 'landmark',
    templateId: 'campus-institution',
    categoryId: 'pdf',
    benefits: [
      'Update policy PDFs without new poster runs',
      'Multilingual routing by locale or geofence',
      'Password-protected internal operational links',
      'Export scan logs for transparency reporting',
    ],
    features: ['HTTPS landing pages with last-updated dates', 'Team workspaces per department', 'API for CMS integration', ...PLATFORM_FEATURES],
    steps: [
      { title: 'Link to service portal', description: 'Permits, payments, schedules or PDF forms.' },
      { title: 'Set access rules', description: 'Public info vs. password-protected staff codes.' },
      { title: 'Deploy on signage', description: 'Libraries, DMV lobbies, parks and transit stops.' },
    ],
    faq: [
      {
        q: 'Is QRbanner suitable for procurement review?',
        a: 'We provide a printable enterprise security overview and respond to security questionnaires on request.',
      },
    ],
  },
  {
    slug: 'supermarket-grocery',
    title: 'Supermarket & Grocery QR',
    headline: 'Shelf talkers, loyalty and weekly promos that update overnight',
    description:
      'Grocery chains point shelf QR to weekly deals, recipe pages and loyalty signups — merchandising updates URLs Monday morning without sticker shipments.',
    metaDescription:
      'Supermarket and grocery QR codes for shelf talkers, loyalty programs, recipe content and weekly promotions with store-level analytics.',
    keywords: ['supermarket QR code', 'grocery QR', 'retail shelf QR', 'loyalty QR code', 'grocery promotion QR'],
    icon: 'shopping-cart',
    templateId: 'retail-grocery',
    categoryId: 'url',
    benefits: [
      'Weekly promo swaps without reprinting shelf talkers',
      'Store-zone analytics for endcap performance',
      'Recipe and allergen PDFs always current',
      'Loyalty app deep links from aisle signage',
    ],
    features: ['Bulk CSV per store zone', 'Campaign batches for seasonal promos', 'GA4 conversion tracking', ...PLATFORM_FEATURES],
    steps: [
      { title: 'Create zone batches', description: 'One dynamic code per aisle cluster or endcap.' },
      { title: 'Link promo landing page', description: 'Deals, recipes, loyalty signup or app download.' },
      { title: 'Roll out chain-wide', description: 'HQ updates all zones from a single dashboard.' },
    ],
    faq: [
      {
        q: 'Can regional managers run local promos?',
        a: 'Yes. Use folders per region and geofence routing so each store shows the right weekly offer.',
      },
    ],
  },
  {
    slug: 'cinema-theaters',
    title: 'Cinema & Theater QR',
    headline: 'Showtimes, tickets and concessions from one lobby QR',
    description:
      'Cinemas and theaters point lobby and poster QR to showtimes, mobile tickets and concession menus — update premieres and pricing without reprinting standees.',
    metaDescription:
      'Cinema and theater QR codes for showtimes, mobile ticketing, concession menus and loyalty signups with dynamic updates across multiplex locations.',
    keywords: ['cinema QR code', 'movie theater QR', 'showtime QR', 'concession menu QR', 'multiplex QR'],
    icon: 'film',
    templateId: 'entertainment-venue',
    categoryId: 'url',
    benefits: [
      'Premiere and showtime swaps without new posters',
      'Concession upsell pages updated per location',
      'Track lobby vs. poster scan performance',
      'Loyalty app and ticket deep links from one code',
    ],
    features: ['Schedule routing for matinee vs. evening menus', 'Campaign batches per auditorium zone', 'Password codes for staff-only ops links', ...PLATFORM_FEATURES],
    steps: [
      { title: 'Link showtimes or tickets', description: 'Mobile ticketing, trailer pages or loyalty signup.' },
      { title: 'Set lobby placements', description: 'Entrance, concession line and auditorium doors.' },
      { title: 'Update on premiere day', description: 'Swap URLs when features rotate — keep printed QR.' },
    ],
    faq: [
      {
        q: 'Can each auditorium have its own code?',
        a: 'Yes. Bulk-create codes per screen or zone and group them in campaign batches for chain-wide updates.',
      },
    ],
  },
  {
    slug: 'logistics-warehouses',
    title: 'Logistics & Warehouse QR',
    headline: 'Dock doors, pallets and driver self-serve status',
    description:
      '3PL and warehouse teams link dock QR to live shipment status, safety checklists and driver instructions — ops updates holds and releases without re-labeling.',
    metaDescription:
      'Warehouse and logistics QR codes for dock status, pallet tracking, safety forms and driver instructions with API webhooks to your WMS.',
    keywords: ['warehouse QR code', 'logistics QR', 'dock QR code', '3PL QR', 'pallet tracking QR'],
    icon: 'truck',
    templateId: 'property-facilities',
    categoryId: 'url',
    benefits: [
      'Live hold/release URLs for staging lanes',
      'Safety checklist completion on mobile',
      'Webhooks into WMS or TMS tools',
      'Bulk rollout across distribution centers',
    ],
    features: ['Password-protected shipment detail pages', 'REST API for status sync', 'Export scan logs per dock zone', ...PLATFORM_FEATURES],
    steps: [
      { title: 'Tag docks and lanes', description: 'One durable dynamic QR per door or staging area.' },
      { title: 'Connect live status', description: 'Dashboard or API updates when batches change.' },
      { title: 'Monitor floor usage', description: 'Scan volume highlights peak receiving windows.' },
    ],
    faq: [
      {
        q: 'Does QRbanner integrate with our WMS?',
        a: 'Use REST API and webhooks to push scan events and sync destination URLs with your warehouse systems.',
      },
    ],
  },
  {
    slug: 'automotive-dealerships',
    title: 'Automotive Dealership QR',
    headline: 'Lot stickers, service lane and test-drive QRs that stay current',
    description:
      'Dealerships point window stickers and service lane signs to live inventory VDPs, loaner policies and test-drive booking — swap offers without reprinting lot signage.',
    metaDescription:
      'Car dealership QR codes for window stickers, service check-in, test drives and OEM promos with geofence routing per lot location.',
    keywords: ['car dealership QR', 'automotive QR code', 'service lane QR', 'test drive QR', 'auto inventory QR'],
    icon: 'car',
    templateId: 'automotive-marine',
    categoryId: 'url',
    benefits: [
      'Inventory and incentive swaps without new stickers',
      'Service lane self-check-in on mobile',
      'Geofence routing per dealership lot',
      'OEM co-op campaigns via batch URL updates',
    ],
    features: ['Lead capture to CRM via webhooks', 'Password-protected internal ops links', 'Print banner export for window clings', ...PLATFORM_FEATURES],
    steps: [
      { title: 'Tag lot and service placements', description: 'Windshield stickers, lane boards and showroom displays.' },
      { title: 'Link live inventory or booking', description: 'VDP deep links, service status and test-drive scheduler.' },
      { title: 'Roll promos on launch day', description: 'HQ updates every lot URL when OEM incentives change.' },
    ],
    faq: [
      {
        q: 'Can each dealership location manage its own codes?',
        a: 'Yes. Use folders per rooftop and geofence routing so regional offers stay accurate.',
      },
    ],
  },
  {
    slug: 'fitness-gyms',
    title: 'Fitness & Gym QR',
    headline: 'Class schedules, memberships and trainer bios from one lobby scan',
    description:
      'Gyms and studios use dynamic QR at entry, equipment zones and posters — update class timetables and promo offers without reprinting wall signage.',
    metaDescription:
      'Gym and fitness studio QR codes for class schedules, membership signup, trainer profiles and equipment how-to videos with dynamic updates.',
    keywords: ['gym QR code', 'fitness studio QR', 'class schedule QR', 'membership QR', 'health club QR'],
    icon: 'dumbbell',
    templateId: 'fitness-gyms',
    categoryId: 'url',
    benefits: [
      'Weekly class schedule updates without new posters',
      'Trial pass and membership signup from lobby QR',
      'Equipment zone links to form videos',
      'Per-location analytics for promo placement',
    ],
    features: ['Schedule routing for peak vs. off-peak offers', 'Lead forms with webhook to CRM', 'Multilingual member onboarding', ...PLATFORM_FEATURES],
    steps: [
      { title: 'Place codes at entry and zones', description: 'Lobby desk, studio doors and equipment areas.' },
      { title: 'Link schedules and offers', description: 'Class booking, trial signup or app download.' },
      { title: 'Refresh each season', description: 'New-year promos and timetable changes are URL updates.' },
    ],
    faq: [
      {
        q: 'Can franchisees run local promos?',
        a: 'Use geofence routing or per-location folders so each club shows the right trial offer.',
      },
    ],
  },
  {
    slug: 'salon-spa',
    title: 'Salon & Spa QR',
    headline: 'Booking, menus of services and retail from one mirror cling',
    description:
      'Salons and spas link mirror and reception QR to live booking pages, service menus and retail offers — update seasonal promos without reprinting clings.',
    metaDescription:
      'Salon and spa QR codes for appointment booking, service menus, stylist bios and retail promos with dynamic updates across multi-location chains.',
    keywords: ['salon QR code', 'spa QR code', 'beauty booking QR', 'nail salon QR', 'salon marketing QR'],
    icon: 'sparkles',
    templateId: 'salon-spa',
    categoryId: 'url',
    benefits: [
      'Booking links always current for each stylist chair',
      'Retail shelf promos swap without new signage',
      'Per-location analytics for window placement',
      'Review and loyalty prompts after checkout',
    ],
    features: ['Lead forms for callback requests', 'Schedule routing for peak hours', 'Folders per location', ...PLATFORM_FEATURES],
    steps: [
      { title: 'Place at reception and stations', description: 'Mirror clings, menu boards and retail shelves.' },
      { title: 'Link booking or service menu', description: 'Online scheduler, price list or membership offer.' },
      { title: 'Refresh seasonal promos', description: 'Holiday packages and new service launches via URL update.' },
    ],
    faq: [
      {
        q: 'Can each stylist have a personal booking QR?',
        a: 'Yes. Create codes per chair or stylist and group them in folders for your franchise or single location.',
      },
    ],
  },
  {
    slug: 'nonprofit-fundraising',
    title: 'Nonprofit & Fundraising QR',
    headline: 'Donate, volunteer and event signups from printed collateral',
    description:
      'Nonprofits point event posters, galas and direct mail QR to donation pages, volunteer forms and impact reports — update campaigns without reprinting.',
    metaDescription:
      'Nonprofit QR codes for fundraising galas, donation drives, volunteer signups and impact storytelling with transparent scan analytics.',
    keywords: ['nonprofit QR code', 'fundraising QR', 'donation QR code', 'charity event QR', 'galas QR'],
    icon: 'heart',
    templateId: 'nonprofit-fundraising',
    categoryId: 'url',
    benefits: [
      'Swap donation URLs between campaigns',
      'Track poster and table-tent engagement',
      'Volunteer signup forms on mobile',
      'Password-protected sponsor-only pages',
    ],
    features: ['UTM-friendly dynamic links', 'CSV export for grant reporting', 'Team workspaces per program', ...PLATFORM_FEATURES],
    steps: [
      { title: 'Link donation or volunteer page', description: 'Campaign landing page, form or payment portal.' },
      { title: 'Print on collateral once', description: 'Posters, programs, table tents and direct mail.' },
      { title: 'Report impact to donors', description: 'Export scan analytics for board and grant updates.' },
    ],
    faq: [
      {
        q: 'Can we run multiple campaigns on one printed QR?',
        a: 'Yes. Update the dynamic destination between gala, year-end and peer-to-peer drives — same code on signage.',
      },
    ],
  },
  {
    slug: 'brewery-beverage',
    title: 'Brewery & Beverage QR',
    headline: 'Tap lists, events and merch from one coaster QR',
    description:
      'Breweries and beverage brands point coasters, tap handles and event posters to live tap lists, ticket sales and merch — rotate seasonal beers without reprinting.',
    metaDescription:
      'Brewery and craft beverage QR codes for tap lists, event tickets, merch stores and loyalty clubs with dynamic menu updates across taprooms.',
    keywords: ['brewery QR code', 'taproom QR', 'craft beer menu QR', 'beverage marketing QR', 'coaster QR'],
    icon: 'beer',
    templateId: 'entertainment-venue',
    categoryId: 'url',
    benefits: [
      'Tap list updates on release day',
      'Event and festival promo swaps',
      'Merch and to-go ordering from one scan',
      'Per-taproom scan analytics',
    ],
    features: ['Schedule routing for happy hour menus', 'Campaign batches per taproom', 'Age-gate landing pages where required', ...PLATFORM_FEATURES],
    steps: [
      { title: 'Print on coasters and signage', description: 'Tap handles, tables, festival tents and packaging.' },
      { title: 'Link tap list or store', description: 'Live menu, ticket page or DTC shop.' },
      { title: 'Rotate seasonal releases', description: 'New beer URLs on launch — same coaster QR.' },
    ],
    faq: [
      {
        q: 'Can each taproom manage its own list?',
        a: 'Yes. Use folders per location and geofence routing so each taproom shows the right menu.',
      },
    ],
  },
  {
    slug: 'insurance-agencies',
    title: 'Insurance Agency QR',
    headline: 'Quote requests, policy PDFs and renewals from one office QR',
    description:
      'Insurance agencies link lobby signage and mailers to quote forms, policy explainers and renewal portals — update products and disclaimers without reprinting.',
    metaDescription:
      'Insurance agency QR codes for quote requests, policy PDFs, renewal reminders and client onboarding with password-protected document links.',
    keywords: ['insurance QR code', 'insurance agency QR', 'policy QR', 'insurance marketing QR', 'renewal QR'],
    icon: 'shield',
    templateId: 'professional-services',
    categoryId: 'pdf',
    benefits: [
      'Product and rate update without new mailers',
      'Password-protected policy document links',
      'Lead forms with webhook to AMS/CRM',
      'Branch-level scan analytics',
    ],
    features: ['Team folders per producer', 'Compliance-friendly HTTPS landing pages', 'CSV export for campaign reporting', ...PLATFORM_FEATURES],
    steps: [
      { title: 'Place in lobby and mailers', description: 'Desk tent, policy jackets and renewal postcards.' },
      { title: 'Link quote or policy hub', description: 'Intake form, PDF library or client portal.' },
      { title: 'Update when products change', description: 'Carrier swaps and disclaimer updates via URL.' },
    ],
    faq: [
      {
        q: 'Can producers have personal QR codes?',
        a: 'Create codes per producer or branch and route leads to the right intake form automatically.',
      },
    ],
  },
  {
    slug: 'property-management',
    title: 'Property Management QR',
    headline: 'Tenant portals, maintenance requests and lease docs from one lobby scan',
    description:
      'Property managers point building signage and unit mailers to tenant portals, maintenance forms and lease PDFs — update policies and vendors without reprinting.',
    metaDescription:
      'Property management QR codes for tenant portals, maintenance requests, lease documents and move-in guides with per-building scan analytics.',
    keywords: ['property management QR', 'tenant portal QR', 'apartment building QR', 'maintenance request QR', 'lease QR code'],
    icon: 'building',
    templateId: 'property-facilities',
    categoryId: 'url',
    benefits: [
      'Swap vendor and policy links without new signage',
      'Per-building and per-unit scan analytics',
      'Maintenance intake forms on mobile',
      'Password-protected lease and policy PDFs',
    ],
    features: ['Geofence routing per property', 'Team folders per portfolio', 'Webhook to property management software', ...PLATFORM_FEATURES],
    steps: [
      { title: 'Place in lobby and units', description: 'Entry desk, elevator posters and welcome packets.' },
      { title: 'Link tenant hub', description: 'Portal login, maintenance form or lease library.' },
      { title: 'Update when policies change', description: 'New vendor, pet policy or amenity hours via URL.' },
    ],
    faq: [
      {
        q: 'Can each building have its own QR?',
        a: 'Yes. Create codes per property and group portfolios in folders with building-level analytics.',
      },
    ],
  },
  {
    slug: 'dental-clinics',
    title: 'Dental Practice QR',
    headline: 'Patient intake, appointments and post-visit care from one chairside scan',
    description:
      'Dental practices link reception signage and appointment cards to intake forms, booking pages and aftercare instructions — update forms and promos without reprinting.',
    metaDescription:
      'Dental clinic QR codes for patient intake, online booking, post-visit care instructions and insurance verification with HIPAA-friendly HTTPS landing pages.',
    keywords: ['dental QR code', 'dentist office QR', 'patient intake QR', 'dental appointment QR', 'dental marketing QR'],
    icon: 'smile',
    templateId: 'dental-clinics',
    categoryId: 'url',
    benefits: [
      'Digital intake before the appointment',
      'Promote whitening and hygiene specials',
      'Aftercare PDFs patients can save',
      'Track referral card engagement',
    ],
    features: ['Password-protected patient forms', 'Schedule routing for office hours', 'CSV export for front-desk reporting', ...PLATFORM_FEATURES],
    steps: [
      { title: 'Print on reception materials', description: 'Desk tent, appointment reminders and referral cards.' },
      { title: 'Link intake or booking', description: 'New patient form, online scheduler or care guide.' },
      { title: 'Rotate seasonal promos', description: 'Whitening specials and hygiene reminders via URL.' },
    ],
    faq: [
      {
        q: 'Can we use different forms per location?',
        a: 'Yes. Create QR codes per office and route scans with geofence or folder organization.',
      },
    ],
  },
  {
    slug: 'veterinary-clinics',
    title: 'Veterinary Clinic QR',
    headline: 'Pet intake, appointment booking and aftercare from one lobby scan',
    description:
      'Veterinary clinics link reception signage and appointment reminders to pet intake forms, booking pages and post-visit care guides — update forms and promos without reprinting.',
    metaDescription:
      'Veterinary clinic QR codes for pet intake, online booking, vaccination reminders and aftercare instructions with per-location scan analytics.',
    keywords: ['veterinary QR code', 'vet clinic QR', 'pet intake QR', 'veterinary appointment QR', 'animal hospital QR'],
    icon: 'paw-print',
    templateId: 'specialty-healthcare',
    categoryId: 'url',
    benefits: [
      'Digital pet intake before visits',
      'Vaccination and wellness reminders',
      'Aftercare PDFs owners can save',
      'Track referral card engagement',
    ],
    features: ['Password-protected patient records links', 'Schedule routing for clinic hours', 'CSV export for front-desk reporting', ...PLATFORM_FEATURES],
    steps: [
      { title: 'Print on reception materials', description: 'Desk tent, appointment cards and kennel signage.' },
      { title: 'Link intake or booking', description: 'New pet form, online scheduler or care guide.' },
      { title: 'Rotate seasonal promos', description: 'Wellness packages and flea/tick reminders via URL.' },
    ],
    faq: [
      {
        q: 'Can each clinic location have its own QR?',
        a: 'Yes. Create codes per location and group practices in folders with location-level analytics.',
      },
    ],
  },
  {
    slug: 'law-firms',
    title: 'Law Firm QR',
    headline: 'Client intake, document portals and consultation booking from one lobby scan',
    description:
      'Law firms link office signage and business cards to client intake forms, document upload portals and consultation booking — update practice areas without reprinting.',
    metaDescription:
      'Law firm QR codes for client intake, secure document portals, consultation booking and practice area updates with password-protected links.',
    keywords: ['law firm QR code', 'legal intake QR', 'attorney QR', 'law office marketing QR', 'client portal QR'],
    icon: 'scale',
    templateId: 'professional-services',
    categoryId: 'url',
    benefits: [
      'Client intake before consultations',
      'Secure document upload portals',
      'Practice area promo swaps',
      'Per-attorney referral tracking',
    ],
    features: ['Password-protected client portals', 'Team folders per practice area', 'Webhook to CRM and case management', ...PLATFORM_FEATURES],
    steps: [
      { title: 'Place in lobby and cards', description: 'Reception desk, conference room signage and business cards.' },
      { title: 'Link intake or portal', description: 'Consultation form, document upload or booking page.' },
      { title: 'Update practice focus', description: 'New practice area pages without reprinting signage.' },
    ],
    faq: [
      {
        q: 'Can attorneys have personal QR codes?',
        a: 'Yes. Create codes per attorney and route leads to the right intake form automatically.',
      },
    ],
  },
  {
    slug: 'accounting-firms',
    title: 'Accounting Firm QR',
    headline: 'Client intake, tax portals and document uploads from one office scan',
    description:
      'Accounting firms link lobby signage and tax season mailers to client intake forms, secure document portals and appointment booking — update deadlines and forms without reprinting.',
    metaDescription:
      'Accounting firm QR codes for client intake, tax document uploads, appointment booking and seasonal deadline reminders with password-protected links.',
    keywords: ['accounting firm QR', 'CPA QR code', 'tax client intake QR', 'accountant marketing QR', 'client portal QR'],
    icon: 'calculator',
    templateId: 'professional-services',
    categoryId: 'url',
    benefits: [
      'Tax season intake before appointments',
      'Secure document upload portals',
      'Deadline reminder promo swaps',
      'Per-partner referral tracking',
    ],
    features: ['Password-protected client portals', 'Team folders per practice area', 'Webhook to practice management software', ...PLATFORM_FEATURES],
    steps: [
      { title: 'Place in lobby and mailers', description: 'Desk tent, tax envelopes and year-end postcards.' },
      { title: 'Link intake or portal', description: 'New client form, document upload or booking page.' },
      { title: 'Update for tax season', description: 'Deadline pages and checklist URLs without reprinting.' },
    ],
    faq: [
      {
        q: 'Can partners have personal QR codes?',
        a: 'Yes. Create codes per partner and route leads to the right intake form automatically.',
      },
    ],
  },
  {
    slug: 'optometry-eye-care',
    title: 'Optometry & Eye Care QR',
    headline: 'Patient intake, eyewear promos and recall reminders from one lobby scan',
    description:
      'Optometry practices link reception signage to patient intake forms, online booking and eyewear promos — update forms and specials without reprinting.',
    metaDescription:
      'Optometry and eye care QR codes for patient intake, appointment booking, eyewear promos and recall reminders with per-location scan analytics.',
    keywords: ['optometry QR code', 'eye care QR', 'optometrist marketing QR', 'patient intake QR', 'eyewear promo QR'],
    icon: 'eye',
    templateId: 'specialty-healthcare',
    categoryId: 'url',
    benefits: [
      'Digital intake before eye exams',
      'Eyewear and contact lens promos',
      'Recall reminder landing pages',
      'Track referral card engagement',
    ],
    features: ['Password-protected patient forms', 'Schedule routing for office hours', 'CSV export for front-desk reporting', ...PLATFORM_FEATURES],
    steps: [
      { title: 'Print on reception materials', description: 'Desk tent, recall postcards and eyewear displays.' },
      { title: 'Link intake or booking', description: 'New patient form, online scheduler or promo page.' },
      { title: 'Rotate seasonal specials', description: 'Back-to-school and lens promos via URL.' },
    ],
    faq: [
      {
        q: 'Can each office have its own QR?',
        a: 'Yes. Create codes per location and group practices in folders with location-level analytics.',
      },
    ],
  },
  {
    slug: 'childcare-centers',
    title: 'Childcare & Daycare QR',
    headline: 'Enrollment forms, parent updates and event signups from one lobby scan',
    description:
      'Childcare centers link lobby signage and parent mailers to enrollment forms, daily updates and event signups — update policies and calendars without reprinting.',
    metaDescription:
      'Childcare and daycare QR codes for enrollment intake, parent communication portals, event signups and policy updates with password-protected links.',
    keywords: ['childcare QR code', 'daycare QR', 'preschool enrollment QR', 'parent communication QR', 'daycare marketing'],
    icon: 'baby',
    templateId: 'family-community',
    categoryId: 'url',
    benefits: [
      'Digital enrollment before tours',
      'Parent portal and daily update links',
      'Event and field-trip signup forms',
      'Policy updates without new signage',
    ],
    features: ['Password-protected parent pages', 'Team folders per campus', 'CSV export for director reporting', ...PLATFORM_FEATURES],
    steps: [
      { title: 'Print on lobby materials', description: 'Entry desk, tour packets and parent bulletin boards.' },
      { title: 'Link enrollment or portal', description: 'Intake form, parent app or event signup page.' },
      { title: 'Update policies and events', description: 'Calendar and handbook URLs without reprinting.' },
    ],
    faq: [
      {
        q: 'Can each campus have its own QR?',
        a: 'Yes. Create codes per location and group centers in folders with campus-level analytics.',
      },
    ],
  },
  {
    slug: 'home-services',
    title: 'Home Services QR',
    headline: 'Service requests, estimates and review links from one truck or yard sign',
    description:
      'HVAC, plumbing and home service companies point truck decals and yard signs to booking forms, estimate requests and review pages — update promos and seasonal offers without reprinting.',
    metaDescription:
      'Home services QR codes for HVAC, plumbing and contractors — booking, estimate requests, review collection and seasonal promo swaps from truck and yard signage.',
    keywords: ['home services QR', 'HVAC QR code', 'plumber QR', 'contractor marketing QR', 'service request QR'],
    icon: 'wrench',
    templateId: 'home-services',
    categoryId: 'url',
    benefits: [
      'Service request forms on mobile',
      'Seasonal promo swaps on truck decals',
      'Review collection after jobs',
      'Per-crew or territory scan analytics',
    ],
    features: ['Geofence routing per service area', 'Webhook to CRM and dispatch tools', 'UTM-friendly campaign links', ...PLATFORM_FEATURES],
    steps: [
      { title: 'Print on trucks and yard signs', description: 'Door hangers, truck decals and job site signage.' },
      { title: 'Link booking or estimate form', description: 'Online scheduler, intake form or promo landing page.' },
      { title: 'Rotate seasonal offers', description: 'AC tune-up and furnace promos via URL — same QR on trucks.' },
    ],
    faq: [
      {
        q: 'Can each technician have a personal QR?',
        a: 'Yes. Create codes per crew member and route leads to the right intake form or territory.',
      },
    ],
  },
  {
    slug: 'senior-living',
    title: 'Senior Living QR',
    headline: 'Family portals, activity signups and care updates from one lobby scan',
    description:
      'Senior living communities link lobby signage and family mailers to resident portals, activity signups and care update pages — update policies and events without reprinting.',
    metaDescription:
      'Senior living and assisted living QR codes for family portals, activity signups, care updates and community event registration with password-protected links.',
    keywords: ['senior living QR', 'assisted living QR', 'nursing home QR', 'family portal QR', 'senior care marketing'],
    icon: 'heart-handshake',
    templateId: 'family-community',
    categoryId: 'url',
    benefits: [
      'Family portal and newsletter links',
      'Activity and outing signup forms',
      'Policy updates without new signage',
      'Per-community scan analytics',
    ],
    features: ['Password-protected family pages', 'Team folders per community', 'CSV export for administrator reporting', ...PLATFORM_FEATURES],
    steps: [
      { title: 'Place in lobby and mailers', description: 'Entry desk, family newsletters and welcome packets.' },
      { title: 'Link portal or signup', description: 'Family app, activity calendar or intake form.' },
      { title: 'Update events and policies', description: 'Community news and handbook URLs without reprinting.' },
    ],
    faq: [
      {
        q: 'Can each community have its own QR?',
        a: 'Yes. Create codes per campus and group portfolios in folders with community-level analytics.',
      },
    ],
  },
  {
    slug: 'pet-grooming',
    title: 'Pet Grooming QR',
    headline: 'Booking, intake and loyalty promos from one salon window scan',
    description:
      'Pet grooming salons link window decals and appointment cards to online booking, pet intake forms and loyalty promos — update services and specials without reprinting.',
    metaDescription:
      'Pet grooming salon QR codes for online booking, pet intake forms, vaccination records and loyalty promos with per-location scan analytics.',
    keywords: ['pet grooming QR', 'dog grooming QR', 'pet salon QR', 'grooming appointment QR', 'pet spa marketing'],
    icon: 'scissors',
    templateId: 'local-services-hub',
    categoryId: 'url',
    benefits: [
      'Online booking from window signage',
      'Pet intake before appointments',
      'Seasonal grooming package promos',
      'Track referral card engagement',
    ],
    features: ['Schedule routing for salon hours', 'Password-protected pet profile links', 'CSV export for front-desk reporting', ...PLATFORM_FEATURES],
    steps: [
      { title: 'Print on window and cards', description: 'Door decal, appointment reminders and loyalty cards.' },
      { title: 'Link booking or intake', description: 'Online scheduler, pet profile form or promo page.' },
      { title: 'Rotate seasonal packages', description: 'Shedding season and holiday grooming specials via URL.' },
    ],
    faq: [
      {
        q: 'Can mobile groomers use personal QRs?',
        a: 'Yes. Create codes per van or groomer and route bookings to the right calendar automatically.',
      },
    ],
  },
  {
    slug: 'coworking-spaces',
    title: 'Coworking Space QR',
    headline: 'Member Wi‑Fi, booking and event signups from one lobby scan',
    description:
      'Coworking operators link lobby signage and desk tents to member Wi‑Fi, room booking and event registration — update amenities and policies without reprinting.',
    metaDescription:
      'Coworking space QR codes for member Wi‑Fi, meeting room booking, event signups and community updates with per-location scan analytics.',
    keywords: ['coworking QR code', 'coworking WiFi QR', 'flex office QR', 'coworking marketing', 'member portal QR'],
    icon: 'briefcase',
    templateId: 'property-facilities',
    categoryId: 'wifi',
    benefits: [
      'Member Wi‑Fi without typing passwords',
      'Meeting room booking on mobile',
      'Community event signup forms',
      'Amenity updates without new signage',
    ],
    features: ['Password-protected member pages', 'Schedule routing for hot desk hours', 'CSV export for community managers', ...PLATFORM_FEATURES],
    steps: [
      { title: 'Print in lobby and desks', description: 'Entry desk, hot desk zones and meeting room doors.' },
      { title: 'Link Wi‑Fi or booking', description: 'Guest Wi‑Fi landing, room scheduler or event page.' },
      { title: 'Update amenities and events', description: 'New community programs via URL — same lobby QR.' },
    ],
    faq: [
      {
        q: 'Can each location have its own QR?',
        a: 'Yes. Create codes per site and group locations in folders with building-level analytics.',
      },
    ],
  },
  {
    slug: 'music-venues',
    title: 'Music Venue QR',
    headline: 'Tickets, merch and setlists from one poster QR',
    description:
      'Music venues and festivals point posters and wristbands to ticket sales, merch stores and live setlists — rotate shows and artists without reprinting.',
    metaDescription:
      'Music venue and festival QR codes for ticket sales, merch stores, artist setlists and fan signups with dynamic updates between shows.',
    keywords: ['music venue QR', 'concert QR code', 'festival QR', 'venue marketing QR', 'ticket QR'],
    icon: 'music',
    templateId: 'entertainment-venue',
    categoryId: 'url',
    benefits: [
      'Ticket URL swaps between shows',
      'Merch and VIP upgrade promos',
      'Fan email signup at the door',
      'Per-event scan analytics',
    ],
    features: ['Schedule routing for show nights', 'Campaign batches per tour stop', 'UTM-friendly promo links', ...PLATFORM_FEATURES],
    steps: [
      { title: 'Print on posters and signage', description: 'Entry posters, bar tents and artist merch tables.' },
      { title: 'Link tickets or merch', description: 'Ticketing page, DTC merch store or VIP upgrade.' },
      { title: 'Rotate for each show', description: 'New artist or tour date URLs — same poster QR.' },
    ],
    faq: [
      {
        q: 'Can we run multiple shows on one printed poster?',
        a: 'Yes. Update the dynamic destination between residency nights and festival days — same code on permanent venue signage.',
      },
    ],
  },
  {
    slug: 'farmers-markets',
    title: 'Farmers Market QR',
    headline: 'Vendor lists, weekly specials and vendor signups from one entrance scan',
    description:
      'Farmers markets and food halls point entrance signage to vendor directories, weekly specials and vendor application forms — update seasons and vendors without reprinting.',
    metaDescription:
      'Farmers market QR codes for vendor directories, weekly produce specials, vendor applications and event updates with per-market scan analytics.',
    keywords: ['farmers market QR', 'farm stand QR', 'produce market QR', 'vendor directory QR', 'farmers market marketing'],
    icon: 'wheat',
    templateId: 'retail-grocery',
    categoryId: 'url',
    benefits: [
      'Weekly vendor list updates',
      'Seasonal produce promo swaps',
      'Vendor application forms on mobile',
      'Track entrance scan peaks by day',
    ],
    features: ['Schedule routing for market days', 'UTM-friendly campaign links', 'CSV export for market managers', ...PLATFORM_FEATURES],
    steps: [
      { title: 'Print at market entrance', description: 'Gate signage, info booth tent and parking lot signs.' },
      { title: 'Link directory or specials', description: 'Vendor map, weekly specials page or signup form.' },
      { title: 'Update each market day', description: 'New vendor lineup via URL — same entrance QR.' },
    ],
    faq: [
      {
        q: 'Can seasonal markets reuse the same QR year after year?',
        a: 'Yes. Update the destination when the season opens — printed entrance signage stays in storage between seasons.',
      },
    ],
  },
  {
    slug: 'wine-tasting',
    title: 'Winery & Tasting Room QR',
    headline: 'Tasting menus, club signups and event tickets from one bottle neck scan',
    description:
      'Wineries and tasting rooms link bottle neckers, table tents and event posters to tasting menus, wine club signups and event tickets — rotate releases without reprinting.',
    metaDescription:
      'Winery and tasting room QR codes for tasting menus, wine club signups, event tickets and DTC shop links with dynamic release updates.',
    keywords: ['winery QR code', 'tasting room QR', 'wine club QR', 'vineyard marketing QR', 'wine tasting QR'],
    icon: 'wine',
    templateId: 'entertainment-venue',
    categoryId: 'url',
    benefits: [
      'Tasting menu updates on release day',
      'Wine club signup from table tents',
      'Event and harvest festival tickets',
      'DTC shop links from bottle neckers',
    ],
    features: ['Age-gate landing pages where required', 'Campaign batches per tasting room', 'Password-protected trade pages', ...PLATFORM_FEATURES],
    steps: [
      { title: 'Print on bottles and signage', description: 'Neck hangers, table tents and tasting bar posters.' },
      { title: 'Link menu or club signup', description: 'Current tasting flight, wine club form or shop page.' },
      { title: 'Rotate on new releases', description: 'New vintage URLs on launch — same neck hanger QR.' },
    ],
    faq: [
      {
        q: 'Can each tasting room manage its own list?',
        a: 'Yes. Use folders per location and geofence routing so each room shows the right menu.',
      },
    ],
  },
  {
    slug: 'marina-boating',
    title: 'Marina & Boating QR',
    headline: 'Slip info, harbor maps and charter bookings from one dock scan',
    description:
      'Marinas and harbors link dock signage and guest packets to slip assignments, harbor maps and charter booking — update rates and policies without reprinting.',
    metaDescription:
      'Marina and boating QR codes for slip information, harbor maps, charter bookings and guest services with per-dock scan analytics.',
    keywords: ['marina QR code', 'boating QR', 'harbor QR', 'yacht club QR', 'marina marketing'],
    icon: 'anchor',
    templateId: 'automotive-marine',
    categoryId: 'url',
    benefits: [
      'Slip assignment and harbor map updates',
      'Charter and rental booking on mobile',
      'Guest services and weather alerts',
      'Per-dock scan analytics',
    ],
    features: ['Password-protected member portals', 'Geofence routing per harbor', 'CSV export for harbor master reporting', ...PLATFORM_FEATURES],
    steps: [
      { title: 'Print on dock and office signage', description: 'Guest dock boards, office desk and welcome packets.' },
      { title: 'Link map or booking', description: 'Harbor map, slip assignment page or charter form.' },
      { title: 'Update rates and policies', description: 'Seasonal rate sheets via URL — same dock QR.' },
    ],
    faq: [
      {
        q: 'Can each harbor have its own QR?',
        a: 'Yes. Create codes per marina and group locations in folders with harbor-level analytics.',
      },
    ],
  },
  {
    slug: 'recruitment-staffing',
    title: 'Recruitment & Staffing QR',
    headline: 'Job listings, apply links and onboarding from one careers poster',
    description:
      'Recruiters and staffing firms link office signage and job fair tents to open roles, application forms and onboarding portals — update listings without reprinting.',
    metaDescription:
      'Recruitment and staffing QR codes for job listings, mobile applications, onboarding portals and career fair signups with per-recruiter tracking.',
    keywords: ['recruitment QR code', 'hiring QR', 'job fair QR', 'staffing agency QR', 'careers QR'],
    icon: 'user-plus',
    templateId: 'cv-resume',
    categoryId: 'url',
    benefits: [
      'Job listing swaps without new posters',
      'Mobile application forms at job fairs',
      'Onboarding portal links for new hires',
      'Per-recruiter referral tracking',
    ],
    features: ['Webhook to ATS and HRIS', 'Team folders per recruiter', 'UTM-friendly campaign links', ...PLATFORM_FEATURES],
    steps: [
      { title: 'Print on careers materials', description: 'Office lobby, job fair tent and storefront hiring signs.' },
      { title: 'Link roles or apply form', description: 'Careers page, role-specific apply link or onboarding hub.' },
      { title: 'Update open roles weekly', description: 'New job URLs on Monday — same careers poster QR.' },
    ],
    faq: [
      {
        q: 'Can recruiters have personal QR codes?',
        a: 'Yes. Create codes per recruiter and route applicants to the right requisition automatically.',
      },
    ],
  },
  {
    slug: 'trade-shows-expos',
    title: 'Trade Shows & Expos QR',
    headline: 'Booth handouts, lead capture and session links from one badge scan',
    description:
      'Exhibitors link booth signage and badge inserts to product demos, lead forms and session schedules — update campaigns without reprinting for every show.',
    metaDescription:
      'Trade show and expo QR codes for booth lead capture, product demos, session schedules and post-show follow-up with per-event scan analytics.',
    keywords: ['trade show QR code', 'expo booth QR', 'conference QR', 'lead capture QR', 'exhibition QR'],
    icon: 'ticket',
    templateId: 'event-registration',
    categoryId: 'url',
    benefits: [
      'Lead form swaps between shows',
      'Product demo and deck links on mobile',
      'Session schedule updates in real time',
      'Per-booth and per-event scan tracking',
    ],
    features: ['UTM campaign links per show', 'Webhook to CRM on scan', 'Team folders per rep', ...PLATFORM_FEATURES],
    steps: [
      { title: 'Print on booth materials', description: 'Banner stands, table tents, badge inserts and handouts.' },
      { title: 'Link demo or lead form', description: 'Product tour, Calendly or HubSpot form on mobile.' },
      { title: 'Update for the next show', description: 'New landing page Monday — same booth banner QR.' },
    ],
    faq: [
      {
        q: 'Can we track leads per trade show?',
        a: 'Yes. Create codes per event or use UTM parameters and compare scan peaks in analytics.',
      },
    ],
  },
  {
    slug: 'coffee-shops-cafes',
    title: 'Coffee Shops & Cafés QR',
    headline: 'Loyalty signup, menu boards and Wi‑Fi from one counter scan',
    description:
      'Cafés link counter signage and table tents to loyalty programs, seasonal menus and guest Wi‑Fi — update drinks and promos without reprinting.',
    metaDescription:
      'Coffee shop and café QR codes for loyalty signup, seasonal menus, guest Wi‑Fi and mobile ordering with per-location scan analytics.',
    keywords: ['coffee shop QR code', 'café QR', 'loyalty QR', 'café menu QR', 'coffee loyalty QR'],
    icon: 'coffee',
    templateId: 'coffee-shops-cafes',
    categoryId: 'url',
    benefits: [
      'Loyalty signup without app download',
      'Seasonal menu swaps on table tents',
      'Guest Wi‑Fi on one counter sign',
      'Per-location promotion tracking',
    ],
    features: ['Wi‑Fi QR type built in', 'Geofence routing per café', 'Password-protected staff menus', ...PLATFORM_FEATURES],
    steps: [
      { title: 'Print on counter and tables', description: 'Register stands, table tents and window decals.' },
      { title: 'Link loyalty or menu', description: 'Rewards signup, seasonal menu or mobile order page.' },
      { title: 'Update seasonal drinks', description: 'New menu URL each season — same table tent QR.' },
    ],
    faq: [
      {
        q: 'Can guests join loyalty without an app?',
        a: 'Yes. Link to a mobile web signup form or your existing loyalty portal.',
      },
    ],
  },
  {
    slug: 'tourist-attractions',
    title: 'Tourist Attractions QR',
    headline: 'Audio guides, tickets and maps from one entrance scan',
    description:
      'Museums, landmarks and attractions link entrance signage to audio guides, ticket pages and wayfinding maps — update hours and exhibits without reprinting.',
    metaDescription:
      'Tourist attraction QR codes for audio guides, mobile tickets, wayfinding maps and exhibit updates with per-entrance scan analytics.',
    keywords: ['tourist attraction QR', 'museum QR code', 'landmark QR', 'audio guide QR', 'attraction ticketing QR'],
    icon: 'map-pin',
    templateId: 'tourist-attractions',
    categoryId: 'url',
    benefits: [
      'Audio guide swaps without new signs',
      'Mobile ticket and pass links',
      'Exhibit and hours updates in real time',
      'Per-entrance visitor flow tracking',
    ],
    features: ['Multi-language landing pages', 'Geofence routing per gate', 'Password-protected staff maps', ...PLATFORM_FEATURES],
    steps: [
      { title: 'Print on entrance signage', description: 'Gate boards, ticket windows and trailhead markers.' },
      { title: 'Link guide or tickets', description: 'Audio tour, mobile ticket page or interactive map.' },
      { title: 'Update exhibits seasonally', description: 'New tour URL each season — same entrance QR.' },
    ],
    faq: [
      {
        q: 'Can we offer audio guides in multiple languages?',
        a: 'Yes. Route scans by language preference or link to a multi-language landing page.',
      },
    ],
  },
  {
    slug: 'florists-gift-shops',
    title: 'Florists & Gift Shops QR',
    headline: 'Seasonal catalogs, delivery forms and loyalty from one counter scan',
    description:
      'Florists and gift shops link counter signage and delivery tags to seasonal catalogs, order forms and loyalty signup — update holidays and promos without reprinting.',
    metaDescription:
      'Florist and gift shop QR codes for seasonal catalogs, delivery order forms, loyalty signup and event promos with per-store scan analytics.',
    keywords: ['florist QR code', 'gift shop QR', 'flower delivery QR', 'seasonal catalog QR', 'gift shop loyalty QR'],
    icon: 'flower',
    templateId: 'retail-grocery',
    categoryId: 'url',
    benefits: [
      'Seasonal catalog swaps on counter signs',
      'Delivery and event order forms on mobile',
      'Loyalty signup without app download',
      'Per-holiday promotion tracking',
    ],
    features: ['UTM links per holiday campaign', 'Webhook to POS on scan', 'Print tag export with QR', ...PLATFORM_FEATURES],
    steps: [
      { title: 'Print on counter and tags', description: 'Register stands, delivery tags and window decals.' },
      { title: 'Link catalog or order form', description: 'Valentine catalog, wedding inquiry form or loyalty signup.' },
      { title: 'Update for each holiday', description: 'New catalog URL before Mother\'s Day — same counter QR.' },
    ],
    faq: [
      {
        q: 'Can delivery drivers scan the same tag QR?',
        a: 'Yes. Link tags to order tracking pages that update as arrangements ship.',
      },
    ],
  },
  {
    slug: 'bakery-pastry',
    title: 'Bakery & Pastry QR',
    headline: 'Daily specials, pre-orders and loyalty from one display case scan',
    description:
      'Bakeries and pastry shops link counter signage and bag tags to daily specials, pre-order forms and loyalty signup — update menus without reprinting.',
    metaDescription:
      'Bakery and pastry shop QR codes for daily specials, pre-order forms, loyalty signup and catering inquiries with per-location scan analytics.',
    keywords: ['bakery QR code', 'pastry shop QR', 'bakery loyalty QR', 'pre-order QR', 'catering QR'],
    icon: 'cake',
    templateId: 'retail-grocery',
    categoryId: 'url',
    benefits: [
      'Daily special swaps on counter signs',
      'Pre-order and catering forms on mobile',
      'Loyalty signup without app download',
      'Per-holiday promotion tracking',
    ],
    features: ['Wi‑Fi QR for guest seating areas', 'UTM links per holiday campaign', 'Print tag export with QR', ...PLATFORM_FEATURES],
    steps: [
      { title: 'Print on counter and tags', description: 'Display case signs, bag tags and window decals.' },
      { title: 'Link specials or pre-order', description: 'Daily menu, holiday pre-order form or loyalty signup.' },
      { title: 'Update daily specials', description: 'New special URL each morning — same display case QR.' },
    ],
    faq: [
      {
        q: 'Can customers pre-order holiday trays?',
        a: 'Yes. Link to a mobile pre-order form that updates cutoff dates and pickup times.',
      },
    ],
  },
  {
    slug: 'car-wash-detailing',
    title: 'Car Wash & Detailing QR',
    headline: 'Membership signup, service menus and queue updates from one bay scan',
    description:
      'Car washes and detailers link bay signage and waiting area posters to membership signup, service menus and queue status — update pricing without reprinting.',
    metaDescription:
      'Car wash and detailing QR codes for membership signup, service menus, queue status and mobile payments with per-bay scan analytics.',
    keywords: ['car wash QR code', 'detailing QR', 'car wash membership QR', 'auto detailing QR', 'car wash marketing'],
    icon: 'spray-can',
    templateId: 'automotive-marine',
    categoryId: 'url',
    benefits: [
      'Membership signup on bay signage',
      'Service menu and package updates',
      'Queue status links for waiting customers',
      'Per-location wash package tracking',
    ],
    features: ['Geofence routing per location', 'Webhook to POS on scan', 'UTM-friendly campaign links', ...PLATFORM_FEATURES],
    steps: [
      { title: 'Print on bay and lobby signs', description: 'Bay entrance boards, vacuum area and waiting room posters.' },
      { title: 'Link membership or menu', description: 'Unlimited wash signup, detailing menu or queue status page.' },
      { title: 'Update packages seasonally', description: 'New pricing URL each season — same bay entrance QR.' },
    ],
    faq: [
      {
        q: 'Can unlimited wash members sign up via QR?',
        a: 'Yes. Link bay signage to a mobile membership signup form connected to your POS.',
      },
    ],
  },
  {
    slug: 'food-trucks',
    title: 'Food Trucks QR',
    headline: 'Daily menus, location updates and pre-orders from one window scan',
    description:
      'Food truck operators link window signage and festival tents to daily menus, location schedules and mobile pre-orders — update routes without reprinting.',
    metaDescription:
      'Food truck QR codes for daily menus, location schedules, mobile pre-orders and loyalty signup with per-event scan analytics.',
    keywords: ['food truck QR code', 'mobile food QR', 'food truck menu QR', 'festival food QR', 'food truck marketing'],
    icon: 'utensils-crossed',
    templateId: 'mobile-vendor',
    categoryId: 'url',
    benefits: [
      'Daily menu swaps on window signs',
      'Location schedule updates in real time',
      'Mobile pre-order forms at festivals',
      'Per-truck and per-event scan tracking',
    ],
    features: ['Geofence routing per stop', 'Schedule routing for lunch/dinner menus', 'UTM links per festival', ...PLATFORM_FEATURES],
    steps: [
      { title: 'Print on window and tent signs', description: 'Service window boards, festival tent banners and business cards.' },
      { title: 'Link menu or pre-order', description: 'Daily menu, location schedule page or mobile order form.' },
      { title: 'Update routes daily', description: 'New location URL each morning — same window board QR.' },
    ],
    faq: [
      {
        q: 'Can customers see where the truck is today?',
        a: 'Yes. Link to a live location page or schedule that updates from your dashboard each morning.',
      },
    ],
  },
  {
    slug: 'landscaping-lawn-care',
    title: 'Landscaping & Lawn Care QR',
    headline: 'Service quotes, seasonal promos and reviews from one yard sign scan',
    description:
      'Landscapers and lawn care crews link yard signs and truck decals to quote forms, seasonal service menus and review pages — update promos without reprinting.',
    metaDescription:
      'Landscaping and lawn care QR codes for service quotes, seasonal promos, review requests and crew scheduling with per-route scan analytics.',
    keywords: ['landscaping QR code', 'lawn care QR', 'yard sign QR', 'landscaping marketing QR', 'lawn service QR'],
    icon: 'trees',
    templateId: 'local-services-hub',
    categoryId: 'url',
    benefits: [
      'Quote form swaps on yard signs',
      'Seasonal service menu updates',
      'Review requests after job completion',
      'Per-crew and per-neighborhood tracking',
    ],
    features: ['Geofence routing per service area', 'Webhook to CRM on scan', 'UTM-friendly campaign links', ...PLATFORM_FEATURES],
    steps: [
      { title: 'Print on yard signs and trucks', description: 'Job site signs, truck decals and door hangers.' },
      { title: 'Link quote or promo', description: 'Service quote form, seasonal aeration promo or review page.' },
      { title: 'Update seasonal offers', description: 'New promo URL each season — same yard sign QR.' },
    ],
    faq: [
      {
        q: 'Can crews use different codes per neighborhood?',
        a: 'Yes. Create codes per crew or route and compare scan peaks in analytics.',
      },
    ],
  },
  {
    slug: 'dry-cleaning-laundry',
    title: 'Dry Cleaning & Laundry QR',
    headline: 'Price lists, pickup forms and loyalty from one counter scan',
    description:
      'Dry cleaners and laundromats link counter signage and garment tags to price lists, pickup scheduling and loyalty signup — update services without reprinting.',
    metaDescription:
      'Dry cleaning and laundry QR codes for price lists, pickup scheduling, loyalty signup and stain-care guides with per-location scan analytics.',
    keywords: ['dry cleaning QR code', 'laundry QR', 'laundromat QR', 'garment tag QR', 'dry cleaner marketing'],
    icon: 'shirt',
    templateId: 'local-services-hub',
    categoryId: 'url',
    benefits: [
      'Price list swaps on counter signs',
      'Pickup and delivery scheduling on mobile',
      'Loyalty signup without app download',
      'Per-location promotion tracking',
    ],
    features: ['Print tag export with QR', 'Webhook to POS on scan', 'Password-protected staff price sheets', ...PLATFORM_FEATURES],
    steps: [
      { title: 'Print on counter and tags', description: 'Register stands, garment tags and window decals.' },
      { title: 'Link prices or pickup', description: 'Service price list, pickup scheduling form or loyalty signup.' },
      { title: 'Update seasonal pricing', description: 'New price sheet URL each quarter — same counter QR.' },
    ],
    faq: [
      {
        q: 'Can garment tags link to order status?',
        a: 'Yes. Link tags to tracking pages that update when orders are ready for pickup.',
      },
    ],
  },
  {
    slug: 'churches-faith',
    title: 'Churches & Faith Organizations QR',
    headline: 'Bulletins, giving and event registration from one pew card scan',
    description:
      'Churches and faith communities link pew cards and lobby signage to weekly bulletins, online giving and event registration — update services without reprinting.',
    metaDescription:
      'Church and faith organization QR codes for weekly bulletins, online giving, event registration and volunteer signup with per-campus scan analytics.',
    keywords: ['church QR code', 'faith organization QR', 'church giving QR', 'bulletin QR', 'church event QR'],
    icon: 'church',
    templateId: 'family-community',
    categoryId: 'url',
    benefits: [
      'Weekly bulletin swaps on pew cards',
      'Online giving links on lobby signage',
      'Event and volunteer registration on mobile',
      'Per-campus and per-service tracking',
    ],
    features: ['Multi-language landing pages', 'Schedule routing for service times', 'Password-protected staff resources', ...PLATFORM_FEATURES],
    steps: [
      { title: 'Print on pew cards and lobby signs', description: 'Bulletin inserts, welcome desk stands and event posters.' },
      { title: 'Link bulletin or giving', description: 'Weekly bulletin, online giving page or event registration form.' },
      { title: 'Update each Sunday', description: 'New bulletin URL weekly — same pew card QR.' },
    ],
    faq: [
      {
        q: 'Can multi-campus churches use one QR design?',
        a: 'Yes. Geofence routing sends each campus to the right bulletin and giving page automatically.',
      },
    ],
  },
  {
    slug: 'printing-copy-shops',
    title: 'Printing & Copy Shops QR',
    headline: 'Price sheets, upload portals and order status from one counter scan',
    description:
      'Print shops and copy centers link counter signage and job tickets to price sheets, file upload portals and order tracking — update rates without reprinting.',
    metaDescription:
      'Printing and copy shop QR codes for price sheets, file upload portals, order tracking and loyalty programs with per-location scan analytics.',
    keywords: ['print shop QR code', 'copy center QR', 'printing business QR', 'print order QR', 'copy shop marketing'],
    icon: 'printer',
    templateId: 'local-services-hub',
    categoryId: 'url',
    benefits: [
      'Price sheet swaps on counter signs',
      'File upload portals on job tickets',
      'Order status links for pickup customers',
      'Per-location service tracking',
    ],
    features: ['Webhook to print MIS on scan', 'UTM links per campaign', 'Print ticket export with QR', ...PLATFORM_FEATURES],
    steps: [
      { title: 'Print on counter and tickets', description: 'Register stands, job tickets and window decals.' },
      { title: 'Link prices or upload', description: 'Service price sheet, file upload portal or order status page.' },
      { title: 'Update rates seasonally', description: 'New price sheet URL each quarter — same counter QR.' },
    ],
    faq: [
      {
        q: 'Can customers upload print files via QR?',
        a: 'Yes. Link to your upload portal or web-to-print page — update the URL without new signage.',
      },
    ],
  },
  {
    slug: 'tutoring-learning-centers',
    title: 'Tutoring & Learning Centers QR',
    headline: 'Class schedules, enrollment forms and resources from one lobby scan',
    description:
      'Tutoring centers and learning studios link lobby signage and parent handouts to class schedules, enrollment forms and study resources — update sessions without reprinting.',
    metaDescription:
      'Tutoring and learning center QR codes for class schedules, enrollment forms, parent resources and trial lesson signup with per-location scan analytics.',
    keywords: ['tutoring QR code', 'learning center QR', 'enrollment QR', 'tutoring marketing QR', 'education center QR'],
    icon: 'book-open',
    templateId: 'cv-resume',
    categoryId: 'url',
    benefits: [
      'Class schedule swaps on lobby signs',
      'Enrollment and trial lesson forms on mobile',
      'Parent resource links after each session',
      'Per-subject and per-location tracking',
    ],
    features: ['Schedule routing for term dates', 'Webhook to CRM on scan', 'Password-protected student resources', ...PLATFORM_FEATURES],
    steps: [
      { title: 'Print on lobby and handouts', description: 'Welcome desk stands, parent handouts and classroom posters.' },
      { title: 'Link schedule or enrollment', description: 'Class schedule, enrollment form or trial lesson signup.' },
      { title: 'Update each term', description: 'New schedule URL each semester — same lobby QR.' },
    ],
    faq: [
      {
        q: 'Can parents access resources for their child\'s subject?',
        a: 'Yes. Route scans by subject folder or link to a landing page with subject-specific resources.',
      },
    ],
  },
];

export function getSolutionBySlug(slug: string): SolutionPage | undefined {
  return SOLUTION_PAGES.find((s) => s.slug === slug);
}

export const FEATURED_SOLUTION_SLUGS = [
  'restaurant-menu',
  'retail-stores',
  'university-campus',
  'stadium-events',
  'government-public-sector',
  'marketing-agencies',
  'automotive-dealerships',
  'fitness-gyms',
  'salon-spa',
  'nonprofit-fundraising',
  'logistics-warehouses',
] as const;
