export interface CaseStudy {
  slug: string;
  title: string;
  headline: string;
  metaDescription: string;
  industry: string;
  companyType: string;
  metrics: { label: string; value: string }[];
  challenge: string;
  solution: string;
  results: string[];
  quote: string;
  quoteRole: string;
}

export const CASE_STUDIES: CaseStudy[] = [
  {
    slug: 'multi-location-restaurant-menus',
    title: 'Multi-Location Restaurant Group',
    headline: '12 locations, one dynamic menu QR — zero reprints in 6 months',
    metaDescription:
      'How a regional restaurant group replaced static menu QRs with QRbanner dynamic codes, geofence routing and scan analytics across 12 locations.',
    industry: 'Food & Beverage',
    companyType: 'Regional restaurant group (12 locations)',
    metrics: [
      { label: 'Locations', value: '12' },
      { label: 'Reprints avoided', value: '4 cycles' },
      { label: 'Menu scans / month', value: '18k+' },
      { label: 'Time to roll out', value: '3 days' },
    ],
    challenge:
      'The group printed new table-tent QR codes every time lunch specials or allergen labels changed. Each reprint cycle cost roughly $120 per location and created inconsistent URLs between branches.',
    solution:
      'They bulk-imported 12 menu QRs via CSV, grouped them in one campaign batch, and pointed every code to a single dynamic landing page. Lunch and dinner menus switch automatically with schedule routing. Regional managers review scan peaks in the dashboard each Monday.',
    results: [
      'Eliminated four planned reprint runs in six months (~$5,700 saved on print alone).',
      'Identified two underperforming locations and relocated table tents based on scan heatmaps.',
      'Rolled out seasonal cocktails by updating URLs — no new stickers ordered.',
    ],
    quote:
      'We finally see which locations actually get menu scans. Changing the PDF link on Friday night beats reprinting table tents on Monday.',
    quoteRole: 'Operations director, regional restaurant group',
  },
  {
    slug: 'retail-chain-in-store-signage',
    title: 'National Retail Chain',
    headline: '340 stores, one QR campaign — seasonal promos without new stickers',
    metaDescription:
      'How a retail chain rolled out dynamic QR on shelf talkers and window posters, updating promo links weekly without reprinting in-store signage.',
    industry: 'Retail',
    companyType: 'National retail chain (340 stores)',
    metrics: [
      { label: 'Stores', value: '340' },
      { label: 'Weekly promo swaps', value: '52' },
      { label: 'Print runs avoided', value: '8 / year' },
      { label: 'Avg. scans / store / week', value: '240' },
    ],
    challenge:
      'Regional marketing printed new shelf talker QR stickers for every weekly promotion. Logistics delays meant some stores ran expired offers for days while waiting for shipments.',
    solution:
      'HQ bulk-generated one QR per store zone via CSV, grouped codes by campaign batch, and pointed all shelf talkers to a single dynamic landing page. Merchandising updates the promo URL every Monday; stores keep the same physical code all year.',
    results: [
      'Cut eight national reprint runs in the first year (~$48k print savings).',
      'Promo go-live time dropped from 5 days to under 2 hours.',
      'Scan analytics highlighted top-performing categories for endcap placement.',
    ],
    quote:
      'We stopped chasing stores with new sticker packs. Monday promo swaps are a URL change, not a freight order.',
    quoteRole: 'VP Retail Marketing',
  },
  {
    slug: 'hotel-group-guest-services',
    title: 'Boutique Hotel Group',
    headline: '28 properties share one guest-services QR playbook',
    metaDescription:
      'A hotel group unified Wi‑Fi, room service, spa booking and local guides behind dynamic room QR codes with white-label landing pages.',
    industry: 'Hospitality',
    companyType: 'Boutique hotel group (28 properties)',
    metrics: [
      { label: 'Properties', value: '28' },
      { label: 'Guest scans / month', value: '42k+' },
      { label: 'Languages routed', value: '6' },
      { label: 'Rollout time', value: '2 weeks' },
    ],
    challenge:
      'Each property used different printed materials for Wi‑Fi, dining hours and spa menus. Guest complaints spiked when PDF links broke after seasonal menu changes.',
    solution:
      'Corporate created a white-label landing template per brand line. Room tent cards use one dynamic QR per property; schedule routing shows breakfast menus only before 11am. Locale-based rules send international guests to translated pages.',
    results: [
      'Front-desk Wi‑Fi questions dropped an estimated 30% in guest surveys.',
      'Spa booking scans converted 2.4× higher after moving CTA above the fold on landing pages.',
      'New property onboarding now reuses the same template — codes live in under a day.',
    ],
    quote:
      'Guests scan once in the room and get everything — Wi‑Fi, menu, spa, city guide. Our GMs stopped reprinting tent cards every quarter.',
    quoteRole: 'Director of Guest Experience',
  },
  {
    slug: 'agency-white-label-qr',
    title: 'Digital Marketing Agency',
    headline: '1,200 client QR codes — white-label delivery at scale',
    metaDescription:
      'How a marketing agency manages client QR campaigns with custom scan domains, hidden branding and per-client analytics dashboards.',
    industry: 'Agencies',
    companyType: 'Full-service digital agency (45 staff)',
    metrics: [
      { label: 'Client codes managed', value: '1,200+' },
      { label: 'Custom domains', value: '38' },
      { label: 'Monthly client reports', value: '62' },
      { label: 'Onboarding per client', value: '< 1 hr' },
    ],
    challenge:
      'The agency juggled five different QR tools for clients. Reporting was manual, powered-by badges hurt premium positioning, and custom domains required DNS back-and-forth with each vendor.',
    solution:
      'They consolidated on QRbanner Agency plan: folder per client, white-label landing pages, verified custom scan domains, and automated monthly scan exports via API for client PDF reports.',
    results: [
      'Reduced tool spend from four subscriptions to one Agency plan.',
      'Client retention improved after offering branded scan analytics in quarterly reviews.',
      'New client QR packages became a $400/mo add-on service line.',
    ],
    quote:
      'Clients see their domain on the scan link, not our vendor. That alone justified moving every account to one platform.',
    quoteRole: 'Head of Client Services',
  },
  {
    slug: 'museum-exhibit-engagement',
    title: 'Regional Art Museum',
    headline: 'Rotating exhibits, permanent QR labels — 40% more gallery engagement',
    metaDescription:
      'How a regional museum used dynamic QR on exhibit labels for audio guides, donations and multilingual content without reprinting between shows.',
    industry: 'Museums',
    companyType: 'Regional art museum (6 galleries)',
    metrics: [
      { label: 'Galleries', value: '6' },
      { label: 'Exhibit label QRs', value: '180' },
      { label: 'Donation scans / quarter', value: '2.4k' },
      { label: 'Languages', value: '5' },
    ],
    challenge:
      'Curators reprinted exhibit labels for every rotation — audio guide URLs and donation links broke when shows changed monthly.',
    solution:
      'Each gallery zone received a batch of dynamic codes on durable labels. Curators update landing pages with new artist bios, audio and high-res zoom images. Locale routing sends international visitors to translated pages.',
    results: [
      'Gallery engagement scans rose 40% after adding audio and donate CTAs above the fold.',
      'Label printing budget dropped ~$3,200 per year.',
      'Popular exhibits identified via scan heatmaps informed next season curation.',
    ],
    quote:
      'We swap exhibit content between shows but keep the same physical label on the wall. That alone saved our prep team days each rotation.',
    quoteRole: 'Curator of digital experiences',
  },
  {
    slug: 'music-festival-multi-stage',
    title: 'City Music Festival',
    headline: '3 stages, 1 QR system — schedules and merch that update live',
    metaDescription:
      'A multi-stage music festival deployed dynamic QR for set times, merch pre-orders and sponsor offers across 45k attendees.',
    industry: 'Events',
    companyType: 'Annual city music festival (45k attendees)',
    metrics: [
      { label: 'Stages', value: '3' },
      { label: 'Signage QRs', value: '96' },
      { label: 'Merch pre-orders', value: '1,800' },
      { label: 'Setup time', value: '1 day' },
    ],
    challenge:
      'Last-minute set time changes left printed schedules wrong by Saturday afternoon. Merch lines overwhelmed two booths with no way to route fans to pre-order.',
    solution:
      'Festival ops printed one QR per stage entrance and merch zone. Schedule routing switched lineups automatically by time slot. Merch codes pointed to mobile checkout with inventory synced hourly.',
    results: [
      'Schedule complaints at info tents dropped after live-updating stage pages.',
      'Merch pre-orders via QR reduced Saturday queue times an estimated 25%.',
      'Sponsor swap at headliner set took under 10 minutes via campaign batch URL update.',
    ],
    quote:
      'When the headliner moved to a later slot, we updated three URLs — not three truckloads of posters.',
    quoteRole: 'Festival operations lead',
  },
  {
    slug: 'healthcare-clinic-patient-intake',
    title: 'Multi-Site Clinic Network',
    headline: '42 clinics, one intake QR — forms and wait times without reprints',
    metaDescription:
      'A regional healthcare group unified patient intake, wait-time updates and telehealth links behind dynamic QR codes at reception desks.',
    industry: 'Healthcare',
    companyType: 'Multi-site clinic network (42 locations)',
    metrics: [
      { label: 'Clinics', value: '42' },
      { label: 'Intake QRs', value: '84' },
      { label: 'Form updates / quarter', value: '12' },
      { label: 'Reprint runs avoided', value: '6' },
    ],
    challenge:
      'Each clinic printed new reception QR stickers whenever intake forms or COVID screening policies changed. Compliance required consistent messaging, but print vendors shipped updates on different schedules.',
    solution:
      'HQ deployed one dynamic QR per waiting area, grouped by region in campaign batches. Intake forms, insurance PDFs and telehealth links update centrally. Schedule routing shows after-hours urgent-care options automatically.',
    results: [
      'Eliminated six planned national sticker reprints in the first year.',
      'Patients completed digital intake 18% faster with stable QR placement at check-in.',
      'Regional ops monitor scan volume to staff front desks during flu season peaks.',
    ],
    quote:
      'Policy changes used to mean a sticker order for every lobby. Now compliance updates a URL once and all 42 sites match.',
    quoteRole: 'Director of patient experience',
  },
  {
    slug: 'ecommerce-dtc-packaging-inserts',
    title: 'DTC Ecommerce Brand',
    headline: '2M orders/year — packaging inserts that stay relevant',
    metaDescription:
      'A direct-to-consumer brand replaced static packaging QR inserts with dynamic codes linking to reviews, replenishment and seasonal campaigns.',
    industry: 'Ecommerce',
    companyType: 'DTC skincare brand (2M orders/year)',
    metrics: [
      { label: 'Monthly orders', value: '170k' },
      { label: 'Insert QRs', value: '1' },
      { label: 'Campaign swaps / year', value: '24' },
      { label: 'Review CTR lift', value: '+31%' },
    ],
    challenge:
      'Every seasonal campaign required reprinting millions of box inserts with new QR destinations. Warehouse teams could not swap collateral mid-run without costly waste.',
    solution:
      'The brand printed one dynamic QR on all inserts. Post-purchase routing sends customers to review prompts, replenishment offers or UGC contests by week. A/B routing tests headline offers without new print files.',
    results: [
      'Saved an estimated $62k in insert reprints across four seasonal launches.',
      'Review submission rate rose 31% after routing high-NPS buyers to G2-style prompts.',
      'Replenishment links updated during supply delays without pausing fulfillment.',
    ],
    quote:
      'Our packaging QR is permanent — the story behind it changes every Monday. That is how DTC should work.',
    quoteRole: 'Head of lifecycle marketing',
  },
  {
    slug: 'university-campus-wayfinding',
    title: 'Public University',
    headline: '18 buildings, one campus QR map — orientation that updates each semester',
    metaDescription:
      'A public university replaced static building QR stickers with dynamic wayfinding, event schedules and dining links across an 18-building campus.',
    industry: 'Education',
    companyType: 'Public university (22k students)',
    metrics: [
      { label: 'Buildings', value: '18' },
      { label: 'Campus QRs', value: '54' },
      { label: 'Semester updates', value: '6' },
      { label: 'Orientation scans', value: '41k' },
    ],
    challenge:
      'Each semester brought new building hours, dining menus and orientation events. Printed QR codes on building entrances pointed to outdated PDFs within weeks.',
    solution:
      'Campus IT deployed dynamic QRs at entrances and bus stops, grouped by zone. Schedule routing switches dining and library hours automatically. Event week overlays redirect to registration pages without new signage.',
    results: [
      'Cut three orientation print runs in the first academic year.',
      'Students reached live bus detour pages during construction via one URL update.',
      'Facilities track scan spikes to place additional signage before exam periods.',
    ],
    quote:
      'Orientation week used to mean re-sticker every entrance. Now we publish the fall schedule once and every code follows.',
    quoteRole: 'Director of campus digital services',
  },
  {
    slug: 'logistics-warehouse-pallet-tracking',
    title: 'Regional Logistics Operator',
    headline: '6 warehouses, pallet QRs that follow the load — not the label printer',
    metaDescription:
      'A logistics operator linked pallet and dock QRs to live shipment status, safety checklists and driver instructions across six warehouses.',
    industry: 'Logistics',
    companyType: 'Regional 3PL (6 warehouses)',
    metrics: [
      { label: 'Warehouses', value: '6' },
      { label: 'Dock QRs', value: '48' },
      { label: 'Daily status updates', value: '1,200' },
      { label: 'Misroute incidents', value: '-22%' },
    ],
    challenge:
      'Pallet labels printed at origin could not reflect reroutes or hold statuses at transfer hubs. Drivers called dispatch for updates that should have been self-serve at the dock.',
    solution:
      'Each dock door and staging lane got a durable dynamic QR tied to shipment batches. Ops updates hold/release URLs from the dashboard; drivers scan for live instructions and safety PDFs. API webhooks push status to the WMS.',
    results: [
      'Misroute incidents dropped 22% in the first quarter after dock self-serve went live.',
      'Dispatch call volume for status checks fell an estimated 15 hours per week per site.',
      'Safety checklist completion rose with mobile forms linked from the same codes.',
    ],
    quote:
      'The QR on the dock is fixed. The shipment behind it is not — dynamic links finally match how our floors actually run.',
    quoteRole: 'VP warehouse operations',
  },
  {
    slug: 'cinema-multiplex-chain',
    title: 'National Cinema Chain',
    headline: '84 screens, one QR playbook — showtimes that never lag the poster',
    metaDescription:
      'A cinema chain unified lobby, concession and poster QR across 84 screens — premiere swaps and concession promos without standee reprints.',
    industry: 'Cinema',
    companyType: 'National cinema chain (84 screens)',
    metrics: [
      { label: 'Screens', value: '84' },
      { label: 'Lobby QRs', value: '168' },
      { label: 'Premiere swaps / year', value: '36' },
      { label: 'Concession scan lift', value: '+19%' },
    ],
    challenge:
      'Each premiere meant reprinting lobby standees and auditorium door stickers with new showtime URLs. Regional managers missed opening weekend swaps when print vendors shipped late.',
    solution:
      'HQ deployed dynamic QRs at every lobby and concession line, grouped by region. Showtime pages update centrally on premiere day. Schedule routing switches matinee concession offers automatically.',
    results: [
      'Eliminated four national standee print runs in the first year.',
      'Concession pre-order scans rose 19% after linking queue-line codes to mobile ordering.',
      'Opening weekend complaints about wrong showtimes dropped at the box office.',
    ],
    quote:
      'Poster art changes every Friday. Our QR at the door does not — only the showtime page behind it does.',
    quoteRole: 'Director of cinema marketing',
  },
  {
    slug: 'pharmacy-chain-wellness',
    title: 'Regional Pharmacy Chain',
    headline: '120 stores, wellness QRs that stay compliant',
    metaDescription:
      'A pharmacy chain rolled out dynamic QR for flu clinics, prescription refill portals and wellness promos across 120 locations without reprinting aisle wobblers.',
    industry: 'Pharmacy',
    companyType: 'Regional pharmacy chain (120 stores)',
    metrics: [
      { label: 'Stores', value: '120' },
      { label: 'Wellness QRs', value: '240' },
      { label: 'Seasonal updates', value: '8 / year' },
      { label: 'Clinic bookings', value: '+27%' },
    ],
    challenge:
      'Seasonal flu-shot and wellness campaigns required new aisle wobblers whenever CDC guidance or insurer forms changed. Stores in the same region showed inconsistent messaging.',
    solution:
      'Corporate health deployed one dynamic QR per wellness endcap and consultation desk. Refill portals, vaccine booking and insurer PDFs update from HQ. Geofence routing shows state-specific forms automatically.',
    results: [
      'Flu clinic bookings via QR rose 27% in the first season after rollout.',
      'Avoided five planned wobbler reprint cycles across the chain.',
      'Compliance audits improved with centralized URL control and scan logs.',
    ],
    quote:
      'When guidance changes, we update one link — not 120 stores worth of printed stickers.',
    quoteRole: 'VP pharmacy operations',
  },
  {
    slug: 'automotive-dealer-group',
    title: 'Multi-Rooftop Dealer Group',
    headline: '22 rooftops, one QR playbook — incentives that land on launch day',
    metaDescription:
      'An automotive dealer group unified window sticker and service lane QR across 22 rooftops — OEM incentive swaps without reprinting lot signage.',
    industry: 'Automotive',
    companyType: 'Regional dealer group (22 rooftops)',
    metrics: [
      { label: 'Rooftops', value: '22' },
      { label: 'Lot QRs', value: '440' },
      { label: 'Monthly incentive swaps', value: '12' },
      { label: 'Service lane scans', value: '28k/mo' },
    ],
    challenge:
      'OEM incentive changes required new window sticker QR runs at every rooftop. Service advisors printed paper status slips because lane signage could not reflect live RO status.',
    solution:
      'Group marketing deployed dynamic QRs on windshield clings and service lane boards. Geofence routing sends each lot to the right regional offer. Service lane codes link to mobile status and loaner policies updated from HQ.',
    results: [
      'Cut six national sticker print runs in the first year (~$38k saved).',
      'Service lane self-serve scans reduced front-desk status questions an estimated 20%.',
      'Launch-day incentive go-live moved from 3 days to under 3 hours.',
    ],
    quote:
      'When OEM cash-back changes on Tuesday, we update URLs — not 22 sticker orders.',
    quoteRole: 'Group marketing director',
  },
  {
    slug: 'fitness-studio-chain',
    title: 'Boutique Fitness Chain',
    headline: '38 studios, class schedules that never lag the lobby poster',
    metaDescription:
      'A boutique fitness chain rolled out dynamic QR for class timetables, trial passes and trainer bios across 38 studios without reprinting wall signage each season.',
    industry: 'Fitness',
    companyType: 'Boutique fitness chain (38 studios)',
    metrics: [
      { label: 'Studios', value: '38' },
      { label: 'Lobby QRs', value: '76' },
      { label: 'Schedule updates / month', value: '4' },
      { label: 'Trial signups', value: '+34%' },
    ],
    challenge:
      'Studios reprinted lobby posters every time class schedules or intro offers changed. Franchise partners ran conflicting trial URLs between locations.',
    solution:
      'Corporate ops placed one dynamic QR per lobby and studio entrance. Schedule routing switches peak vs. off-peak trial offers. Franchise folders let local managers update trainer bios while HQ controls promo URLs.',
    results: [
      'Trial signups via lobby QR rose 34% in the first quarter after rollout.',
      'Eliminated three seasonal poster print cycles chain-wide.',
      'Franchise compliance improved with locked promo URLs and editable trainer pages.',
    ],
    quote:
      'Our lobby poster is permanent. The class schedule behind the QR is what changes — sometimes twice a week.',
    quoteRole: 'VP franchise operations',
  },
  {
    slug: 'salon-spa-chain',
    title: 'Regional Salon & Spa Group',
    headline: '64 locations, booking QRs that never show last season’s promo',
    metaDescription:
      'A salon group unified mirror cling and reception QR for booking, retail and review prompts across 64 locations without seasonal reprint runs.',
    industry: 'Beauty & Wellness',
    companyType: 'Regional salon & spa group (64 locations)',
    metrics: [
      { label: 'Locations', value: '64' },
      { label: 'Station QRs', value: '320' },
      { label: 'Seasonal promo swaps', value: '8 / year' },
      { label: 'Online bookings', value: '+22%' },
    ],
    challenge:
      'Each seasonal retail promo required new mirror clings at every station. Stylists shared outdated booking links on business cards when HQ changed the scheduler URL.',
    solution:
      'Brand ops deployed one dynamic QR per station zone and reception desk. Booking, retail and review URLs update from HQ. Franchise folders let local managers adjust stylist bios while promos stay locked.',
    results: [
      'Online bookings via QR rose 22% in six months after rollout.',
      'Skipped four chain-wide cling print runs (~$24k saved).',
      'Google review prompts tied to checkout QR improved location ratings on average 0.3 stars.',
    ],
    quote:
      'Our mirror clings are finally permanent. The promo on the other side of the scan is what rotates.',
    quoteRole: 'Director of brand experience',
  },
  {
    slug: 'nonprofit-gala-campaign',
    title: 'National Nonprofit',
    headline: 'One gala QR — donation, volunteer and impact pages all year',
    metaDescription:
      'A national nonprofit reused gala table-tent QR for year-end giving, volunteer drives and impact reports without reprinting event collateral.',
    industry: 'Nonprofit',
    companyType: 'National health nonprofit',
    metrics: [
      { label: 'Annual galas', value: '12' },
      { label: 'Table tent QRs', value: '1 design' },
      { label: 'Campaign swaps', value: '6 / year' },
      { label: 'Donation page CTR', value: '+41%' },
    ],
    challenge:
      'Printed gala materials could not be reused for year-end or peer-to-peer campaigns. Each program ordered new table tents, wasting budget and creating donor confusion.',
    solution:
      'Development printed one dynamic QR for all table tents and direct-mail inserts. URLs rotate from live auction to year-end giving to volunteer signup. Scan exports feed board reports.',
    results: [
      'Donation landing CTR from printed QR rose 41% vs. prior static short links.',
      'Saved an estimated $18k in reprints across six campaign cycles.',
      'Volunteer signups doubled when the same QR pointed to a mobile form post-gala.',
    ],
    quote:
      'Donors keep the same program in their hand — we change where it leads when the campaign changes.',
    quoteRole: 'Chief development officer',
  },
  {
    slug: 'craft-brewery-taproom-group',
    title: 'Craft Brewery Group',
    headline: '18 taprooms, one coaster QR — tap lists that update on release day',
    metaDescription:
      'A craft brewery group unified coaster and tap-handle QR across 18 taprooms — seasonal releases and event promos without reprint runs.',
    industry: 'Beverage',
    companyType: 'Craft brewery group (18 taprooms)',
    metrics: [
      { label: 'Taprooms', value: '18' },
      { label: 'Coaster QRs', value: '1 design' },
      { label: 'Releases / year', value: '48' },
      { label: 'Merch scan lift', value: '+26%' },
    ],
    challenge:
      'Each new seasonal release meant reprinting coasters and table tents at every taproom. Festival activations used one-off static QRs that expired before the event ended.',
    solution:
      'Marketing printed one dynamic QR on coasters chain-wide. Tap lists, event tickets and merch store URLs update from HQ on release day. Geofence routing shows the right taproom menu when guests travel between cities.',
    results: [
      'Skipped five coaster reprint runs in the first year (~$14k saved).',
      'Merch store scans from coaster QR rose 26% after linking DTC shop on Fridays.',
      'Festival promo swaps took under 15 minutes via campaign batch URL update.',
    ],
    quote:
      'We brew something new every few weeks. Our coasters finally keep up — the QR stays, the beer page changes.',
    quoteRole: 'Director of taproom marketing',
  },
  {
    slug: 'insurance-agency-network',
    title: 'Independent Agency Network',
    headline: '240 agents, compliant policy QRs that update when carriers change',
    metaDescription:
      'An independent insurance agency network deployed dynamic QR for quote intake, policy PDFs and renewals across 240 agents without reprinting lobby signage.',
    industry: 'Insurance',
    companyType: 'Independent agency network (240 agents)',
    metrics: [
      { label: 'Agents', value: '240' },
      { label: 'Lobby QRs', value: '480' },
      { label: 'Product updates / year', value: '10' },
      { label: 'Quote form fills', value: '+31%' },
    ],
    challenge:
      'Carrier product changes required new lobby tent cards and mailer inserts network-wide. Agents used outdated PDF links on printed materials for weeks after compliance updates.',
    solution:
      'Home office issued one dynamic QR per lobby and renewal mailer. Quote forms, policy libraries and renewal portals update centrally. Password-protected links for sensitive documents. Webhooks push leads into the agency AMS.',
    results: [
      'Quote form submissions via QR rose 31% in the first two quarters.',
      'Avoided four network-wide lobby reprint cycles.',
      'Compliance audits improved with centralized URL control and scan logs per branch.',
    ],
    quote:
      'When carriers change forms, we update one link — not 240 offices worth of tent cards.',
    quoteRole: 'Chief distribution officer',
  },
  {
    slug: 'supermarket-grocery-chain',
    title: 'Regional Grocery Co-op',
    headline: 'Weekly promos on one shelf-talker QR — no reprint between ad cycles',
    metaDescription:
      'A regional grocery co-op unified shelf talker and endcap QR across 42 stores — weekly promo swaps without reprinting signage between ad cycles.',
    industry: 'Grocery',
    companyType: 'Regional grocery co-op (42 stores)',
    metrics: [
      { label: 'Stores', value: '42' },
      { label: 'Endcap QRs', value: '1 design' },
      { label: 'Weekly promos', value: '52' },
      { label: 'Coupon redemptions', value: '+19%' },
    ],
    challenge:
      'Each weekly ad cycle required new shelf talkers and endcap signs at every store. Static QRs on permanent fixtures pointed to expired promos within days.',
    solution:
      'Marketing printed one dynamic QR on reusable endcap holders chain-wide. Weekly promo landing pages, digital coupons and loyalty signup URLs update from HQ every Tuesday. Store managers see scan peaks by aisle category.',
    results: [
      'Eliminated 11 chain-wide shelf-talker reprint runs in year one.',
      'Digital coupon redemptions via QR rose 19% after centralizing promo URLs.',
      'Store managers adopted the same QR on reusable holders — less cardboard waste.',
    ],
    quote:
      'Tuesday promo drops used to mean a print emergency. Now we change a URL and every store is live.',
    quoteRole: 'VP of retail marketing',
  },
  {
    slug: 'municipal-citizen-services',
    title: 'Municipal Services Agency',
    headline: 'Citizen forms and policy PDFs that stay current on park and city hall signage',
    metaDescription:
      'A municipal services agency deployed dynamic QR on park kiosks and city hall posters — permit forms and policy PDFs update without reprinting public signage.',
    industry: 'Government',
    companyType: 'Municipal services agency (850k residents)',
    metrics: [
      { label: 'Public sites', value: '120' },
      { label: 'Signage QRs', value: '340' },
      { label: 'Policy updates / year', value: '18' },
      { label: 'Form completions', value: '+24%' },
    ],
    challenge:
      'Permit instructions and park rules changed frequently but laminated posters could not be reprinted on every policy update. Citizens called the help desk for outdated PDF links.',
    solution:
      'Communications issued one dynamic QR per kiosk and lobby poster. Permit applications, recycling schedules and emergency alerts update centrally. Password-protected links for internal staff-only documents on shared fixtures.',
    results: [
      'Online form completions via QR rose 24% in the first year.',
      'Avoided six city-wide poster reprint cycles after policy changes.',
      'Help-desk calls about outdated park rules dropped measurably.',
    ],
    quote:
      'Citizens scan the same sign in the park — we update what they see when ordinances change.',
    quoteRole: 'Director of citizen communications',
  },
  {
    slug: 'property-management-portfolio',
    title: 'Multifamily Portfolio Operator',
    headline: '62 buildings, one lobby QR — tenant portals that update on policy day',
    metaDescription:
      'A multifamily portfolio operator unified lobby QR across 62 buildings — tenant portals and maintenance forms update without reprinting signage.',
    industry: 'Real Estate',
    companyType: 'Multifamily portfolio operator (62 buildings)',
    metrics: [
      { label: 'Buildings', value: '62' },
      { label: 'Lobby QRs', value: '1 design' },
      { label: 'Policy updates / year', value: '14' },
      { label: 'Maintenance requests', value: '+28%' },
    ],
    challenge:
      'Pet policies, amenity hours and vendor contacts changed frequently but laminated lobby posters could not be reprinted at every building on each update.',
    solution:
      'Operations printed one dynamic QR on reusable lobby holders portfolio-wide. Tenant portals, maintenance intake and amenity guides update from HQ. Geofence routing shows the right building portal when residents travel between properties.',
    results: [
      'Online maintenance requests via QR rose 28% in year one.',
      'Avoided eight portfolio-wide lobby reprint cycles.',
      'Resident satisfaction scores improved on move-in communication.',
    ],
    quote:
      'We manage dozens of buildings. One QR in the lobby — we change the portal, not the poster.',
    quoteRole: 'VP of resident experience',
  },
  {
    slug: 'dental-practice-network',
    title: 'Dental Practice Network',
    headline: '24 offices, one intake QR — forms that update when insurance changes',
    metaDescription:
      'A dental practice network deployed dynamic QR for patient intake and booking across 24 offices without reprinting reception signage.',
    industry: 'Healthcare',
    companyType: 'Dental practice network (24 offices)',
    metrics: [
      { label: 'Offices', value: '24' },
      { label: 'Reception QRs', value: '1 design' },
      { label: 'Form updates / year', value: '9' },
      { label: 'Intake completions', value: '+22%' },
    ],
    challenge:
      'Insurance and intake form changes required new reception tent cards at every office. Patients completed outdated PDFs for weeks after network-wide updates.',
    solution:
      'Home office issued one dynamic QR per reception desk. Intake forms, booking pages and aftercare guides update centrally. Password-protected links for treatment plans. Webhooks push submissions to the practice management system.',
    results: [
      'Digital intake completions via QR rose 22% in two quarters.',
      'Avoided five network-wide reception reprint cycles.',
      'Front-desk check-in time dropped with pre-visit form completion.',
    ],
    quote:
      'When insurance forms change, we update one link — not 24 waiting rooms worth of tent cards.',
    quoteRole: 'Chief operations officer',
  },
  {
    slug: 'veterinary-clinic-network',
    title: 'Veterinary Clinic Network',
    headline: '32 clinics, one intake QR — pet forms that update when protocols change',
    metaDescription:
      'A veterinary clinic network deployed dynamic QR for pet intake and booking across 32 locations without reprinting lobby signage.',
    industry: 'Healthcare',
    companyType: 'Veterinary clinic network (32 locations)',
    metrics: [
      { label: 'Clinics', value: '32' },
      { label: 'Lobby QRs', value: '1 design' },
      { label: 'Protocol updates / year', value: '8' },
      { label: 'Intake completions', value: '+20%' },
    ],
    challenge:
      'Vaccination and intake form changes required new reception tent cards at every clinic. Pet owners completed outdated forms for weeks after network-wide updates.',
    solution:
      'Home office issued one dynamic QR per reception desk. Pet intake forms, booking pages and aftercare guides update centrally. Webhooks push submissions to the practice management system.',
    results: [
      'Digital intake completions via QR rose 20% in two quarters.',
      'Avoided four network-wide reception reprint cycles.',
      'Front-desk check-in time dropped with pre-visit form completion.',
    ],
    quote:
      'When our intake forms change, we update one link — not 32 waiting rooms worth of tent cards.',
    quoteRole: 'Chief medical officer',
  },
  {
    slug: 'law-firm-intake-network',
    title: 'Regional Law Firm Network',
    headline: '18 offices, one intake QR — consultation forms that stay current',
    metaDescription:
      'A regional law firm network unified lobby QR for client intake and document portals across 18 offices without reprinting signage.',
    industry: 'Legal',
    companyType: 'Regional law firm network (18 offices)',
    metrics: [
      { label: 'Offices', value: '18' },
      { label: 'Lobby QRs', value: '1 design' },
      { label: 'Practice updates / year', value: '6' },
      { label: 'Consultation requests', value: '+27%' },
    ],
    challenge:
      'Practice area changes and intake form updates required new lobby tent cards at every office. Attorneys shared outdated PDF links on printed materials.',
    solution:
      'Marketing printed one dynamic QR on reusable lobby holders network-wide. Consultation forms, document upload portals and practice area pages update from HQ. Password-protected links for sensitive client documents.',
    results: [
      'Consultation form submissions via QR rose 27% in the first year.',
      'Avoided three network-wide lobby reprint cycles.',
      'Intake routing to the right practice area improved with centralized URL control.',
    ],
    quote:
      'We add a practice area without reprinting 18 lobbies — the QR stays, the intake page changes.',
    quoteRole: 'Managing partner, marketing',
  },
  {
    slug: 'accounting-firm-network',
    title: 'Regional Accounting Firm',
    headline: '14 offices, one tax-season QR — intake forms that update on deadline day',
    metaDescription:
      'A regional accounting firm unified tax-season QR for client intake and document uploads across 14 offices without reprinting lobby signage.',
    industry: 'Professional Services',
    companyType: 'Regional accounting firm (14 offices)',
    metrics: [
      { label: 'Offices', value: '14' },
      { label: 'Lobby QRs', value: '1 design' },
      { label: 'Form updates / year', value: '7' },
      { label: 'Document uploads', value: '+33%' },
    ],
    challenge:
      'Tax form and checklist changes required new lobby tent cards at every office each season. Clients uploaded documents to outdated portals linked on printed mailers.',
    solution:
      'Home office issued one dynamic QR per lobby and tax envelope. Intake forms, document upload portals and deadline pages update centrally. Password-protected links for sensitive client files.',
    results: [
      'Secure document uploads via QR rose 33% during tax season.',
      'Avoided three network-wide lobby reprint cycles.',
      'Partner referral tracking improved with per-partner QR variants in folders.',
    ],
    quote:
      'Tax season moves fast. We update the intake link once — every office is current on day one.',
    quoteRole: 'Managing partner, operations',
  },
  {
    slug: 'optometry-practice-group',
    title: 'Optometry Practice Group',
    headline: '22 offices, one recall QR — booking pages that update for lens promos',
    metaDescription:
      'An optometry practice group deployed dynamic QR for patient intake and eyewear promos across 22 locations without reprinting reception signage.',
    industry: 'Healthcare',
    companyType: 'Optometry practice group (22 locations)',
    metrics: [
      { label: 'Locations', value: '22' },
      { label: 'Reception QRs', value: '1 design' },
      { label: 'Promo swaps / year', value: '12' },
      { label: 'Booking conversions', value: '+18%' },
    ],
    challenge:
      'Eyewear promos and recall campaigns required new reception tent cards at every location. Patients booked through expired promo links on printed recall postcards.',
    solution:
      'Marketing printed one dynamic QR on reusable reception holders group-wide. Intake forms, booking pages and lens promos update from HQ. Schedule routing shows after-hours booking when offices are closed.',
    results: [
      'Online bookings via QR rose 18% in the first year.',
      'Skipped six group-wide reception reprint runs for seasonal promos.',
      'Recall postcard campaigns saw higher scan-to-book conversion with centralized URLs.',
    ],
    quote:
      'Back-to-school lens promos used to mean a print rush. Now we swap the URL — the desk tent stays.',
    quoteRole: 'Director of practice marketing',
  },
  {
    slug: 'childcare-center-network',
    title: 'Childcare Center Network',
    headline: '28 campuses, one enrollment QR — forms that update before open house season',
    metaDescription:
      'A childcare center network deployed dynamic QR for enrollment and parent portals across 28 campuses without reprinting lobby signage.',
    industry: 'Education',
    companyType: 'Childcare center network (28 campuses)',
    metrics: [
      { label: 'Campuses', value: '28' },
      { label: 'Lobby QRs', value: '1 design' },
      { label: 'Form updates / year', value: '6' },
      { label: 'Enrollment inquiries', value: '+24%' },
    ],
    challenge:
      'Enrollment forms and parent handbook changes required new lobby tent cards at every campus. Tour families scanned outdated policy links on printed brochures.',
    solution:
      'Home office issued one dynamic QR per lobby and tour packet. Enrollment forms, parent portals and event signup pages update centrally. Password-protected links for family-only updates.',
    results: [
      'Enrollment inquiry form submissions via QR rose 24% in the first year.',
      'Avoided four network-wide lobby reprint cycles.',
      'Open house scan peaks helped directors compare campus marketing effectiveness.',
    ],
    quote:
      'Open house season used to mean reprinting every lobby. Now we update the enrollment link once.',
    quoteRole: 'Director of family engagement',
  },
  {
    slug: 'hvac-home-services-company',
    title: 'Regional HVAC Company',
    headline: '120 trucks, one yard-sign QR — seasonal promos without decal reprints',
    metaDescription:
      'A regional HVAC company unified truck decal and yard sign QR for service requests and seasonal promos across 120 vehicles without reprint runs.',
    industry: 'Home Services',
    companyType: 'Regional HVAC contractor (120 trucks)',
    metrics: [
      { label: 'Trucks', value: '120' },
      { label: 'Yard sign QRs', value: '1 design' },
      { label: 'Promo swaps / year', value: '4' },
      { label: 'Service requests', value: '+21%' },
    ],
    challenge:
      'AC tune-up and furnace promos required new truck decals and yard signs twice a year. Static QRs on older decals pointed to expired seasonal offers.',
    solution:
      'Marketing printed one dynamic QR on reusable yard sign holders and truck decal templates. Service request forms, booking pages and seasonal promos update from HQ. Geofence routing shows the right territory phone number after hours.',
    results: [
      'Online service requests via QR rose 21% in the first year.',
      'Skipped three fleet-wide decal reprint runs for seasonal promos.',
      'Review collection links after jobs improved Google rating velocity.',
    ],
    quote:
      'Our trucks keep the same decal. When summer AC season hits, we swap the promo URL — not 120 trucks worth of vinyl.',
    quoteRole: 'VP of marketing',
  },
  {
    slug: 'senior-living-operator-group',
    title: 'Senior Living Operator',
    headline: '45 communities, one family portal QR — updates without lobby reprints',
    metaDescription:
      'A senior living operator unified lobby QR for family portals and activity signups across 45 communities without reprinting signage.',
    industry: 'Healthcare',
    companyType: 'Senior living operator (45 communities)',
    metrics: [
      { label: 'Communities', value: '45' },
      { label: 'Lobby QRs', value: '1 design' },
      { label: 'Portal updates / year', value: '9' },
      { label: 'Activity signups', value: '+17%' },
    ],
    challenge:
      'Family handbook and activity calendar changes required new lobby tent cards at every community. Families bookmarked outdated portal links from printed welcome packets.',
    solution:
      'Corporate communications issued one dynamic QR per lobby and welcome packet. Family portals, activity signups and community news update centrally. Password-protected links for resident-specific updates.',
    results: [
      'Activity signup form completions via QR rose 17% in the first year.',
      'Avoided five operator-wide lobby reprint cycles.',
      'Family engagement scores improved with consistent portal access.',
    ],
    quote:
      'Families scan the same plaque in the lobby. We change what they see when policies or events update.',
    quoteRole: 'Chief experience officer',
  },
  {
    slug: 'pet-grooming-salon-chain',
    title: 'Pet Grooming Salon Chain',
    headline: '38 salons, one booking QR — promos that update on grooming season',
    metaDescription:
      'A pet grooming salon chain deployed dynamic QR for online booking and loyalty promos across 38 locations without reprinting window decals.',
    industry: 'Pet Services',
    companyType: 'Pet grooming chain (38 salons)',
    metrics: [
      { label: 'Salons', value: '38' },
      { label: 'Window QRs', value: '1 design' },
      { label: 'Promo swaps / year', value: '10' },
      { label: 'Online bookings', value: '+23%' },
    ],
    challenge:
      'Seasonal grooming packages required new window decals at every salon. Static QRs on loyalty cards pointed to expired promos within weeks.',
    solution:
      'Marketing printed one dynamic QR on reusable window clings chain-wide. Booking pages, pet intake forms and package promos update from HQ. Mobile groomers use personal QR variants in folders.',
    results: [
      'Online bookings via QR rose 23% in two quarters.',
      'Skipped four chain-wide window decal reprint runs.',
      'Loyalty card scans increased after linking rotating package promos.',
    ],
    quote:
      'Shedding season promos used to mean new decals everywhere. Now we change a URL — the window cling stays.',
    quoteRole: 'Director of brand marketing',
  },
  {
    slug: 'coworking-flex-operator',
    title: 'Flex Office Operator',
    headline: '62 sites, one member Wi‑Fi QR — amenity pages that update on move-in day',
    metaDescription:
      'A flex office operator unified lobby QR for member Wi‑Fi and room booking across 62 coworking sites without reprinting signage.',
    industry: 'Workplace',
    companyType: 'Flex office operator (62 sites)',
    metrics: [
      { label: 'Sites', value: '62' },
      { label: 'Lobby QRs', value: '1 design' },
      { label: 'Amenity updates / year', value: '8' },
      { label: 'Room bookings', value: '+19%' },
    ],
    challenge:
      'Amenity guides and Wi‑Fi instructions changed frequently but laminated lobby posters could not be reprinted at every site on each update.',
    solution:
      'Operations issued one dynamic QR per lobby and hot desk zone. Member Wi‑Fi, room booking and community event pages update from HQ. Geofence routing shows the right site portal when members travel between cities.',
    results: [
      'Meeting room bookings via QR rose 19% in the first year.',
      'Avoided five operator-wide lobby reprint cycles.',
      'Member NPS improved on move-in communication.',
    ],
    quote:
      'New members scan one plaque — they get the right Wi‑Fi and booking page for that building.',
    quoteRole: 'Head of member experience',
  },
  {
    slug: 'indie-music-venue-group',
    title: 'Independent Venue Group',
    headline: '12 venues, one poster QR — ticket URLs that swap on show night',
    metaDescription:
      'An independent venue group deployed dynamic QR for ticket sales and merch across 12 music venues without reprinting permanent venue signage.',
    industry: 'Entertainment',
    companyType: 'Independent venue group (12 venues)',
    metrics: [
      { label: 'Venues', value: '12' },
      { label: 'Poster QRs', value: '1 design' },
      { label: 'Shows / year', value: '840' },
      { label: 'Merch scan lift', value: '+22%' },
    ],
    challenge:
      'Each show required new poster runs at every venue. Permanent bar signage used static QRs that pointed to expired ticket links after sellout.',
    solution:
      'Marketing printed one dynamic QR on reusable poster templates and bar signage. Ticket URLs, merch stores and fan signup pages update per show from a central calendar. Campaign batches speed up tour stop swaps.',
    results: [
      'Merch store scans from bar signage rose 22% after linking DTC shop on show nights.',
      'Skipped eight venue-wide poster reprint runs in year one.',
      'Fan email signups increased with centralized post-show landing pages.',
    ],
    quote:
      'We book hundreds of shows a year. The poster QR stays — the ticket link changes every night.',
    quoteRole: 'Director of marketing',
  },
  {
    slug: 'winery-tasting-group',
    title: 'Regional Winery Group',
    headline: '8 tasting rooms, one neck hanger QR — releases that update on bottling day',
    metaDescription:
      'A regional winery group unified bottle neck hanger QR for tasting menus and wine club signups across 8 tasting rooms without reprint runs.',
    industry: 'Beverage',
    companyType: 'Regional winery group (8 tasting rooms)',
    metrics: [
      { label: 'Tasting rooms', value: '8' },
      { label: 'Neck hanger QRs', value: '1 design' },
      { label: 'Releases / year', value: '36' },
      { label: 'Club signups', value: '+29%' },
    ],
    challenge:
      'Each new vintage required new neck hangers and table tents at every tasting room. DTC shop links on printed materials pointed to sold-out wines for weeks.',
    solution:
      'Marketing printed one dynamic QR on neck hanger templates chain-wide. Tasting menus, club signup forms and DTC shop URLs update from HQ on bottling day. Geofence routing shows the right room menu for travelers.',
    results: [
      'Wine club signups via QR rose 29% in the first year.',
      'Avoided six group-wide neck hanger reprint runs.',
      'DTC revenue from tasting room scans increased after centralized shop link updates.',
    ],
    quote:
      'We release new wines monthly. The neck hanger QR stays — the tasting menu URL changes on bottling day.',
    quoteRole: 'Director of DTC marketing',
  },
  {
    slug: 'farmers-market-cooperative',
    title: 'Farmers Market Cooperative',
    headline: '24 markets, one entrance QR — vendor lists that update every Saturday',
    metaDescription:
      'A farmers market cooperative deployed dynamic QR for vendor directories and weekly specials across 24 markets without reprinting entrance signage.',
    industry: 'Food & Beverage',
    companyType: 'Farmers market cooperative (24 markets)',
    metrics: [
      { label: 'Markets', value: '24' },
      { label: 'Entrance QRs', value: '1 design' },
      { label: 'Market days / year', value: '48' },
      { label: 'Vendor signups', value: '+16%' },
    ],
    challenge:
      'Weekly vendor lineups required new entrance banners at every market. Shoppers scanned outdated vendor maps from laminated gate signs.',
    solution:
      'Co-op issued one dynamic QR on reusable entrance banners. Vendor directories, weekly specials and vendor application forms update centrally each market day. Per-market folders track scan peaks.',
    results: [
      'Vendor application submissions via QR rose 16% in season one.',
      'Avoided four co-op-wide entrance banner reprint cycles.',
      'Market managers compared Saturday scan peaks to plan staffing.',
    ],
    quote:
      'Every Saturday we update the vendor map — the gate banner stays rolled up in the trailer.',
    quoteRole: 'Cooperative market director',
  },
  {
    slug: 'marina-harbor-group',
    title: 'Marina Harbor Group',
    headline: '12 harbors, one dock QR — slip maps and charter bookings that update each season',
    metaDescription:
      'A marina harbor group unified dock signage QR for slip maps, charter bookings and guest services across 12 harbors without seasonal reprint runs.',
    industry: 'Hospitality',
    companyType: 'Marina harbor group (12 locations)',
    metrics: [
      { label: 'Harbors', value: '12' },
      { label: 'Dock QRs', value: '1 design' },
      { label: 'Seasons / year', value: '2' },
      { label: 'Charter bookings', value: '+22%' },
    ],
    challenge:
      'Each harbor printed new dock boards every season with different slip maps and charter rates. Guest packets linked to outdated harbor policies.',
    solution:
      'Operations printed one dynamic QR on dock board templates group-wide. Slip maps, charter booking forms and rate sheets update from HQ on opening day. Geofence routing shows the right harbor map for transient boaters.',
    results: [
      'Charter bookings via QR rose 22% in the first season.',
      'Avoided five group-wide dock board reprint runs.',
      'Harbor masters compared weekend scan peaks to plan dock staff.',
    ],
    quote:
      'Opening day we update every harbor map — the dock board QR never comes off the pilings.',
    quoteRole: 'Director of marina operations',
  },
  {
    slug: 'staffing-agency-network',
    title: 'Staffing Agency Network',
    headline: '40 offices, one careers poster QR — open roles that update every Monday',
    metaDescription:
      'A staffing agency network deployed dynamic QR on careers posters and job fair tents across 40 offices without reprinting hiring signage weekly.',
    industry: 'Professional Services',
    companyType: 'Staffing agency network (40 offices)',
    metrics: [
      { label: 'Offices', value: '40' },
      { label: 'Careers QRs', value: '1 design' },
      { label: 'Open roles / week', value: '180+' },
      { label: 'Applications', value: '+24%' },
    ],
    challenge:
      'Weekly role changes required new careers posters at every office. Job fair tents linked to filled positions from last month.',
    solution:
      'HR printed one dynamic QR on careers poster templates network-wide. Open role listings, apply forms and onboarding portals update centrally each Monday. Per-recruiter codes track fair booth performance.',
    results: [
      'Mobile applications via QR rose 24% in the first quarter.',
      'Avoided eight network-wide careers poster reprint cycles.',
      'Recruiters compared job fair scan peaks to plan booth staffing.',
    ],
    quote:
      'Monday morning we swap the role list — the lobby careers poster stays on the wall.',
    quoteRole: 'VP of talent acquisition',
  },
  {
    slug: 'trade-show-exhibitor-network',
    title: 'Trade Show Exhibitor Network',
    headline: '60 booths a year, one banner QR — demos and lead forms that update per show',
    metaDescription:
      'A B2B exhibitor network deployed dynamic QR on booth banners across 60 trade shows per year without reprinting graphics for every event.',
    industry: 'Marketing',
    companyType: 'B2B exhibitor network (60 shows / year)',
    metrics: [
      { label: 'Trade shows / year', value: '60' },
      { label: 'Booth QRs', value: '1 design' },
      { label: 'Leads / show', value: '420+' },
      { label: 'Lead capture', value: '+31%' },
    ],
    challenge:
      'Each show required new booth banners with different product demos and lead forms. Badge inserts linked to last quarter\'s campaign.',
    solution:
      'Marketing printed one dynamic QR on reusable booth banner templates. Product demos, lead forms and session schedules update centrally before each show. Per-rep codes track booth staffing performance.',
    results: [
      'Lead form submissions via QR rose 31% in the first year.',
      'Avoided twelve network-wide booth banner reprint cycles.',
      'Reps compared show scan peaks to plan demo staffing.',
    ],
    quote:
      'We ship the same banner to every show — marketing swaps the demo link Sunday night.',
    quoteRole: 'VP of field marketing',
  },
  {
    slug: 'coffee-chain-loyalty',
    title: 'Regional Coffee Chain',
    headline: '28 cafés, one table tent QR — seasonal menus and loyalty that update each quarter',
    metaDescription:
      'A regional coffee chain unified table tent QR for loyalty signup and seasonal menus across 28 cafés without quarterly reprint runs.',
    industry: 'Hospitality',
    companyType: 'Regional coffee chain (28 locations)',
    metrics: [
      { label: 'Cafés', value: '28' },
      { label: 'Table tent QRs', value: '1 design' },
      { label: 'Menu updates / year', value: '4' },
      { label: 'Loyalty signups', value: '+27%' },
    ],
    challenge:
      'Quarterly drink launches required new table tents at every café. Counter signs linked to last season\'s loyalty promo.',
    solution:
      'Ops printed one dynamic QR on table tent templates chain-wide. Seasonal menus, loyalty signup forms and mobile order links update from HQ on launch day. Per-store folders track morning rush scan peaks.',
    results: [
      'Loyalty signups via QR rose 27% in the first year.',
      'Avoided four chain-wide table tent reprint runs.',
      'Store managers compared weekday scan peaks to plan register staffing.',
    ],
    quote:
      'Pumpkin spice season we update the menu URL — the table tent never leaves the counter.',
    quoteRole: 'Director of store operations',
  },
  {
    slug: 'museum-tour-network',
    title: 'Museum Tour Network',
    headline: '15 sites, one entrance QR — audio guides and tickets that update each exhibit season',
    metaDescription:
      'A museum tour network unified entrance QR for audio guides and mobile tickets across 15 sites without seasonal reprint runs.',
    industry: 'Hospitality',
    companyType: 'Museum tour network (15 sites)',
    metrics: [
      { label: 'Sites', value: '15' },
      { label: 'Entrance QRs', value: '1 design' },
      { label: 'Exhibit seasons / year', value: '3' },
      { label: 'Mobile tickets', value: '+33%' },
    ],
    challenge:
      'Each exhibit season required new entrance boards at every site. Audio guide links on printed signage pointed to retired tours.',
    solution:
      'Visitor services printed one dynamic QR on entrance board templates network-wide. Audio guides, mobile tickets and exhibit maps update from HQ on opening day. Geofence routing shows the right site tour for travelers.',
    results: [
      'Mobile ticket purchases via QR rose 33% in the first year.',
      'Avoided six network-wide entrance board reprint runs.',
      'Site managers compared weekend scan peaks to plan docent staffing.',
    ],
    quote:
      'New exhibit season we swap the audio guide — the entrance board stays at the gate.',
    quoteRole: 'Director of visitor experience',
  },
  {
    slug: 'florist-delivery-chain',
    title: 'Florist Delivery Chain',
    headline: '22 shops, one counter QR — seasonal catalogs and delivery forms that update each holiday',
    metaDescription:
      'A florist delivery chain deployed dynamic QR on counter signs and delivery tags across 22 shops without holiday reprint runs.',
    industry: 'Retail',
    companyType: 'Florist delivery chain (22 shops)',
    metrics: [
      { label: 'Shops', value: '22' },
      { label: 'Counter QRs', value: '1 design' },
      { label: 'Holiday campaigns / year', value: '5' },
      { label: 'Delivery orders', value: '+21%' },
    ],
    challenge:
      'Each holiday required new counter signs and delivery tags at every shop. Catalog links on bag tags pointed to sold-out arrangements.',
    solution:
      'Marketing printed one dynamic QR on counter sign and tag templates chain-wide. Seasonal catalogs, delivery order forms and wedding inquiry pages update centrally before each holiday. Per-shop folders track Valentine\'s Day scan peaks.',
    results: [
      'Delivery order submissions via QR rose 21% in the first year.',
      'Avoided five chain-wide counter sign reprint cycles.',
      'Shop managers compared holiday scan peaks to plan delivery staffing.',
    ],
    quote:
      'Valentine\'s week we update the catalog URL — the counter sign never comes down.',
    quoteRole: 'Director of retail operations',
  },
  {
    slug: 'food-truck-festival-circuit',
    title: 'Food Truck Festival Circuit',
    headline: '18 trucks, one window QR — daily menus and locations that update each morning',
    metaDescription:
      'A food truck festival circuit deployed dynamic QR on window boards and festival tents across 18 trucks without daily reprint runs.',
    industry: 'Food & Beverage',
    companyType: 'Food truck festival circuit (18 trucks)',
    metrics: [
      { label: 'Trucks', value: '18' },
      { label: 'Window QRs', value: '1 design' },
      { label: 'Festival days / year', value: '120' },
      { label: 'Pre-orders', value: '+26%' },
    ],
    challenge:
      'Daily location changes required new window boards at every truck. Festival tents linked to yesterday\'s menu and wrong pickup times.',
    solution:
      'Operators printed one dynamic QR on reusable window board templates fleet-wide. Daily menus, location schedules and pre-order forms update centrally each morning. Per-truck folders track festival scan peaks.',
    results: [
      'Mobile pre-orders via QR rose 26% in the first season.',
      'Avoided six circuit-wide window board reprint cycles.',
      'Truck owners compared festival scan peaks to plan staffing.',
    ],
    quote:
      'Every morning we update the menu and location — the window board stays on the truck.',
    quoteRole: 'Festival circuit operations manager',
  },
  {
    slug: 'landscaping-franchise-network',
    title: 'Landscaping Franchise Network',
    headline: '35 crews, one yard sign QR — seasonal promos that update each spring',
    metaDescription:
      'A landscaping franchise network unified yard sign QR for quote forms and seasonal promos across 35 crews without spring reprint runs.',
    industry: 'Home Services',
    companyType: 'Landscaping franchise network (35 crews)',
    metrics: [
      { label: 'Crews', value: '35' },
      { label: 'Yard sign QRs', value: '1 design' },
      { label: 'Seasonal promos / year', value: '4' },
      { label: 'Quote requests', value: '+23%' },
    ],
    challenge:
      'Each spring required new yard signs at every crew. Truck decals linked to last season\'s aeration promo and expired pricing.',
    solution:
      'Franchise HQ printed one dynamic QR on yard sign templates network-wide. Quote forms, seasonal service menus and review pages update centrally on opening day. Per-crew codes track neighborhood scan peaks.',
    results: [
      'Quote form submissions via QR rose 23% in the first year.',
      'Avoided five network-wide yard sign reprint cycles.',
      'Crew leads compared spring scan peaks to plan route density.',
    ],
    quote:
      'Spring aeration season we swap the promo URL — the yard sign stays at the job site.',
    quoteRole: 'Franchise operations director',
  },
  {
    slug: 'dry-cleaning-chain',
    title: 'Regional Dry Cleaning Chain',
    headline: '16 locations, one counter QR — price lists and pickup forms that update each quarter',
    metaDescription:
      'A regional dry cleaning chain deployed dynamic QR on counter signs and garment tags across 16 locations without quarterly reprint runs.',
    industry: 'Retail',
    companyType: 'Regional dry cleaning chain (16 locations)',
    metrics: [
      { label: 'Locations', value: '16' },
      { label: 'Counter QRs', value: '1 design' },
      { label: 'Price updates / year', value: '4' },
      { label: 'Pickup requests', value: '+19%' },
    ],
    challenge:
      'Quarterly price changes required new counter signs at every location. Garment tags linked to outdated service menus and wrong pickup windows.',
    solution:
      'Corporate printed one dynamic QR on counter sign and tag templates chain-wide. Price lists, pickup scheduling forms and loyalty signup update centrally each quarter. Per-store folders track weekday scan peaks.',
    results: [
      'Pickup scheduling submissions via QR rose 19% in the first year.',
      'Avoided four chain-wide counter sign reprint cycles.',
      'Store managers compared morning rush scan peaks to plan counter staffing.',
    ],
    quote:
      'Quarterly price changes are a URL update — the counter sign never leaves the register.',
    quoteRole: 'Director of store operations',
  },
  {
    slug: 'multi-campus-church-group',
    title: 'Multi-Campus Church Group',
    headline: '8 campuses, one pew card QR — bulletins and giving that update each Sunday',
    metaDescription:
      'A multi-campus church group unified pew card QR for weekly bulletins and online giving across 8 campuses without weekly reprint runs.',
    industry: 'Nonprofit',
    companyType: 'Multi-campus church group (8 campuses)',
    metrics: [
      { label: 'Campuses', value: '8' },
      { label: 'Pew card QRs', value: '1 design' },
      { label: 'Services / week', value: '24' },
      { label: 'Online giving', value: '+18%' },
    ],
    challenge:
      'Weekly bulletin changes required new pew card inserts at every campus. Lobby signs linked to last week\'s event registration and expired volunteer forms.',
    solution:
      'Communications printed one dynamic QR on pew card templates group-wide. Weekly bulletins, online giving pages and event registration forms update centrally each Sunday. Geofence routing sends each campus to the right bulletin.',
    results: [
      'Online giving via QR rose 18% in the first year.',
      'Avoided 52 campus-wide pew card reprint cycles.',
      'Campus pastors compared Sunday scan peaks to plan lobby staffing.',
    ],
    quote:
      'Saturday night we update the bulletin — the pew card stays in the rack.',
    quoteRole: 'Director of communications',
  },
  {
    slug: 'print-shop-franchise',
    title: 'Print Shop Franchise',
    headline: '22 shops, one counter QR — price sheets and upload portals that update each quarter',
    metaDescription:
      'A print shop franchise deployed dynamic QR on counter signs and job tickets across 22 shops without quarterly reprint runs.',
    industry: 'Professional Services',
    companyType: 'Print shop franchise (22 locations)',
    metrics: [
      { label: 'Shops', value: '22' },
      { label: 'Counter QRs', value: '1 design' },
      { label: 'Rate updates / year', value: '4' },
      { label: 'Upload orders', value: '+22%' },
    ],
    challenge:
      'Quarterly rate changes required new counter signs at every shop. Job tickets linked to retired upload portals and wrong order status pages.',
    solution:
      'Franchise HQ printed one dynamic QR on counter sign and ticket templates network-wide. Price sheets, file upload portals and order tracking pages update centrally each quarter. Per-shop folders track weekday scan peaks.',
    results: [
      'File upload orders via QR rose 22% in the first year.',
      'Avoided four franchise-wide counter sign reprint cycles.',
      'Shop managers compared counter scan peaks to plan production staffing.',
    ],
    quote:
      'Rate changes go live Monday — the counter sign and job ticket QR stay the same.',
    quoteRole: 'Franchise brand director',
  },
  {
    slug: 'tutoring-center-network',
    title: 'Tutoring Center Network',
    headline: '14 centers, one lobby QR — class schedules and enrollment that update each term',
    metaDescription:
      'A tutoring center network unified lobby QR for class schedules and enrollment forms across 14 centers without semester reprint runs.',
    industry: 'Education',
    companyType: 'Tutoring center network (14 locations)',
    metrics: [
      { label: 'Centers', value: '14' },
      { label: 'Lobby QRs', value: '1 design' },
      { label: 'Terms / year', value: '3' },
      { label: 'Enrollments', value: '+25%' },
    ],
    challenge:
      'Each term required new lobby signs at every center. Parent handouts linked to last semester\'s schedule and filled trial lesson slots.',
    solution:
      'Academic ops printed one dynamic QR on lobby sign templates network-wide. Class schedules, enrollment forms and parent resource pages update centrally on term start. Per-subject folders track enrollment scan peaks.',
    results: [
      'Enrollment form submissions via QR rose 25% in the first year.',
      'Avoided three network-wide lobby sign reprint cycles.',
      'Center directors compared after-school scan peaks to plan tutor staffing.',
    ],
    quote:
      'Term start we publish the new schedule — the lobby sign never comes off the wall.',
    quoteRole: 'Director of academic operations',
  },
  {
    slug: 'car-wash-membership-chain',
    title: 'Car Wash Membership Chain',
    headline: '20 bays, one entrance QR — membership signup and menus that update each season',
    metaDescription:
      'A car wash membership chain deployed dynamic QR on bay signage across 20 locations without seasonal reprint runs.',
    industry: 'Automotive',
    companyType: 'Car wash membership chain (20 locations)',
    metrics: [
      { label: 'Locations', value: '20' },
      { label: 'Bay QRs', value: '1 design' },
      { label: 'Package updates / year', value: '2' },
      { label: 'Membership signups', value: '+28%' },
    ],
    challenge:
      'Seasonal package changes required new bay signs at every location. Waiting area posters linked to last season\'s pricing and expired queue status pages.',
    solution:
      'Operations printed one dynamic QR on bay entrance templates chain-wide. Membership signup forms, service menus and queue status pages update centrally each season. Per-location folders track weekend scan peaks.',
    results: [
      'Membership signups via QR rose 28% in the first year.',
      'Avoided four chain-wide bay sign reprint cycles.',
      'Location managers compared Saturday scan peaks to plan tunnel staffing.',
    ],
    quote:
      'Summer unlimited promo goes live Friday — the bay entrance QR stays on the sign.',
    quoteRole: 'VP of operations',
  },
  {
    slug: 'bakery-delivery-chain',
    title: 'Bakery Delivery Chain',
    headline: '19 bakeries, one display QR — daily specials and pre-orders that update each morning',
    metaDescription:
      'A bakery delivery chain unified display case QR for daily specials and pre-orders across 19 bakeries without daily reprint runs.',
    industry: 'Food & Beverage',
    companyType: 'Bakery delivery chain (19 locations)',
    metrics: [
      { label: 'Bakeries', value: '19' },
      { label: 'Display QRs', value: '1 design' },
      { label: 'Daily updates', value: '365' },
      { label: 'Pre-orders', value: '+24%' },
    ],
    challenge:
      'Daily special changes required new display signs at every bakery. Bag tags linked to sold-out holiday trays and wrong pickup times.',
    solution:
      'Production printed one dynamic QR on display case templates chain-wide. Daily specials, pre-order forms and catering inquiry pages update centrally each morning. Per-store folders track morning rush scan peaks.',
    results: [
      'Holiday pre-orders via QR rose 24% in the first year.',
      'Avoided daily display sign reprints across the chain.',
      'Store managers compared 6am scan peaks to plan oven staffing.',
    ],
    quote:
      'Every morning the baker updates the special — the display case QR never moves.',
    quoteRole: 'Director of production',
  },
  {
    slug: 'pet-grooming-franchise',
    title: 'Pet Grooming Franchise',
    headline: '26 salons, one lobby QR — booking forms and service menus that update each quarter',
    metaDescription:
      'A pet grooming franchise deployed dynamic QR on lobby signage across 26 salons without quarterly reprint runs.',
    industry: 'Pet Services',
    companyType: 'Pet grooming franchise (26 locations)',
    metrics: [
      { label: 'Salons', value: '26' },
      { label: 'Lobby QRs', value: '1 design' },
      { label: 'Menu updates / year', value: '4' },
      { label: 'Online bookings', value: '+21%' },
    ],
    challenge:
      'Quarterly service menu changes required new lobby signs at every salon. Kennel cards linked to last season\'s add-on packages and expired booking forms.',
    solution:
      'Franchise HQ printed one dynamic QR on lobby sign templates network-wide. Booking forms, service menus and loyalty signup pages update centrally each quarter. Per-salon folders track Saturday scan peaks.',
    results: [
      'Online booking submissions via QR rose 21% in the first year.',
      'Avoided four franchise-wide lobby sign reprint cycles.',
      'Salon managers compared weekend scan peaks to plan groomer staffing.',
    ],
    quote:
      'New spa package launches Monday — the lobby sign QR stays by the treat jar.',
    quoteRole: 'Franchise operations manager',
  },
  {
    slug: 'coworking-space-network',
    title: 'Coworking Space Network',
    headline: '11 hubs, one lobby QR — member resources and event calendars that update weekly',
    metaDescription:
      'A coworking space network unified lobby QR for member resources and event calendars across 11 hubs without weekly reprint runs.',
    industry: 'Professional Services',
    companyType: 'Coworking space network (11 hubs)',
    metrics: [
      { label: 'Hubs', value: '11' },
      { label: 'Lobby QRs', value: '1 design' },
      { label: 'Event updates / week', value: '52' },
      { label: 'Event RSVPs', value: '+30%' },
    ],
    challenge:
      'Weekly event changes required new lobby signs at every hub. Desk tent cards linked to last week\'s workshop and expired room booking forms.',
    solution:
      'Community team printed one dynamic QR on lobby sign templates network-wide. Member resource hubs, event calendars and room booking forms update centrally each Monday. Geofence routing shows the right hub events for visitors.',
    results: [
      'Event RSVPs via QR rose 30% in the first year.',
      'Avoided 52 hub-wide lobby sign reprint cycles.',
      'Hub managers compared weekday scan peaks to plan community staffing.',
    ],
    quote:
      'Monday we publish the week\'s events — the lobby QR stays on the welcome desk.',
    quoteRole: 'Director of community',
  },
];

export function getCaseStudy(slug: string): CaseStudy | undefined {
  return CASE_STUDIES.find((c) => c.slug === slug);
}
